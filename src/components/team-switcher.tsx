"use client";

import * as React from "react";
import { OrganizationSwitcher } from "@clerk/nextjs";
import { useQuery } from "convex/react";

import { api } from "../../convex/_generated/api";

import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";

export function TeamSwitcher() {
	const organization = useQuery(api.organizations.get);
	const shouldInvert = organization?.logoInvertInDarkMode ?? true;
	const avatarImageClass = `w-8 h-8 rounded-lg object-cover ${
		shouldInvert ? "dark:invert dark:brightness-0" : ""
	}`;
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<div className="flex items-center w-full">
					<OrganizationSwitcher
						appearance={{
							elements: {
								userPreviewMainIdentifierText: "dark:text-white m-2",
								organizationSwitcherPopoverMain: "dark:bg-zinc-900 bg-white",
								rootBox: "w-full",
								organizationSwitcherTrigger:
									"w-full justify-start p-2 border-0 bg-transparent hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground rounded-md text-foreground transition-all duration-200 [&_svg:last-child]:w-3 [&_svg:last-child]:h-3 dark:text-white",
								organizationSwitcherTriggerIcon:
									"bg-sidebar-primary text-sidebar-primary-foreground size-8 rounded-lg",

								// Make dropdown arrow much smaller with design token colors
								chevronDown: "w-3 h-3 text-muted-foreground",
								organizationSwitcherTriggerChevron:
									"w-3 h-3 text-muted-foreground",
								triggerChevron: "w-3 h-3 text-muted-foreground",
								arrow: "w-3 h-3 text-muted-foreground",
								organizationPreview: "flex-1 text-left",
								organizationPreviewMainIdentifier:
									"text-sm font-medium truncate text-foreground",
								organizationPreviewSecondaryIdentifier:
									"text-xs dark:text-white text-muted-foreground truncate",

								// Enhanced popover styling using design system tokens
								organizationSwitcherPopoverCard:
									"dark:bg-zinc-900 bg-white shadow-lg border border-border rounded-xl p-2",
								organizationSwitcherPopoverActionButton:
									"text-primary hover:text-primary/90 font-medium transition-colors",
								organizationSwitcherPopoverActionButtonText:
									"text-sm text-foreground",

								// Organization list styling with design tokens
								organizationSwitcherPreviewButton:
									"w-full p-2 rounded-lg bg-transparent hover:bg-muted/50 transition-colors text-left text-foreground",
								organizationPreviewAvatarBox:
									"w-8 h-8 rounded-lg dark:bg-zinc-800 bg-gray-100 flex items-center justify-center",
								organizationPreviewAvatarImage: avatarImageClass,

								// Organization list text with design tokens
								organizationSwitcherPopoverOrganization: "text-foreground",
								organizationSwitcherPopoverOrganizationName:
									"text-sm font-medium text-foreground",
								organizationSwitcherPopoverOrganizationRole:
									"text-xs text-muted-foreground",

								// Create organization button with design tokens
								organizationSwitcherPopoverFooter:
									"border-t border-border mt-2 pt-2",
								organizationSwitcherPopoverFooterAction:
									"text-primary hover:text-primary/90",
								organizationSwitcherPopoverFooterActionText:
									"text-sm font-medium text-foreground",

								// Additional popover elements with design tokens
								popoverContent:
									"dark:bg-zinc-900 bg-white border border-border",
								popoverTrigger: "text-foreground",
								organizationSwitcherPopover: "dark:bg-zinc-900 bg-white",
								organizationSwitcherPopoverContent:
									"dark:bg-zinc-900 bg-white border border-border",

								// Target all possible popover containers with design tokens
								popoverBox: "dark:bg-zinc-900 bg-white",
								modalContent: "dark:bg-zinc-900 bg-white",
								dropdownContainer: "dark:bg-zinc-900 bg-white",
								organizationSwitcherPopoverContainer:
									"dark:bg-zinc-900 bg-white",
							},
							variables: {
								// Keep primary color in sync with design tokens
								colorPrimary: "hsl(var(--primary))",
								colorTextOnPrimaryBackground: "hsl(var(--primary-foreground))",
								colorNeutral: "hsl(var(--muted-foreground))",
								// Typography
								fontFamily: "inherit",
								fontSize: "0.875rem",
								fontWeight: {
									normal: "400",
									medium: "500",
									semibold: "600",
									bold: "700",
								},
								// Design tokens
								borderRadius: "0.5rem",
								spacingUnit: "0.5rem",
							},
						}}
						createOrganizationUrl="/organization/new"
						organizationProfileUrl="/organization/profile"
						afterCreateOrganizationUrl="/organization/complete"
						afterSelectOrganizationUrl="/home"
						hidePersonal={true}
					/>
				</div>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
