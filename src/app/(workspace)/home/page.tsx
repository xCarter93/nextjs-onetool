"use client";

import ActivityFeed from "@/components/activity-feed";
import GettingStarted from "@/components/getting-started";
import HomeStats from "@/components/home-stats";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export default function Page() {
	const user = useQuery(api.users.current);

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
		<div className="min-h-[100vh] flex-1 md:min-h-min">
			{/* Enhanced Background with Gradient */}
			<div className="relative bg-gradient-to-br from-background via-muted/30 to-muted/60 dark:from-background dark:via-muted/20 dark:to-muted/40 min-h-[100vh] md:min-h-min rounded-xl">
				{/* Subtle Pattern Overlay */}
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(120,119,198,0.1),transparent_50%)] rounded-xl" />

				<div className="relative p-6">
					{/* Compact Date Header */}
					<div className="mb-6">
						<h1 className="text-lg font-medium text-muted-foreground mb-1">
							{formatDate()}
						</h1>
						<h2 className="text-2xl font-bold text-foreground">
							{getWelcomeMessage()}
						</h2>
					</div>

					<HomeStats />

					{/* Dashboard Layout */}
					<div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
						{/* Main Content Area - 3 columns */}
						<div className="xl:col-span-3 space-y-6">
							{/* Getting Started Section */}
							<div className="bg-card dark:bg-card backdrop-blur-md border border-border dark:border-border rounded-xl p-6 shadow-lg dark:shadow-black/50 ring-1 ring-border/30 dark:ring-border/50">
								<GettingStarted />
							</div>
						</div>

						{/* Sidebar - 2 columns for more breathing room */}
						<div className="xl:col-span-2 space-y-6">
							{/* Activity Feed Section */}
							<div className="bg-card dark:bg-card backdrop-blur-md border border-border dark:border-border rounded-xl p-6 shadow-lg dark:shadow-black/50 ring-1 ring-border/30 dark:ring-border/50">
								<ActivityFeed />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
