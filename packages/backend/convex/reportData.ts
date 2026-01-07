import { query, QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { getCurrentUserOrgId } from "./lib/auth";
import { getOrgTimezoneById } from "./lib/organization";
import { DateUtils } from "./lib/shared";

/**
 * Report Data Queries
 * Provides aggregated data for report visualizations and analytics
 */

// Common types for report data
export interface AggregatedDataPoint {
	label: string;
	value: number;
	metadata?: Record<string, unknown>;
}

export interface ReportDataResult {
	data: AggregatedDataPoint[];
	total: number;
	metadata?: {
		entityType: string;
		dateRange?: { start: number; end: number };
		groupBy?: string;
	};
}

// Paginated result type
export interface PaginatedReportDataResult extends ReportDataResult {
	nextCursor?: string;
	hasMore: boolean;
}

// Date range validator
const dateRangeValidator = v.optional(
	v.object({
		start: v.optional(v.number()),
		end: v.optional(v.number()),
	})
);

// Pagination validator
const paginationValidator = {
	limit: v.optional(v.number()),
	cursor: v.optional(v.string()),
};

/**
 * Get normalized date bounds for a date range
 * Returns undefined bounds if no date range is specified (meaning "all time")
 */
const getDateBounds = (dateRange?: {
	start?: number;
	end?: number;
}): { start?: number; end?: number; hasDateFilter: boolean } => {
	// If no date range specified, return no bounds (all time)
	if (!dateRange || (!dateRange.start && !dateRange.end)) {
		return { start: undefined, end: undefined, hasDateFilter: false };
	}

	const now = Date.now();
	const start = dateRange.start
		? DateUtils.startOfDay(dateRange.start)
		: undefined;
	const end = dateRange.end
		? DateUtils.endOfDay(dateRange.end)
		: DateUtils.endOfDay(now);

	return { start, end, hasDateFilter: true };
};

/**
 * Get a date key for grouping based on granularity
 */
const getDateKey = (
	timestamp: number,
	granularity: "day" | "week" | "month",
	timezone?: string
): string => {
	const dateStr = DateUtils.toLocalDateString(timestamp, timezone);

	switch (granularity) {
		case "day":
			return dateStr; // YYYY-MM-DD
		case "week": {
			// Get the start of the week (Sunday)
			const date = new Date(timestamp);
			const dayOfWeek = date.getDay();
			const weekStart = new Date(date);
			weekStart.setDate(date.getDate() - dayOfWeek);
			return DateUtils.toLocalDateString(weekStart.getTime(), timezone);
		}
		case "month":
		default:
			return dateStr.substring(0, 7); // YYYY-MM
	}
};

/**
 * Format a date key into a human-readable label
 */
const formatDateLabel = (
	dateKey: string,
	granularity: "day" | "week" | "month"
): string => {
	switch (granularity) {
		case "day": {
			// Format as "Jan 15, 2024"
			const date = new Date(dateKey + "T12:00:00");
			return date.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
			});
		}
		case "week": {
			// Format as "Week of Jan 15"
			const date = new Date(dateKey + "T12:00:00");
			return `Week of ${date.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
			})}`;
		}
		case "month":
		default: {
			// Format as "Jan 2024"
			const [year, month] = dateKey.split("-");
			const date = new Date(parseInt(year), parseInt(month) - 1, 1);
			return date.toLocaleDateString("en-US", {
				month: "short",
				year: "numeric",
			});
		}
	}
};

/**
 * Encode cursor for pagination
 */
const encodeCursor = (offset: number): string => {
	return Buffer.from(offset.toString()).toString("base64");
};

/**
 * Decode cursor for pagination
 */
const decodeCursor = (cursor?: string): number => {
	if (!cursor) return 0;
	try {
		return parseInt(Buffer.from(cursor, "base64").toString("utf-8"), 10);
	} catch {
		return 0;
	}
};

// ============================================================================
// Public Query Exports
// These delegate to internal implementation functions
// ============================================================================

// Client Reports
export const queryClientsByStatus = query({
	args: { dateRange: dateRangeValidator },
	handler: async (ctx, args) => _queryClientsByStatus(ctx, args),
});

export const queryClientsByLeadSource = query({
	args: { dateRange: dateRangeValidator },
	handler: async (ctx, args) => _queryClientsByLeadSource(ctx, args),
});

export const queryClientsByCreationDate = query({
	args: {
		dateRange: dateRangeValidator,
		granularity: v.optional(
			v.union(v.literal("day"), v.literal("week"), v.literal("month"))
		),
	},
	handler: async (ctx, args) => _queryClientsByCreationDate(ctx, args),
});

// Project Reports
export const queryProjectsByStatus = query({
	args: { dateRange: dateRangeValidator },
	handler: async (ctx, args) => _queryProjectsByStatus(ctx, args),
});

export const queryProjectsByType = query({
	args: { dateRange: dateRangeValidator },
	handler: async (ctx, args) => _queryProjectsByType(ctx, args),
});

export const queryProjectsByCreationDate = query({
	args: {
		dateRange: dateRangeValidator,
		granularity: v.optional(
			v.union(v.literal("day"), v.literal("week"), v.literal("month"))
		),
	},
	handler: async (ctx, args) => _queryProjectsByCreationDate(ctx, args),
});

// Task Reports
export const queryTasksByStatus = query({
	args: { dateRange: dateRangeValidator },
	handler: async (ctx, args) => _queryTasksByStatus(ctx, args),
});

export const queryTaskCompletionRate = query({
	args: { dateRange: dateRangeValidator },
	handler: async (ctx, args) => _queryTaskCompletionRate(ctx, args),
});

export const queryTasksByDate = query({
	args: {
		dateRange: dateRangeValidator,
		granularity: v.optional(
			v.union(v.literal("day"), v.literal("week"), v.literal("month"))
		),
	},
	handler: async (ctx, args) => _queryTasksByDate(ctx, args),
});

// Quote Reports
export const queryQuotesByStatus = query({
	args: { dateRange: dateRangeValidator },
	handler: async (ctx, args) => _queryQuotesByStatus(ctx, args),
});

export const queryQuoteConversionRate = query({
	args: { dateRange: dateRangeValidator },
	handler: async (ctx, args) => _queryQuoteConversionRate(ctx, args),
});

// Invoice Reports
export const queryInvoicesByStatus = query({
	args: { dateRange: dateRangeValidator },
	handler: async (ctx, args) => _queryInvoicesByStatus(ctx, args),
});

export const queryRevenueByMonth = query({
	args: { dateRange: dateRangeValidator },
	handler: async (ctx, args) => _queryRevenueByMonth(ctx, args),
});

export const queryRevenueByClient = query({
	args: {
		dateRange: dateRangeValidator,
		limit: v.optional(v.number()),
		cursor: v.optional(v.string()),
	},
	handler: async (ctx, args) => _queryRevenueByClient(ctx, args),
});

// Activity Reports
export const queryActivitiesByType = query({
	args: { dateRange: dateRangeValidator },
	handler: async (ctx, args) => _queryActivitiesByType(ctx, args),
});

export const queryActivitiesByDate = query({
	args: {
		dateRange: dateRangeValidator,
		granularity: v.optional(
			v.union(v.literal("day"), v.literal("week"), v.literal("month"))
		),
	},
	handler: async (ctx, args) => _queryActivitiesByDate(ctx, args),
});

// ============================================================================
// Internal Query Implementation Functions
// ============================================================================

/**
 * Internal implementation for clients by status
 */
async function _queryClientsByStatus(
	ctx: QueryCtx,
	args: { dateRange?: { start?: number; end?: number } }
): Promise<ReportDataResult> {
	const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
	if (!userOrgId) {
		return { data: [], total: 0 };
	}

	const { start, end, hasDateFilter } = getDateBounds(args.dateRange);

	const allClients = await ctx.db
		.query("clients")
		.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
		.collect();

	const clients =
		hasDateFilter && start && end
			? allClients.filter(
					(c) => c._creationTime >= start && c._creationTime <= end
				)
			: allClients;

	const statusCounts: Record<string, number> = {
		lead: 0,
		active: 0,
		inactive: 0,
		archived: 0,
	};

	for (const client of clients) {
		statusCounts[client.status] = (statusCounts[client.status] || 0) + 1;
	}

	const statusLabels: Record<string, string> = {
		lead: "Prospective",
		active: "Active",
		inactive: "Inactive",
		archived: "Archived",
	};

	const data: AggregatedDataPoint[] = Object.entries(statusCounts)
		.filter(([, count]) => count > 0)
		.map(([status, count]) => ({
			label:
				statusLabels[status] ||
				status.charAt(0).toUpperCase() + status.slice(1),
			value: count,
		}));

	return {
		data,
		total: clients.length,
		metadata: {
			entityType: "clients",
			dateRange: hasDateFilter && start && end ? { start, end } : undefined,
			groupBy: "status",
		},
	};
}

/**
 * Internal implementation for clients by lead source
 */
async function _queryClientsByLeadSource(
	ctx: QueryCtx,
	args: { dateRange?: { start?: number; end?: number } }
): Promise<ReportDataResult> {
	const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
	if (!userOrgId) {
		return { data: [], total: 0 };
	}

	const { start, end, hasDateFilter } = getDateBounds(args.dateRange);

	const allClients = await ctx.db
		.query("clients")
		.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
		.collect();

	const clients =
		hasDateFilter && start && end
			? allClients.filter(
					(c) => c._creationTime >= start && c._creationTime <= end
				)
			: allClients;

	const sourceCounts: Record<string, number> = {};
	for (const client of clients) {
		const source = client.leadSource || "unknown";
		sourceCounts[source] = (sourceCounts[source] || 0) + 1;
	}

	const data: AggregatedDataPoint[] = Object.entries(sourceCounts)
		.map(([source, count]) => ({
			label: source
				.split("-")
				.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
				.join(" "),
			value: count,
		}))
		.sort((a, b) => b.value - a.value);

	return {
		data,
		total: clients.length,
		metadata: {
			entityType: "clients",
			dateRange: hasDateFilter && start && end ? { start, end } : undefined,
			groupBy: "leadSource",
		},
	};
}

/**
 * Internal implementation for clients by creation date
 */
async function _queryClientsByCreationDate(
	ctx: QueryCtx,
	args: {
		dateRange?: { start?: number; end?: number };
		granularity?: "day" | "week" | "month";
	}
): Promise<ReportDataResult> {
	const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
	if (!userOrgId) {
		return { data: [], total: 0 };
	}

	const { start, end, hasDateFilter } = getDateBounds(args.dateRange);
	const granularity = args.granularity || "month";
	const timezone = await getOrgTimezoneById(ctx, userOrgId);

	const allClients = await ctx.db
		.query("clients")
		.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
		.collect();

	const clients =
		hasDateFilter && start && end
			? allClients.filter(
					(c) => c._creationTime >= start && c._creationTime <= end
				)
			: allClients;

	const dateCounts: Record<string, number> = {};
	for (const client of clients) {
		const dateKey = getDateKey(client._creationTime, granularity, timezone);
		dateCounts[dateKey] = (dateCounts[dateKey] || 0) + 1;
	}

	const data: AggregatedDataPoint[] = Object.entries(dateCounts)
		.map(([dateKey, count]) => ({
			label: formatDateLabel(dateKey, granularity),
			value: count,
			metadata: { dateKey },
		}))
		.sort((a, b) => {
			const aKey = a.metadata?.dateKey as string;
			const bKey = b.metadata?.dateKey as string;
			return aKey.localeCompare(bKey);
		});

	return {
		data,
		total: clients.length,
		metadata: {
			entityType: "clients",
			dateRange: hasDateFilter && start && end ? { start, end } : undefined,
			groupBy: `creationDate_${granularity}`,
		},
	};
}

/**
 * Internal implementation for projects by status
 */
async function _queryProjectsByStatus(
	ctx: QueryCtx,
	args: { dateRange?: { start?: number; end?: number } }
): Promise<ReportDataResult> {
	const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
	if (!userOrgId) {
		return { data: [], total: 0 };
	}

	const { start, end, hasDateFilter } = getDateBounds(args.dateRange);

	const allProjects = await ctx.db
		.query("projects")
		.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
		.collect();

	const projects =
		hasDateFilter && start && end
			? allProjects.filter(
					(p) => p._creationTime >= start && p._creationTime <= end
				)
			: allProjects;

	const statusCounts: Record<string, number> = {
		planned: 0,
		"in-progress": 0,
		completed: 0,
		cancelled: 0,
	};

	for (const project of projects) {
		statusCounts[project.status] = (statusCounts[project.status] || 0) + 1;
	}

	const data: AggregatedDataPoint[] = Object.entries(statusCounts)
		.filter(([, count]) => count > 0)
		.map(([status, count]) => ({
			label: status
				.split("-")
				.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
				.join(" "),
			value: count,
		}));

	return {
		data,
		total: projects.length,
		metadata: {
			entityType: "projects",
			dateRange: hasDateFilter && start && end ? { start, end } : undefined,
			groupBy: "status",
		},
	};
}

/**
 * Internal implementation for projects by type
 */
async function _queryProjectsByType(
	ctx: QueryCtx,
	args: { dateRange?: { start?: number; end?: number } }
): Promise<ReportDataResult> {
	const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
	if (!userOrgId) {
		return { data: [], total: 0 };
	}

	const { start, end, hasDateFilter } = getDateBounds(args.dateRange);

	const allProjects = await ctx.db
		.query("projects")
		.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
		.collect();

	const projects =
		hasDateFilter && start && end
			? allProjects.filter(
					(p) => p._creationTime >= start && p._creationTime <= end
				)
			: allProjects;

	const typeCounts: Record<string, number> = {
		"one-off": 0,
		recurring: 0,
	};

	for (const project of projects) {
		typeCounts[project.projectType] =
			(typeCounts[project.projectType] || 0) + 1;
	}

	const data: AggregatedDataPoint[] = Object.entries(typeCounts)
		.filter(([, count]) => count > 0)
		.map(([type, count]) => ({
			label: type === "one-off" ? "One-off" : "Recurring",
			value: count,
		}));

	return {
		data,
		total: projects.length,
		metadata: {
			entityType: "projects",
			dateRange: hasDateFilter && start && end ? { start, end } : undefined,
			groupBy: "projectType",
		},
	};
}

/**
 * Internal implementation for projects by creation date
 */
async function _queryProjectsByCreationDate(
	ctx: QueryCtx,
	args: {
		dateRange?: { start?: number; end?: number };
		granularity?: "day" | "week" | "month";
	}
): Promise<ReportDataResult> {
	const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
	if (!userOrgId) {
		return { data: [], total: 0 };
	}

	const { start, end, hasDateFilter } = getDateBounds(args.dateRange);
	const granularity = args.granularity || "month";
	const timezone = await getOrgTimezoneById(ctx, userOrgId);

	const allProjects = await ctx.db
		.query("projects")
		.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
		.collect();

	const projects =
		hasDateFilter && start && end
			? allProjects.filter(
					(p) => p._creationTime >= start && p._creationTime <= end
				)
			: allProjects;

	const dateCounts: Record<string, number> = {};
	for (const project of projects) {
		const dateKey = getDateKey(project._creationTime, granularity, timezone);
		dateCounts[dateKey] = (dateCounts[dateKey] || 0) + 1;
	}

	const data: AggregatedDataPoint[] = Object.entries(dateCounts)
		.map(([dateKey, count]) => ({
			label: formatDateLabel(dateKey, granularity),
			value: count,
			metadata: { dateKey },
		}))
		.sort((a, b) => {
			const aKey = a.metadata?.dateKey as string;
			const bKey = b.metadata?.dateKey as string;
			return aKey.localeCompare(bKey);
		});

	return {
		data,
		total: projects.length,
		metadata: {
			entityType: "projects",
			dateRange: hasDateFilter && start && end ? { start, end } : undefined,
			groupBy: `creationDate_${granularity}`,
		},
	};
}

/**
 * Internal implementation for tasks by status
 */
async function _queryTasksByStatus(
	ctx: QueryCtx,
	args: { dateRange?: { start?: number; end?: number } }
): Promise<ReportDataResult> {
	const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
	if (!userOrgId) {
		return { data: [], total: 0 };
	}

	const { start, end, hasDateFilter } = getDateBounds(args.dateRange);

	const allTasks = await ctx.db
		.query("tasks")
		.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
		.collect();

	const tasks =
		hasDateFilter && start && end
			? allTasks.filter((t) => t.date >= start && t.date <= end)
			: allTasks;

	const statusCounts: Record<string, number> = {
		pending: 0,
		"in-progress": 0,
		completed: 0,
		cancelled: 0,
	};

	for (const task of tasks) {
		statusCounts[task.status] = (statusCounts[task.status] || 0) + 1;
	}

	const data: AggregatedDataPoint[] = Object.entries(statusCounts).map(
		([status, count]) => ({
			label: status
				.split("-")
				.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
				.join(" "),
			value: count,
		})
	);

	return {
		data,
		total: tasks.length,
		metadata: {
			entityType: "tasks",
			dateRange: hasDateFilter && start && end ? { start, end } : undefined,
			groupBy: "status",
		},
	};
}

/**
 * Internal implementation for task completion rate
 */
async function _queryTaskCompletionRate(
	ctx: QueryCtx,
	args: { dateRange?: { start?: number; end?: number } }
): Promise<ReportDataResult> {
	const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
	if (!userOrgId) {
		return { data: [], total: 0 };
	}

	const { start, end, hasDateFilter } = getDateBounds(args.dateRange);

	const allTasks = await ctx.db
		.query("tasks")
		.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
		.collect();

	const tasks =
		hasDateFilter && start && end
			? allTasks.filter((t) => t.date >= start && t.date <= end)
			: allTasks;

	const totalTasks = tasks.length;
	const completedTasks = tasks.filter(
		(task) => task.status === "completed"
	).length;
	const pendingTasks = tasks.filter(
		(task) => task.status === "pending" || task.status === "in-progress"
	).length;

	const completionRate =
		totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

	const data: AggregatedDataPoint[] = [
		{ label: "Completed", value: completedTasks },
		{ label: "Pending", value: pendingTasks },
	];

	return {
		data,
		total: completionRate,
		metadata: {
			entityType: "tasks",
			dateRange: hasDateFilter && start && end ? { start, end } : undefined,
			groupBy: "completionRate",
		},
	};
}

/**
 * Internal implementation for tasks by date
 */
async function _queryTasksByDate(
	ctx: QueryCtx,
	args: {
		dateRange?: { start?: number; end?: number };
		granularity?: "day" | "week" | "month";
	}
): Promise<ReportDataResult> {
	const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
	if (!userOrgId) {
		return { data: [], total: 0 };
	}

	const { start, end, hasDateFilter } = getDateBounds(args.dateRange);
	const granularity = args.granularity || "month";
	const timezone = await getOrgTimezoneById(ctx, userOrgId);

	const allTasks = await ctx.db
		.query("tasks")
		.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
		.collect();

	const tasks =
		hasDateFilter && start && end
			? allTasks.filter((t) => t.date >= start && t.date <= end)
			: allTasks;

	const dateCounts: Record<string, number> = {};
	for (const task of tasks) {
		const dateKey = getDateKey(task.date, granularity, timezone);
		dateCounts[dateKey] = (dateCounts[dateKey] || 0) + 1;
	}

	const data: AggregatedDataPoint[] = Object.entries(dateCounts)
		.map(([dateKey, count]) => ({
			label: formatDateLabel(dateKey, granularity),
			value: count,
			metadata: { dateKey },
		}))
		.sort((a, b) => {
			const aKey = a.metadata?.dateKey as string;
			const bKey = b.metadata?.dateKey as string;
			return aKey.localeCompare(bKey);
		});

	return {
		data,
		total: tasks.length,
		metadata: {
			entityType: "tasks",
			dateRange: hasDateFilter && start && end ? { start, end } : undefined,
			groupBy: `date_${granularity}`,
		},
	};
}

/**
 * Internal implementation for quotes by status
 */
async function _queryQuotesByStatus(
	ctx: QueryCtx,
	args: { dateRange?: { start?: number; end?: number } }
): Promise<ReportDataResult> {
	const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
	if (!userOrgId) {
		return { data: [], total: 0 };
	}

	const { start, end, hasDateFilter } = getDateBounds(args.dateRange);

	const allQuotes = await ctx.db
		.query("quotes")
		.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
		.collect();

	const quotes =
		hasDateFilter && start && end
			? allQuotes.filter(
					(q) => q._creationTime >= start && q._creationTime <= end
				)
			: allQuotes;

	const statusData: Record<string, { count: number; total: number }> = {
		draft: { count: 0, total: 0 },
		sent: { count: 0, total: 0 },
		approved: { count: 0, total: 0 },
		declined: { count: 0, total: 0 },
		expired: { count: 0, total: 0 },
	};

	for (const quote of quotes) {
		if (statusData[quote.status]) {
			statusData[quote.status].count++;
			statusData[quote.status].total += quote.total;
		}
	}

	const data: AggregatedDataPoint[] = Object.entries(statusData)
		.filter(([, info]) => info.count > 0)
		.map(([status, info]) => ({
			label: status.charAt(0).toUpperCase() + status.slice(1),
			value: info.count,
			metadata: { totalValue: info.total },
		}));

	const totalValue = quotes.reduce((sum, quote) => sum + quote.total, 0);

	return {
		data,
		total: totalValue,
		metadata: {
			entityType: "quotes",
			dateRange: hasDateFilter && start && end ? { start, end } : undefined,
			groupBy: "status",
		},
	};
}

/**
 * Internal implementation for quote conversion rate
 */
async function _queryQuoteConversionRate(
	ctx: QueryCtx,
	args: { dateRange?: { start?: number; end?: number } }
): Promise<ReportDataResult> {
	const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
	if (!userOrgId) {
		return { data: [], total: 0 };
	}

	const { start, end, hasDateFilter } = getDateBounds(args.dateRange);

	const allQuotes = await ctx.db
		.query("quotes")
		.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
		.collect();

	const quotes =
		hasDateFilter && start && end
			? allQuotes.filter(
					(q) => q._creationTime >= start && q._creationTime <= end
				)
			: allQuotes;

	const sentOrResolved = quotes.filter((q) =>
		["sent", "approved", "declined", "expired"].includes(q.status)
	);
	const approved = quotes.filter((q) => q.status === "approved");

	const conversionRate =
		sentOrResolved.length > 0
			? Math.round((approved.length / sentOrResolved.length) * 100)
			: 0;

	const data: AggregatedDataPoint[] = [
		{ label: "Approved", value: approved.length },
		{
			label: "Not Approved",
			value: sentOrResolved.length - approved.length,
		},
	];

	return {
		data,
		total: conversionRate,
		metadata: {
			entityType: "quotes",
			dateRange: hasDateFilter && start && end ? { start, end } : undefined,
			groupBy: "conversionRate",
		},
	};
}

/**
 * Internal implementation for invoices by status
 */
async function _queryInvoicesByStatus(
	ctx: QueryCtx,
	args: { dateRange?: { start?: number; end?: number } }
): Promise<ReportDataResult> {
	const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
	if (!userOrgId) {
		return { data: [], total: 0 };
	}

	const { start, end, hasDateFilter } = getDateBounds(args.dateRange);

	const allInvoices = await ctx.db
		.query("invoices")
		.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
		.collect();

	const invoices =
		hasDateFilter && start && end
			? allInvoices.filter(
					(i) => i.issuedDate >= start && i.issuedDate <= end
				)
			: allInvoices;

	const statusData: Record<string, { count: number; total: number }> = {
		draft: { count: 0, total: 0 },
		sent: { count: 0, total: 0 },
		paid: { count: 0, total: 0 },
		overdue: { count: 0, total: 0 },
		cancelled: { count: 0, total: 0 },
	};

	for (const invoice of invoices) {
		if (statusData[invoice.status]) {
			statusData[invoice.status].count++;
			statusData[invoice.status].total += invoice.total;
		}
	}

	const data: AggregatedDataPoint[] = Object.entries(statusData)
		.filter(([, info]) => info.count > 0)
		.map(([status, info]) => ({
			label: status.charAt(0).toUpperCase() + status.slice(1),
			value: info.count,
			metadata: { totalValue: info.total },
		}));

	const totalValue = invoices.reduce((sum, inv) => sum + inv.total, 0);

	return {
		data,
		total: totalValue,
		metadata: {
			entityType: "invoices",
			dateRange: hasDateFilter && start && end ? { start, end } : undefined,
			groupBy: "status",
		},
	};
}

/**
 * Internal implementation for revenue by month
 */
async function _queryRevenueByMonth(
	ctx: QueryCtx,
	args: { dateRange?: { start?: number; end?: number } }
): Promise<ReportDataResult> {
	const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
	if (!userOrgId) {
		return { data: [], total: 0 };
	}

	const { start, end, hasDateFilter } = getDateBounds(args.dateRange);
	const timezone = await getOrgTimezoneById(ctx, userOrgId);

	const allInvoices = await ctx.db
		.query("invoices")
		.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
		.filter((q) =>
			q.and(
				q.eq(q.field("status"), "paid"),
				q.neq(q.field("paidAt"), undefined)
			)
		)
		.collect();

	const invoices =
		hasDateFilter && start && end
			? allInvoices.filter(
					(i) => i.paidAt && i.paidAt >= start && i.paidAt <= end
				)
			: allInvoices;

	const monthlyRevenue: Record<string, number> = {};
	for (const invoice of invoices) {
		if (invoice.paidAt) {
			const dateStr = DateUtils.toLocalDateString(invoice.paidAt, timezone);
			const monthKey = dateStr.substring(0, 7);
			monthlyRevenue[monthKey] =
				(monthlyRevenue[monthKey] || 0) + invoice.total;
		}
	}

	const data: AggregatedDataPoint[] = Object.entries(monthlyRevenue)
		.map(([month, value]) => ({
			label: month,
			value,
		}))
		.sort((a, b) => a.label.localeCompare(b.label));

	const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);

	return {
		data,
		total: totalRevenue,
		metadata: {
			entityType: "invoices",
			dateRange: hasDateFilter && start && end ? { start, end } : undefined,
			groupBy: "month",
		},
	};
}

/**
 * Internal implementation for revenue by client (optimized, no N+1)
 */
async function _queryRevenueByClient(
	ctx: QueryCtx,
	args: {
		dateRange?: { start?: number; end?: number };
		limit?: number;
		cursor?: string;
	}
): Promise<PaginatedReportDataResult> {
	const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
	if (!userOrgId) {
		return { data: [], total: 0, hasMore: false };
	}

	const { start, end, hasDateFilter } = getDateBounds(args.dateRange);
	const limit = args.limit || 50;
	const offset = decodeCursor(args.cursor);

	const allInvoices = await ctx.db
		.query("invoices")
		.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
		.filter((q) =>
			q.and(
				q.eq(q.field("status"), "paid"),
				q.neq(q.field("paidAt"), undefined)
			)
		)
		.collect();

	const invoices =
		hasDateFilter && start && end
			? allInvoices.filter(
					(i) => i.paidAt && i.paidAt >= start && i.paidAt <= end
				)
			: allInvoices;

	const clientRevenue: Record<string, number> = {};
	for (const invoice of invoices) {
		const clientId = invoice.clientId.toString();
		clientRevenue[clientId] = (clientRevenue[clientId] || 0) + invoice.total;
	}

	const sortedClientIds = Object.entries(clientRevenue)
		.sort(([, a], [, b]) => b - a)
		.map(([id]) => id);

	const paginatedClientIds = sortedClientIds.slice(offset, offset + limit);
	const hasMore = offset + limit < sortedClientIds.length;

	// OPTIMIZED: Batch fetch all clients at once instead of N+1 queries
	const clientIdsToFetch = paginatedClientIds.map((id) => id as Id<"clients">);
	const clientDocs = await Promise.all(
		clientIdsToFetch.map((id) => ctx.db.get(id))
	);

	const clientNameMap = new Map<string, string>();
	clientDocs.forEach((client, index) => {
		const clientId = clientIdsToFetch[index];
		clientNameMap.set(clientId, client?.companyName || "Unknown Client");
	});

	const data: AggregatedDataPoint[] = paginatedClientIds.map((clientId) => ({
		label: clientNameMap.get(clientId) || "Unknown Client",
		value: clientRevenue[clientId],
		metadata: { clientId },
	}));

	const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);

	return {
		data,
		total: totalRevenue,
		hasMore,
		nextCursor: hasMore ? encodeCursor(offset + limit) : undefined,
		metadata: {
			entityType: "invoices",
			dateRange: hasDateFilter && start && end ? { start, end } : undefined,
			groupBy: "client",
		},
	};
}

/**
 * Internal implementation for activities by type
 */
async function _queryActivitiesByType(
	ctx: QueryCtx,
	args: { dateRange?: { start?: number; end?: number } }
): Promise<ReportDataResult> {
	const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
	if (!userOrgId) {
		return { data: [], total: 0 };
	}

	const { start, end, hasDateFilter } = getDateBounds(args.dateRange);

	const allActivities = await ctx.db
		.query("activities")
		.withIndex("by_org_timestamp", (q) => q.eq("orgId", userOrgId))
		.collect();

	const activities =
		hasDateFilter && start && end
			? allActivities.filter(
					(a) => a.timestamp >= start && a.timestamp <= end
				)
			: allActivities;

	const typeCounts: Record<string, number> = {};
	for (const activity of activities) {
		typeCounts[activity.activityType] =
			(typeCounts[activity.activityType] || 0) + 1;
	}

	const data: AggregatedDataPoint[] = Object.entries(typeCounts)
		.map(([type, count]) => ({
			label: type
				.split("_")
				.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
				.join(" "),
			value: count,
		}))
		.sort((a, b) => b.value - a.value);

	return {
		data,
		total: activities.length,
		metadata: {
			entityType: "activities",
			dateRange: hasDateFilter && start && end ? { start, end } : undefined,
			groupBy: "activityType",
		},
	};
}

/**
 * Internal implementation for activities by date
 */
async function _queryActivitiesByDate(
	ctx: QueryCtx,
	args: {
		dateRange?: { start?: number; end?: number };
		granularity?: "day" | "week" | "month";
	}
): Promise<ReportDataResult> {
	const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
	if (!userOrgId) {
		return { data: [], total: 0 };
	}

	const { start, end, hasDateFilter } = getDateBounds(args.dateRange);
	const granularity = args.granularity || "month";
	const timezone = await getOrgTimezoneById(ctx, userOrgId);

	const allActivities = await ctx.db
		.query("activities")
		.withIndex("by_org_timestamp", (q) => q.eq("orgId", userOrgId))
		.collect();

	const activities =
		hasDateFilter && start && end
			? allActivities.filter(
					(a) => a.timestamp >= start && a.timestamp <= end
				)
			: allActivities;

	const dateCounts: Record<string, number> = {};
	for (const activity of activities) {
		const dateKey = getDateKey(activity.timestamp, granularity, timezone);
		dateCounts[dateKey] = (dateCounts[dateKey] || 0) + 1;
	}

	const data: AggregatedDataPoint[] = Object.entries(dateCounts)
		.map(([dateKey, count]) => ({
			label: formatDateLabel(dateKey, granularity),
			value: count,
			metadata: { dateKey },
		}))
		.sort((a, b) => {
			const aKey = a.metadata?.dateKey as string;
			const bKey = b.metadata?.dateKey as string;
			return aKey.localeCompare(bKey);
		});

	return {
		data,
		total: activities.length,
		metadata: {
			entityType: "activities",
			dateRange: hasDateFilter && start && end ? { start, end } : undefined,
			groupBy: `timestamp_${granularity}`,
		},
	};
}

// ============================================================================
// Generic Report Execution
// ============================================================================

/**
 * Internal helper to run report queries by entity type and groupBy
 * Delegates to internal implementation functions to avoid code duplication
 */
async function runReportByConfig(
	ctx: QueryCtx,
	entityType: string,
	groupBy: string | undefined,
	dateRange: { start?: number; end?: number } | undefined
): Promise<ReportDataResult> {
	// Check for time-based groupings (creationDate_month, creationDate_week, etc.)
	const timeGroupingMatch = groupBy?.match(
		/^(creationDate|date|timestamp)_(day|week|month)$/
	);

	if (timeGroupingMatch) {
		const granularity = timeGroupingMatch[2] as "day" | "week" | "month";
		switch (entityType) {
			case "clients":
				return await _queryClientsByCreationDate(ctx, { dateRange, granularity });
			case "projects":
				return await _queryProjectsByCreationDate(ctx, { dateRange, granularity });
			case "tasks":
				return await _queryTasksByDate(ctx, { dateRange, granularity });
			case "activities":
				return await _queryActivitiesByDate(ctx, { dateRange, granularity });
			default:
				return { data: [], total: 0 };
		}
	}

	// Route to appropriate internal function based on entity type and groupBy
	switch (entityType) {
		case "clients":
			if (groupBy === "leadSource") {
				return await _queryClientsByLeadSource(ctx, { dateRange });
			}
			return await _queryClientsByStatus(ctx, { dateRange });

		case "projects":
			if (groupBy === "projectType") {
				return await _queryProjectsByType(ctx, { dateRange });
			}
			return await _queryProjectsByStatus(ctx, { dateRange });

		case "tasks":
			if (groupBy === "completionRate") {
				return await _queryTaskCompletionRate(ctx, { dateRange });
			}
			return await _queryTasksByStatus(ctx, { dateRange });

		case "quotes":
			if (groupBy === "conversionRate") {
				return await _queryQuoteConversionRate(ctx, { dateRange });
			}
			return await _queryQuotesByStatus(ctx, { dateRange });

		case "invoices":
			if (groupBy === "month") {
				return await _queryRevenueByMonth(ctx, { dateRange });
			}
			if (groupBy === "client") {
				// Return without pagination info for backwards compatibility
				const result = await _queryRevenueByClient(ctx, { dateRange, limit: 10 });
				return {
					data: result.data,
					total: result.total,
					metadata: result.metadata,
				};
			}
			return await _queryInvoicesByStatus(ctx, { dateRange });

		case "activities":
			return await _queryActivitiesByType(ctx, { dateRange });

		default:
			return { data: [], total: 0 };
	}
}

/**
 * Execute a report based on saved configuration
 * This query delegates to the appropriate specialized query based on entityType and groupBy
 */
export const executeReport = query({
	args: {
		entityType: v.union(
			v.literal("clients"),
			v.literal("projects"),
			v.literal("tasks"),
			v.literal("quotes"),
			v.literal("invoices"),
			v.literal("activities")
		),
		groupBy: v.optional(v.string()),
		dateRange: dateRangeValidator,
	},
	handler: async (ctx, args): Promise<ReportDataResult> => {
		return await runReportByConfig(
			ctx,
			args.entityType,
			args.groupBy,
			args.dateRange
		);
	},
});

// ============================================================================
// Paginated List Queries
// ============================================================================

/**
 * Get paginated list of clients with optional date filtering
 */
export const queryClientsListPaginated = query({
	args: {
		dateRange: dateRangeValidator,
		...paginationValidator,
	},
	handler: async (ctx, args): Promise<PaginatedReportDataResult> => {
		const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
		if (!userOrgId) {
			return { data: [], total: 0, hasMore: false };
		}

		const { start, end, hasDateFilter } = getDateBounds(args.dateRange);
		const limit = args.limit || 50;
		const offset = decodeCursor(args.cursor);

		const allClients = await ctx.db
			.query("clients")
			.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
			.collect();

		const clients =
			hasDateFilter && start && end
				? allClients.filter(
						(c) => c._creationTime >= start && c._creationTime <= end
					)
				: allClients;

		// Apply pagination
		const paginatedClients = clients.slice(offset, offset + limit);
		const hasMore = offset + limit < clients.length;

		const data: AggregatedDataPoint[] = paginatedClients.map((client) => ({
			label: client.companyName,
			value: 1, // Count of 1 per client for list views
			metadata: {
				clientId: client._id,
				status: client.status,
				leadSource: client.leadSource,
			},
		}));

		return {
			data,
			total: clients.length,
			hasMore,
			nextCursor: hasMore ? encodeCursor(offset + limit) : undefined,
			metadata: {
				entityType: "clients",
				dateRange: hasDateFilter && start && end ? { start, end } : undefined,
			},
		};
	},
});

/**
 * Get paginated list of projects with optional date filtering
 */
export const queryProjectsListPaginated = query({
	args: {
		dateRange: dateRangeValidator,
		...paginationValidator,
	},
	handler: async (ctx, args): Promise<PaginatedReportDataResult> => {
		const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
		if (!userOrgId) {
			return { data: [], total: 0, hasMore: false };
		}

		const { start, end, hasDateFilter } = getDateBounds(args.dateRange);
		const limit = args.limit || 50;
		const offset = decodeCursor(args.cursor);

		const allProjects = await ctx.db
			.query("projects")
			.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
			.collect();

		const projects =
			hasDateFilter && start && end
				? allProjects.filter(
						(p) => p._creationTime >= start && p._creationTime <= end
					)
				: allProjects;

		// Apply pagination
		const paginatedProjects = projects.slice(offset, offset + limit);
		const hasMore = offset + limit < projects.length;

		const data: AggregatedDataPoint[] = paginatedProjects.map((project) => ({
			label: project.title,
			value: 1,
			metadata: {
				projectId: project._id,
				status: project.status,
				projectType: project.projectType,
			},
		}));

		return {
			data,
			total: projects.length,
			hasMore,
			nextCursor: hasMore ? encodeCursor(offset + limit) : undefined,
			metadata: {
				entityType: "projects",
				dateRange: hasDateFilter && start && end ? { start, end } : undefined,
			},
		};
	},
});

/**
 * Get paginated list of invoices with optional date filtering
 */
export const queryInvoicesListPaginated = query({
	args: {
		dateRange: dateRangeValidator,
		...paginationValidator,
	},
	handler: async (ctx, args): Promise<PaginatedReportDataResult> => {
		const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
		if (!userOrgId) {
			return { data: [], total: 0, hasMore: false };
		}

		const { start, end, hasDateFilter } = getDateBounds(args.dateRange);
		const limit = args.limit || 50;
		const offset = decodeCursor(args.cursor);

		const allInvoices = await ctx.db
			.query("invoices")
			.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
			.collect();

		const invoices =
			hasDateFilter && start && end
				? allInvoices.filter(
						(i) => i.issuedDate >= start && i.issuedDate <= end
					)
				: allInvoices;

		// Apply pagination
		const paginatedInvoices = invoices.slice(offset, offset + limit);
		const hasMore = offset + limit < invoices.length;

		const data: AggregatedDataPoint[] = paginatedInvoices.map((invoice) => ({
			label: invoice.invoiceNumber || `Invoice ${invoice._id}`,
			value: invoice.total,
			metadata: {
				invoiceId: invoice._id,
				status: invoice.status,
				clientId: invoice.clientId,
			},
		}));

		const totalValue = invoices.reduce((sum, inv) => sum + inv.total, 0);

		return {
			data,
			total: totalValue,
			hasMore,
			nextCursor: hasMore ? encodeCursor(offset + limit) : undefined,
			metadata: {
				entityType: "invoices",
				dateRange: hasDateFilter && start && end ? { start, end } : undefined,
			},
		};
	},
});
