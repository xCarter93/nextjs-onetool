import type { ReactNode } from "react";
import { SidebarWithHeader } from "@/components/layout/sidebar-with-header";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
	return (
		<div className="min-h-[100vh] flex-1 md:min-h-min">
			{/* Modern Background with Subtle Texture */}
			<div className="relative bg-background min-h-[100vh]">
				{/* Ambient Light Effects */}
				<div className="absolute inset-0 overflow-hidden">
					<div className="absolute -inset-10 opacity-50">
						<div className="absolute top-0 -left-4 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
						<div className="absolute top-0 -right-4 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
						<div className="absolute -bottom-8 left-20 w-72 h-72 bg-primary/5 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
					</div>
				</div>

				{/* Subtle Grid Pattern */}
				<div
					className="absolute inset-0 bg-[linear-gradient(to_right,theme(colors.border)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.border)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.03] dark:opacity-[0.05]"
					style={{
						maskImage:
							"radial-gradient(ellipse at center, transparent 20%, black)",
						WebkitMaskImage:
							"radial-gradient(ellipse at center, transparent 20%, black)",
					}}
				/>

				<SidebarWithHeader>{children}</SidebarWithHeader>
			</div>
		</div>
	);
}
