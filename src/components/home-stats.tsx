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

interface StatItem {
	name: string;
	stat: string;
	previousStat?: string;
	change?: string;
	changeType?: "increase" | "decrease" | "neutral";
	value?: string;
	subtitle?: string;
	icon: React.ComponentType<{ className?: string }>;
}

const stats: StatItem[] = [
	{
		name: "Total Clients",
		stat: "127",
		previousStat: "115",
		change: "+12",
		changeType: "increase",
		subtitle: "Active relationships",
		icon: UsersIcon,
	},
	{
		name: "Projects Completed",
		stat: "89",
		previousStat: "76",
		change: "+13",
		changeType: "increase",
		value: "$487,320",
		subtitle: "Total value this month",
		icon: CheckCircleIcon,
	},
	{
		name: "Approved Quotes",
		stat: "34",
		previousStat: "28",
		change: "+6",
		changeType: "increase",
		value: "$234,890",
		subtitle: "Ready for invoicing",
		icon: DocumentTextIcon,
	},
	{
		name: "Invoices Sent",
		stat: "67",
		previousStat: "58",
		change: "+9",
		changeType: "increase",
		value: "$389,450",
		subtitle: "Outstanding: $127,340",
		icon: DocumentIcon,
	},
	{
		name: "Revenue Goal",
		stat: "78%",
		previousStat: "72%",
		change: "+6%",
		changeType: "increase",
		subtitle: "Monthly target progress",
		icon: ChartBarIcon,
	},
	{
		name: "Pending Tasks",
		stat: "23",
		changeType: "neutral",
		subtitle: "Due this week",
		icon: ClockIcon,
	},
];

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(" ");
}

export default function HomeStats() {
	return (
		<div className="mb-8">
			<h3 className="text-lg font-semibold text-foreground mb-4">
				Business Overview (Month to Date)
			</h3>
			<dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
				{stats.map((item, index) => {
					const Icon = item.icon;
					// Define colors for different stat types
					const colors = [
						"border-t-orange-500", // Total Clients
						"border-t-red-500", // Projects Completed
						"border-t-green-500", // Approved Quotes
						"border-t-blue-500", // Invoices Sent
						"border-t-purple-500", // Revenue Goal
						"border-t-yellow-500", // Pending Tasks
					];
					const borderColor = colors[index % colors.length];

					return (
						<Card
							key={item.name}
							className={`group relative backdrop-blur-md transition-all duration-200 hover:shadow-lg dark:hover:shadow-black/70 border-t-4 ${borderColor} overflow-hidden ring-1 ring-border/20 dark:ring-border/40 py-0`}
							role="article"
							tabIndex={0}
						>
							<CardContent className="relative p-4">
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
