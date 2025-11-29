"use client";

import { ReactNode } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { PlanBadge } from "@/components/layout/plan-badge";
import { NotificationBell } from "@/components/layout/notification-bell";
import { ServiceStatusBadge } from "@/components/layout/service-status-badge";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { motion } from "motion/react";

interface SidebarWithHeaderProps {
	children: ReactNode;
}

export function SidebarWithHeader({ children }: SidebarWithHeaderProps) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				{/* Modern Header with Enhanced Design */}
				<motion.header
					className="sticky top-0 z-30 isolate overflow-hidden backdrop-blur-xl bg-background/95 dark:bg-background/90 border-b border-border/60 dark:border-border/40 shadow-sm dark:shadow-md transition-all duration-200"
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
				>
					{/* Enhanced ambient lighting for better separation */}
					<div className="absolute inset-0 bg-linear-to-r from-primary/3 via-transparent to-primary/3 dark:from-primary/5 dark:via-transparent dark:to-primary/5" />

					{/* Header Content */}
					<div className="relative flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
						{/* Left Section - Sidebar Trigger */}
						<div className="flex items-center gap-4">
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								transition={{ type: "spring", stiffness: 400, damping: 17 }}
							>
								<SidebarTrigger
									size="sq-lg"
									className="group relative bg-card/50 hover:bg-card/80 dark:bg-card/20 dark:hover:bg-card/40 border border-border/40 dark:border-border/20 hover:border-border/60 dark:hover:border-border/40 rounded-xl p-2.5 shadow-sm hover:shadow-md transition-all duration-200 ring-0 hover:ring-2 hover:ring-primary/20 dark:hover:ring-primary/30"
								/>
							</motion.div>
						</div>

						{/* Center Section - Brand/Status */}
						<motion.div
							className="flex-1 flex items-center justify-center"
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.3, delay: 0.1 }}
						>
							<ServiceStatusBadge />
						</motion.div>

						{/* Right Section - Plan Badge, Notifications & Theme Switcher */}
						<div className="flex items-center gap-3">
							<PlanBadge />
							<NotificationBell />
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								transition={{ type: "spring", stiffness: 400, damping: 17 }}
							>
								<ThemeSwitcher className="group relative bg-card/50 hover:bg-card/80 dark:bg-card/20 dark:hover:bg-card/40 border border-border/40 dark:border-border/20 hover:border-border/60 dark:hover:border-border/40 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ring-0 hover:ring-2 hover:ring-primary/20 dark:hover:ring-primary/30" />
							</motion.div>
						</div>
					</div>

					{/* Enhanced bottom border gradient for clearer separation */}
					<div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border/80 dark:via-border/60 to-transparent" />
				</motion.header>

				<div className="flex flex-1 flex-col gap-4 pt-0">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
