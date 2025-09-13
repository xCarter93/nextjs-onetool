import { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeSwitcher } from "@/components/theme-switcher";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";

interface SidebarWithHeaderProps {
	children: ReactNode;
}

export function SidebarWithHeader({ children }: SidebarWithHeaderProps) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				{/* Header with banner and controls integrated */}
				<header className="sticky top-0 z-50 isolate overflow-hidden transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
					{/* Decorative background elements */}
					<div
						aria-hidden="true"
						className="absolute top-1/2 left-[max(-7rem,calc(50%-52rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl"
					>
						<div
							style={{
								clipPath:
									"polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
							}}
							className="aspect-577/310 w-144.25 bg-gradient-to-r from-primary to-primary/80 opacity-40"
						/>
					</div>
					<div
						aria-hidden="true"
						className="absolute top-1/2 left-[max(45rem,calc(50%+8rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl"
					>
						<div
							style={{
								clipPath:
									"polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
							}}
							className="aspect-577/310 w-144.25 bg-gradient-to-r from-primary to-primary/80 opacity-40"
						/>
					</div>

					{/* Banner background with controls overlay */}
					<div className="relative isolate flex items-center gap-x-6 bg-slate-200 dark:bg-slate-700 px-6 py-2.5 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-gray-300/20 dark:after:bg-white/10">
						{/* Gradient overlay to maintain exact same look */}
						<div className="absolute inset-0 bg-gradient-conic from-blue-300 to-slate-300 dark:from-primary dark:to-slate-600"></div>
						{/* Sidebar trigger positioned within banner */}
						<div className="relative z-10">
							<SidebarTrigger className="text-gray-900 dark:text-gray-100 hover:text-gray-800 dark:hover:text-white bg-white/80 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/15 rounded-lg p-2 transition-all duration-200 border border-gray-300 dark:border-white/20 hover:border-gray-400 dark:hover:border-white/30 shadow-sm" />
						</div>

						{/* Banner content centered */}
						<div className="flex-1 flex items-center justify-center relative z-10">
							<p className="text-sm/6 text-gray-900 dark:text-gray-100">
								GeneriCon 2023 is on June 7 – 9 in Denver.{" "}
								<a
									href="#"
									className="font-semibold whitespace-nowrap text-gray-800 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
								>
									Get your ticket&nbsp;<span aria-hidden="true">&rarr;</span>
								</a>
							</p>
						</div>

						{/* Theme switcher positioned within banner */}
						<div className="relative z-10">
							<ThemeSwitcher className="border-gray-300 dark:border-white/20 text-gray-900 dark:text-gray-100 hover:bg-white/90 dark:hover:bg-white/15 hover:border-gray-400 dark:hover:border-white/30 bg-white/80 dark:bg-white/10 rounded-lg shadow-sm transition-all duration-200" />
						</div>
					</div>
				</header>
				<div className="flex flex-1 flex-col gap-4 pt-0">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
