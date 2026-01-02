"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavUser() {
	const { user } = useUser();

	if (!user) {
		return null;
	}

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton
					size="lg"
					className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground w-full cursor-pointer"
					onClick={(e) => {
						// Check if the click was on the UserButton or its children
						const userButtonElement = e.currentTarget.querySelector(
							".cl-userButtonAvatarImage"
						);
						const isClickOnUserButton =
							userButtonElement && userButtonElement.contains(e.target as Node);

						// If not clicking on the UserButton itself, trigger it programmatically
						if (!isClickOnUserButton && userButtonElement) {
							(userButtonElement as HTMLElement).click();
						}
						// If clicking on the UserButton, let it handle the click naturally
					}}
				>
					<div className="flex items-center gap-2">
						<UserButton
							appearance={{
								elements: {
									avatarBox: "h-8 w-8 rounded-lg",
									userButtonPopoverCard: "rounded-lg",
								},
							}}
						/>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-medium">
								{user.firstName} {user.lastName}
							</span>
							<span className="truncate text-xs">
								{user.primaryEmailAddress?.emailAddress}
							</span>
						</div>
					</div>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
