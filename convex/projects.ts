import { query, mutation, QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { getCurrentUserOrgIdOptional, getCurrentUserOrgId } from "./lib/auth";
import { ActivityHelpers } from "./lib/activities";
import { DateUtils } from "./lib/shared";

/**
 * Project operations with embedded CRUD helpers
 * All project-specific logic lives in this file for better organization
 */

// Project-specific helper functions

/**
 * Get a project by ID with organization validation
 */
async function getProjectWithOrgValidation(
	ctx: QueryCtx | MutationCtx,
	id: Id<"projects">
): Promise<Doc<"projects"> | null> {
	const userOrgId = await getCurrentUserOrgIdOptional(ctx);
	if (!userOrgId) {
		return null;
	}
	const project = await ctx.db.get(id);

	if (!project) {
		return null;
	}

	if (project.orgId !== userOrgId) {
		throw new Error("Project does not belong to your organization");
	}

	return project;
}

/**
 * Get a project by ID, throwing if not found
 */
async function getProjectOrThrow(
	ctx: QueryCtx | MutationCtx,
	id: Id<"projects">
): Promise<Doc<"projects">> {
	const project = await getProjectWithOrgValidation(ctx, id);
	if (!project) {
		throw new Error("Project not found");
	}
	return project;
}

/**
 * Validate client exists and belongs to user's org
 */
async function validateClientAccess(
	ctx: QueryCtx | MutationCtx,
	clientId: Id<"clients">
): Promise<void> {
	const userOrgId = await getCurrentUserOrgIdOptional(ctx);
	if (!userOrgId) {
		throw new Error("User is not associated with an organization");
	}
	const client = await ctx.db.get(clientId);

	if (!client) {
		throw new Error("Client not found");
	}

	if (client.orgId !== userOrgId) {
		throw new Error("Client does not belong to your organization");
	}
}

/**
 * Validate users exist and belong to user's org
 */
async function validateUserAccess(
	ctx: QueryCtx | MutationCtx,
	userIds: Id<"users">[]
): Promise<void> {
	const userOrgId = await getCurrentUserOrgIdOptional(ctx);
	if (!userOrgId) {
		throw new Error("User is not associated with an organization");
	}

	for (const userId of userIds) {
		const user = await ctx.db.get(userId);
		if (!user) {
			throw new Error(`User ${userId} not found`);
		}
		if (user.organizationId !== userOrgId) {
			throw new Error(`User ${userId} does not belong to your organization`);
		}
	}
}

/**
 * Create a project with automatic orgId assignment
 */
async function createProjectWithOrg(
	ctx: MutationCtx,
	data: Omit<Doc<"projects">, "_id" | "_creationTime" | "orgId">
): Promise<Id<"projects">> {
	const userOrgId = await getCurrentUserOrgId(ctx);

	// Validate client access
	await validateClientAccess(ctx, data.clientId);

	// Validate assigned users if provided
	if (data.assignedUserIds && data.assignedUserIds.length > 0) {
		await validateUserAccess(ctx, data.assignedUserIds);
	}

	// Validate salesperson if provided
	if (data.salespersonId) {
		await validateUserAccess(ctx, [data.salespersonId]);
	}

	const projectData = {
		...data,
		orgId: userOrgId,
	};

	return await ctx.db.insert("projects", projectData);
}

/**
 * Update a project with validation
 */
async function updateProjectWithValidation(
	ctx: MutationCtx,
	id: Id<"projects">,
	updates: Partial<Doc<"projects">>
): Promise<void> {
	// Validate project exists and belongs to user's org
	await getProjectOrThrow(ctx, id);

	// Validate new client if being updated
	if (updates.clientId) {
		await validateClientAccess(ctx, updates.clientId);
	}

	// Validate assigned users if being updated
	if (updates.assignedUserIds && updates.assignedUserIds.length > 0) {
		await validateUserAccess(ctx, updates.assignedUserIds);
	}

	// Validate salesperson if being updated
	if (updates.salespersonId) {
		await validateUserAccess(ctx, [updates.salespersonId]);
	}

	// Update the project
	await ctx.db.patch(id, updates);
}

// Define specific types for project operations
type ProjectDocument = Doc<"projects">;
type ProjectId = Id<"projects">;

// Interface for project statistics
interface ProjectStats {
	total: number;
	byStatus: {
		planned: number;
		"in-progress": number;
		completed: number;
		cancelled: number;
	};
	byType: {
		"one-off": number;
		recurring: number;
	};
	upcomingDeadlines: number; // Projects with deadlines in next 7 days
	overdue: number; // Projects past due date
}

/**
 * Get all projects for the current user's organization
 */
export const list = query({
	args: {
		status: v.optional(
			v.union(
				v.literal("planned"),
				v.literal("in-progress"),
				v.literal("completed"),
				v.literal("cancelled")
			)
		),
		clientId: v.optional(v.id("clients")),
	},
	handler: async (ctx, args): Promise<ProjectDocument[]> => {
		const userOrgId = await getCurrentUserOrgIdOptional(ctx);
		if (!userOrgId) {
			return [];
		}

		let projects: ProjectDocument[];

		if (args.clientId) {
			await validateClientAccess(ctx, args.clientId);
			projects = await ctx.db
				.query("projects")
				.withIndex("by_client", (q) => q.eq("clientId", args.clientId!))
				.collect();
		} else if (args.status) {
			projects = await ctx.db
				.query("projects")
				.withIndex("by_status", (q) =>
					q.eq("orgId", userOrgId).eq("status", args.status!)
				)
				.collect();
		} else {
			projects = await ctx.db
				.query("projects")
				.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
				.collect();
		}

		return projects;
	},
});

/**
 * Get a specific project by ID
 */
export const get = query({
	args: { id: v.id("projects") },
	handler: async (ctx, args): Promise<ProjectDocument | null> => {
		return await getProjectWithOrgValidation(ctx, args.id);
	},
});

/**
 * Create a new project
 */
export const create = mutation({
	args: {
		clientId: v.id("clients"),
		title: v.string(),
		description: v.optional(v.string()),
		instructions: v.optional(v.string()),
		projectNumber: v.optional(v.string()),
		status: v.union(
			v.literal("planned"),
			v.literal("in-progress"),
			v.literal("completed"),
			v.literal("cancelled")
		),
		projectType: v.union(v.literal("one-off"), v.literal("recurring")),
		startDate: v.optional(v.number()),
		endDate: v.optional(v.number()),
		dueDate: v.optional(v.number()),
		salespersonId: v.optional(v.id("users")),
		assignedUserIds: v.optional(v.array(v.id("users"))),
		invoiceReminderEnabled: v.optional(v.boolean()),
		scheduleForLater: v.optional(v.boolean()),
	},
	handler: async (ctx, args): Promise<ProjectId> => {
		// Validate title is not empty
		if (!args.title.trim()) {
			throw new Error("Project title is required");
		}

		// Validate dates if provided
		if (args.startDate && args.endDate && args.startDate > args.endDate) {
			throw new Error("Start date cannot be after end date");
		}

		if (args.startDate && args.dueDate && args.startDate > args.dueDate) {
			throw new Error("Start date cannot be after due date");
		}

		const projectId = await createProjectWithOrg(ctx, args);

		// Get the created project for activity logging
		const project = await ctx.db.get(projectId);
		if (project) {
			await ActivityHelpers.projectCreated(ctx, project as ProjectDocument);
		}

		return projectId;
	},
});

/**
 * Update a project
 */
export const update = mutation({
	args: {
		id: v.id("projects"),
		clientId: v.optional(v.id("clients")),
		title: v.optional(v.string()),
		description: v.optional(v.string()),
		instructions: v.optional(v.string()),
		projectNumber: v.optional(v.string()),
		status: v.optional(
			v.union(
				v.literal("planned"),
				v.literal("in-progress"),
				v.literal("completed"),
				v.literal("cancelled")
			)
		),
		projectType: v.optional(
			v.union(v.literal("one-off"), v.literal("recurring"))
		),
		startDate: v.optional(v.number()),
		endDate: v.optional(v.number()),
		dueDate: v.optional(v.number()),
		salespersonId: v.optional(v.id("users")),
		assignedUserIds: v.optional(v.array(v.id("users"))),
		invoiceReminderEnabled: v.optional(v.boolean()),
		scheduleForLater: v.optional(v.boolean()),
	},
	handler: async (ctx, args): Promise<ProjectId> => {
		const { id, ...updates } = args;

		// Validate title is not empty if being updated
		if (updates.title !== undefined && !updates.title.trim()) {
			throw new Error("Project title cannot be empty");
		}

		// Filter out undefined values
		const filteredUpdates = Object.fromEntries(
			Object.entries(updates).filter(([, value]) => value !== undefined)
		) as Partial<ProjectDocument>;

		if (Object.keys(filteredUpdates).length === 0) {
			throw new Error("No valid updates provided");
		}

		// Get current project for date validation
		const currentProject = await getProjectOrThrow(ctx, id);
		const startDate = filteredUpdates.startDate ?? currentProject.startDate;
		const endDate = filteredUpdates.endDate ?? currentProject.endDate;
		const dueDate = filteredUpdates.dueDate ?? currentProject.dueDate;

		// Validate dates
		if (startDate && endDate && startDate > endDate) {
			throw new Error("Start date cannot be after end date");
		}

		if (startDate && dueDate && startDate > dueDate) {
			throw new Error("Start date cannot be after due date");
		}

		// Check if status is being changed to completed
		const wasCompleted = currentProject.status === "completed";
		const isBeingCompleted =
			filteredUpdates.status === "completed" && !wasCompleted;

		await updateProjectWithValidation(ctx, id, filteredUpdates);

		// Get updated project for activity logging
		const project = await ctx.db.get(id);
		if (project) {
			if (isBeingCompleted) {
				await ActivityHelpers.projectCompleted(ctx, project as ProjectDocument);
			} else {
				await ActivityHelpers.projectUpdated(ctx, project as ProjectDocument);
			}
		}

		return id;
	},
});

/**
 * Delete a project with relationship validation
 */
export const remove = mutation({
	args: { id: v.id("projects") },
	handler: async (ctx, args): Promise<ProjectId> => {
		// First check if project has any related data
		const tasks = await ctx.db
			.query("tasks")
			.withIndex("by_project", (q) => q.eq("projectId", args.id))
			.collect();

		const quotes = await ctx.db
			.query("quotes")
			.withIndex("by_project", (q) => q.eq("projectId", args.id))
			.collect();

		const invoices = await ctx.db
			.query("invoices")
			.withIndex("by_project", (q) => q.eq("projectId", args.id))
			.collect();

		// Prevent deletion if project has related data
		if (tasks.length > 0 || quotes.length > 0 || invoices.length > 0) {
			throw new Error(
				"Cannot delete project with existing tasks, quotes, or invoices. " +
					"Please remove or transfer these items first."
			);
		}

		await getProjectOrThrow(ctx, args.id); // Validate access
		await ctx.db.delete(args.id);

		return args.id;
	},
});

/**
 * Search projects with filtering
 */
export const search = query({
	args: {
		query: v.string(),
		status: v.optional(
			v.union(
				v.literal("planned"),
				v.literal("in-progress"),
				v.literal("completed"),
				v.literal("cancelled")
			)
		),
		projectType: v.optional(
			v.union(v.literal("one-off"), v.literal("recurring"))
		),
		clientId: v.optional(v.id("clients")),
	},
	handler: async (ctx, args): Promise<ProjectDocument[]> => {
		const userOrgId = await getCurrentUserOrgIdOptional(ctx);
		if (!userOrgId) {
			return [];
		}
		let projects = await ctx.db
			.query("projects")
			.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
			.collect();

		// Filter by client if specified
		if (args.clientId) {
			await validateClientAccess(ctx, args.clientId);
			projects = projects.filter(
				(project: ProjectDocument) => project.clientId === args.clientId
			);
		}

		// Filter by status if specified
		if (args.status) {
			projects = projects.filter(
				(project: ProjectDocument) => project.status === args.status
			);
		}

		// Filter by project type if specified
		if (args.projectType) {
			projects = projects.filter(
				(project: ProjectDocument) => project.projectType === args.projectType
			);
		}

		// Search in title, description, instructions, and project number
		const searchQuery = args.query.toLowerCase();
		return projects.filter(
			(project: ProjectDocument) =>
				project.title.toLowerCase().includes(searchQuery) ||
				(project.description &&
					project.description.toLowerCase().includes(searchQuery)) ||
				(project.instructions &&
					project.instructions.toLowerCase().includes(searchQuery)) ||
				(project.projectNumber &&
					project.projectNumber.toLowerCase().includes(searchQuery))
		);
	},
});

/**
 * Get project statistics for dashboard
 */
export const getStats = query({
	args: {},
	handler: async (ctx): Promise<ProjectStats> => {
		const userOrgId = await getCurrentUserOrgIdOptional(ctx);
		if (!userOrgId) {
			return {
				total: 0,
				byStatus: {
					planned: 0,
					"in-progress": 0,
					completed: 0,
					cancelled: 0,
				},
				byType: {
					"one-off": 0,
					recurring: 0,
				},
				upcomingDeadlines: 0,
				overdue: 0,
			};
		}
		const projects = await ctx.db
			.query("projects")
			.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
			.collect();

		const stats: ProjectStats = {
			total: projects.length,
			byStatus: {
				planned: 0,
				"in-progress": 0,
				completed: 0,
				cancelled: 0,
			},
			byType: {
				"one-off": 0,
				recurring: 0,
			},
			upcomingDeadlines: 0,
			overdue: 0,
		};

		const now = Date.now();
		const nextWeek = DateUtils.addDays(now, 7);

		projects.forEach((project: ProjectDocument) => {
			// Count by status
			stats.byStatus[project.status]++;

			// Count by type
			stats.byType[project.projectType]++;

			// Count upcoming deadlines (next 7 days)
			if (
				project.dueDate &&
				project.dueDate <= nextWeek &&
				project.dueDate > now
			) {
				stats.upcomingDeadlines++;
			}

			// Count overdue projects
			if (
				project.dueDate &&
				project.dueDate < now &&
				project.status !== "completed"
			) {
				stats.overdue++;
			}
		});

		return stats;
	},
});

/**
 * Get projects assigned to a specific user
 */
export const getByAssignee = query({
	args: { userId: v.id("users") },
	handler: async (ctx, args): Promise<ProjectDocument[]> => {
		const userOrgId = await getCurrentUserOrgIdOptional(ctx);
		if (!userOrgId) {
			return [];
		}

		// Validate user belongs to organization
		await validateUserAccess(ctx, [args.userId]);

		const projects = await ctx.db
			.query("projects")
			.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
			.collect();

		// Filter projects where user is assigned or is the salesperson
		return projects.filter(
			(project: ProjectDocument) =>
				project.salespersonId === args.userId ||
				(project.assignedUserIds &&
					project.assignedUserIds.includes(args.userId))
		);
	},
});

/**
 * Get projects with upcoming deadlines
 */
export const getUpcomingDeadlines = query({
	args: { days: v.optional(v.number()) },
	handler: async (ctx, args): Promise<ProjectDocument[]> => {
		const userOrgId = await getCurrentUserOrgIdOptional(ctx);
		if (!userOrgId) {
			return [];
		}
		const daysAhead = args.days || 7;

		const projects = await ctx.db
			.query("projects")
			.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
			.collect();

		const now = Date.now();
		const deadline = DateUtils.addDays(now, daysAhead);

		return projects.filter(
			(project: ProjectDocument) =>
				project.dueDate &&
				project.dueDate <= deadline &&
				project.dueDate > now &&
				project.status !== "completed" &&
				project.status !== "cancelled"
		);
	},
});

/**
 * Get overdue projects
 */
export const getOverdue = query({
	args: {},
	handler: async (ctx): Promise<ProjectDocument[]> => {
		const userOrgId = await getCurrentUserOrgIdOptional(ctx);
		if (!userOrgId) {
			return [];
		}

		const projects = await ctx.db
			.query("projects")
			.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
			.collect();

		const now = Date.now();

		return projects.filter(
			(project: ProjectDocument) =>
				project.dueDate &&
				project.dueDate < now &&
				project.status !== "completed" &&
				project.status !== "cancelled"
		);
	},
});
