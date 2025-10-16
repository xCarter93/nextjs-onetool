"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface StyledButtonProps {
	label?: string;
	onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
	intent?:
		| "primary"
		| "outline"
		| "secondary"
		| "warning"
		| "success"
		| "destructive"
		| "plain";
	size?: "sm" | "md" | "lg";
	icon?: ReactNode;
	isLoading?: boolean;
	disabled?: boolean;
	type?: "button" | "submit" | "reset";
	className?: string;
	showArrow?: boolean;
	children?: ReactNode;
}

export function StyledButton({
	label,
	onClick,
	intent = "outline",
	size = "md",
	icon,
	isLoading = false,
	disabled = false,
	type = "button",
	className = "",
	showArrow = true,
	children,
}: StyledButtonProps) {
	const getButtonStyling = (intent: string, size: string) => {
		// Base classes with shadow, backdrop blur, and hover effects
		const baseClasses =
			"group inline-flex items-center gap-2 font-semibold transition-all duration-200 rounded-lg ring-1 shadow-sm hover:shadow-md backdrop-blur-sm";

		// Size variants
		const sizeClasses = {
			sm: "text-xs px-3 py-1.5",
			md: "text-sm px-4 py-2",
			lg: "text-base px-5 py-2.5",
		};

		// Intent variants with beautiful colors
		const intentClasses = {
			primary:
				"text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/15 ring-primary/30 hover:ring-primary/40",
			success:
				"text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 ring-green-200 hover:ring-green-300 dark:text-green-400 dark:hover:text-green-300 dark:bg-green-950 dark:hover:bg-green-900 dark:ring-green-800 dark:hover:ring-green-700",
			destructive:
				"text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 ring-red-200 hover:ring-red-300 dark:text-red-400 dark:hover:text-red-300 dark:bg-red-950 dark:hover:bg-red-900 dark:ring-red-800 dark:hover:ring-red-700",
			warning:
				"text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 ring-amber-200 hover:ring-amber-300 dark:text-amber-400 dark:hover:text-amber-300 dark:bg-amber-950 dark:hover:bg-amber-900 dark:ring-amber-800 dark:hover:ring-amber-700",
			secondary:
				"text-gray-600 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 ring-gray-200 hover:ring-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:ring-gray-700 dark:hover:ring-gray-600",
			outline:
				"text-gray-600 hover:text-gray-700 bg-white hover:bg-gray-50 ring-gray-200 hover:ring-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:bg-gray-900 dark:hover:bg-gray-800 dark:ring-gray-700 dark:hover:ring-gray-600",
			plain:
				"text-gray-600 hover:text-gray-700 bg-transparent hover:bg-gray-50 ring-transparent hover:ring-gray-200 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800 dark:hover:ring-gray-700",
		};

		return cn(
			baseClasses,
			sizeClasses[size as keyof typeof sizeClasses],
			intentClasses[intent as keyof typeof intentClasses]
		);
	};

	const buttonClasses = getButtonStyling(intent, size);
	const isDisabled = disabled || isLoading;
	const displayText = isLoading ? "Loading..." : label || children;

	return (
		<button
			onClick={onClick}
			disabled={isDisabled}
			type={type}
			className={cn(
				buttonClasses,
				isDisabled && "opacity-50 cursor-not-allowed",
				className
			)}
		>
			{icon && <span className="shrink-0">{icon}</span>}
			{displayText}
			{!isLoading && showArrow && (
				<span
					aria-hidden="true"
					className="group-hover:translate-x-1 transition-transform duration-200"
				>
					→
				</span>
			)}
		</button>
	);
}
