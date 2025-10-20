"use client";

import ActivityFeed from "@/components/activity-feed";
import GettingStarted from "@/components/getting-started";
import HomeStats from "@/components/home-stats-real";
import HomeTaskList from "@/components/home-task-list";
import RevenueGoalSetter from "@/components/revenue-goal-setter";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { motion } from "motion/react";
import { useAutoTimezone } from "@/hooks/use-auto-timezone";

export default function Page() {
	const user = useQuery(api.users.current);

	// Automatically detect and save timezone if not set
	useAutoTimezone();

	const formatDate = () => {
		const now = new Date();
		return now.toLocaleDateString("en-US", {
			weekday: "long",
			month: "long",
			day: "numeric",
		});
	};

	const getWelcomeMessage = () => {
		if (!user?.name) return "Welcome back to OneTool!";

		const firstName = user.name.split(" ")[0];
		const messages = [
			`Welcome back, ${firstName}! Ready to conquer your tasks?`,
			`Good to see you again, ${firstName}! Let's make today productive.`,
			`Hello ${firstName}! OneTool is here to streamline your workflow.`,
			`Welcome back ${firstName}! Let's turn ideas into action.`,
		];

		// Use a simple hash of the date to consistently show the same message per day
		const today = new Date().toDateString();
		const hash = today.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
		return messages[hash % messages.length];
	};
	return (
		<motion.div
			className="relative p-4 sm:p-6 lg:p-8"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			{/* Modern Header */}
			<motion.div
				className="mb-8 sm:mb-10"
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}
			>
				<div className="flex items-center gap-3 mb-2">
					<div className="w-1 h-8 bg-gradient-to-b from-primary via-primary/80 to-primary/60 rounded-full" />
					<time className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
						{formatDate()}
					</time>
				</div>
				<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight tracking-tight">
					{getWelcomeMessage()}
				</h1>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}
			>
				<HomeStats />
			</motion.div>

			{/* Enhanced Dashboard Layout */}
			<motion.div
				className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.3 }}
			>
				{/* Main Content Area */}
				<div className="xl:col-span-7 space-y-6 lg:space-y-8">
					{/* Getting Started Section */}
					<motion.div
						transition={{ type: "spring", stiffness: 300, damping: 30 }}
					>
						<GettingStarted />
					</motion.div>

					{/* Tasks Section - Now integrated into main content */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.5 }}
					>
						<HomeTaskList />
					</motion.div>
				</div>

				{/* Enhanced Sidebar */}
				<div className="xl:col-span-5 space-y-6 lg:space-y-8">
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.4 }}
					>
						<RevenueGoalSetter />
					</motion.div>

					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{
							type: "spring",
							stiffness: 300,
							damping: 30,
							delay: 0.5,
						}}
					>
						<ActivityFeed />
					</motion.div>
				</div>
			</motion.div>
		</motion.div>
	);
}
