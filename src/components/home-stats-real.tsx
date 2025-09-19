import React from "react";
import {
	ArrowDownIcon,
	ArrowUpIcon,
	ArrowRightIcon,
	UsersIcon,
	CheckCircleIcon,
	DocumentTextIcon,
	DocumentIcon,
	ChartBarIcon,
	ClockIcon,
} from "@heroicons/react/24/outline";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { GradientRoundedAreaChart } from "@/components/ui/gradient-rounded-chart";

interface StatItem {
	name: string;
	stat: string;
	previousStat?: string;
	change?: string;
	changeType?: "increase" | "decrease" | "neutral";
	value?: string;
	subtitle?: string;
	icon: React.ComponentType<{ className?: string }>;
	isLoading?: boolean;
}

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(" ");
}

// Generic data processing function for all chart types
function processDataForChart(
	data: Array<{
		date: string;
		count: number;
		_creationTime: number;
	}>,
	dataKey: string
) {
	// Generate complete date range from start of month to today
	const now = new Date();
	const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

	// Create array of all dates from start of month to today
	const allDates: string[] = [];
	const currentDate = new Date(startOfMonth);

	while (currentDate <= today) {
		// Format date manually to avoid timezone issues
		const year = currentDate.getFullYear();
		const month = String(currentDate.getMonth() + 1).padStart(2, "0");
		const day = String(currentDate.getDate()).padStart(2, "0");
		allDates.push(`${year}-${month}-${day}`);
		currentDate.setDate(currentDate.getDate() + 1);
	}

	// Group existing data by date
	const groupedData = (data || []).reduce(
		(acc, item) => {
			const date = item.date;
			if (!acc[date]) {
				acc[date] = 0;
			}
			acc[date] += item.count;
			return acc;
		},
		{} as Record<string, number>
	);

	// Create chart data with complete date range, filling zeros for missing dates
	const chartData = allDates.map((date) => ({
		date,
		[dataKey]: groupedData[date] || 0,
	}));

	return chartData;
}

// Get chart configuration for different data types
function getChartConfig(cardName: string) {
	const configs = {
		"Total Clients": {
			data: "clients",
			config: {
				clients: {
					label: "Clients",
					color: "var(--chart-1)",
				},
			},
			chartId: "clients-monthly",
		},
		"Projects Completed": {
			data: "projects",
			config: {
				projects: {
					label: "Projects",
					color: "var(--chart-2)",
				},
			},
			chartId: "projects-monthly",
		},
		"Approved Quotes": {
			data: "quotes",
			config: {
				quotes: {
					label: "Quotes",
					color: "var(--chart-3)",
				},
			},
			chartId: "quotes-monthly",
		},
		"Invoices Sent": {
			data: "invoices",
			config: {
				invoices: {
					label: "Invoices",
					color: "var(--chart-4)",
				},
			},
			chartId: "invoices-monthly",
		},
		"Revenue Goal": {
			data: "revenue",
			config: {
				revenue: {
					label: "Revenue",
					color: "var(--chart-5)",
				},
			},
			chartId: "revenue-monthly",
		},
		"Pending Tasks": {
			data: "tasks",
			config: {
				tasks: {
					label: "Tasks",
					color: "var(--chart-1)",
				},
			},
			chartId: "tasks-monthly",
		},
	};

	return configs[cardName as keyof typeof configs];
}

// Get chart data for different card types
function getChartData(
	cardName: string,
	chartDataSets: {
		clientsChartData: Array<{ date: string; [key: string]: string | number }>;
		projectsChartData: Array<{ date: string; [key: string]: string | number }>;
		quotesChartData: Array<{ date: string; [key: string]: string | number }>;
		invoicesChartData: Array<{ date: string; [key: string]: string | number }>;
		revenueChartData: Array<{ date: string; [key: string]: string | number }>;
		tasksChartData: Array<{ date: string; [key: string]: string | number }>;
	}
) {
	const dataMap = {
		"Total Clients": chartDataSets.clientsChartData,
		"Projects Completed": chartDataSets.projectsChartData,
		"Approved Quotes": chartDataSets.quotesChartData,
		"Invoices Sent": chartDataSets.invoicesChartData,
		"Revenue Goal": chartDataSets.revenueChartData,
		"Pending Tasks": chartDataSets.tasksChartData,
	};

	return dataMap[cardName as keyof typeof dataMap] || [];
}

export default function HomeStatsReal() {
	const homeStats = useQuery(api.homeStats.getHomeStats);
	const clientsThisMonth = useQuery(api.homeStats.getClientsCreatedThisMonth);
	const projectsThisMonth = useQuery(
		api.homeStats.getProjectsCompletedThisMonth
	);
	const quotesThisMonth = useQuery(api.homeStats.getQuotesApprovedThisMonth);
	const invoicesThisMonth = useQuery(api.homeStats.getInvoicesSentThisMonth);
	const revenueThisMonth = useQuery(api.homeStats.getRevenueThisMonth);
	const tasksThisMonth = useQuery(api.homeStats.getTasksCreatedThisMonth);

	const isLoading = homeStats === undefined;

	// Process chart data for each type
	const clientsChartData = processDataForChart(
		clientsThisMonth || [],
		"clients"
	);
	const projectsChartData = processDataForChart(
		projectsThisMonth || [],
		"projects"
	);
	const quotesChartData = processDataForChart(quotesThisMonth || [], "quotes");
	const invoicesChartData = processDataForChart(
		invoicesThisMonth || [],
		"invoices"
	);
	const revenueChartData = processDataForChart(
		revenueThisMonth || [],
		"revenue"
	);
	const tasksChartData = processDataForChart(tasksThisMonth || [], "tasks");

	// Transform the data into the format expected by the UI
	const stats: StatItem[] = [
		{
			name: "Total Clients",
			stat: isLoading ? "..." : homeStats.totalClients.current.toString(),
			previousStat: isLoading
				? "..."
				: homeStats.totalClients.previous.toString(),
			change: isLoading
				? "..."
				: `${homeStats.totalClients.changeType === "increase" ? "+" : homeStats.totalClients.changeType === "decrease" ? "-" : ""}${homeStats.totalClients.change}`,
			changeType: homeStats?.totalClients.changeType || "neutral",
			subtitle: "Active relationships",
			icon: UsersIcon,
			isLoading,
		},
		{
			name: "Projects Completed",
			stat: isLoading ? "..." : homeStats.completedProjects.current.toString(),
			previousStat: isLoading
				? "..."
				: homeStats.completedProjects.previous.toString(),
			change: isLoading
				? "..."
				: `${homeStats.completedProjects.changeType === "increase" ? "+" : homeStats.completedProjects.changeType === "decrease" ? "-" : ""}${homeStats.completedProjects.change}`,
			changeType: homeStats?.completedProjects.changeType || "neutral",
			value: isLoading
				? "..."
				: new Intl.NumberFormat("en-US", {
						style: "currency",
						currency: "USD",
					}).format(homeStats.completedProjects.totalValue),
			subtitle: "Total value this month",
			icon: CheckCircleIcon,
			isLoading,
		},
		{
			name: "Approved Quotes",
			stat: isLoading ? "..." : homeStats.approvedQuotes.current.toString(),
			previousStat: isLoading
				? "..."
				: homeStats.approvedQuotes.previous.toString(),
			change: isLoading
				? "..."
				: `${homeStats.approvedQuotes.changeType === "increase" ? "+" : homeStats.approvedQuotes.changeType === "decrease" ? "-" : ""}${homeStats.approvedQuotes.change}`,
			changeType: homeStats?.approvedQuotes.changeType || "neutral",
			value: isLoading
				? "..."
				: new Intl.NumberFormat("en-US", {
						style: "currency",
						currency: "USD",
					}).format(homeStats.approvedQuotes.totalValue),
			subtitle: "Ready for invoicing",
			icon: DocumentTextIcon,
			isLoading,
		},
		{
			name: "Invoices Sent",
			stat: isLoading ? "..." : homeStats.invoicesSent.current.toString(),
			previousStat: isLoading
				? "..."
				: homeStats.invoicesSent.previous.toString(),
			change: isLoading
				? "..."
				: `${homeStats.invoicesSent.changeType === "increase" ? "+" : homeStats.invoicesSent.changeType === "decrease" ? "-" : ""}${homeStats.invoicesSent.change}`,
			changeType: homeStats?.invoicesSent.changeType || "neutral",
			value: isLoading
				? "..."
				: new Intl.NumberFormat("en-US", {
						style: "currency",
						currency: "USD",
					}).format(homeStats.invoicesSent.totalValue),
			subtitle: isLoading
				? "Outstanding: ..."
				: `Outstanding: ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(homeStats.invoicesSent.outstanding)}`,
			icon: DocumentIcon,
			isLoading,
		},
		{
			name: "Revenue Goal",
			stat: isLoading ? "..." : `${homeStats.revenueGoal.percentage}%`,
			previousStat: isLoading
				? "..."
				: `${homeStats.revenueGoal.previousPercentage}%`,
			change: isLoading
				? "..."
				: `${homeStats.revenueGoal.changePercentage > 0 ? "+" : ""}${homeStats.revenueGoal.changePercentage}%`,
			changeType: isLoading
				? "neutral"
				: homeStats.revenueGoal.changePercentage > 0
					? "increase"
					: homeStats.revenueGoal.changePercentage < 0
						? "decrease"
						: "neutral",
			subtitle: "Monthly target progress",
			icon: ChartBarIcon,
			isLoading,
		},
		{
			name: "Pending Tasks",
			stat: isLoading ? "..." : homeStats.pendingTasks.total.toString(),
			changeType: "neutral",
			subtitle: isLoading
				? "Due this week: ..."
				: `Due this week: ${homeStats.pendingTasks.dueThisWeek}`,
			icon: ClockIcon,
			isLoading,
		},
	];

	return (
		<div className="mb-8">
			<h3 className="text-lg font-semibold text-foreground mb-4">
				Business Overview (Month to Date)
			</h3>
			<dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
				{stats.map((item) => {
					const Icon = item.icon;
					const chartConfig = getChartConfig(item.name);
					const chartData = getChartData(item.name, {
						clientsChartData,
						projectsChartData,
						quotesChartData,
						invoicesChartData,
						revenueChartData,
						tasksChartData,
					});

					return (
						<Card
							key={item.name}
							className={`group relative backdrop-blur-md transition-all duration-200 hover:shadow-lg dark:hover:shadow-black/70 border-t-4 border-t-primary overflow-hidden ring-1 ring-border/20 dark:ring-border/40 py-0 ${
								item.isLoading ? "animate-pulse" : ""
							}`}
							role="article"
							tabIndex={0}
						>
							{/* Glass morphism overlay */}
							<div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent dark:from-white/5 dark:via-white/2 dark:to-transparent rounded-2xl" />
							<CardContent className="relative z-10 p-4">
								<div className="flex items-center justify-between mb-3">
									<div className="flex items-center space-x-3">
										<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted/50 dark:bg-muted/70 text-muted-foreground dark:text-muted-foreground/90 ring-1 ring-border/10 dark:ring-border/30">
											<Icon className="w-4 h-4" />
										</div>
										<dt className="text-xs font-medium text-muted-foreground dark:text-muted-foreground/90 uppercase tracking-wide">
											{item.name}
										</dt>
									</div>

									{item.change && item.changeType && !item.isLoading && (
										<div
											className={classNames(
												item.changeType === "increase"
													? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
													: item.changeType === "decrease"
														? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
														: "bg-muted text-muted-foreground",
												"inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
											)}
										>
											{item.changeType === "increase" ? (
												<ArrowUpIcon
													aria-hidden="true"
													className="mr-1 -ml-0.5 size-3 shrink-0"
												/>
											) : item.changeType === "decrease" ? (
												<ArrowDownIcon
													aria-hidden="true"
													className="mr-1 -ml-0.5 size-3 shrink-0"
												/>
											) : (
												<ArrowRightIcon
													aria-hidden="true"
													className="mr-1 -ml-0.5 size-3 shrink-0"
												/>
											)}
											{item.change}
										</div>
									)}
								</div>

								<dd className="mt-2">
									<div className="space-y-1">
										<div className="flex items-center justify-between">
											<span
												className={`text-2xl font-bold text-foreground dark:text-foreground/95 ${
													item.isLoading
														? "bg-muted/30 rounded text-transparent"
														: ""
												}`}
											>
												{item.stat}
											</span>
											{item.value && (
												<span
													className={`text-sm font-semibold text-primary dark:text-primary/90 ${
														item.isLoading
															? "bg-muted/30 rounded text-transparent"
															: ""
													}`}
												>
													{item.value}
												</span>
											)}
										</div>
										{item.subtitle && (
											<span
												className={`text-xs text-muted-foreground dark:text-muted-foreground/85 ${
													item.isLoading
														? "bg-muted/30 rounded text-transparent"
														: ""
												}`}
											>
												{item.subtitle}
											</span>
										)}
									</div>
								</dd>

								{/* Add chart for all cards with data */}
								{chartConfig && !isLoading && (
									<div className="mt-4 pt-4 border-t border-border/20">
										<GradientRoundedAreaChart
											data={chartData}
											config={chartConfig.config}
											title=""
											description=""
											xAxisKey="date"
											dataKeys={[chartConfig.data]}
											height={80}
											showCard={false}
											chartId={chartConfig.chartId}
											className="w-full"
										/>
									</div>
								)}
							</CardContent>
						</Card>
					);
				})}
			</dl>
		</div>
	);
}
