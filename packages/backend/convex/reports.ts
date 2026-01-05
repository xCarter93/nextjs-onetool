import { query, mutation, QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { getCurrentUserOrgId, getCurrentUser } from "./lib/auth";

/**
 * Report operations with CRUD helpers
 * Handles saved report configurations for analytics and data visualization
 */

// Report configuration validators
const reportConfigValidator = v.object({
	entityType: v.union(
		v.literal("clients"),
		v.literal("projects"),
		v.literal("tasks"),
		v.literal("quotes"),
		v.literal("invoices"),
		v.literal("activities")
	),
	filters: v.optional(v.any()),
	aggregations: v.optional(
		v.array(
			v.object({
				field: v.string(),
				operation: v.union(
					v.literal("count"),
					v.literal("sum"),
					v.literal("avg"),
					v.literal("min"),
					v.literal("max")
				),
			})
		)
	),
	groupBy: v.optional(v.array(v.string())),
	dateRange: v.optional(
		v.object({
			start: v.optional(v.number()),
			end: v.optional(v.number()),
		})
	),
});

const visualizationValidator = v.object({
	type: v.union(
		v.literal("table"),
		v.literal("bar"),
		v.literal("line"),
		v.literal("pie")
	),
	options: v.optional(v.any()),
});

// Helper functions

/**
 * Get a report by ID with organization validation
 */
async function getReportWithOrgValidation(
	ctx: QueryCtx | MutationCtx,
	id: Id<"reports">
): Promise<Doc<"reports"> | null> {
	const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
	if (!userOrgId) {
		return null;
	}

	const report = await ctx.db.get(id);
	if (!report) {
		return null;
	}

	if (report.orgId !== userOrgId) {
		throw new Error("Report does not belong to your organization");
	}

	return report;
}

/**
 * Get a report by ID, throwing if not found
 */
async function getReportOrThrow(
	ctx: QueryCtx | MutationCtx,
	id: Id<"reports">
): Promise<Doc<"reports">> {
	const report = await getReportWithOrgValidation(ctx, id);
	if (!report) {
		throw new Error("Report not found");
	}
	return report;
}

// ============================================================================
// Query Operations
// ============================================================================

/**
 * List all reports for the current user's organization
 */
export const list = query({
	args: {},
	handler: async (ctx): Promise<Doc<"reports">[]> => {
		const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
		if (!userOrgId) {
			return [];
		}

		const reports = await ctx.db
			.query("reports")
			.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
			.collect();

		// Sort by most recently updated
		return reports.sort((a, b) => b.updatedAt - a.updatedAt);
	},
});

/**
 * Get a single report by ID
 */
export const get = query({
	args: { id: v.id("reports") },
	handler: async (ctx, args): Promise<Doc<"reports"> | null> => {
		return await getReportWithOrgValidation(ctx, args.id);
	},
});

/**
 * Get reports created by the current user
 */
export const getMyReports = query({
	args: {},
	handler: async (ctx): Promise<Doc<"reports">[]> => {
		const user = await getCurrentUser(ctx);
		if (!user) {
			return [];
		}

		const reports = await ctx.db
			.query("reports")
			.withIndex("by_creator", (q) => q.eq("createdBy", user._id))
			.collect();

		return reports.sort((a, b) => b.updatedAt - a.updatedAt);
	},
});

// ============================================================================
// Mutation Operations
// ============================================================================

/**
 * Create a new report
 */
export const create = mutation({
	args: {
		name: v.string(),
		description: v.optional(v.string()),
		config: reportConfigValidator,
		visualization: visualizationValidator,
		isPublic: v.optional(v.boolean()),
	},
	handler: async (ctx, args): Promise<Id<"reports">> => {
		const user = await getCurrentUser(ctx);
		if (!user) {
			throw new Error("Not authenticated");
		}

		const userOrgId = await getCurrentUserOrgId(ctx);
		if (!userOrgId) {
			throw new Error("No organization found");
		}

		const now = Date.now();

		const reportId = await ctx.db.insert("reports", {
			orgId: userOrgId,
			createdBy: user._id,
			name: args.name,
			description: args.description,
			config: args.config,
			visualization: args.visualization,
			isPublic: args.isPublic ?? false,
			createdAt: now,
			updatedAt: now,
		});

		return reportId;
	},
});

/**
 * Update an existing report
 */
export const update = mutation({
	args: {
		id: v.id("reports"),
		name: v.optional(v.string()),
		description: v.optional(v.string()),
		config: v.optional(reportConfigValidator),
		visualization: v.optional(visualizationValidator),
		isPublic: v.optional(v.boolean()),
	},
	handler: async (ctx, args): Promise<Id<"reports">> => {
		const report = await getReportOrThrow(ctx, args.id);

		const updates: Partial<Doc<"reports">> = {
			updatedAt: Date.now(),
		};

		if (args.name !== undefined) {
			updates.name = args.name;
		}
		if (args.description !== undefined) {
			updates.description = args.description;
		}
		if (args.config !== undefined) {
			updates.config = args.config;
		}
		if (args.visualization !== undefined) {
			updates.visualization = args.visualization;
		}
		if (args.isPublic !== undefined) {
			updates.isPublic = args.isPublic;
		}

		await ctx.db.patch(report._id, updates);
		return report._id;
	},
});

/**
 * Delete a report
 */
export const remove = mutation({
	args: { id: v.id("reports") },
	handler: async (ctx, args): Promise<void> => {
		const report = await getReportOrThrow(ctx, args.id);
		await ctx.db.delete(report._id);
	},
});

/**
 * Duplicate an existing report
 */
export const duplicate = mutation({
	args: { id: v.id("reports") },
	handler: async (ctx, args): Promise<Id<"reports">> => {
		const user = await getCurrentUser(ctx);
		if (!user) {
			throw new Error("Not authenticated");
		}

		const report = await getReportOrThrow(ctx, args.id);
		const now = Date.now();

		const newReportId = await ctx.db.insert("reports", {
			orgId: report.orgId,
			createdBy: user._id,
			name: `${report.name} (Copy)`,
			description: report.description,
			config: report.config,
			visualization: report.visualization,
			isPublic: false, // Copies are private by default
			createdAt: now,
			updatedAt: now,
		});

		return newReportId;
	},
});
