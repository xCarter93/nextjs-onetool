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
			<h3 className="text-xl font-semibold text-foreground mb-6">
				Business Overview (Month to Date)
			</h3>
			<dl className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{stats.map((item) => {
					const Icon = item.icon;
					return (
						<div
							key={item.name}
							className="group relative bg-card/95 border border-border rounded-xl p-6 shadow-sm dark:shadow-black/40 transition-all duration-200 hover:shadow-md hover:scale-[1.01] focus-within:shadow-md hover:border-primary/20 ring-1 ring-border/5"
							role="article"
							tabIndex={0}
						>
							{/* Subtle gradient overlay */}
							<div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

							<div className="relative">
								<div className="flex items-center justify-between mb-4">
									<div className="flex items-center space-x-3">
										<div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/15 transition-colors duration-200 ring-1 ring-border/10">
											<Icon className="w-5 h-5" />
										</div>
										<dt className="text-sm font-medium text-muted-foreground dark:text-muted-foreground/90">
											{item.name}
										</dt>
									</div>

									{item.change && item.changeType && (
										<div
											className={classNames(
												item.changeType === "increase"
													? "bg-green-600/80 text-black dark:bg-green-500/80"
													: item.changeType === "decrease"
														? "bg-red-600/80 text-black dark:bg-red-500/80"
														: "bg-muted text-muted-foreground border border-border",
												"inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
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
									<div className="flex flex-col space-y-1">
										<div className="flex items-baseline space-x-2">
											<span className="text-3xl font-bold text-foreground dark:text-white">
												{item.stat}
											</span>
											{item.value && (
												<span className="text-sm font-semibold text-primary">
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
							</div>
						</div>
					);
				})}
			</dl>
		</div>
	);
}
