import { ReactNode } from "react";
import { useSidebar } from "@/components/ui/sidebar";

interface ButtonConfig {
	label: string;
	onClick?: () => void;
	intent?:
		| "primary"
		| "outline"
		| "secondary"
		| "warning"
		| "danger"
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
								.map((button, index) => {
									// Generate button styling based on intent
									const getButtonStyling = (intent: string) => {
										const baseClasses =
											"group inline-flex items-center gap-2 text-sm font-semibold transition-all duration-200 px-4 py-2 rounded-lg ring-1 shadow-sm hover:shadow-md backdrop-blur-sm";

										switch (intent) {
											case "primary":
												return `${baseClasses} text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/15 ring-primary/30 hover:ring-primary/40`;
											case "success":
												return `${baseClasses} text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 ring-green-200 hover:ring-green-300 dark:text-green-400 dark:hover:text-green-300 dark:bg-green-950 dark:hover:bg-green-900 dark:ring-green-800 dark:hover:ring-green-700`;
											case "destructive":
											case "danger":
												return `${baseClasses} text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 ring-red-200 hover:ring-red-300 dark:text-red-400 dark:hover:text-red-300 dark:bg-red-950 dark:hover:bg-red-900 dark:ring-red-800 dark:hover:ring-red-700`;
											case "warning":
												return `${baseClasses} text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 ring-amber-200 hover:ring-amber-300 dark:text-amber-400 dark:hover:text-amber-300 dark:bg-amber-950 dark:hover:bg-amber-900 dark:ring-amber-800 dark:hover:ring-amber-700`;
											case "secondary":
												return `${baseClasses} text-gray-600 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 ring-gray-200 hover:ring-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:ring-gray-700 dark:hover:ring-gray-600`;
											case "outline":
											default:
												return `${baseClasses} text-gray-600 hover:text-gray-700 bg-white hover:bg-gray-50 ring-gray-200 hover:ring-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:bg-gray-900 dark:hover:bg-gray-800 dark:ring-gray-700 dark:hover:ring-gray-600`;
										}
									};

									const buttonClasses = getButtonStyling(
										button.intent || "outline"
									);
									const isLoading = button.isLoading || false;
									const isDisabled = button.disabled || isLoading;

									return (
										<button
											key={`left-${index}`}
											onClick={button.onClick}
											disabled={isDisabled}
											type={button.type || "button"}
											className={`${buttonClasses} ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
										>
											{button.icon}
											{isLoading ? "Loading..." : button.label}
											{!isLoading && (
												<span
													aria-hidden="true"
													className="group-hover:translate-x-1 transition-transform duration-200"
												>
													→
												</span>
											)}
										</button>
									);
								})}
						</div>

						{/* Right side buttons */}
						<div className="flex items-center gap-x-3 flex-wrap">
							{buttonConfigs
								.filter((button) => button.position === "right")
								.map((button, index) => {
									// Generate button styling based on intent
									const getButtonStyling = (intent: string) => {
										const baseClasses =
											"group inline-flex items-center gap-2 text-sm font-semibold transition-all duration-200 px-4 py-2 rounded-lg ring-1 shadow-sm hover:shadow-md backdrop-blur-sm";

										switch (intent) {
											case "primary":
												return `${baseClasses} text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/15 ring-primary/30 hover:ring-primary/40`;
											case "success":
												return `${baseClasses} text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 ring-green-200 hover:ring-green-300 dark:text-green-400 dark:hover:text-green-300 dark:bg-green-950 dark:hover:bg-green-900 dark:ring-green-800 dark:hover:ring-green-700`;
											case "destructive":
											case "danger":
												return `${baseClasses} text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 ring-red-200 hover:ring-red-300 dark:text-red-400 dark:hover:text-red-300 dark:bg-red-950 dark:hover:bg-red-900 dark:ring-red-800 dark:hover:ring-red-700`;
											case "warning":
												return `${baseClasses} text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 ring-amber-200 hover:ring-amber-300 dark:text-amber-400 dark:hover:text-amber-300 dark:bg-amber-950 dark:hover:bg-amber-900 dark:ring-amber-800 dark:hover:ring-amber-700`;
											case "secondary":
												return `${baseClasses} text-gray-600 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 ring-gray-200 hover:ring-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:ring-gray-700 dark:hover:ring-gray-600`;
											case "outline":
											default:
												return `${baseClasses} text-gray-600 hover:text-gray-700 bg-white hover:bg-gray-50 ring-gray-200 hover:ring-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:bg-gray-900 dark:hover:bg-gray-800 dark:ring-gray-700 dark:hover:ring-gray-600`;
										}
									};

									const buttonClasses = getButtonStyling(
										button.intent || "outline"
									);
									const isLoading = button.isLoading || false;
									const isDisabled = button.disabled || isLoading;

									return (
										<button
											key={`right-${index}`}
											onClick={button.onClick}
											disabled={isDisabled}
											type={button.type || "button"}
											className={`${buttonClasses} ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
										>
											{button.icon}
											{isLoading ? "Loading..." : button.label}
											{!isLoading && (
												<span
													aria-hidden="true"
													className="group-hover:translate-x-1 transition-transform duration-200"
												>
													→
												</span>
											)}
										</button>
									);
								})}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
