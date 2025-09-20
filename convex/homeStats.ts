import { query } from "./_generated/server";
import { getCurrentUserOrgIdOptional } from "./lib/auth";
import { DateUtils } from "./lib/shared";

/**
 * Home dashboard statistics queries
 * Provides real-time metrics for the business overview section
 */

// Interface for home statistics
export interface HomeStats {
	totalClients: {
		current: number;
		previous: number;
		change: number;
		changeType: "increase" | "decrease" | "neutral";
	};
	completedProjects: {
		current: number;
		previous: number;
		change: number;
		changeType: "increase" | "decrease" | "neutral";
		totalValue: number;
	};
	approvedQuotes: {
		current: number;
		previous: number;
		change: number;
		changeType: "increase" | "decrease" | "neutral";
		totalValue: number;
	};
	invoicesSent: {
		current: number;
		previous: number;
		change: number;
		changeType: "increase" | "decrease" | "neutral";
		totalValue: number;
		outstanding: number;
	};
	revenueGoal: {
		percentage: number;
		current: number;
		target: number;
		previousPercentage: number;
		changePercentage: number;
	};
	pendingTasks: {
		total: number;
		dueThisWeek: number;
	};
}

/**
 * Get comprehensive home dashboard statistics
 */
export const getHomeStats = query({
	args: {},
	handler: async (ctx): Promise<HomeStats> => {
		const userOrgId = await getCurrentUserOrgIdOptional(ctx);

		// Return empty stats for users without organizations
		if (!userOrgId) {
			return {
				totalClients: {
					current: 0,
					previous: 0,
					change: 0,
					changeType: "neutral" as const,
				},
				completedProjects: {
					current: 0,
					previous: 0,
					change: 0,
					changeType: "neutral" as const,
					totalValue: 0,
				},
				approvedQuotes: {
					current: 0,
					previous: 0,
					change: 0,
					changeType: "neutral" as const,
					totalValue: 0,
				},
				invoicesSent: {
					current: 0,
					previous: 0,
					change: 0,
					changeType: "neutral" as const,
					totalValue: 0,
					outstanding: 0,
				},
				revenueGoal: {
					percentage: 0,
					current: 0,
					target: 0,
					previousPercentage: 0,
					changePercentage: 0,
				},
				pendingTasks: {
					total: 0,
					dueThisWeek: 0,
				},
			};
		}
		const now = Date.now();
		const startOfThisMonth = new Date(new Date(now).setDate(1));
		startOfThisMonth.setHours(0, 0, 0, 0);
		const startOfLastMonth = new Date(startOfThisMonth);
		startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);
		const endOfLastMonth = new Date(startOfThisMonth.getTime() - 1);

		const thisMonthStart = startOfThisMonth.getTime();
		const lastMonthStart = startOfLastMonth.getTime();
		const lastMonthEnd = endOfLastMonth.getTime();

		// Get organization to fetch revenue target
		const organization = await ctx.db.get(userOrgId);

		// Parallel queries for better performance
		const [allClients, allProjects, allQuotes, allInvoices, allTasks] =
			await Promise.all([
				// Get all clients
				ctx.db
					.query("clients")
					.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
					.collect(),

				// Get all projects
				ctx.db
					.query("projects")
					.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
					.collect(),

				// Get all quotes
				ctx.db
					.query("quotes")
					.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
					.collect(),

				// Get all invoices
				ctx.db
					.query("invoices")
					.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
					.collect(),

				// Get all tasks
				ctx.db
					.query("tasks")
					.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
					.collect(),
			]);

		// Calculate client statistics
		const clientsThisMonth = allClients.filter(
			(client) => client._creationTime >= thisMonthStart
		).length;
		const clientsLastMonth = allClients.filter(
			(client) =>
				client._creationTime >= lastMonthStart &&
				client._creationTime <= lastMonthEnd
		).length;
		const clientsChange = clientsThisMonth - clientsLastMonth;

		// Calculate completed projects statistics
		const completedProjectsThisMonth = allProjects.filter(
			(project) =>
				project.status === "completed" &&
				project._creationTime >= thisMonthStart
		);
		const completedProjectsLastMonth = allProjects.filter(
			(project) =>
				project.status === "completed" &&
				project._creationTime >= lastMonthStart &&
				project._creationTime <= lastMonthEnd
		);
		const projectsChange =
			completedProjectsThisMonth.length - completedProjectsLastMonth.length;

		// For project value, we'll use a base calculation since we don't have actual project values in schema
		// This could be enhanced by linking to invoices or quotes
		const projectsValue = completedProjectsThisMonth.length * 5000; // Placeholder calculation

		// Calculate approved quotes statistics
		const approvedQuotesThisMonth = allQuotes.filter(
			(quote) =>
				quote.status === "approved" &&
				(quote.approvedAt ? quote.approvedAt >= thisMonthStart : false)
		);
		const approvedQuotesLastMonth = allQuotes.filter(
			(quote) =>
				quote.status === "approved" &&
				quote.approvedAt &&
				quote.approvedAt >= lastMonthStart &&
				quote.approvedAt <= lastMonthEnd
		);
		const quotesChange =
			approvedQuotesThisMonth.length - approvedQuotesLastMonth.length;
		const quotesTotalValue = approvedQuotesThisMonth.reduce(
			(sum, quote) => sum + quote.total,
			0
		);

		// Calculate invoice statistics
		const invoicesThisMonth = allInvoices.filter(
			(invoice) => invoice.issuedDate >= thisMonthStart
		);
		const invoicesLastMonth = allInvoices.filter(
			(invoice) =>
				invoice.issuedDate >= lastMonthStart &&
				invoice.issuedDate <= lastMonthEnd
		);
		const invoicesChange = invoicesThisMonth.length - invoicesLastMonth.length;
		const invoicesTotalValue = invoicesThisMonth.reduce(
			(sum, invoice) => sum + invoice.total,
			0
		);
		const outstandingInvoices = allInvoices
			.filter(
				(invoice) => invoice.status === "sent" || invoice.status === "overdue"
			)
			.reduce((sum, invoice) => sum + invoice.total, 0);

		// Calculate revenue goal progress
		const monthlyTarget = organization?.monthlyRevenueTarget || 50000; // Default target
		const currentRevenue = invoicesThisMonth
			.filter((invoice) => invoice.status === "paid")
			.reduce((sum, invoice) => sum + invoice.total, 0);
		const currentPercentage = Math.round(
			(currentRevenue / monthlyTarget) * 100
		);

		const lastMonthRevenue = invoicesLastMonth
			.filter((invoice) => invoice.status === "paid")
			.reduce((sum, invoice) => sum + invoice.total, 0);
		const lastMonthPercentage = Math.round(
			(lastMonthRevenue / monthlyTarget) * 100
		);
		const revenuePercentageChange = currentPercentage - lastMonthPercentage;

		// Calculate pending tasks
		const today = DateUtils.startOfDay(now);
		const nextWeek = DateUtils.addDays(today, 7);
		const pendingTasks = allTasks.filter(
			(task) => task.status === "pending" || task.status === "in-progress"
		);
		const tasksThisWeek = pendingTasks.filter(
			(task) => task.date >= today && task.date < nextWeek
		).length;

		// Helper function to determine change type
		const getChangeType = (
			change: number
		): "increase" | "decrease" | "neutral" => {
			if (change > 0) return "increase";
			if (change < 0) return "decrease";
			return "neutral";
		};

		return {
			totalClients: {
				current: allClients.length,
				previous: allClients.length - clientsThisMonth + clientsLastMonth,
				change: Math.abs(clientsChange),
				changeType: getChangeType(clientsChange),
			},
			completedProjects: {
				current: completedProjectsThisMonth.length,
				previous: completedProjectsLastMonth.length,
				change: Math.abs(projectsChange),
				changeType: getChangeType(projectsChange),
				totalValue: projectsValue,
			},
			approvedQuotes: {
				current: approvedQuotesThisMonth.length,
				previous: approvedQuotesLastMonth.length,
				change: Math.abs(quotesChange),
				changeType: getChangeType(quotesChange),
				totalValue: quotesTotalValue,
			},
			invoicesSent: {
				current: invoicesThisMonth.length,
				previous: invoicesLastMonth.length,
				change: Math.abs(invoicesChange),
				changeType: getChangeType(invoicesChange),
				totalValue: invoicesTotalValue,
				outstanding: outstandingInvoices,
			},
			revenueGoal: {
				percentage: currentPercentage,
				current: currentRevenue,
				target: monthlyTarget,
				previousPercentage: lastMonthPercentage,
				changePercentage: Math.abs(revenuePercentageChange),
			},
			pendingTasks: {
				total: pendingTasks.length,
				dueThisWeek: tasksThisWeek,
			},
		};
	},
});

/**
 * Get simple task count for pending tasks widget
 */
export const getPendingTasksCount = query({
	args: {},
	handler: async (ctx): Promise<{ count: number; dueThisWeek: number }> => {
		const userOrgId = await getCurrentUserOrgIdOptional(ctx);
		if (!userOrgId) {
			return { count: 0, dueThisWeek: 0 };
		}
		const today = DateUtils.startOfDay(Date.now());
		const nextWeek = DateUtils.addDays(today, 7);

		const pendingTasks = await ctx.db
			.query("tasks")
			.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
			.filter((q) =>
				q.or(
					q.eq(q.field("status"), "pending"),
					q.eq(q.field("status"), "in-progress")
				)
			)
			.collect();

		const dueThisWeek = pendingTasks.filter(
			(task) => task.date >= today && task.date < nextWeek
		).length;

		return {
			count: pendingTasks.length,
			dueThisWeek,
		};
	},
});

/**
 * Get clients count with month-over-month comparison
 */
export const getClientsStats = query({
	args: {},
	handler: async (
		ctx
	): Promise<{
		total: number;
		thisMonth: number;
		lastMonth: number;
		change: number;
		changeType: "increase" | "decrease" | "neutral";
	}> => {
		const userOrgId = await getCurrentUserOrgIdOptional(ctx);
		if (!userOrgId) {
			return {
				current: 0,
				previous: 0,
				change: 0,
				changeType: "neutral" as const,
			};
		}
		const now = Date.now();
		const startOfThisMonth = new Date(new Date(now).setDate(1)).getTime();
		const startOfLastMonth = new Date(
			new Date(startOfThisMonth).setMonth(
				new Date(startOfThisMonth).getMonth() - 1
			)
		).getTime();
		const endOfLastMonth = startOfThisMonth - 1;

		const allClients = await ctx.db
			.query("clients")
			.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
			.collect();

		const thisMonth = allClients.filter(
			(client) => client._creationTime >= startOfThisMonth
		).length;

		const lastMonth = allClients.filter(
			(client) =>
				client._creationTime >= startOfLastMonth &&
				client._creationTime <= endOfLastMonth
		).length;

		const change = thisMonth - lastMonth;
		const changeType =
			change > 0 ? "increase" : change < 0 ? "decrease" : "neutral";

		return {
			total: allClients.length,
			thisMonth,
			lastMonth,
			change: Math.abs(change),
			changeType,
		};
	},
});

/**
 * Get revenue goal progress
 */
export const getRevenueGoalProgress = query({
	args: {},
	handler: async (
		ctx
	): Promise<{
		percentage: number;
		current: number;
		target: number;
		isOnTrack: boolean;
	}> => {
		const userOrgId = await getCurrentUserOrgIdOptional(ctx);
		if (!userOrgId) {
			return { current: 0, target: 0, isOnTrack: false };
		}

		// Get organization to fetch revenue target
		const organization = await ctx.db.get(userOrgId);

		const monthlyTarget = organization?.monthlyRevenueTarget || 50000;

		// Get this month's paid invoices
		const startOfThisMonth = new Date(new Date().setDate(1)).getTime();
		const paidInvoices = await ctx.db
			.query("invoices")
			.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
			.filter((q) =>
				q.and(
					q.eq(q.field("status"), "paid"),
					q.gte(q.field("issuedDate"), startOfThisMonth)
				)
			)
			.collect();

		const currentRevenue = paidInvoices.reduce(
			(sum, invoice) => sum + invoice.total,
			0
		);
		const percentage = Math.round((currentRevenue / monthlyTarget) * 100);

		// Consider "on track" if we're at least at the expected percentage for this point in the month
		const daysInMonth = new Date(
			new Date().getFullYear(),
			new Date().getMonth() + 1,
			0
		).getDate();
		const dayOfMonth = new Date().getDate();
		const expectedPercentage = Math.round((dayOfMonth / daysInMonth) * 100);

		return {
			percentage,
			current: currentRevenue,
			target: monthlyTarget,
			isOnTrack: percentage >= expectedPercentage,
		};
	},
});

/**
 * Get clients created this month for daily chart visualization
 */
export const getClientsCreatedThisMonth = query({
	args: {},
	handler: async (
		ctx
	): Promise<
		Array<{
			date: string; // YYYY-MM-DD format
			count: number;
			_creationTime: number;
		}>
	> => {
		const userOrgId = await getCurrentUserOrgIdOptional(ctx);
		if (!userOrgId) {
			return [];
		}

		// Calculate start of current month
		const now = new Date();
		const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
		startOfThisMonth.setHours(0, 0, 0, 0);
		const startOfThisMonthTimestamp = startOfThisMonth.getTime();

		// Get all clients created this month
		const clientsThisMonth = await ctx.db
			.query("clients")
			.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
			.filter((q) => q.gte(q.field("_creationTime"), startOfThisMonthTimestamp))
			.collect();

		// Return the raw data with creation timestamps
		// Frontend will handle grouping by day
		return clientsThisMonth.map((client) => ({
			date: new Date(client._creationTime).toISOString().split("T")[0], // YYYY-MM-DD
			count: 1, // Each client counts as 1
			_creationTime: client._creationTime,
		}));
	},
});

/**
 * Get projects completed this month for daily chart visualization
 */
export const getProjectsCompletedThisMonth = query({
	args: {},
	handler: async (
		ctx
	): Promise<
		Array<{
			date: string; // YYYY-MM-DD format
			count: number;
			_creationTime: number;
		}>
	> => {
		const userOrgId = await getCurrentUserOrgIdOptional(ctx);
		if (!userOrgId) {
			return [];
		}

		// Calculate start of current month
		const now = new Date();
		const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
		startOfThisMonth.setHours(0, 0, 0, 0);
		const startOfThisMonthTimestamp = startOfThisMonth.getTime();

		// Get all projects completed this month
		const projectsThisMonth = await ctx.db
			.query("projects")
			.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
			.filter((q) =>
				q.and(
					q.eq(q.field("status"), "completed"),
					q.gte(q.field("_creationTime"), startOfThisMonthTimestamp)
				)
			)
			.collect();

		return projectsThisMonth.map((project) => ({
			date: new Date(project._creationTime).toISOString().split("T")[0],
			count: 1,
			_creationTime: project._creationTime,
		}));
	},
});

/**
 * Get quotes approved this month for daily chart visualization
 */
export const getQuotesApprovedThisMonth = query({
	args: {},
	handler: async (
		ctx
	): Promise<
		Array<{
			date: string; // YYYY-MM-DD format
			count: number;
			_creationTime: number;
		}>
	> => {
		const userOrgId = await getCurrentUserOrgIdOptional(ctx);
		if (!userOrgId) {
			return [];
		}

		// Calculate start of current month
		const now = new Date();
		const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
		startOfThisMonth.setHours(0, 0, 0, 0);
		const startOfThisMonthTimestamp = startOfThisMonth.getTime();

		// Get all quotes approved this month
		const quotesThisMonth = await ctx.db
			.query("quotes")
			.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
			.filter((q) =>
				q.and(
					q.eq(q.field("status"), "approved"),
					q.gte(q.field("approvedAt"), startOfThisMonthTimestamp)
				)
			)
			.collect();

		return quotesThisMonth.map((quote) => ({
			date: new Date(quote.approvedAt!).toISOString().split("T")[0],
			count: 1,
			_creationTime: quote.approvedAt!,
		}));
	},
});

/**
 * Get invoices sent this month for daily chart visualization
 */
export const getInvoicesSentThisMonth = query({
	args: {},
	handler: async (
		ctx
	): Promise<
		Array<{
			date: string; // YYYY-MM-DD format
			count: number;
			_creationTime: number;
		}>
	> => {
		const userOrgId = await getCurrentUserOrgIdOptional(ctx);
		if (!userOrgId) {
			return [];
		}

		// Calculate start of current month
		const now = new Date();
		const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
		startOfThisMonth.setHours(0, 0, 0, 0);
		const startOfThisMonthTimestamp = startOfThisMonth.getTime();

		// Get all invoices sent this month
		const invoicesThisMonth = await ctx.db
			.query("invoices")
			.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
			.filter((q) => q.gte(q.field("issuedDate"), startOfThisMonthTimestamp))
			.collect();

		return invoicesThisMonth.map((invoice) => ({
			date: new Date(invoice.issuedDate).toISOString().split("T")[0],
			count: 1,
			_creationTime: invoice.issuedDate,
		}));
	},
});

/**
 * Get revenue received this month for daily chart visualization
 */
export const getRevenueThisMonth = query({
	args: {},
	handler: async (
		ctx
	): Promise<
		Array<{
			date: string; // YYYY-MM-DD format
			count: number;
			_creationTime: number;
		}>
	> => {
		const userOrgId = await getCurrentUserOrgIdOptional(ctx);
		if (!userOrgId) {
			return [];
		}

		// Calculate start of current month
		const now = new Date();
		const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
		startOfThisMonth.setHours(0, 0, 0, 0);
		const startOfThisMonthTimestamp = startOfThisMonth.getTime();

		// Get all paid invoices this month
		const paidInvoicesThisMonth = await ctx.db
			.query("invoices")
			.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
			.filter((q) =>
				q.and(
					q.eq(q.field("status"), "paid"),
					q.gte(q.field("paidAt"), startOfThisMonthTimestamp)
				)
			)
			.collect();

		return paidInvoicesThisMonth.map((invoice) => ({
			date: new Date(invoice.paidAt!).toISOString().split("T")[0],
			count: invoice.total, // Use the invoice total as the count for revenue
			_creationTime: invoice.paidAt!,
		}));
	},
});

/**
 * Get tasks created this month for daily chart visualization
 */
export const getTasksCreatedThisMonth = query({
	args: {},
	handler: async (
		ctx
	): Promise<
		Array<{
			date: string; // YYYY-MM-DD format
			count: number;
			_creationTime: number;
		}>
	> => {
		const userOrgId = await getCurrentUserOrgIdOptional(ctx);
		if (!userOrgId) {
			return [];
		}

		// Calculate start of current month
		const now = new Date();
		const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
		startOfThisMonth.setHours(0, 0, 0, 0);
		const startOfThisMonthTimestamp = startOfThisMonth.getTime();

		// Get all tasks created this month
		const tasksThisMonth = await ctx.db
			.query("tasks")
			.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
			.filter((q) => q.gte(q.field("_creationTime"), startOfThisMonthTimestamp))
			.collect();

		return tasksThisMonth.map((task) => ({
			date: new Date(task._creationTime).toISOString().split("T")[0],
			count: 1,
			_creationTime: task._creationTime,
		}));
	},
});
