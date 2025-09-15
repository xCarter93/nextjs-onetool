"use client";

import * as React from "react";
import {
	ChevronRight,
	Plus,
	UserPlus,
	FolderPlus,
	FilePlus,
	type LucideIcon,
} from "lucide-react";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";

export function NavMain({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon?: LucideIcon;
		isActive?: boolean;
		items?: {
			title: string;
			url: string;
		}[];
	}[];
}) {
	const [openQuickActions, setOpenQuickActions] = React.useState(false);
	const isMobile = useIsMobile();
	const closeTimerRef = React.useRef<number | null>(null);

	const openQuickMenu = React.useCallback(() => {
		if (closeTimerRef.current) {
			window.clearTimeout(closeTimerRef.current);
			closeTimerRef.current = null;
		}
		setOpenQuickActions(true);
	}, []);

	const scheduleCloseQuickMenu = React.useCallback(() => {
		if (closeTimerRef.current) {
			window.clearTimeout(closeTimerRef.current);
		}
		closeTimerRef.current = window.setTimeout(() => {
			setOpenQuickActions(false);
			closeTimerRef.current = null;
		}, 1200);
	}, []);

	return (
		<>
			<SidebarGroup>
				<SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu
							open={openQuickActions}
							onOpenChange={setOpenQuickActions}
						>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton
									onMouseEnter={openQuickMenu}
									onMouseLeave={scheduleCloseQuickMenu}
								>
									<Plus />
									<span>Create</span>
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								side={isMobile ? "bottom" : "right"}
								align="start"
								sideOffset={isMobile ? 6 : 8}
								collisionPadding={12}
								onMouseEnter={openQuickMenu}
								onMouseLeave={scheduleCloseQuickMenu}
								className="w-[calc(100vw-2rem)] md:w-auto max-w-[90vw] md:max-w-none p-3 rounded-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 shadow-xl ring-1 ring-black/5 dark:ring-white/10"
							>
								<div className="flex flex-col md:flex-row gap-2">
									<DropdownMenuItem asChild className="p-0">
										<Link
											href="/clients/new"
											className="group flex w-full md:w-40 items-center gap-3 rounded-lg border bg-card p-3 shadow-sm hover:bg-accent hover:text-accent-foreground"
										>
											<UserPlus className="size-5 text-muted-foreground group-hover:text-accent-foreground" />
											<span className="font-medium">Create Client</span>
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild className="p-0">
										<Link
											href="/projects/new"
											className="group flex w-full md:w-40 items-center gap-3 rounded-lg border bg-card p-3 shadow-sm hover:bg-accent hover:text-accent-foreground"
										>
											<FolderPlus className="size-5 text-muted-foreground group-hover:text-accent-foreground" />
											<span className="font-medium">Create Project</span>
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild className="p-0">
										<Link
											href="/quotes/new"
											className="group flex w-full md:w-40 items-center gap-3 rounded-lg border bg-card p-3 shadow-sm hover:bg-accent hover:text-accent-foreground"
										>
											<FilePlus className="size-5 text-muted-foreground group-hover:text-accent-foreground" />
											<span className="font-medium">Create Quote</span>
										</Link>
									</DropdownMenuItem>
								</div>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarGroup>

			<SidebarGroup>
				<SidebarGroupLabel>Platform</SidebarGroupLabel>
				<SidebarMenu>
					{items.map((item) => {
						// If item has nested items, use collapsible structure
						if (item.items && item.items.length > 0) {
							return (
								<Collapsible
									key={item.title}
									asChild
									defaultOpen={item.isActive}
									className="group/collapsible"
								>
									<SidebarMenuItem>
										<CollapsibleTrigger asChild>
											<SidebarMenuButton tooltip={item.title}>
												{item.icon && <item.icon />}
												<span>{item.title}</span>
												<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
											</SidebarMenuButton>
										</CollapsibleTrigger>
										<CollapsibleContent>
											<SidebarMenuSub>
												{item.items.map((subItem) => (
													<SidebarMenuSubItem key={subItem.title}>
														<SidebarMenuSubButton asChild>
															<Link href={subItem.url}>
																<span>{subItem.title}</span>
															</Link>
														</SidebarMenuSubButton>
													</SidebarMenuSubItem>
												))}
											</SidebarMenuSub>
										</CollapsibleContent>
									</SidebarMenuItem>
								</Collapsible>
							);
						}

						// If no nested items, render as simple link
						return (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton asChild isActive={item.isActive}>
									<Link href={item.url}>
										{item.icon && <item.icon />}
										<span>{item.title}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						);
					})}
				</SidebarMenu>
			</SidebarGroup>
		</>
	);
}
