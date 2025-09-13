import type { ReactNode } from "react";
import { SidebarWithHeader } from "@/components/sidebar-with-header";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
	return <SidebarWithHeader>{children}</SidebarWithHeader>;
}
