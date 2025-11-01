"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";
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

import { NavMain } from "@/components/layout/nav-main";
import { NavUser } from "@/components/layout/nav-user";
import { TeamSwitcher } from "@/components/layout/team-switcher";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { useFeatureAccess } from "@/hooks/use-feature-access";

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
					url: "/organization/profile?tab=business",
				},
				{
					title: "Preferences",
					url: "/organization/profile?tab=preferences",
				},
				{
					title: "Documents",
					url: "/organization/profile?tab=documents",
				},
				{
					title: "SKUs",
					url: "/organization/profile?tab=skus",
				},
			],
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const taskStats = useQuery(api.tasks.getStats, {});
	const tasksDueToday = taskStats?.todayTasks ?? 0;
	const { hasOrganization } = useFeatureAccess();

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
		const subItems = item.items?.map((subItem) => {
			// For URLs with search params, we need to compare both pathname and params
			const [subItemPath, subItemParams] = subItem.url.split("?");
			const currentPath = pathname;
			const currentParams = searchParams.toString();

			let isSubItemActive = false;

			if (subItemParams) {
				// URL has search params (like ?tab=business)
				isSubItemActive =
					currentPath === subItemPath && currentParams === subItemParams;
			} else {
				// No search params in the URL - should match only when current page has no params either
				// Special case: for organization/profile, only match when there are no search params
				if (subItem.url === "/organization/profile") {
					isSubItemActive = pathname === subItem.url && currentParams === "";
				} else {
					// Use original logic for other routes
					isSubItemActive =
						pathname === subItem.url ||
						(subItem.url !== item.url &&
							pathname.startsWith(`${subItem.url}/`));
				}
			}

			return {
				...subItem,
				isActive: isSubItemActive,
			};
		});

		const isActive =
			isNavItemActive(item.url, item.title) ||
			subItems?.some((subItem) => subItem.isActive);

		// Determine if item should be disabled
		// Users without an organization can only access Settings
		const isDisabled =
			!hasOrganization && item.title !== "Settings" && item.title !== "Home";

		return {
			...item,
			items: subItems,
			isActive,
			disabled: isDisabled,
			badgeCount:
				item.title === "Tasks" && tasksDueToday > 0 ? tasksDueToday : undefined,
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
