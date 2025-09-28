"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
	AudioWaveform,
	Command,
	GalleryVerticalEnd,
	Home,
	Settings,
	Users,
	FileText,
	Receipt,
	Briefcase,
	ListCheck,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";

// This is sample data.
const data = {
	user: {
		name: "shadcn",
		email: "m@example.com",
		avatar: "/avatars/shadcn.jpg",
	},
	teams: [
		{
			name: "Acme Inc",
			logo: GalleryVerticalEnd,
			plan: "Enterprise",
		},
		{
			name: "Acme Corp.",
			logo: AudioWaveform,
			plan: "Startup",
		},
		{
			name: "Evil Corp.",
			logo: Command,
			plan: "Free",
		},
	],
	navMain: [
		{
			title: "Home",
			url: "/home",
			icon: Home,
		},
		{
			title: "Clients",
			url: "/clients",
			icon: Users,
		},
		{
			title: "Projects",
			url: "/projects",
			icon: Briefcase,
		},
		{
			title: "Tasks",
			url: "/tasks",
			icon: ListCheck,
		},
		{
			title: "Quotes",
			url: "/quotes",
			icon: FileText,
		},
		{
			title: "Invoices",
			url: "/invoices",
			icon: Receipt,
		},
		{
			title: "Settings",
			url: "/organization/profile",
			icon: Settings,
			items: [
				{
					title: "Overview",
					url: "/organization/profile",
				},
				{
					title: "Business Info",
					url: "/organization/profile/business",
				},
				{
					title: "Preferences",
					url: "/organization/profile/preferences",
				},
			],
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const pathname = usePathname();
	const taskStats = useQuery(api.tasks.getStats, {});
	const tasksDueToday = taskStats?.todayTasks ?? 0;

	// Function to determine if a navigation item should be active
	const isNavItemActive = (navUrl: string, title: string) => {
		if (title === "Settings") {
			return pathname.startsWith("/organization/profile");
		}

		// For other items, check both plural and singular forms
		if (title === "Clients") {
			return pathname.startsWith("/clients") || pathname.startsWith("/client");
		}

		if (title === "Projects") {
			return (
				pathname.startsWith("/projects") || pathname.startsWith("/project")
			);
		}

		if (title === "Tasks") {
			return pathname.startsWith("/tasks") || pathname.startsWith("/task");
		}

		if (title === "Quotes") {
			return pathname.startsWith("/quotes") || pathname.startsWith("/quote");
		}

		if (title === "Invoices") {
			return (
				pathname.startsWith("/invoices") || pathname.startsWith("/invoice")
			);
		}

		// Fallback for other items (like Home)
		return pathname.startsWith(navUrl);
	};

	// Create navigation items with dynamic isActive property
	const navigationItems = data.navMain.map((item) => {
		const subItems = item.items?.map((subItem) => ({
			...subItem,
			isActive:
				pathname === subItem.url || pathname.startsWith(`${subItem.url}/`),
		}));

		const isActive =
			isNavItemActive(item.url, item.title) ||
			subItems?.some((subItem) => subItem.isActive);

		return {
			...item,
			items: subItems,
			isActive,
			badgeCount:
				item.title === "Tasks" && tasksDueToday > 0
					? tasksDueToday
					: undefined,
			badgeVariant: item.title === "Tasks" ? ("alert" as const) : undefined,
		};
	});

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader className="pl-0">
				<TeamSwitcher />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={navigationItems} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
