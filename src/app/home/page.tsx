"use client";

import { SidebarWithHeader } from "@/components/sidebar-with-header";
import ActivityFeed from "@/components/activity-feed";
import GettingStarted from "@/components/getting-started";
import HomeStats from "@/components/home-stats";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

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
		<SidebarWithHeader>
			<div className="bg-muted min-h-[100vh] flex-1 rounded-xl md:min-h-min p-6">
				{/* Date Header */}
				<div className="mb-8">
					<h1 className="text-2xl font-semibold text-foreground mb-2">
						{formatDate()}
					</h1>
					<p className="text-3xl font-bold text-muted-foreground">
						{getWelcomeMessage()}
					</p>
				</div>

				<HomeStats />
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Getting Started Section */}
					<div className="bg-card border border-border rounded-lg p-6 shadow-sm">
						<GettingStarted />
					</div>

					{/* Activity Feed Section */}
					<div className="bg-card border border-border rounded-lg p-6 shadow-sm">
						<ActivityFeed />
					</div>
				</div>
			</div>
		</SidebarWithHeader>
	);
}
