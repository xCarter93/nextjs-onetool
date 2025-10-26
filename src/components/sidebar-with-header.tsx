"use client";

import { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { PlanBadge } from "@/components/plan-badge";
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
					className="sticky top-0 z-50 isolate overflow-hidden backdrop-blur-xl bg-background/80 dark:bg-background/80 border-b border-border/40 dark:border-border/20 transition-all duration-200"
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
				>
					{/* Subtle ambient lighting */}
					<div className="absolute inset-0 bg-gradient-to-r from-primary/2 via-transparent to-primary/2" />

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
							<div className="relative flex items-center gap-3">
								{/* Status Indicator with glossy overlay */}
								<div className="relative flex items-center gap-3 bg-card/30 dark:bg-card/10 backdrop-blur-sm border border-border/30 dark:border-border/20 rounded-full px-4 py-2 shadow-sm">
									<div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-white/10 via-white/5 to-transparent dark:from-white/5 dark:via-white/2 dark:to-transparent" />
									<div className="relative flex items-center gap-2">
										<span className="relative inline-flex h-2.5 w-2.5">
											<span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 blur-sm" />
											<span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 animate-pulse" />
										</span>
										<span className="text-sm font-medium text-foreground/80">
											All systems operational
										</span>
									</div>
								</div>
							</div>
						</motion.div>

						{/* Right Section - Plan Badge & Theme Switcher */}
						<div className="flex items-center gap-3">
							<PlanBadge />
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								transition={{ type: "spring", stiffness: 400, damping: 17 }}
							>
								<ThemeSwitcher className="group relative bg-card/50 hover:bg-card/80 dark:bg-card/20 dark:hover:bg-card/40 border border-border/40 dark:border-border/20 hover:border-border/60 dark:hover:border-border/40 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ring-0 hover:ring-2 hover:ring-primary/20 dark:hover:ring-primary/30" />
							</motion.div>
						</div>
					</div>

					{/* Bottom Border Gradient */}
					<div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
				</motion.header>

				<div className="flex flex-1 flex-col gap-4 pt-0">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
