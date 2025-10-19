"use client";
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
import ChartDetailModal from "@/components/ui/chart-detail-modal";
import type { ChartConfig } from "@/components/ui/chart";
import { RoundedPieChartCore } from "@/components/ui/rounded-pie-chart";

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
					color: "var(--chart-1)",
				},
			},
			chartId: "projects-monthly",
		},
		"Approved Quotes": {
			data: "quotes",
			config: {
				quotes: {
					label: "Quotes",
					color: "var(--chart-1)",
				},
			},
			chartId: "quotes-monthly",
		},
		"Invoices Sent": {
			data: "invoices",
			config: {
				invoices: {
					label: "Invoices",
					color: "var(--chart-1)",
				},
			},
			chartId: "invoices-monthly",
		},
		"Revenue Goal": {
			data: "revenue",
			config: {
				revenue: {
					label: "Revenue",
					color: "var(--chart-1)",
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
	const [openClientsModal, setOpenClientsModal] = React.useState(false);
	const [openProjectsModal, setOpenProjectsModal] = React.useState(false);
	const [openQuotesModal, setOpenQuotesModal] = React.useState(false);
	const [openInvoicesModal, setOpenInvoicesModal] = React.useState(false);
	const [openRevenueModal, setOpenRevenueModal] = React.useState(false);
	const [openTasksModal, setOpenTasksModal] = React.useState(false);

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

	// Modal chart configs and datasets
	const clientsAreaConfig: ChartConfig = React.useMemo(
		() => ({ clients: { label: "Clients", color: "var(--chart-1)" } }),
		[]
	);

	const projectsAreaConfig: ChartConfig = React.useMemo(
		() => ({ projects: { label: "Projects", color: "var(--chart-1)" } }),
		[]
	);

	const quotesAreaConfig: ChartConfig = React.useMemo(
		() => ({ quotes: { label: "Quotes", color: "var(--chart-1)" } }),
		[]
	);

	const invoicesAreaConfig: ChartConfig = React.useMemo(
		() => ({ invoices: { label: "Invoices", color: "var(--chart-1)" } }),
		[]
	);

	const revenueAreaConfig: ChartConfig = React.useMemo(
		() => ({ revenue: { label: "Revenue", color: "var(--chart-1)" } }),
		[]
	);

	const tasksAreaConfig: ChartConfig = React.useMemo(
		() => ({ tasks: { label: "Tasks", color: "var(--chart-1)" } }),
		[]
	);

	// Types from Convex for clients created this month (extended with status)
	interface ClientCreatedData {
		date: string;
		count: number;
		_creationTime: number;
		clientType?: string;
		status?: "lead" | "prospect" | "active" | "inactive" | "archived";
	}

	// New clients by status for the pie chart
	const statusBarData = React.useMemo(() => {
		const order = [
			"lead",
			"prospect",
			"active",
			"inactive",
			"archived",
		] as const;
		const map = new Map<string, number>(order.map((k) => [k, 0]));
		for (const d of (clientsThisMonth as ClientCreatedData[] | undefined) ||
			[]) {
			const status = d.status ?? "lead";
			map.set(status, (map.get(status) || 0) + d.count);
		}
		return Array.from(map.entries()).map(([status, clients]) => ({
			status,
			clients,
		}));
	}, [clientsThisMonth]);

	const statusConfig: ChartConfig = React.useMemo(
		() => ({
			clients: { label: "Clients", color: "var(--chart-1)" },
			lead: { label: "Lead", color: "var(--chart-1)" },
			prospect: { label: "Prospect", color: "var(--chart-2)" },
			active: { label: "Active", color: "var(--chart-3)" },
			inactive: { label: "Inactive", color: "var(--chart-4)" },
			archived: { label: "Archived", color: "var(--chart-5)" },
		}),
		[]
	);

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
					const isTotalClients = item.name === "Total Clients";
					const isProjects = item.name === "Projects Completed";
					const isQuotes = item.name === "Approved Quotes";
					const isInvoices = item.name === "Invoices Sent";
					const isRevenue = item.name === "Revenue Goal";
					const isTasks = item.name === "Pending Tasks";
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
							} ${
								isTotalClients ||
								isProjects ||
								isQuotes ||
								isInvoices ||
								isRevenue ||
								isTasks
									? "cursor-pointer hover:scale-[1.01]"
									: ""
							}`}
							role="article"
							tabIndex={0}
							onClick={() => {
								if (isTotalClients) setOpenClientsModal(true);
								if (isProjects) setOpenProjectsModal(true);
								if (isQuotes) setOpenQuotesModal(true);
								if (isInvoices) setOpenInvoicesModal(true);
								if (isRevenue) setOpenRevenueModal(true);
								if (isTasks) setOpenTasksModal(true);
							}}
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
											referenceLineValue={
												isRevenue ? homeStats?.revenueGoal.target : undefined
											}
											referenceLineLabel={isRevenue ? "Target" : undefined}
											referenceLineColor={
												isRevenue ? "hsl(142.1 76.2% 36.3%)" : undefined
											}
										/>
									</div>
								)}
							</CardContent>
						</Card>
					);
				})}
			</dl>
			{/* Clients Modal */}
			<ChartDetailModal
				isOpen={openClientsModal}
				onClose={() => setOpenClientsModal(false)}
				title="Total Clients — Monthly Trend"
				subtitle="Daily new clients this month"
				change={
					homeStats
						? `${homeStats.totalClients.changeType === "increase" ? "+" : homeStats.totalClients.changeType === "decrease" ? "-" : ""}${homeStats.totalClients.change}`
						: undefined
				}
				changeType={homeStats?.totalClients.changeType}
				statSummary={(() => {
					const monthCount = (clientsThisMonth || []).reduce(
						(s, d) => s + d.count,
						0
					);
					const daysPassed = new Date().getDate();
					const avgPerDay = daysPassed ? monthCount / daysPassed : 0;
					return [
						{ label: "New this month", value: monthCount },
						{
							label: "End of last month",
							value: homeStats?.totalClients.previous ?? "—",
						},
						{ label: "Avg/day", value: avgPerDay.toFixed(1) },
					];
				})()}
				metadata={(() => {
					let peak = { date: "—", value: 0 } as { date: string; value: number };
					clientsChartData.forEach((d) => {
						const v = (d as Record<string, number>).clients ?? 0;
						if (v > peak.value) peak = { date: d.date, value: v };
					});
					return [
						{
							label: "Peak day",
							value: peak.value > 0 ? `${peak.date} (${peak.value})` : "—",
						},
						{
							label: "Total clients",
							value: homeStats?.totalClients.current ?? "—",
						},
					];
				})()}
				chart={{
					data: clientsChartData,
					config: clientsAreaConfig,
					xAxisKey: "date",
					dataKeys: ["clients"],
					chartId: "clients-modal",
				}}
				secondaryTitle="New Clients by Status"
				secondary={
					<RoundedPieChartCore
						data={statusBarData.map((d) => ({
							name: d.status,
							value: d.clients,
						}))}
						config={statusConfig}
						nameKey="name"
						valueKey="value"
						showCard={false}
						id="clients-status-pie"
					/>
				}
				sideBySide
			/>

			{/* Projects Modal */}
			<ChartDetailModal
				isOpen={openProjectsModal}
				onClose={() => setOpenProjectsModal(false)}
				title="Projects Completed — Monthly Trend"
				subtitle="Daily completed projects this month"
				change={
					homeStats
						? `${homeStats.completedProjects.changeType === "increase" ? "+" : homeStats.completedProjects.changeType === "decrease" ? "-" : ""}${homeStats.completedProjects.change}`
						: undefined
				}
				changeType={homeStats?.completedProjects.changeType}
				statSummary={(() => {
					const monthCount = (projectsThisMonth || []).reduce(
						(s, d) => s + d.count,
						0
					);
					const daysPassed = new Date().getDate();
					const avgPerDay = daysPassed ? monthCount / daysPassed : 0;
					return [
						{ label: "Completed this month", value: monthCount },
						{
							label: "Last month",
							value: homeStats?.completedProjects.previous ?? "—",
						},
						{ label: "Avg/day", value: avgPerDay.toFixed(1) },
						{
							label: "Total value",
							value: new Intl.NumberFormat("en-US", {
								style: "currency",
								currency: "USD",
							}).format(homeStats?.completedProjects.totalValue ?? 0),
						},
					];
				})()}
				metadata={(() => {
					let peak = { date: "—", value: 0 } as { date: string; value: number };
					projectsChartData.forEach((d) => {
						const v = (d as Record<string, number>).projects ?? 0;
						if (v > peak.value) peak = { date: d.date, value: v };
					});
					return [
						{
							label: "Peak day",
							value: peak.value > 0 ? `${peak.date} (${peak.value})` : "—",
						},
						{
							label: "Completed this month",
							value: homeStats?.completedProjects.current ?? "—",
						},
					];
				})()}
				chart={{
					data: projectsChartData,
					config: projectsAreaConfig,
					xAxisKey: "date",
					dataKeys: ["projects"],
					chartId: "projects-modal",
				}}
			/>

			{/* Quotes Modal */}
			<ChartDetailModal
				isOpen={openQuotesModal}
				onClose={() => setOpenQuotesModal(false)}
				title="Approved Quotes — Monthly Trend"
				subtitle="Daily quotes approved this month"
				change={
					homeStats
						? `${homeStats.approvedQuotes.changeType === "increase" ? "+" : homeStats.approvedQuotes.changeType === "decrease" ? "-" : ""}${homeStats.approvedQuotes.change}`
						: undefined
				}
				changeType={homeStats?.approvedQuotes.changeType}
				statSummary={(() => {
					const monthCount = (quotesThisMonth || []).reduce(
						(s, d) => s + d.count,
						0
					);
					const daysPassed = new Date().getDate();
					const avgPerDay = daysPassed ? monthCount / daysPassed : 0;
					return [
						{ label: "Approved this month", value: monthCount },
						{
							label: "Last month",
							value: homeStats?.approvedQuotes.previous ?? "—",
						},
						{ label: "Avg/day", value: avgPerDay.toFixed(1) },
						{
							label: "Total value",
							value: new Intl.NumberFormat("en-US", {
								style: "currency",
								currency: "USD",
							}).format(homeStats?.approvedQuotes.totalValue ?? 0),
						},
					];
				})()}
				metadata={(() => {
					let peak = { date: "—", value: 0 } as { date: string; value: number };
					quotesChartData.forEach((d) => {
						const v = (d as Record<string, number>).quotes ?? 0;
						if (v > peak.value) peak = { date: d.date, value: v };
					});
					return [
						{
							label: "Peak day",
							value: peak.value > 0 ? `${peak.date} (${peak.value})` : "—",
						},
						{
							label: "Approved this month",
							value: homeStats?.approvedQuotes.current ?? "—",
						},
					];
				})()}
				chart={{
					data: quotesChartData,
					config: quotesAreaConfig,
					xAxisKey: "date",
					dataKeys: ["quotes"],
					chartId: "quotes-modal",
				}}
			/>

			{/* Invoices Modal */}
			<ChartDetailModal
				isOpen={openInvoicesModal}
				onClose={() => setOpenInvoicesModal(false)}
				title="Invoices Sent — Monthly Trend"
				subtitle="Daily invoices sent this month"
				change={
					homeStats
						? `${homeStats.invoicesSent.changeType === "increase" ? "+" : homeStats.invoicesSent.changeType === "decrease" ? "-" : ""}${homeStats.invoicesSent.change}`
						: undefined
				}
				changeType={homeStats?.invoicesSent.changeType}
				statSummary={(() => {
					const monthCount = (invoicesThisMonth || []).reduce(
						(s, d) => s + d.count,
						0
					);
					const daysPassed = new Date().getDate();
					const avgPerDay = daysPassed ? monthCount / daysPassed : 0;
					return [
						{ label: "Sent this month", value: monthCount },
						{
							label: "Last month",
							value: homeStats?.invoicesSent.previous ?? "—",
						},
						{ label: "Avg/day", value: avgPerDay.toFixed(1) },
						{
							label: "Total value",
							value: new Intl.NumberFormat("en-US", {
								style: "currency",
								currency: "USD",
							}).format(homeStats?.invoicesSent.totalValue ?? 0),
						},
						{
							label: "Outstanding",
							value: new Intl.NumberFormat("en-US", {
								style: "currency",
								currency: "USD",
							}).format(homeStats?.invoicesSent.outstanding ?? 0),
						},
					];
				})()}
				metadata={(() => {
					let peak = { date: "—", value: 0 } as { date: string; value: number };
					invoicesChartData.forEach((d) => {
						const v = (d as Record<string, number>).invoices ?? 0;
						if (v > peak.value) peak = { date: d.date, value: v };
					});
					return [
						{
							label: "Peak day",
							value: peak.value > 0 ? `${peak.date} (${peak.value})` : "—",
						},
						{
							label: "Sent this month",
							value: homeStats?.invoicesSent.current ?? "—",
						},
					];
				})()}
				chart={{
					data: invoicesChartData,
					config: invoicesAreaConfig,
					xAxisKey: "date",
					dataKeys: ["invoices"],
					chartId: "invoices-modal",
				}}
			/>

			{/* Revenue Modal */}
			<ChartDetailModal
				isOpen={openRevenueModal}
				onClose={() => setOpenRevenueModal(false)}
				title="Revenue — Monthly Trend"
				subtitle="Daily revenue received this month"
				change={
					homeStats
						? `${homeStats.revenueGoal.changePercentage > 0 ? "+" : ""}${homeStats.revenueGoal.changePercentage}%`
						: undefined
				}
				changeType={
					!homeStats
						? "neutral"
						: homeStats.revenueGoal.changePercentage > 0
							? "increase"
							: homeStats.revenueGoal.changePercentage < 0
								? "decrease"
								: "neutral"
				}
				statSummary={(() => {
					const monthRevenue = (revenueThisMonth || []).reduce(
						(s, d) => s + d.count,
						0
					);
					const now = new Date();
					const daysInMonth = new Date(
						now.getFullYear(),
						now.getMonth() + 1,
						0
					).getDate();
					const dayOfMonth = now.getDate();
					const expectedPercentage = Math.round(
						(dayOfMonth / daysInMonth) * 100
					);
					const currentPercentage = homeStats?.revenueGoal.percentage ?? 0;
					const onTrack = currentPercentage >= expectedPercentage;
					return [
						{
							label: "Revenue this month",
							value: new Intl.NumberFormat("en-US", {
								style: "currency",
								currency: "USD",
							}).format(monthRevenue),
						},
						{
							label: "Target",
							value: new Intl.NumberFormat("en-US", {
								style: "currency",
								currency: "USD",
							}).format(homeStats?.revenueGoal.target ?? 0),
						},
						{ label: "Progress", value: `${currentPercentage}%` },
						{ label: "On track", value: onTrack ? "Yes" : "No" },
					];
				})()}
				metadata={(() => {
					let peak = { date: "—", value: 0 } as { date: string; value: number };
					revenueChartData.forEach((d) => {
						const v = (d as Record<string, number>).revenue ?? 0;
						if (v > peak.value) peak = { date: d.date, value: v };
					});
					return [
						{
							label: "Peak day",
							value:
								peak.value > 0
									? `${peak.date} (${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(peak.value)})`
									: "—",
						},
					];
				})()}
				chart={{
					data: revenueChartData,
					config: revenueAreaConfig,
					xAxisKey: "date",
					dataKeys: ["revenue"],
					chartId: "revenue-modal",
					referenceLineValue: homeStats?.revenueGoal.target,
					referenceLineLabel: `Target: ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact" }).format(homeStats?.revenueGoal.target ?? 0)}`,
					referenceLineColor: "hsl(142.1 76.2% 36.3%)",
				}}
			/>

			{/* Tasks Modal */}
			<ChartDetailModal
				isOpen={openTasksModal}
				onClose={() => setOpenTasksModal(false)}
				title="Tasks — Monthly Trend"
				subtitle="Daily tasks created this month"
				changeType="neutral"
				statSummary={(() => {
					const monthCount = (tasksThisMonth || []).reduce(
						(s, d) => s + d.count,
						0
					);
					const daysPassed = new Date().getDate();
					const avgPerDay = daysPassed ? monthCount / daysPassed : 0;
					return [
						{ label: "Created this month", value: monthCount },
						{
							label: "Due this week",
							value: homeStats?.pendingTasks.dueThisWeek ?? "—",
						},
						{
							label: "Current total",
							value: homeStats?.pendingTasks.total ?? "—",
						},
						{ label: "Avg/day", value: avgPerDay.toFixed(1) },
					];
				})()}
				metadata={(() => {
					let peak = { date: "—", value: 0 } as { date: string; value: number };
					tasksChartData.forEach((d) => {
						const v = (d as Record<string, number>).tasks ?? 0;
						if (v > peak.value) peak = { date: d.date, value: v };
					});
					return [
						{
							label: "Peak day",
							value: peak.value > 0 ? `${peak.date} (${peak.value})` : "—",
						},
					];
				})()}
				chart={{
					data: tasksChartData,
					config: tasksAreaConfig,
					xAxisKey: "date",
					dataKeys: ["tasks"],
					chartId: "tasks-modal",
				}}
			/>
		</div>
	);
}
