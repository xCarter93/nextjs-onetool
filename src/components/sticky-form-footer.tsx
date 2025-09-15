import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface ButtonConfig {
	label: string;
	onClick?: () => void;
	intent?: "primary" | "outline" | "secondary" | "warning" | "danger" | "plain";
	size?: "sm" | "md" | "lg";
	icon?: ReactNode;
	isLoading?: boolean;
	disabled?: boolean;
	type?: "button" | "submit";
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
}

export function StickyFormFooter({
	buttons,
	onCancel,
	onSave,
	cancelText = "Cancel",
	saveText = "Save",
	isLoading = false,
	className = "",
}: StickyFormFooterProps) {
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

	return (
		<div
			className={`sticky bottom-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg ${className}`}
		>
			<div className="w-full px-6">
				<div className="w-full">
					<div className="flex items-center justify-end gap-x-3 py-4 flex-wrap">
						{buttonConfigs.map((button, index) => (
							<Button
								key={index}
								intent={button.intent || "outline"}
								size={button.size || "sm"}
								onPress={button.onClick}
								isDisabled={button.disabled}
								type={button.type}
								className="flex items-center gap-2"
							>
								{button.icon}
								{button.label}
							</Button>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
