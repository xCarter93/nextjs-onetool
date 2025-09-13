import Link from "next/link";
import {
	UserGroupIcon,
	DocumentTextIcon,
	CalendarDaysIcon,
	CurrencyDollarIcon,
	ChartBarIcon,
	WrenchScrewdriverIcon,
	ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";

const items = [
	{
		title: "Add Your First Client",
		description:
			"Start by adding a client to manage their projects and services.",
		icon: UserGroupIcon,
		background: "bg-blue-500",
		href: "/client/new",
	},
	{
		title: "Create Your First Project",
		description: "Set up a project to organize tasks and track progress.",
		icon: WrenchScrewdriverIcon,
		background: "bg-green-500",
		href: "/project/new",
	},
	{
		title: "Send Your First Quote",
		description: "Create and send professional quotes with PDF generation.",
		icon: DocumentTextIcon,
		background: "bg-purple-500",
		href: "/quote/new",
	},
	{
		title: "Schedule Your First Task",
		description: "Add tasks and schedule appointments for your projects.",
		icon: CalendarDaysIcon,
		background: "bg-orange-500",
		href: "/task/new",
	},
	{
		title: "Create Your First Invoice",
		description: "Generate invoices and track payments from your clients.",
		icon: CurrencyDollarIcon,
		background: "bg-emerald-500",
		href: "/invoice/new",
	},
	{
		title: "View Your Dashboard",
		description: "Check your business metrics and upcoming tasks.",
		icon: ChartBarIcon,
		background: "bg-indigo-500",
		href: "/dashboard",
	},
];

function classNames(
	...classes: (string | boolean | undefined | null)[]
): string {
	return classes.filter(Boolean).join(" ");
}

export default function GettingStarted() {
	return (
		<div>
			<div className="flex items-center gap-3 mb-4">
				<div className="w-1.5 h-6 bg-gradient-to-b from-primary to-primary/60 rounded-full" />
				<h2 className="text-lg font-semibold text-foreground tracking-tight">
					Getting Started
				</h2>
			</div>
			<p className="mt-2 text-sm text-muted-foreground leading-relaxed">
				Welcome to OneTool! Here are some quick actions to get you started with
				managing your field service business.
			</p>

			{/* Enhanced Organization Setup Alert */}
			<Alert className="mt-6 border-amber-300 dark:border-amber-700 bg-gradient-to-r from-amber-50 to-amber-100 text-amber-900 dark:bg-gradient-to-r dark:from-amber-950 dark:to-amber-900 dark:text-amber-100 shadow-md ring-1 ring-amber-200 dark:ring-amber-800 backdrop-blur-sm">
				<ExclamationTriangleIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
				<AlertTitle className="text-amber-900 dark:text-amber-100 font-semibold">
					Set Up Your Organization
				</AlertTitle>
				<AlertDescription className="text-amber-800 dark:text-amber-200 leading-relaxed">
					Complete your organization setup to unlock all features and customize
					OneTool for your business.
					<Link
						href="/organization/new"
						className="inline-flex items-center gap-1 text-amber-900 hover:text-amber-950 dark:text-amber-200 dark:hover:text-amber-50 font-semibold underline underline-offset-2 transition-colors ml-1"
					>
						Click here to set up organization →
					</Link>
				</AlertDescription>
			</Alert>
			<ul
				role="list"
				className="mt-8 grid grid-cols-1 gap-5 border-y border-border dark:border-border py-8 sm:grid-cols-2"
			>
				{items.map((item, itemIdx) => (
					<li key={itemIdx} className="flow-root">
						<Link href={item.href} className="block group">
							<div className="relative -m-2 flex items-center space-x-4 rounded-2xl p-4 bg-gradient-to-r from-card/80 to-card/60 dark:from-card/70 dark:to-card/50 border border-border/80 dark:border-border shadow-md hover:shadow-lg hover:-translate-y-1 focus-within:outline-2 focus-within:outline-primary hover:bg-gradient-to-r hover:from-card hover:to-card/80 transition-all duration-300 ring-1 ring-border/20 dark:ring-border/40 backdrop-blur-md">
								<div
									className={classNames(
										item.background,
										"flex size-14 shrink-0 items-center justify-center rounded-xl p-3 shadow-lg ring-1 ring-white/20 group-hover:scale-105 transition-transform duration-300"
									)}
								>
									<item.icon aria-hidden="true" className="size-6 text-white" />
								</div>
								<div className="flex-1">
									<h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
										<span>{item.title}</span>
										<span
											aria-hidden="true"
											className="ml-2 text-primary group-hover:translate-x-1 inline-block transition-transform duration-200"
										>
											→
										</span>
									</h3>
									<p className="mt-1.5 text-sm text-muted-foreground dark:text-muted-foreground/90 leading-relaxed">
										{item.description}
									</p>
								</div>
							</div>
						</Link>
					</li>
				))}
			</ul>
			<div className="mt-6 flex">
				<Link
					href="/dashboard"
					className="group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-all duration-200 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/15 ring-1 ring-primary/30 hover:ring-primary/40 shadow-sm hover:shadow-md backdrop-blur-sm"
				>
					View Dashboard
					<span
						aria-hidden="true"
						className="group-hover:translate-x-1 transition-transform duration-200"
					>
						→
					</span>
				</Link>
			</div>
		</div>
	);
}
