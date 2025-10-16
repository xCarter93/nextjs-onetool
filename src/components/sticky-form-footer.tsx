import { ReactNode } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { StyledButton } from "@/components/ui/styled-button";

interface ButtonConfig {
	label: string;
	onClick?: () => void;
	intent?:
		| "primary"
		| "outline"
		| "secondary"
		| "warning"
		| "plain"
		| "success"
		| "destructive";
	size?: "sm" | "md" | "lg";
	icon?: ReactNode;
	isLoading?: boolean;
	disabled?: boolean;
	type?: "button" | "submit";
	position?: "left" | "right";
}

interface StickyFormFooterProps {
	buttons?: ButtonConfig[];
	// Legacy props for backward compatibility
	onCancel?: () => void;
	onSave?: () => void;
	cancelText?: string;
	saveText?: string;
	isLoading?: boolean;
	className?: string;
	fullWidth?: boolean;
}

export function StickyFormFooter({
	buttons,
	onCancel,
	onSave,
	cancelText = "Cancel",
	saveText = "Save",
	isLoading = false,
	className = "",
	fullWidth = false,
}: StickyFormFooterProps) {
	const sidebar = useSidebar();

	// Use new button config if provided, otherwise fall back to legacy props
	const buttonConfigs: ButtonConfig[] = buttons || [
		...(onCancel
			? [
					{
						label: cancelText,
						onClick: onCancel,
						intent: "outline" as const,
						disabled: isLoading,
					},
				]
			: []),
		...(onSave
			? [
					{
						label: isLoading ? "Saving..." : saveText,
						onClick: onSave,
						intent: "primary" as const,
						type: "submit" as const,
						disabled: isLoading,
					},
				]
			: []),
	];

	if (buttonConfigs.length === 0) return null;

	// Calculate sidebar width based on state
	const getSidebarWidth = () => {
		if (!fullWidth || !sidebar || sidebar.isMobile) return "0px";
		return sidebar.state === "expanded"
			? "var(--sidebar-width, 18rem)"
			: "var(--sidebar-width-icon, 3rem)";
	};

	return (
		<div
			className={`${fullWidth ? "fixed right-0" : "sticky"} bottom-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg ${className} transition-[left] duration-200 ease-linear`}
			style={fullWidth ? { left: getSidebarWidth() } : undefined}
		>
			<div className={fullWidth ? "w-full px-6" : "w-full px-6"}>
				<div className="w-full">
					<div className="flex items-center justify-between gap-x-3 py-4 flex-wrap">
						{/* Left side buttons */}
						<div className="flex items-center gap-x-3 flex-wrap">
							{buttonConfigs
								.filter(
									(button) => !button.position || button.position === "left"
								)
								.map((button, index) => (
									<StyledButton
										key={`left-${index}`}
										label={button.label}
										onClick={button.onClick}
										intent={button.intent}
										size={button.size}
										icon={button.icon}
										isLoading={button.isLoading}
										disabled={button.disabled}
										type={button.type}
									/>
								))}
						</div>

						{/* Right side buttons */}
						<div className="flex items-center gap-x-3 flex-wrap">
							{buttonConfigs
								.filter((button) => button.position === "right")
								.map((button, index) => (
									<StyledButton
										key={`right-${index}`}
										label={button.label}
										onClick={button.onClick}
										intent={button.intent}
										size={button.size}
										icon={button.icon}
										isLoading={button.isLoading}
										disabled={button.disabled}
										type={button.type}
									/>
								))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
