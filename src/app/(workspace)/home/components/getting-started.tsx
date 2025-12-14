"use client";

import Link from "next/link";
import {
	UserGroupIcon,
	DocumentTextIcon,
	CalendarDaysIcon,
	WrenchScrewdriverIcon,
	ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { useOrganization } from "@clerk/nextjs";

const items = [
	{
		title: "Add Your First Client",
		description:
			"Start by adding a client to manage their projects and services.",
		icon: UserGroupIcon,
		background: "bg-primary",
		href: "/clients/new",
	},
	{
		title: "Create Your First Project",
		description: "Set up a project to organize tasks and track progress.",
		icon: WrenchScrewdriverIcon,
		background: "bg-primary",
		href: "/projects/new",
	},
	{
		title: "Send Your First Quote",
		description: "Create and send professional quotes with PDF generation.",
		icon: DocumentTextIcon,
		background: "bg-primary",
		href: "/quotes/new",
	},
	{
		title: "Schedule Your First Task",
		description: "Add tasks and schedule appointments for your projects.",
		icon: CalendarDaysIcon,
		background: "bg-primary",
		href: "/tasks/new",
	},
];

function classNames(
	...classes: (string | boolean | undefined | null)[]
): string {
	return classes.filter(Boolean).join(" ");
}

export default function GettingStarted() {
	const { organization, isLoaded } = useOrganization();

	return (
		<Card className="group relative backdrop-blur-md overflow-hidden ring-1 ring-border/20 dark:ring-border/40">
			{/* Glass morphism overlay */}
			<div className="absolute inset-0 bg-linear-to-br from-white/10 via-white/5 to-transparent dark:from-white/5 dark:via-white/2 dark:to-transparent rounded-2xl" />
			<CardContent className="relative z-10">
				<div className="flex items-center gap-3 mb-4">
					<div className="w-1.5 h-6 bg-linear-to-b from-primary to-primary/60 rounded-full" />
					<h2 className="text-lg font-semibold text-foreground tracking-tight">
						Getting Started
					</h2>
				</div>
				<p className="mt-2 text-sm text-muted-foreground leading-relaxed">
					Welcome to OneTool! Here are some quick actions to get you started
					with managing your field service business.
				</p>

				{/* Enhanced Organization Setup Alert - Only show if no organization exists */}
				{isLoaded && !organization && (
					<Alert className="mt-6 border-amber-300 dark:border-amber-700 bg-linear-to-r from-amber-50 to-amber-100 text-amber-900 dark:bg-linear-to-r dark:from-amber-950 dark:to-amber-900 dark:text-amber-100 ring-1 ring-amber-200 dark:ring-amber-800 backdrop-blur-sm">
						<ExclamationTriangleIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
						<AlertTitle className="text-amber-900 dark:text-amber-100 font-semibold">
							Set Up Your Organization
						</AlertTitle>
						<AlertDescription className="text-amber-800 dark:text-amber-200 leading-relaxed">
							Complete your organization setup to unlock all features and
							customize OneTool for your business.
							<Link
								href="/organization/complete"
								className="inline-flex items-center gap-1 text-amber-900 hover:text-amber-950 dark:text-amber-200 dark:hover:text-amber-50 font-semibold underline underline-offset-2 transition-colors ml-1"
							>
								Click here to set up organization →
							</Link>
						</AlertDescription>
					</Alert>
				)}
				<ul
					role="list"
					className="mt-8 grid grid-cols-1 gap-5 border-y border-border dark:border-border py-8 sm:grid-cols-2"
				>
					{items.map((item, itemIdx) => (
						<li key={itemIdx} className="flow-root">
							<Link href={item.href} className="block group">
								<div className="relative -m-2 flex items-center space-x-4 rounded-2xl p-4 bg-linear-to-r from-card/80 to-card/60 dark:from-card/70 dark:to-card/50 border border-border/80 dark:border-border hover:-translate-y-1 focus-within:outline-2 focus-within:outline-primary hover:bg-linear-to-r hover:from-card hover:to-card/80 transition-all duration-300 ring-1 ring-border/20 dark:ring-border/40 backdrop-blur-md">
									<div
										className={classNames(
											item.background,
											"flex size-14 shrink-0 items-center justify-center rounded-xl p-3 ring-1 ring-white/20 group-hover:scale-105 transition-transform duration-300"
										)}
									>
										<item.icon
											aria-hidden="true"
											className="size-6 text-white"
										/>
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
			</CardContent>
		</Card>
	);
}
