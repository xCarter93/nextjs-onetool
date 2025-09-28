import { query, mutation, QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { getCurrentUserOrgId } from "./lib/auth";
import { ActivityHelpers } from "./lib/activities";
import { DateUtils } from "./lib/shared";
import { requireMembership } from "./lib/memberships";

/**
 * Task/Schedule operations with embedded CRUD helpers
 * All task-specific logic lives in this file for better organization
 */

// Task-specific helper functions

/**
 * Get a task by ID with organization validation
 */
async function getTaskWithOrgValidation(
	ctx: QueryCtx | MutationCtx,
	id: Id<"tasks">,
	existingOrgId?: Id<"organizations">
): Promise<Doc<"tasks"> | null> {
	const userOrgId = existingOrgId ?? (await getCurrentUserOrgId(ctx));
	const task = await ctx.db.get(id);

	if (!task) {
		return null;
	}

	if (task.orgId !== userOrgId) {
		throw new Error("Task does not belong to your organization");
	}

	return task;
}

/**
 * Get a task by ID, throwing if not found
 */
async function getTaskOrThrow(
	ctx: QueryCtx | MutationCtx,
	id: Id<"tasks">
): Promise<Doc<"tasks">> {
	const task = await getTaskWithOrgValidation(ctx, id);
	if (!task) {
		throw new Error("Task not found");
	}
	return task;
}

/**
 * Validate client exists and belongs to user's org
 */
async function validateClientAccess(
	ctx: QueryCtx | MutationCtx,
	clientId: Id<"clients">,
	existingOrgId?: Id<"organizations">
): Promise<void> {
	const userOrgId = existingOrgId ?? (await getCurrentUserOrgId(ctx));
	const client = await ctx.db.get(clientId);

	if (!client) {
		throw new Error("Client not found");
	}

	if (client.orgId !== userOrgId) {
		throw new Error("Client does not belong to your organization");
	}
}

/**
 * Validate project exists and belongs to user's org (if provided)
 */
async function validateProjectAccess(
	ctx: QueryCtx | MutationCtx,
	projectId: Id<"projects">,
	existingOrgId?: Id<"organizations">
): Promise<void> {
	const userOrgId = existingOrgId ?? (await getCurrentUserOrgId(ctx));
	const project = await ctx.db.get(projectId);

	if (!project) {
		throw new Error("Project not found");
	}

	if (project.orgId !== userOrgId) {
		throw new Error("Project does not belong to your organization");
	}
}

/**
 * Validate user exists and belongs to user's org (if provided)
 */
async function validateUserAccess(
	ctx: QueryCtx | MutationCtx,
	userId: Id<"users">,
	existingOrgId?: Id<"organizations">
): Promise<void> {
	const userOrgId = existingOrgId ?? (await getCurrentUserOrgId(ctx));
	const user = await ctx.db.get(userId);

	if (!user) {
		throw new Error("User not found");
	}

	await requireMembership(ctx, userId, userOrgId);
}

/**
 * Create a task with automatic orgId assignment
 */
async function createTaskWithOrg(
	ctx: MutationCtx,
	data: Omit<Doc<"tasks">, "_id" | "_creationTime" | "orgId">
): Promise<Id<"tasks">> {
	const userOrgId = await getCurrentUserOrgId(ctx);

	// Validate client access
	await validateClientAccess(ctx, data.clientId);

	// Validate project access if provided
	if (data.projectId) {
		await validateProjectAccess(ctx, data.projectId);
	}

	// Validate assignee if provided
	if (data.assigneeUserId) {
		await validateUserAccess(ctx, data.assigneeUserId);
	}

	const taskData = {
		...data,
		orgId: userOrgId,
	};

	return await ctx.db.insert("tasks", taskData);
}

/**
 * Update a task with validation
 */
async function updateTaskWithValidation(
	ctx: MutationCtx,
	id: Id<"tasks">,
	updates: Partial<Doc<"tasks">>
): Promise<void> {
	// Validate task exists and belongs to user's org
	await getTaskOrThrow(ctx, id);

	// Validate new client if being updated
	if (updates.clientId) {
		await validateClientAccess(ctx, updates.clientId);
	}

	// Validate new project if being updated
	if (updates.projectId) {
		await validateProjectAccess(ctx, updates.projectId);
	}

	// Validate new assignee if being updated
	if (updates.assigneeUserId) {
		await validateUserAccess(ctx, updates.assigneeUserId);
	}

	// Update the task
	await ctx.db.patch(id, updates);
}

// Define specific types for task operations
type TaskDocument = Doc<"tasks">;
type TaskId = Id<"tasks">;

// Interface for task statistics
interface TaskStats {
	total: number;
	byStatus: {
		pending: number;
		inProgress: number;
		completed: number;
		cancelled: number;
	};
	todayTasks: number;
	overdue: number;
	thisWeek: number;
	recurring: number;
}

function createEmptyTaskStats(): TaskStats {
	return {
		total: 0,
		byStatus: {
			pending: 0,
			inProgress: 0,
			completed: 0,
			cancelled: 0,
		},
		todayTasks: 0,
		overdue: 0,
		thisWeek: 0,
		recurring: 0,
	};
}

/**
 * Get all tasks for the current user's organization
 */
export const list = query({
	args: {
		status: v.optional(
			v.union(
				v.literal("pending"),
				v.literal("in-progress"),
				v.literal("completed"),
				v.literal("cancelled")
			)
		),
		clientId: v.optional(v.id("clients")),
		projectId: v.optional(v.id("projects")),
		assigneeUserId: v.optional(v.id("users")),
		dateFrom: v.optional(v.number()),
		dateTo: v.optional(v.number()),
	},
	handler: async (ctx, args): Promise<TaskDocument[]> => {
		const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
		if (!userOrgId) {
			return [];
		}

		let tasks: TaskDocument[];

		// Start with the most specific query available
		if (args.assigneeUserId) {
			await validateUserAccess(ctx, args.assigneeUserId, userOrgId);
			tasks = await ctx.db
				.query("tasks")
				.withIndex("by_assignee", (q) =>
					q.eq("assigneeUserId", args.assigneeUserId)
				)
				.collect();
		} else if (args.projectId) {
			await validateProjectAccess(ctx, args.projectId, userOrgId);
			tasks = await ctx.db
				.query("tasks")
				.withIndex("by_project", (q) => q.eq("projectId", args.projectId))
				.collect();
		} else if (args.clientId) {
			await validateClientAccess(ctx, args.clientId, userOrgId);
			tasks = await ctx.db
				.query("tasks")
				.withIndex("by_client", (q) => q.eq("clientId", args.clientId!))
				.collect();
		} else if (args.dateFrom && args.dateTo) {
			tasks = await ctx.db
				.query("tasks")
				.withIndex("by_date", (q) =>
					q
						.eq("orgId", userOrgId)
						.gte("date", args.dateFrom!)
						.lte("date", args.dateTo!)
				)
				.collect();
		} else {
			tasks = await ctx.db
				.query("tasks")
				.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
				.collect();
		}

		// Apply additional filters
		if (args.status) {
			tasks = tasks.filter((task) => task.status === args.status);
		}

		if (args.clientId && !args.assigneeUserId && !args.projectId) {
			tasks = tasks.filter((task) => task.clientId === args.clientId);
		}

		if (args.projectId && !args.assigneeUserId) {
			tasks = tasks.filter((task) => task.projectId === args.projectId);
		}

		// Sort by date
		return tasks.sort((a, b) => a.date - b.date);
	},
});

/**
 * Get a specific task by ID
 */
export const get = query({
	args: { id: v.id("tasks") },
	handler: async (ctx, args): Promise<TaskDocument | null> => {
		const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
		if (!userOrgId) {
			return null;
		}
		return await getTaskWithOrgValidation(ctx, args.id, userOrgId);
	},
});

/**
 * Create a new task
 */
export const create = mutation({
	args: {
		clientId: v.id("clients"),
		projectId: v.optional(v.id("projects")),
		title: v.string(),
		description: v.optional(v.string()),
		date: v.number(),
		startTime: v.optional(v.string()),
		endTime: v.optional(v.string()),
		assigneeUserId: v.optional(v.id("users")),
		status: v.union(
			v.literal("pending"),
			v.literal("in-progress"),
			v.literal("completed"),
			v.literal("cancelled")
		),
		priority: v.optional(
			v.union(
				v.literal("low"),
				v.literal("medium"),
				v.literal("high"),
				v.literal("urgent")
			)
		),
		repeat: v.optional(
			v.union(
				v.literal("none"),
				v.literal("daily"),
				v.literal("weekly"),
				v.literal("monthly")
			)
		),
		repeatUntil: v.optional(v.number()),
	},
	handler: async (ctx, args): Promise<TaskId> => {
		// Validate title is not empty
		if (!args.title.trim()) {
			throw new Error("Task title is required");
		}

		// Validate time format if provided
		if (
			args.startTime &&
			!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(args.startTime)
		) {
			throw new Error("Invalid start time format. Use HH:MM format");
		}

		if (
			args.endTime &&
			!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(args.endTime)
		) {
			throw new Error("Invalid end time format. Use HH:MM format");
		}

		// Validate time logic
		if (args.startTime && args.endTime && args.startTime >= args.endTime) {
			throw new Error("End time must be after start time");
		}

		// Validate repeat logic
		if (args.repeat && args.repeat !== "none" && !args.repeatUntil) {
			throw new Error("Repeat end date is required for recurring tasks");
		}

		if (args.repeatUntil && (!args.repeat || args.repeat === "none")) {
			throw new Error(
				"Repeat frequency is required when repeat end date is set"
			);
		}

		if (args.repeatUntil && args.repeatUntil <= args.date) {
			throw new Error("Repeat end date must be after task date");
		}

		const taskId = await createTaskWithOrg(ctx, args);

		// Get the created task for activity logging
		const task = await ctx.db.get(taskId);
		if (task) {
			await ActivityHelpers.taskCreated(ctx, task as TaskDocument);
		}

		return taskId;
	},
});

/**
 * Update a task
 */
export const update = mutation({
	args: {
		id: v.id("tasks"),
		clientId: v.optional(v.id("clients")),
		projectId: v.optional(v.id("projects")),
		title: v.optional(v.string()),
		description: v.optional(v.string()),
		date: v.optional(v.number()),
		startTime: v.optional(v.string()),
		endTime: v.optional(v.string()),
		assigneeUserId: v.optional(v.id("users")),
		status: v.optional(
			v.union(
				v.literal("pending"),
				v.literal("in-progress"),
				v.literal("completed"),
				v.literal("cancelled")
			)
		),
		priority: v.optional(
			v.union(
				v.literal("low"),
				v.literal("medium"),
				v.literal("high"),
				v.literal("urgent")
			)
		),
		repeat: v.optional(
			v.union(
				v.literal("none"),
				v.literal("daily"),
				v.literal("weekly"),
				v.literal("monthly")
			)
		),
		repeatUntil: v.optional(v.number()),
	},
	handler: async (ctx, args): Promise<TaskId> => {
		const { id, ...updates } = args;

		// Validate title is not empty if being updated
		if (updates.title !== undefined && !updates.title.trim()) {
			throw new Error("Task title cannot be empty");
		}

		// Validate time format if provided
		if (
			updates.startTime &&
			!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(updates.startTime)
		) {
			throw new Error("Invalid start time format. Use HH:MM format");
		}

		if (
			updates.endTime &&
			!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(updates.endTime)
		) {
			throw new Error("Invalid end time format. Use HH:MM format");
		}

		// Filter out undefined values
		const filteredUpdates = Object.fromEntries(
			Object.entries(updates).filter(([, value]) => value !== undefined)
		) as Partial<TaskDocument>;

		if (Object.keys(filteredUpdates).length === 0) {
			throw new Error("No valid updates provided");
		}

		// Get current task for validation
		const currentTask = await getTaskOrThrow(ctx, id);

		// Validate time logic with current or updated values
		const startTime = filteredUpdates.startTime ?? currentTask.startTime;
		const endTime = filteredUpdates.endTime ?? currentTask.endTime;

		if (startTime && endTime && startTime >= endTime) {
			throw new Error("End time must be after start time");
		}

		// Check if task is being completed
		const wasCompleted = currentTask.status === "completed";
		const isBeingCompleted =
			filteredUpdates.status === "completed" && !wasCompleted;

		// If being completed, set completion time
		if (isBeingCompleted) {
			filteredUpdates.completedAt = Date.now();
		}

		await updateTaskWithValidation(ctx, id, filteredUpdates);

		// Get updated task for activity logging
		const task = await ctx.db.get(id);
		if (task && isBeingCompleted) {
			await ActivityHelpers.taskCompleted(ctx, task as TaskDocument);
		}

		return id;
	},
});

/**
 * Mark a task as completed
 */
export const complete = mutation({
	args: { id: v.id("tasks") },
	handler: async (ctx, args): Promise<TaskId> => {
		const task = await getTaskOrThrow(ctx, args.id);

		if (task.status === "completed") {
			throw new Error("Task is already completed");
		}

		await ctx.db.patch(args.id, {
			status: "completed",
			completedAt: Date.now(),
		});

		// Log activity
		const updatedTask = await ctx.db.get(args.id);
		if (updatedTask) {
			await ActivityHelpers.taskCompleted(ctx, updatedTask as TaskDocument);
		}

		return args.id;
	},
});

/**
 * Delete a task
 */
export const remove = mutation({
	args: { id: v.id("tasks") },
	handler: async (ctx, args): Promise<TaskId> => {
		await getTaskOrThrow(ctx, args.id); // Validate access
		await ctx.db.delete(args.id);
		return args.id;
	},
});

/**
 * Search tasks
 */
// TODO: Candidate for deletion if confirmed unused.
export const search = query({
	args: {
		query: v.string(),
		status: v.optional(
			v.union(
				v.literal("pending"),
				v.literal("in-progress"),
				v.literal("completed"),
				v.literal("cancelled")
			)
		),
		clientId: v.optional(v.id("clients")),
		assigneeUserId: v.optional(v.id("users")),
	},
	handler: async (ctx, args): Promise<TaskDocument[]> => {
		const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
		if (!userOrgId) {
			return [];
		}
		let tasks = await ctx.db
			.query("tasks")
			.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
			.collect();

		// Filter by status if specified
		if (args.status) {
			tasks = tasks.filter((task) => task.status === args.status);
		}

		// Filter by client if specified
		if (args.clientId) {
			await validateClientAccess(ctx, args.clientId, userOrgId);
			tasks = tasks.filter((task) => task.clientId === args.clientId);
		}

		// Filter by assignee if specified
		if (args.assigneeUserId) {
			await validateUserAccess(ctx, args.assigneeUserId, userOrgId);
			tasks = tasks.filter(
				(task) => task.assigneeUserId === args.assigneeUserId
			);
		}

		// Search in title and description
		const searchQuery = args.query.toLowerCase();
		return tasks.filter(
			(task: TaskDocument) =>
				task.title.toLowerCase().includes(searchQuery) ||
				(task.description &&
					task.description.toLowerCase().includes(searchQuery))
		);
	},
});

/**
 * Get task statistics for dashboard
 */
export const getStats = query({
	args: {},
	handler: async (ctx): Promise<TaskStats> => {
		const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
		if (!userOrgId) {
			return createEmptyTaskStats();
		}
		const tasks = await ctx.db
			.query("tasks")
			.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
			.collect();

		const stats: TaskStats = {
			total: tasks.length,
			byStatus: {
				pending: 0,
				inProgress: 0,
				completed: 0,
				cancelled: 0,
			},
			todayTasks: 0,
			overdue: 0,
			thisWeek: 0,
			recurring: 0,
		};

		const now = Date.now();
		const today = DateUtils.startOfDay(now);
		const tomorrow = DateUtils.addDays(today, 1);
		const nextWeek = DateUtils.addDays(today, 7);

		tasks.forEach((task: TaskDocument) => {
			// Count by status
			if (task.status === "pending") {
				stats.byStatus.pending++;
			} else if (task.status === "in-progress") {
				stats.byStatus.inProgress++;
			} else if (task.status === "completed") {
				stats.byStatus.completed++;
			} else if (task.status === "cancelled") {
				stats.byStatus.cancelled++;
			}

			// Count today's tasks
			if (task.date >= today && task.date < tomorrow) {
				stats.todayTasks++;
			}

			// Count this week's tasks
			if (
				task.date >= today &&
				task.date < nextWeek &&
				(task.status === "pending" || task.status === "in-progress")
			) {
				stats.thisWeek++;
			}

			// Count overdue tasks
			if (
				task.date < today &&
				(task.status === "pending" || task.status === "in-progress")
			) {
				stats.overdue++;
			}

			// Count recurring tasks
			if (task.repeat && task.repeat !== "none") {
				stats.recurring++;
			}
		});

		return stats;
	},
});

/**
 * Get today's tasks
 */
// TODO: Candidate for deletion if confirmed unused.
export const getToday = query({
	args: { assigneeUserId: v.optional(v.id("users")) },
	handler: async (ctx, args): Promise<TaskDocument[]> => {
		const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
		if (!userOrgId) {
			return [];
		}
		const today = DateUtils.startOfDay(Date.now());
		const tomorrow = DateUtils.addDays(today, 1);

		let tasks = await ctx.db
			.query("tasks")
			.withIndex("by_date", (q) =>
				q.eq("orgId", userOrgId).gte("date", today).lt("date", tomorrow)
			)
			.collect();

		// Filter by assignee if specified
		if (args.assigneeUserId) {
			await validateUserAccess(ctx, args.assigneeUserId, userOrgId);
			tasks = tasks.filter(
				(task) => task.assigneeUserId === args.assigneeUserId
			);
		}

		return tasks.sort((a, b) => {
			// Sort by start time if available, otherwise by creation time
			if (a.startTime && b.startTime) {
				return a.startTime.localeCompare(b.startTime);
			}
			return a._creationTime - b._creationTime;
		});
	},
});

/**
 * Get overdue tasks
 */
export const getOverdue = query({
	args: { assigneeUserId: v.optional(v.id("users")) },
	handler: async (ctx, args): Promise<TaskDocument[]> => {
		const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
		if (!userOrgId) {
			return [];
		}
		const today = DateUtils.startOfDay(Date.now());

		let tasks = await ctx.db
			.query("tasks")
			.withIndex("by_date", (q) => q.eq("orgId", userOrgId).lt("date", today))
			.collect();

		// Only include pending and in-progress tasks (not completed or cancelled)
		tasks = tasks.filter(
			(task) => task.status === "pending" || task.status === "in-progress"
		);

		// Filter by assignee if specified
		if (args.assigneeUserId) {
			await validateUserAccess(ctx, args.assigneeUserId, userOrgId);
			tasks = tasks.filter(
				(task) => task.assigneeUserId === args.assigneeUserId
			);
		}

		return tasks.sort((a, b) => b.date - a.date); // Most recent overdue first
	},
});

/**
 * Get upcoming tasks (due within the next 7 days) for dashboard/home page
 */
export const getUpcoming = query({
	args: {
		assigneeUserId: v.optional(v.id("users")),
		daysAhead: v.optional(v.number()), // Default to 7 days if not specified
	},
	handler: async (ctx, args): Promise<TaskDocument[]> => {
		const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
		if (!userOrgId) {
			return [];
		}
		const today = DateUtils.startOfDay(Date.now());
		const daysAhead = args.daysAhead || 7;
		const futureDate = DateUtils.addDays(today, daysAhead);

		let tasks = await ctx.db
			.query("tasks")
			.withIndex("by_date", (q) =>
				q.eq("orgId", userOrgId).gte("date", today).lt("date", futureDate)
			)
			.collect();

		// Only include pending and in-progress tasks
		tasks = tasks.filter(
			(task) => task.status === "pending" || task.status === "in-progress"
		);

		// Filter by assignee if specified
		if (args.assigneeUserId) {
			await validateUserAccess(ctx, args.assigneeUserId, userOrgId);
			tasks = tasks.filter(
				(task) => task.assigneeUserId === args.assigneeUserId
			);
		}

		// Sort by date, then by priority (urgent first), then by start time
		return tasks.sort((a, b) => {
			// First sort by date
			if (a.date !== b.date) {
				return a.date - b.date;
			}

			// Then by priority (urgent -> high -> medium -> low)
			const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
			const aPriority = priorityOrder[a.priority || "medium"];
			const bPriority = priorityOrder[b.priority || "medium"];

			if (aPriority !== bPriority) {
				return bPriority - aPriority; // Higher priority first
			}

			// Finally by start time if available
			if (a.startTime && b.startTime) {
				return a.startTime.localeCompare(b.startTime);
			}

			return a._creationTime - b._creationTime;
		});
	},
});

/**
 * Get tasks assigned to a specific user
 */
// TODO: Candidate for deletion if confirmed unused.
export const getByUser = query({
	args: {
		userId: v.id("users"),
		status: v.optional(
			v.union(
				v.literal("pending"),
				v.literal("in-progress"),
				v.literal("completed"),
				v.literal("cancelled")
			)
		),
		includeCompleted: v.optional(v.boolean()), // Whether to include completed tasks
	},
	handler: async (ctx, args): Promise<TaskDocument[]> => {
		const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
		if (!userOrgId) {
			return [];
		}

		// Validate the user exists and belongs to the same org
		await validateUserAccess(ctx, args.userId, userOrgId);

		let tasks = await ctx.db
			.query("tasks")
			.withIndex("by_assignee", (q) => q.eq("assigneeUserId", args.userId))
			.collect();

		// Filter by organization (additional security check)
		tasks = tasks.filter((task) => task.orgId === userOrgId);

		// Filter by status if specified
		if (args.status) {
			tasks = tasks.filter((task) => task.status === args.status);
		} else if (!args.includeCompleted) {
			// By default, exclude completed and cancelled tasks
			tasks = tasks.filter(
				(task) => task.status === "pending" || task.status === "in-progress"
			);
		}

		// Sort by date, then by priority, then by start time
		return tasks.sort((a, b) => {
			// First sort by date
			if (a.date !== b.date) {
				return a.date - b.date;
			}

			// Then by priority (urgent -> high -> medium -> low)
			const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
			const aPriority = priorityOrder[a.priority || "medium"];
			const bPriority = priorityOrder[b.priority || "medium"];

			if (aPriority !== bPriority) {
				return bPriority - aPriority; // Higher priority first
			}

			// Finally by start time if available
			if (a.startTime && b.startTime) {
				return a.startTime.localeCompare(b.startTime);
			}

			return a._creationTime - b._creationTime;
		});
	},
});
