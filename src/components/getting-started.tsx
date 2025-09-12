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
		href: "/clients/new",
	},
	{
		title: "Create Your First Project",
		description: "Set up a project to organize tasks and track progress.",
		icon: WrenchScrewdriverIcon,
		background: "bg-green-500",
		href: "/projects/new",
	},
	{
		title: "Send Your First Quote",
		description: "Create and send professional quotes with PDF generation.",
		icon: DocumentTextIcon,
		background: "bg-purple-500",
		href: "/quotes/new",
	},
	{
		title: "Schedule Your First Task",
		description: "Add tasks and schedule appointments for your projects.",
		icon: CalendarDaysIcon,
		background: "bg-orange-500",
		href: "/tasks/new",
	},
	{
		title: "Create Your First Invoice",
		description: "Generate invoices and track payments from your clients.",
		icon: CurrencyDollarIcon,
		background: "bg-emerald-500",
		href: "/invoices/new",
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
			<h2 className="text-lg font-semibold text-foreground">Getting Started</h2>
			<p className="mt-2 text-sm text-muted-foreground">
				Welcome to OneTool! Here are some quick actions to get you started with
				managing your field service business.
			</p>

			{/* Organization Setup Alert */}
			<Alert className="mt-4 border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
				<ExclamationTriangleIcon className="h-4 w-4" />
				<AlertTitle className="text-amber-800 dark:text-amber-200">
					Set Up Your Organization
				</AlertTitle>
				<AlertDescription className="text-amber-700 dark:text-amber-300">
					Complete your organization setup to unlock all features and customize
					OneTool for your business.
					<Link
						href="/organization/new"
						className="inline text-amber-800 hover:text-amber-900 dark:text-amber-300 dark:hover:text-amber-100 font-medium underline underline-offset-2 transition-colors"
					>
						Click here to set up organization →
					</Link>
				</AlertDescription>
			</Alert>
			<ul
				role="list"
				className="mt-6 grid grid-cols-1 gap-4 border-y border-border py-6 sm:grid-cols-2"
			>
				{items.map((item, itemIdx) => (
					<li key={itemIdx} className="flow-root">
						<Link href={item.href} className="block">
							<div className="relative -m-2 flex items-center space-x-4 rounded-xl p-3 bg-muted/5 dark:bg-muted/10 border border-border/40 shadow-sm hover:shadow-md hover:-translate-y-0.5 focus-within:outline-2 focus-within:outline-primary hover:bg-muted/50 transition">
								<div
									className={classNames(
										item.background,
										"flex size-16 shrink-0 items-center justify-center rounded-lg p-3 ring-1 ring-border/30"
									)}
								>
									<item.icon aria-hidden="true" className="size-6 text-white" />
								</div>
								<div className="flex-1">
									<h3 className="text-sm font-medium text-foreground">
										<span>{item.title}</span>
										<span aria-hidden="true" className="ml-1">
											→
										</span>
									</h3>
									<p className="mt-1 text-sm text-muted-foreground dark:text-muted-foreground/90">
										{item.description}
									</p>
								</div>
							</div>
						</Link>
					</li>
				))}
			</ul>
			<div className="mt-4 flex">
				<Link
					href="/dashboard"
					className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
				>
					View Dashboard
					<span aria-hidden="true" className="ml-1">
						→
					</span>
				</Link>
			</div>
		</div>
	);
}
