"use client";

import * as React from "react";
import {
	ChevronRight,
	Plus,
	UserPlus,
	FolderPlus,
	FilePlus,
	CheckSquare,
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
	SidebarMenuBadge,
} from "@/components/ui/sidebar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { TaskSheet } from "@/components/shared/task-sheet";

export function NavMain({
	items,
	showQuickActions = true,
}: {
	items: {
		title: string;
		url: string;
		icon?: LucideIcon;
		isActive?: boolean;
		badgeCount?: number;
		badgeVariant?: "alert";
		items?: {
			title: string;
			url: string;
			isActive?: boolean;
		}[];
	}[];
	showQuickActions?: boolean;
}) {
	const [openQuickActions, setOpenQuickActions] = React.useState(false);
	const [taskSheetOpen, setTaskSheetOpen] = React.useState(false);
	const isMobile = useIsMobile();
	const openTimerRef = React.useRef<number | null>(null);
	const closeTimerRef = React.useRef<number | null>(null);

	const handleOpenChange = React.useCallback((open: boolean) => {
		// Clear any pending timers
		if (openTimerRef.current) {
			window.clearTimeout(openTimerRef.current);
			openTimerRef.current = null;
		}
		if (closeTimerRef.current) {
			window.clearTimeout(closeTimerRef.current);
			closeTimerRef.current = null;
		}
		setOpenQuickActions(open);
	}, []);

	const handleMouseEnterTrigger = React.useCallback(() => {
		// Clear any close timer
		if (closeTimerRef.current) {
			window.clearTimeout(closeTimerRef.current);
			closeTimerRef.current = null;
		}

		// Add delay before opening to prevent accidental triggers
		if (!openQuickActions) {
			openTimerRef.current = window.setTimeout(() => {
				setOpenQuickActions(true);
				openTimerRef.current = null;
			}, 300);
		}
	}, [openQuickActions]);

	const handleMouseLeaveTrigger = React.useCallback(() => {
		// Clear open timer if user leaves before delay completes
		if (openTimerRef.current) {
			window.clearTimeout(openTimerRef.current);
			openTimerRef.current = null;
		}
	}, []);

	const handleMouseEnterContent = React.useCallback(() => {
		// Clear any close timer when entering content
		if (closeTimerRef.current) {
			window.clearTimeout(closeTimerRef.current);
			closeTimerRef.current = null;
		}
	}, []);

	const handleMouseLeaveContent = React.useCallback(() => {
		// Schedule close when leaving content
		closeTimerRef.current = window.setTimeout(() => {
			setOpenQuickActions(false);
			closeTimerRef.current = null;
		}, 200);
	}, []);

	// Cleanup timers on unmount
	React.useEffect(() => {
		return () => {
			if (openTimerRef.current) {
				window.clearTimeout(openTimerRef.current);
			}
			if (closeTimerRef.current) {
				window.clearTimeout(closeTimerRef.current);
			}
		};
	}, []);

	return (
		<>
			{showQuickActions && (
				<SidebarGroup>
					<SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
					<SidebarMenu>
						<SidebarMenuItem>
							<DropdownMenu
								open={openQuickActions}
								onOpenChange={handleOpenChange}
							>
								<DropdownMenuTrigger asChild>
									<SidebarMenuButton
										onMouseEnter={handleMouseEnterTrigger}
										onMouseLeave={handleMouseLeaveTrigger}
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
									onMouseEnter={handleMouseEnterContent}
									onMouseLeave={handleMouseLeaveContent}
									onPointerDownOutside={(e) => {
										// Prevent closing when clicking the trigger
										const target = e.target as HTMLElement;
										if (target.closest('[data-slot="dropdown-menu-trigger"]')) {
											e.preventDefault();
										}
									}}
									className="w-[calc(100vw-2rem)] md:w-auto max-w-[90vw] md:max-w-none p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 shadow-2xl"
								>
									<div className="flex flex-col md:flex-row gap-3">
										{/* Create Client */}
										<DropdownMenuItem
											asChild
											className="p-0"
											onSelect={() => setOpenQuickActions(false)}
										>
											<Link
												href="/clients/new"
												className="group relative flex w-full md:w-44 flex-col items-start gap-2 rounded-lg border bg-card p-3 shadow-sm hover:bg-accent hover:text-accent-foreground transition-all duration-200"
											>
												<div className="flex items-center gap-2">
													<div className="rounded-lg bg-blue-500/10 dark:bg-blue-500/20 p-2">
														<UserPlus className="size-5 text-blue-600 dark:text-blue-400" />
													</div>
													<span className="font-semibold text-sm">
														New Client
													</span>
												</div>
												<p className="text-xs text-muted-foreground">
													Add a new client to your workspace
												</p>
											</Link>
										</DropdownMenuItem>

										{/* Create Project */}
										<DropdownMenuItem
											asChild
											className="p-0"
											onSelect={() => setOpenQuickActions(false)}
										>
											<Link
												href="/projects/new"
												className="group relative flex w-full md:w-44 flex-col items-start gap-2 rounded-lg border bg-card p-3 shadow-sm hover:bg-accent hover:text-accent-foreground transition-all duration-200"
											>
												<div className="flex items-center gap-2">
													<div className="rounded-lg bg-purple-500/10 dark:bg-purple-500/20 p-2">
														<FolderPlus className="size-5 text-purple-600 dark:text-purple-400" />
													</div>
													<span className="font-semibold text-sm">
														New Project
													</span>
												</div>
												<p className="text-xs text-muted-foreground">
													Start a new project for a client
												</p>
											</Link>
										</DropdownMenuItem>

										{/* Create Quote */}
										<DropdownMenuItem
											asChild
											className="p-0"
											onSelect={() => setOpenQuickActions(false)}
										>
											<Link
												href="/quotes/new"
												className="group relative flex w-full md:w-44 flex-col items-start gap-2 rounded-lg border bg-card p-3 shadow-sm hover:bg-accent hover:text-accent-foreground transition-all duration-200"
											>
												<div className="flex items-center gap-2">
													<div className="rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 p-2">
														<FilePlus className="size-5 text-emerald-600 dark:text-emerald-400" />
													</div>
													<span className="font-semibold text-sm">New Quote</span>
												</div>
												<p className="text-xs text-muted-foreground">
													Create a quote for a project
												</p>
											</Link>
										</DropdownMenuItem>

										{/* Create Task */}
										<DropdownMenuItem
											className="p-0"
											onSelect={(e) => {
												e.preventDefault();
												setTaskSheetOpen(true);
												setOpenQuickActions(false);
											}}
										>
											<button
												type="button"
												className="group relative flex w-full md:w-44 flex-col items-start gap-2 rounded-lg border bg-card p-3 shadow-sm hover:bg-accent hover:text-accent-foreground transition-all duration-200"
											>
												<div className="flex items-center gap-2">
													<div className="rounded-lg bg-amber-500/10 dark:bg-amber-500/20 p-2">
														<CheckSquare className="size-5 text-amber-600 dark:text-amber-400" />
													</div>
													<span className="font-semibold text-sm">New Task</span>
												</div>
												<p className="text-xs text-muted-foreground">
													Add a task to your schedule
												</p>
											</button>
										</DropdownMenuItem>
									</div>
								</DropdownMenuContent>
							</DropdownMenu>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>
			)}

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
											<SidebarMenuButton
												tooltip={item.title}
												isActive={item.isActive}
											>
												{item.icon && <item.icon />}
												<span>{item.title}</span>
												<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
											</SidebarMenuButton>
										</CollapsibleTrigger>
										<CollapsibleContent>
											<SidebarMenuSub>
												{item.items.map((subItem) => (
													<SidebarMenuSubItem key={subItem.title}>
														<SidebarMenuSubButton
															asChild
															isActive={subItem.isActive}
														>
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
								{typeof item.badgeCount === "number" && item.badgeCount > 0 && (
									<SidebarMenuBadge
										className={cn(
											item.badgeVariant === "alert" &&
												"bg-red-500 text-white ring-2 ring-red-300 shadow-[0_0_0_2px_rgba(255,255,255,0.35)]"
										)}
									>
										{item.badgeCount}
									</SidebarMenuBadge>
								)}
							</SidebarMenuItem>
						);
					})}
				</SidebarMenu>
			</SidebarGroup>

			{/* Task Sheet for Quick Action */}
			<TaskSheet
				mode="create"
				isOpen={taskSheetOpen}
				onOpenChange={setTaskSheetOpen}
			/>
		</>
	);
}
