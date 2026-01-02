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
import { api } from "@onetool/backend/convex/_generated/api";
import type { HomeStats as HomeStatsType } from "@onetool/backend";
import { StatItem } from "@/types/stats";

// Helper function to format currency
function formatCurrency(amount: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0,
	}).format(amount);
}

// Helper function to format change with sign
function formatChange(change: number, isPercentage: boolean = false): string {
	const sign = change > 0 ? "+" : "";
	const suffix = isPercentage ? "%" : "";
	return `${sign}${change}${suffix}`;
}

// Generate stats array from Convex data
function generateStats(homeStats: HomeStatsType | undefined): StatItem[] {
	if (!homeStats) {
		// Return loading placeholders
		return [
			{
				name: "Total Clients",
				stat: "—",
				subtitle: "Loading...",
				icon: UsersIcon,
			},
			{
				name: "Projects Completed",
				stat: "—",
				subtitle: "Loading...",
				icon: CheckCircleIcon,
			},
			{
				name: "Approved Quotes",
				stat: "—",
				subtitle: "Loading...",
				icon: DocumentTextIcon,
			},
			{
				name: "Invoices Sent",
				stat: "—",
				subtitle: "Loading...",
				icon: DocumentIcon,
			},
			{
				name: "Revenue Goal",
				stat: "—",
				subtitle: "Loading...",
				icon: ChartBarIcon,
			},
			{
				name: "Pending Tasks",
				stat: "—",
				subtitle: "Loading...",
				icon: ClockIcon,
			},
		];
	}

	return [
		{
			name: "Total Clients",
			stat: homeStats.totalClients.current.toString(),
			previousStat: homeStats.totalClients.previous.toString(),
			change: formatChange(homeStats.totalClients.change),
			changeType: homeStats.totalClients.changeType,
			subtitle: "Active relationships",
			icon: UsersIcon,
		},
		{
			name: "Projects Completed",
			stat: homeStats.completedProjects.current.toString(),
			previousStat: homeStats.completedProjects.previous.toString(),
			change: formatChange(homeStats.completedProjects.change),
			changeType: homeStats.completedProjects.changeType,
			value: formatCurrency(homeStats.completedProjects.totalValue),
			subtitle: "Total value this month",
			icon: CheckCircleIcon,
		},
		{
			name: "Approved Quotes",
			stat: homeStats.approvedQuotes.current.toString(),
			previousStat: homeStats.approvedQuotes.previous.toString(),
			change: formatChange(homeStats.approvedQuotes.change),
			changeType: homeStats.approvedQuotes.changeType,
			value: formatCurrency(homeStats.approvedQuotes.totalValue),
			subtitle: "Ready for invoicing",
			icon: DocumentTextIcon,
		},
		{
			name: "Invoices Sent",
			stat: homeStats.invoicesSent.current.toString(),
			previousStat: homeStats.invoicesSent.previous.toString(),
			change: formatChange(homeStats.invoicesSent.change),
			changeType: homeStats.invoicesSent.changeType,
			value: formatCurrency(homeStats.invoicesSent.totalValue),
			subtitle: `Outstanding: ${formatCurrency(homeStats.invoicesSent.outstanding)}`,
			icon: DocumentIcon,
		},
		{
			name: "Revenue Goal",
			stat: `${homeStats.revenueGoal.percentage}%`,
			previousStat: `${homeStats.revenueGoal.previousPercentage}%`,
			change: formatChange(homeStats.revenueGoal.changePercentage, true),
			changeType:
				homeStats.revenueGoal.changePercentage > 0
					? "increase"
					: homeStats.revenueGoal.changePercentage < 0
						? "decrease"
						: "neutral",
			subtitle: "Monthly target progress",
			icon: ChartBarIcon,
		},
		{
			name: "Pending Tasks",
			stat: homeStats.pendingTasks.total.toString(),
			changeType: "neutral",
			subtitle: `${homeStats.pendingTasks.dueThisWeek} due this week`,
			icon: ClockIcon,
		},
	];
}

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(" ");
}

export default function HomeStats() {
	// Fetch home stats from Convex
	const homeStats = useQuery(api.homeStats.getHomeStats);

	// Generate stats array from Convex data
	const stats = generateStats(homeStats);

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
							className={`group relative backdrop-blur-md transition-all duration-200 hover:shadow-lg dark:hover:shadow-black/70 border-t-4 border-t-primary overflow-hidden ring-1 ring-border/20 dark:ring-border/40 py-0`}
							role="article"
							tabIndex={0}
						>
							{/* Glass morphism overlay */}
							<div className="absolute inset-0 bg-linear-to-br from-white/10 via-white/5 to-transparent dark:from-white/5 dark:via-white/2 dark:to-transparent rounded-2xl" />
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

									{item.change && item.changeType && (
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
											<span className="text-2xl font-bold text-foreground dark:text-foreground/95">
												{item.stat}
											</span>
											{item.value && (
												<span className="text-sm font-semibold text-primary dark:text-primary/90">
													{item.value}
												</span>
											)}
										</div>
										{item.subtitle && (
											<span className="text-xs text-muted-foreground dark:text-muted-foreground/85">
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
