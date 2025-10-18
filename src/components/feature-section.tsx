"use client";

import { motion } from "motion/react";
import {
	Users,
	FolderKanban,
	FileText,
	CheckSquare,
	Smartphone,
	Zap,
} from "lucide-react";
import { StyledButton } from "@/components/ui/styled-button";

const features = [
	{
		icon: Users,
		title: "Client Management",
		description:
			"Organize all your clients in one place with detailed profiles, contact information, service history, and preferences.",
		gradient: "from-primary/5 to-primary/10",
		colSpan: "lg:col-span-3",
	},
	{
		icon: FolderKanban,
		title: "Project Tracking",
		description:
			"Manage projects from start to finish. Track status, deadlines, and progress in real-time while keeping your team aligned.",
		gradient: "from-primary/10 to-primary/5",
		colSpan: "lg:col-span-3",
	},
	{
		icon: FileText,
		title: "Quoting & Invoicing",
		description:
			"Create professional quotes and invoices with your branding. Include line items, taxes, and send via email with e-signature capabilities.",
		gradient: "from-primary/5 to-primary/10",
		colSpan: "lg:col-span-2",
	},
	{
		icon: CheckSquare,
		title: "Task Scheduling",
		description:
			"Plan your day with smart scheduling. Set reminders, assign tasks to team members, and track completion in real-time.",
		gradient: "from-primary/10 to-primary/5",
		colSpan: "lg:col-span-2",
	},
	{
		icon: Smartphone,
		title: "Mobile Access",
		description:
			"Access your business data on the go with our responsive web app. Check schedules, update clients, and manage projects from anywhere.",
		gradient: "from-primary/5 to-primary/10",
		colSpan: "lg:col-span-2",
	},
	{
		icon: Zap,
		title: "Real-Time Collaboration",
		description:
			"Work seamlessly with your team. Share updates, communicate changes, and stay synchronized across all devices instantly.",
		gradient: "from-primary/10 to-primary/5",
		colSpan: "lg:col-span-6",
	},
];

export default function FeatureSection() {
	return (
		<div className="bg-white py-24 sm:py-32 dark:bg-gray-900">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
					className="mx-auto max-w-2xl text-center"
				>
					<h2 className="text-base font-semibold leading-7 text-primary">
						Streamline operations
					</h2>
					<p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
						Everything you need to run your field service business
					</p>
					<p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
						From client management to invoicing, OneTool provides a complete
						solution for field service professionals.
					</p>
				</motion.div>

				{/* Features Bento Grid */}
				<div className="mx-auto mt-16 max-w-7xl sm:mt-20 lg:mt-24">
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-6">
						{features.map((feature, index) => (
							<motion.div
								key={feature.title}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								className={`group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 dark:border-gray-800 dark:bg-gray-800/50 ${feature.colSpan}`}
							>
								{/* Background gradient on hover */}
								<div
									className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
								/>

								<div className="relative z-10">
									{/* Icon */}
									<div className="inline-flex rounded-lg bg-primary/10 p-3 ring-1 ring-inset ring-primary/20 transition-all duration-300 group-hover:bg-primary/20 group-hover:ring-primary/30">
										<feature.icon className="h-6 w-6 text-primary" />
									</div>

									{/* Content */}
									<h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
										{feature.title}
									</h3>
									<p className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-400">
										{feature.description}
									</p>

									{/* Decorative element */}
									<div className="absolute bottom-0 right-0 h-32 w-32 -translate-y-1/2 translate-x-1/2 transform opacity-0 transition-opacity duration-300 group-hover:opacity-20">
										<feature.icon className="h-full w-full text-primary" />
									</div>
								</div>
							</motion.div>
						))}
					</div>
				</div>

				{/* Bottom CTA */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, delay: 0.6 }}
					className="mt-16 text-center"
				>
					<p className="text-base leading-7 text-gray-600 dark:text-gray-400">
						Ready to streamline your field service business?
					</p>
					<div className="mt-4">
						<StyledButton
							label="Get Started Today"
							intent="primary"
							size="lg"
							onClick={() => {
								document
									.getElementById("pricing")
									?.scrollIntoView({ behavior: "smooth" });
							}}
						/>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
