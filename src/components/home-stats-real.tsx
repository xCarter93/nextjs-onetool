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

export default function HomeStatsReal() {
	const homeStats = useQuery(api.homeStats.getHomeStats);
	const isLoading = homeStats === undefined;

	// Transform the data into the format expected by the UI
	const stats: StatItem[] = [
		{
			name: "Total Clients",
			stat: isLoading ? "..." : homeStats.totalClients.current.toString(),
			previousStat: isLoading ? "..." : homeStats.totalClients.previous.toString(),
			change: isLoading ? "..." : `${homeStats.totalClients.changeType === "increase" ? "+" : homeStats.totalClients.changeType === "decrease" ? "-" : ""}${homeStats.totalClients.change}`,
			changeType: homeStats?.totalClients.changeType || "neutral",
			subtitle: "Active relationships",
			icon: UsersIcon,
			isLoading,
		},
		{
			name: "Projects Completed",
			stat: isLoading ? "..." : homeStats.completedProjects.current.toString(),
			previousStat: isLoading ? "..." : homeStats.completedProjects.previous.toString(),
			change: isLoading ? "..." : `${homeStats.completedProjects.changeType === "increase" ? "+" : homeStats.completedProjects.changeType === "decrease" ? "-" : ""}${homeStats.completedProjects.change}`,
			changeType: homeStats?.completedProjects.changeType || "neutral",
			value: isLoading ? "..." : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(homeStats.completedProjects.totalValue),
			subtitle: "Total value this month",
			icon: CheckCircleIcon,
			isLoading,
		},
		{
			name: "Approved Quotes",
			stat: isLoading ? "..." : homeStats.approvedQuotes.current.toString(),
			previousStat: isLoading ? "..." : homeStats.approvedQuotes.previous.toString(),
			change: isLoading ? "..." : `${homeStats.approvedQuotes.changeType === "increase" ? "+" : homeStats.approvedQuotes.changeType === "decrease" ? "-" : ""}${homeStats.approvedQuotes.change}`,
			changeType: homeStats?.approvedQuotes.changeType || "neutral",
			value: isLoading ? "..." : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(homeStats.approvedQuotes.totalValue),
			subtitle: "Ready for invoicing",
			icon: DocumentTextIcon,
			isLoading,
		},
		{
			name: "Invoices Sent",
			stat: isLoading ? "..." : homeStats.invoicesSent.current.toString(),
			previousStat: isLoading ? "..." : homeStats.invoicesSent.previous.toString(),
			change: isLoading ? "..." : `${homeStats.invoicesSent.changeType === "increase" ? "+" : homeStats.invoicesSent.changeType === "decrease" ? "-" : ""}${homeStats.invoicesSent.change}`,
			changeType: homeStats?.invoicesSent.changeType || "neutral",
			value: isLoading ? "..." : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(homeStats.invoicesSent.totalValue),
			subtitle: isLoading ? "Outstanding: ..." : `Outstanding: ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(homeStats.invoicesSent.outstanding)}`,
			icon: DocumentIcon,
			isLoading,
		},
		{
			name: "Revenue Goal",
			stat: isLoading ? "..." : `${homeStats.revenueGoal.percentage}%`,
			previousStat: isLoading ? "..." : `${homeStats.revenueGoal.previousPercentage}%`,
			change: isLoading ? "..." : `${homeStats.revenueGoal.changePercentage > 0 ? "+" : ""}${homeStats.revenueGoal.changePercentage}%`,
			changeType: isLoading ? "neutral" : homeStats.revenueGoal.changePercentage > 0 ? "increase" : homeStats.revenueGoal.changePercentage < 0 ? "decrease" : "neutral",
			subtitle: "Monthly target progress",
			icon: ChartBarIcon,
			isLoading,
		},
		{
			name: "Pending Tasks",
			stat: isLoading ? "..." : homeStats.pendingTasks.total.toString(),
			changeType: "neutral",
			subtitle: isLoading ? "Due this week: ..." : `Due this week: ${homeStats.pendingTasks.dueThisWeek}`,
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
											<span className={`text-2xl font-bold text-foreground dark:text-foreground/95 ${
												item.isLoading ? "bg-muted/30 rounded text-transparent" : ""
											}`}>
												{item.stat}
											</span>
											{item.value && (
												<span className={`text-sm font-semibold text-primary dark:text-primary/90 ${
													item.isLoading ? "bg-muted/30 rounded text-transparent" : ""
												}`}>
													{item.value}
												</span>
											)}
										</div>
										{item.subtitle && (
											<span className={`text-xs text-muted-foreground dark:text-muted-foreground/85 ${
												item.isLoading ? "bg-muted/30 rounded text-transparent" : ""
											}`}>
												{item.subtitle}
											</span>
										)}
									</div>
								</dd>
							</CardContent>
						</Card>
					);
				})}
			</dl>
		</div>
	);
}