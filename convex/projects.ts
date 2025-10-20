import { query, mutation, QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { getCurrentUserOrgId } from "./lib/auth";
import { ActivityHelpers } from "./lib/activities";
import { DateUtils } from "./lib/shared";
import { requireMembership } from "./lib/memberships";

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
	id: Id<"projects">,
	existingOrgId?: Id<"organizations">
): Promise<Doc<"projects"> | null> {
	const userOrgId = existingOrgId ?? (await getCurrentUserOrgId(ctx));
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
 * Validate users exist and belong to user's org
 */
async function validateUserAccess(
	ctx: QueryCtx | MutationCtx,
	userIds: Id<"users">[],
	existingOrgId?: Id<"organizations">
): Promise<void> {
	const userOrgId = existingOrgId ?? (await getCurrentUserOrgId(ctx));

	for (const userId of userIds) {
		const user = await ctx.db.get(userId);
		if (!user) {
			throw new Error(`User ${userId} not found`);
		}
		await requireMembership(ctx, userId, userOrgId);
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
	await validateClientAccess(ctx, data.clientId, userOrgId);

	// Validate assigned users if provided
	if (data.assignedUserIds && data.assignedUserIds.length > 0) {
		await validateUserAccess(ctx, data.assignedUserIds, userOrgId);
	}

	// Validate salesperson if provided
	if (data.salespersonId) {
		await validateUserAccess(ctx, [data.salespersonId], userOrgId);
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

function createEmptyProjectStats(): ProjectStats {
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
		const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
		if (!userOrgId) {
			return [];
		}

		let projects: ProjectDocument[];

		if (args.clientId) {
			await validateClientAccess(ctx, args.clientId, userOrgId);
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
		const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
		if (!userOrgId) {
			return null;
		}
		return await getProjectWithOrgValidation(ctx, args.id, userOrgId);
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
 * Bulk create projects from CSV import
 */
export const bulkCreate = mutation({
	args: {
		projects: v.array(
			v.object({
				clientId: v.optional(v.id("clients")),
				clientName: v.optional(v.string()), // For lookup if clientId not provided
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
				salespersonId: v.optional(v.id("users")),
				assignedUserIds: v.optional(v.array(v.id("users"))),
				invoiceReminderEnabled: v.optional(v.boolean()),
				scheduleForLater: v.optional(v.boolean()),
			})
		),
	},
	handler: async (
		ctx,
		args
	): Promise<Array<{ success: boolean; id?: ProjectId; error?: string }>> => {
		const results: Array<{
			success: boolean;
			id?: ProjectId;
			error?: string;
		}> = [];

		const userOrgId = await getCurrentUserOrgId(ctx);

		for (const projectData of args.projects) {
			try {
				// Validate required fields
				if (!projectData.title || !projectData.title.trim()) {
					results.push({
						success: false,
						error: "Project title is required",
					});
					continue;
				}

				// Resolve clientId if clientName is provided instead
				let clientId = projectData.clientId;
				if (!clientId && projectData.clientName) {
					const clients = await ctx.db
						.query("clients")
						.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
						.collect();

					const matchedClient = clients.find(
						(c) =>
							c.companyName.toLowerCase() ===
							projectData.clientName!.toLowerCase()
					);

					if (matchedClient) {
						clientId = matchedClient._id;
					} else {
						results.push({
							success: false,
							error: `Client "${projectData.clientName}" not found`,
						});
						continue;
					}
				}

				if (!clientId) {
					results.push({
						success: false,
						error: "Client ID or client name is required",
					});
					continue;
				}

				// Validate dates if provided
				if (
					projectData.startDate &&
					projectData.endDate &&
					projectData.startDate > projectData.endDate
				) {
					results.push({
						success: false,
						error: "Start date cannot be after end date",
					});
					continue;
				}

				// Create the project
				const { clientName, ...projectCreateData } = projectData;
				const projectId = await createProjectWithOrg(ctx, {
					...projectCreateData,
					clientId,
				});

				// Get the created project for activity logging
				const project = await ctx.db.get(projectId);
				if (project) {
					await ActivityHelpers.projectCreated(ctx, project as ProjectDocument);
				}

				results.push({
					success: true,
					id: projectId,
				});
			} catch (error) {
				results.push({
					success: false,
					error:
						error instanceof Error ? error.message : "Unknown error occurred",
				});
			}
		}

		return results;
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

		// Validate dates
		if (startDate && endDate && startDate > endDate) {
			throw new Error("Start date cannot be after end date");
		}

		// Check if status is being changed to completed
		const wasCompleted = currentProject.status === "completed";
		const isBeingCompleted =
			filteredUpdates.status === "completed" && !wasCompleted;

		// If being completed, set completion time
		if (isBeingCompleted) {
			filteredUpdates.completedAt = Date.now();
		}

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
// TODO: Candidate for deletion if confirmed unused.
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
		const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
		if (!userOrgId) {
			return [];
		}
		let projects = await ctx.db
			.query("projects")
			.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
			.collect();

		// Filter by client if specified
		if (args.clientId) {
			await validateClientAccess(ctx, args.clientId, userOrgId);
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
		const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
		if (!userOrgId) {
			return createEmptyProjectStats();
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

			// Count upcoming deadlines (next 7 days) - based on end date
			if (
				project.endDate &&
				project.endDate <= nextWeek &&
				project.endDate > now
			) {
				stats.upcomingDeadlines++;
			}

			// Count overdue projects - based on end date
			if (
				project.endDate &&
				project.endDate < now &&
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
// TODO: Candidate for deletion if confirmed unused.
export const getByAssignee = query({
	args: { userId: v.id("users") },
	handler: async (ctx, args): Promise<ProjectDocument[]> => {
		const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
		if (!userOrgId) {
			return [];
		}

		// Validate user belongs to organization
		await validateUserAccess(ctx, [args.userId], userOrgId);

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
// TODO: Candidate for deletion if confirmed unused.
export const getUpcomingDeadlines = query({
	args: { days: v.optional(v.number()) },
	handler: async (ctx, args): Promise<ProjectDocument[]> => {
		const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
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
				project.endDate &&
				project.endDate <= deadline &&
				project.endDate > now &&
				project.status !== "completed" &&
				project.status !== "cancelled"
		);
	},
});

/**
 * Get overdue projects
 */
// TODO: Candidate for deletion if confirmed unused.
export const getOverdue = query({
	args: {},
	handler: async (ctx): Promise<ProjectDocument[]> => {
		const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
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
				project.endDate &&
				project.endDate < now &&
				project.status !== "completed" &&
				project.status !== "cancelled"
		);
	},
});
