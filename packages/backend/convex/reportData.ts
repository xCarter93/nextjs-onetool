import { query, QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { getCurrentUserOrgId } from "./lib/auth";
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

// Date range validator
const dateRangeValidator = v.optional(
	v.object({
		start: v.optional(v.number()),
		end: v.optional(v.number()),
	})
);

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

// ============================================================================
// Client Reports
// ============================================================================

/**
 * Get client counts grouped by status
 */
export const queryClientsByStatus = query({
	args: {
		dateRange: dateRangeValidator,
	},
	handler: async (ctx, args): Promise<ReportDataResult> => {
		const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
		if (!userOrgId) {
			return { data: [], total: 0 };
		}

		const { start, end, hasDateFilter } = getDateBounds(args.dateRange);

		// Get all clients for this org, optionally filtered by date
		let clientsQuery = ctx.db
			.query("clients")
			.withIndex("by_org", (q) => q.eq("orgId", userOrgId));

		const allClients = await clientsQuery.collect();

		// Apply date filter if specified
		const clients =
			hasDateFilter && start && end
				? allClients.filter(
						(c) => c._creationTime >= start && c._creationTime <= end
					)
				: allClients;

		// Group by status
		const statusCounts: Record<string, number> = {
			lead: 0,
			active: 0,
			inactive: 0,
			archived: 0,
		};

		for (const client of clients) {
			statusCounts[client.status] = (statusCounts[client.status] || 0) + 1;
		}

		// Map status to user-friendly labels (matching the clients page)
		const statusLabels: Record<string, string> = {
			lead: "Prospective",
			active: "Active",
			inactive: "Inactive",
			archived: "Archived",
		};

		const data: AggregatedDataPoint[] = Object.entries(statusCounts)
			.filter(([, count]) => count > 0) // Only include statuses with data
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
	},
});

/**
 * Get client counts grouped by lead source
 */
export const queryClientsByLeadSource = query({
	args: {
		dateRange: dateRangeValidator,
	},
	handler: async (ctx, args): Promise<ReportDataResult> => {
		const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
		if (!userOrgId) {
			return { data: [], total: 0 };
		}

		const { start, end, hasDateFilter } = getDateBounds(args.dateRange);

		const allClients = await ctx.db
			.query("clients")
			.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
			.collect();

		// Apply date filter if specified
		const clients =
			hasDateFilter && start && end
				? allClients.filter(
						(c) => c._creationTime >= start && c._creationTime <= end
					)
				: allClients;

		// Group by lead source
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
	},
});

/**
 * Get client counts grouped by creation date (month, week, or day)
 */
export const queryClientsByCreationDate = query({
	args: {
		dateRange: dateRangeValidator,
		granularity: v.optional(
			v.union(v.literal("day"), v.literal("week"), v.literal("month"))
		),
	},
	handler: async (ctx, args): Promise<ReportDataResult> => {
		const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
		if (!userOrgId) {
			return { data: [], total: 0 };
		}

		const { start, end, hasDateFilter } = getDateBounds(args.dateRange);
		const granularity = args.granularity || "month";

		// Get organization timezone
		const org = await ctx.db.get(userOrgId);
		const timezone = org?.timezone;

		const allClients = await ctx.db
			.query("clients")
			.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
			.collect();

		// Apply date filter if specified
		const clients =
			hasDateFilter && start && end
				? allClients.filter(
						(c) => c._creationTime >= start && c._creationTime <= end
					)
				: allClients;

		// Group by date based on granularity
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
	},
});

// ============================================================================
// Project Reports
// ============================================================================

/**
 * Get project counts grouped by status
 */
export const queryProjectsByStatus = query({
	args: {
		dateRange: dateRangeValidator,
	},
	handler: async (ctx, args): Promise<ReportDataResult> => {
		const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
		if (!userOrgId) {
			return { data: [], total: 0 };
		}

		const { start, end, hasDateFilter } = getDateBounds(args.dateRange);

		const allProjects = await ctx.db
			.query("projects")
			.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
			.collect();

		// Apply date filter if specified
		const projects =
			hasDateFilter && start && end
				? allProjects.filter(
						(p) => p._creationTime >= start && p._creationTime <= end
					)
				: allProjects;

		// Group by status
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
	},
});

/**
 * Get project counts grouped by type
 */
export const queryProjectsByType = query({
	args: {
		dateRange: dateRangeValidator,
	},
	handler: async (ctx, args): Promise<ReportDataResult> => {
		const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
		if (!userOrgId) {
			return { data: [], total: 0 };
		}

		const { start, end, hasDateFilter } = getDateBounds(args.dateRange);

		const allProjects = await ctx.db
			.query("projects")
			.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
			.collect();

		// Apply date filter if specified
		const projects =
			hasDateFilter && start && end
				? allProjects.filter(
						(p) => p._creationTime >= start && p._creationTime <= end
					)
				: allProjects;

		// Group by type
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
	},
});

/**
 * Get project counts grouped by creation date (month, week, or day)
 */
export const queryProjectsByCreationDate = query({
	args: {
		dateRange: dateRangeValidator,
		granularity: v.optional(
			v.union(v.literal("day"), v.literal("week"), v.literal("month"))
		),
	},
	handler: async (ctx, args): Promise<ReportDataResult> => {
		const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
		if (!userOrgId) {
			return { data: [], total: 0 };
		}

		const { start, end, hasDateFilter } = getDateBounds(args.dateRange);
		const granularity = args.granularity || "month";

		const org = await ctx.db.get(userOrgId);
		const timezone = org?.timezone;

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
	},
});

// ============================================================================
// Task Reports
// ============================================================================

/**
 * Get task counts grouped by status
 */
export const queryTasksByStatus = query({
	args: {
		dateRange: dateRangeValidator,
	},
	handler: async (ctx, args): Promise<ReportDataResult> => {
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

		// Group by status
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
	},
});

/**
 * Get task completion rate over time
 */
export const queryTaskCompletionRate = query({
	args: {
		dateRange: dateRangeValidator,
	},
	handler: async (ctx, args): Promise<ReportDataResult> => {
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
	},
});

/**
 * Get task counts grouped by date (month, week, or day)
 */
export const queryTasksByDate = query({
	args: {
		dateRange: dateRangeValidator,
		granularity: v.optional(
			v.union(v.literal("day"), v.literal("week"), v.literal("month"))
		),
	},
	handler: async (ctx, args): Promise<ReportDataResult> => {
		const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
		if (!userOrgId) {
			return { data: [], total: 0 };
		}

		const { start, end, hasDateFilter } = getDateBounds(args.dateRange);
		const granularity = args.granularity || "month";

		const org = await ctx.db.get(userOrgId);
		const timezone = org?.timezone;

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
	},
});

// ============================================================================
// Quote Reports
// ============================================================================

/**
 * Get quote counts and totals grouped by status
 */
export const queryQuotesByStatus = query({
	args: {
		dateRange: dateRangeValidator,
	},
	handler: async (ctx, args): Promise<ReportDataResult> => {
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

		// Group by status with total values
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
	},
});

/**
 * Get quote conversion rate
 */
export const queryQuoteConversionRate = query({
	args: {
		dateRange: dateRangeValidator,
	},
	handler: async (ctx, args): Promise<ReportDataResult> => {
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
	},
});

// ============================================================================
// Invoice Reports
// ============================================================================

/**
 * Get invoice counts and totals grouped by status
 */
export const queryInvoicesByStatus = query({
	args: {
		dateRange: dateRangeValidator,
	},
	handler: async (ctx, args): Promise<ReportDataResult> => {
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

		// Group by status with total values
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
	},
});

/**
 * Get revenue over time (by month)
 */
export const queryRevenueByMonth = query({
	args: {
		dateRange: dateRangeValidator,
	},
	handler: async (ctx, args): Promise<ReportDataResult> => {
		const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
		if (!userOrgId) {
			return { data: [], total: 0 };
		}

		const { start, end, hasDateFilter } = getDateBounds(args.dateRange);

		// Get organization timezone
		const organization = await ctx.db.get(userOrgId);
		const timezone = organization?.timezone;

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

		// Group by month
		const monthlyRevenue: Record<string, number> = {};
		for (const invoice of invoices) {
			if (invoice.paidAt) {
				const dateStr = DateUtils.toLocalDateString(invoice.paidAt, timezone);
				const monthKey = dateStr.substring(0, 7); // YYYY-MM
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
	},
});

/**
 * Get revenue by client
 */
export const queryRevenueByClient = query({
	args: {
		dateRange: dateRangeValidator,
		limit: v.optional(v.number()),
	},
	handler: async (ctx, args): Promise<ReportDataResult> => {
		const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
		if (!userOrgId) {
			return { data: [], total: 0 };
		}

		const { start, end, hasDateFilter } = getDateBounds(args.dateRange);
		const limit = args.limit || 10;

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

		// Group by client
		const clientRevenue: Record<string, number> = {};
		for (const invoice of invoices) {
			const clientId = invoice.clientId.toString();
			clientRevenue[clientId] = (clientRevenue[clientId] || 0) + invoice.total;
		}

		// Get client names
		const clientIds = Object.keys(clientRevenue);
		const clients = await Promise.all(
			clientIds.map(async (id) => {
				const client = await ctx.db.get(id as Id<"clients">);
				return { id, name: client?.companyName || "Unknown Client" };
			})
		);

		const clientNameMap = new Map(clients.map((c) => [c.id, c.name]));

		const data: AggregatedDataPoint[] = Object.entries(clientRevenue)
			.map(([clientId, value]) => ({
				label: clientNameMap.get(clientId) || "Unknown Client",
				value,
				metadata: { clientId },
			}))
			.sort((a, b) => b.value - a.value)
			.slice(0, limit);

		const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);

		return {
			data,
			total: totalRevenue,
			metadata: {
				entityType: "invoices",
				dateRange: hasDateFilter && start && end ? { start, end } : undefined,
				groupBy: "client",
			},
		};
	},
});

// ============================================================================
// Activity Reports
// ============================================================================

/**
 * Get activity counts grouped by type
 */
export const queryActivitiesByType = query({
	args: {
		dateRange: dateRangeValidator,
	},
	handler: async (ctx, args): Promise<ReportDataResult> => {
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

		// Group by activity type
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
	},
});

/**
 * Get activity counts grouped by date (month, week, or day)
 */
export const queryActivitiesByDate = query({
	args: {
		dateRange: dateRangeValidator,
		granularity: v.optional(
			v.union(v.literal("day"), v.literal("week"), v.literal("month"))
		),
	},
	handler: async (ctx, args): Promise<ReportDataResult> => {
		const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
		if (!userOrgId) {
			return { data: [], total: 0 };
		}

		const { start, end, hasDateFilter } = getDateBounds(args.dateRange);
		const granularity = args.granularity || "month";

		const org = await ctx.db.get(userOrgId);
		const timezone = org?.timezone;

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
	},
});

// ============================================================================
// Generic Report Execution
// ============================================================================

// Internal helper functions for report execution
async function executeClientsByStatus(
	ctx: QueryCtx,
	dateRange?: { start?: number; end?: number }
): Promise<ReportDataResult> {
	const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
	if (!userOrgId) return { data: [], total: 0 };

	const { start, end, hasDateFilter } = getDateBounds(dateRange);
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

	// Map status to user-friendly labels (matching the clients page)
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

async function executeClientsByLeadSource(
	ctx: QueryCtx,
	dateRange?: { start?: number; end?: number }
): Promise<ReportDataResult> {
	const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
	if (!userOrgId) return { data: [], total: 0 };

	const { start, end, hasDateFilter } = getDateBounds(dateRange);
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

async function executeClientsByCreationDate(
	ctx: QueryCtx,
	dateRange?: { start?: number; end?: number },
	granularity: "day" | "week" | "month" = "month"
): Promise<ReportDataResult> {
	const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
	if (!userOrgId) return { data: [], total: 0 };

	const { start, end, hasDateFilter } = getDateBounds(dateRange);
	const org = await ctx.db.get(userOrgId);
	const timezone = org?.timezone;

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

async function executeProjectsByCreationDate(
	ctx: QueryCtx,
	dateRange?: { start?: number; end?: number },
	granularity: "day" | "week" | "month" = "month"
): Promise<ReportDataResult> {
	const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
	if (!userOrgId) return { data: [], total: 0 };

	const { start, end, hasDateFilter } = getDateBounds(dateRange);
	const org = await ctx.db.get(userOrgId);
	const timezone = org?.timezone;

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

async function executeTasksByDate(
	ctx: QueryCtx,
	dateRange?: { start?: number; end?: number },
	granularity: "day" | "week" | "month" = "month"
): Promise<ReportDataResult> {
	const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
	if (!userOrgId) return { data: [], total: 0 };

	const { start, end, hasDateFilter } = getDateBounds(dateRange);
	const org = await ctx.db.get(userOrgId);
	const timezone = org?.timezone;

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

async function executeProjectsByStatus(
	ctx: QueryCtx,
	dateRange?: { start?: number; end?: number }
): Promise<ReportDataResult> {
	const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
	if (!userOrgId) return { data: [], total: 0 };

	const { start, end, hasDateFilter } = getDateBounds(dateRange);
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

async function executeProjectsByType(
	ctx: QueryCtx,
	dateRange?: { start?: number; end?: number }
): Promise<ReportDataResult> {
	const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
	if (!userOrgId) return { data: [], total: 0 };

	const { start, end, hasDateFilter } = getDateBounds(dateRange);
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

	const typeCounts: Record<string, number> = { "one-off": 0, recurring: 0 };
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

async function executeTasksByStatus(
	ctx: QueryCtx,
	dateRange?: { start?: number; end?: number }
): Promise<ReportDataResult> {
	const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
	if (!userOrgId) return { data: [], total: 0 };

	const { start, end, hasDateFilter } = getDateBounds(dateRange);
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
		total: tasks.length,
		metadata: {
			entityType: "tasks",
			dateRange: hasDateFilter && start && end ? { start, end } : undefined,
			groupBy: "status",
		},
	};
}

async function executeTaskCompletionRate(
	ctx: QueryCtx,
	dateRange?: { start?: number; end?: number }
): Promise<ReportDataResult> {
	const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
	if (!userOrgId) return { data: [], total: 0 };

	const { start, end, hasDateFilter } = getDateBounds(dateRange);
	const allTasks = await ctx.db
		.query("tasks")
		.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
		.collect();

	const tasks =
		hasDateFilter && start && end
			? allTasks.filter((t) => t.date >= start && t.date <= end)
			: allTasks;

	const completed = tasks.filter((t) => t.status === "completed").length;
	const pending = tasks.filter(
		(t) => t.status === "pending" || t.status === "in-progress"
	).length;
	const rate =
		tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

	return {
		data: [
			{ label: "Completed", value: completed },
			{ label: "Pending", value: pending },
		],
		total: rate,
		metadata: {
			entityType: "tasks",
			dateRange: hasDateFilter && start && end ? { start, end } : undefined,
			groupBy: "completionRate",
		},
	};
}

async function executeQuotesByStatus(
	ctx: QueryCtx,
	dateRange?: { start?: number; end?: number }
): Promise<ReportDataResult> {
	const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
	if (!userOrgId) return { data: [], total: 0 };

	const { start, end, hasDateFilter } = getDateBounds(dateRange);
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

	return {
		data,
		total: quotes.reduce((sum, q) => sum + q.total, 0),
		metadata: {
			entityType: "quotes",
			dateRange: hasDateFilter && start && end ? { start, end } : undefined,
			groupBy: "status",
		},
	};
}

async function executeQuoteConversionRate(
	ctx: QueryCtx,
	dateRange?: { start?: number; end?: number }
): Promise<ReportDataResult> {
	const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
	if (!userOrgId) return { data: [], total: 0 };

	const { start, end, hasDateFilter } = getDateBounds(dateRange);
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
	const rate =
		sentOrResolved.length > 0
			? Math.round((approved.length / sentOrResolved.length) * 100)
			: 0;

	return {
		data: [
			{ label: "Approved", value: approved.length },
			{ label: "Not Approved", value: sentOrResolved.length - approved.length },
		],
		total: rate,
		metadata: {
			entityType: "quotes",
			dateRange: hasDateFilter && start && end ? { start, end } : undefined,
			groupBy: "conversionRate",
		},
	};
}

async function executeInvoicesByStatus(
	ctx: QueryCtx,
	dateRange?: { start?: number; end?: number }
): Promise<ReportDataResult> {
	const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
	if (!userOrgId) return { data: [], total: 0 };

	const { start, end, hasDateFilter } = getDateBounds(dateRange);
	const allInvoices = await ctx.db
		.query("invoices")
		.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
		.collect();

	const invoices =
		hasDateFilter && start && end
			? allInvoices.filter((i) => i.issuedDate >= start && i.issuedDate <= end)
			: allInvoices;

	const statusData: Record<string, { count: number; total: number }> = {
		draft: { count: 0, total: 0 },
		sent: { count: 0, total: 0 },
		paid: { count: 0, total: 0 },
		overdue: { count: 0, total: 0 },
		cancelled: { count: 0, total: 0 },
	};
	for (const inv of invoices) {
		if (statusData[inv.status]) {
			statusData[inv.status].count++;
			statusData[inv.status].total += inv.total;
		}
	}

	const data: AggregatedDataPoint[] = Object.entries(statusData)
		.filter(([, info]) => info.count > 0)
		.map(([status, info]) => ({
			label: status.charAt(0).toUpperCase() + status.slice(1),
			value: info.count,
			metadata: { totalValue: info.total },
		}));

	return {
		data,
		total: invoices.reduce((sum, i) => sum + i.total, 0),
		metadata: {
			entityType: "invoices",
			dateRange: hasDateFilter && start && end ? { start, end } : undefined,
			groupBy: "status",
		},
	};
}

async function executeRevenueByMonth(
	ctx: QueryCtx,
	dateRange?: { start?: number; end?: number }
): Promise<ReportDataResult> {
	const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
	if (!userOrgId) return { data: [], total: 0 };

	const { start, end, hasDateFilter } = getDateBounds(dateRange);
	const org = await ctx.db.get(userOrgId);
	const timezone = org?.timezone;

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
	for (const inv of invoices) {
		if (inv.paidAt) {
			const dateStr = DateUtils.toLocalDateString(inv.paidAt, timezone);
			const monthKey = dateStr.substring(0, 7);
			monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + inv.total;
		}
	}

	const data: AggregatedDataPoint[] = Object.entries(monthlyRevenue)
		.map(([month, value]) => ({ label: month, value }))
		.sort((a, b) => a.label.localeCompare(b.label));

	return {
		data,
		total: invoices.reduce((sum, i) => sum + i.total, 0),
		metadata: {
			entityType: "invoices",
			dateRange: hasDateFilter && start && end ? { start, end } : undefined,
			groupBy: "month",
		},
	};
}

async function executeRevenueByClient(
	ctx: QueryCtx,
	dateRange?: { start?: number; end?: number }
): Promise<ReportDataResult> {
	const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
	if (!userOrgId) return { data: [], total: 0 };

	const { start, end, hasDateFilter } = getDateBounds(dateRange);
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
	for (const inv of invoices) {
		const cid = inv.clientId.toString();
		clientRevenue[cid] = (clientRevenue[cid] || 0) + inv.total;
	}

	const clientIds = Object.keys(clientRevenue);
	const clients = await Promise.all(
		clientIds.map(async (id) => {
			const c = await ctx.db.get(id as Id<"clients">);
			return { id, name: c?.companyName || "Unknown Client" };
		})
	);
	const clientNameMap = new Map(clients.map((c) => [c.id, c.name]));

	const data: AggregatedDataPoint[] = Object.entries(clientRevenue)
		.map(([cid, value]) => ({
			label: clientNameMap.get(cid) || "Unknown",
			value,
			metadata: { clientId: cid },
		}))
		.sort((a, b) => b.value - a.value)
		.slice(0, 10);

	return {
		data,
		total: invoices.reduce((sum, i) => sum + i.total, 0),
		metadata: {
			entityType: "invoices",
			dateRange: hasDateFilter && start && end ? { start, end } : undefined,
			groupBy: "client",
		},
	};
}

async function executeActivitiesByType(
	ctx: QueryCtx,
	dateRange?: { start?: number; end?: number }
): Promise<ReportDataResult> {
	const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
	if (!userOrgId) return { data: [], total: 0 };

	const { start, end, hasDateFilter } = getDateBounds(dateRange);
	const allActivities = await ctx.db
		.query("activities")
		.withIndex("by_org_timestamp", (q) => q.eq("orgId", userOrgId))
		.collect();

	const activities =
		hasDateFilter && start && end
			? allActivities.filter((a) => a.timestamp >= start && a.timestamp <= end)
			: allActivities;

	const typeCounts: Record<string, number> = {};
	for (const a of activities) {
		typeCounts[a.activityType] = (typeCounts[a.activityType] || 0) + 1;
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

async function executeActivitiesByDate(
	ctx: QueryCtx,
	dateRange?: { start?: number; end?: number },
	granularity: "day" | "week" | "month" = "month"
): Promise<ReportDataResult> {
	const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
	if (!userOrgId) return { data: [], total: 0 };

	const { start, end, hasDateFilter } = getDateBounds(dateRange);
	const org = await ctx.db.get(userOrgId);
	const timezone = org?.timezone;

	const allActivities = await ctx.db
		.query("activities")
		.withIndex("by_org_timestamp", (q) => q.eq("orgId", userOrgId))
		.collect();

	const activities =
		hasDateFilter && start && end
			? allActivities.filter((a) => a.timestamp >= start && a.timestamp <= end)
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

/**
 * Execute a report based on saved configuration
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
		const { entityType, groupBy, dateRange } = args;

		// Check for time-based groupings (creationDate_month, creationDate_week, etc.)
		const timeGroupingMatch = groupBy?.match(
			/^(creationDate|date|timestamp)_(day|week|month)$/
		);
		if (timeGroupingMatch) {
			const granularity = timeGroupingMatch[2] as "day" | "week" | "month";
			switch (entityType) {
				case "clients":
					return await executeClientsByCreationDate(
						ctx,
						dateRange,
						granularity
					);
				case "projects":
					return await executeProjectsByCreationDate(
						ctx,
						dateRange,
						granularity
					);
				case "tasks":
					return await executeTasksByDate(ctx, dateRange, granularity);
				case "activities":
					return await executeActivitiesByDate(ctx, dateRange, granularity);
				default:
					return { data: [], total: 0 };
			}
		}

		// Route to appropriate internal function based on entity type and groupBy
		switch (entityType) {
			case "clients":
				if (groupBy === "leadSource") {
					return await executeClientsByLeadSource(ctx, dateRange);
				}
				return await executeClientsByStatus(ctx, dateRange);

			case "projects":
				if (groupBy === "projectType") {
					return await executeProjectsByType(ctx, dateRange);
				}
				return await executeProjectsByStatus(ctx, dateRange);

			case "tasks":
				if (groupBy === "completionRate") {
					return await executeTaskCompletionRate(ctx, dateRange);
				}
				return await executeTasksByStatus(ctx, dateRange);

			case "quotes":
				if (groupBy === "conversionRate") {
					return await executeQuoteConversionRate(ctx, dateRange);
				}
				return await executeQuotesByStatus(ctx, dateRange);

			case "invoices":
				if (groupBy === "month") {
					return await executeRevenueByMonth(ctx, dateRange);
				}
				if (groupBy === "client") {
					return await executeRevenueByClient(ctx, dateRange);
				}
				return await executeInvoicesByStatus(ctx, dateRange);

			case "activities":
				return await executeActivitiesByType(ctx, dateRange);

			default:
				return { data: [], total: 0 };
		}
	},
});
