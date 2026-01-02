"use client";

import * as React from "react";
import {
	Select,
	SelectGroup,
	SelectValue,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectLabel,
	SelectSeparator,
	SelectScrollUpButton,
	SelectScrollDownButton,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/**
 * StyledSelect - A wrapper around the base Select component with consistent styling
 */
export function StyledSelect({
	...props
}: React.ComponentProps<typeof Select>) {
	return <Select {...props} />;
}

export function StyledSelectTrigger({
	className,
	...props
}: React.ComponentProps<typeof SelectTrigger>) {
	return (
		<SelectTrigger
			className={cn(
				"transition-all duration-200 focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/30",
				className
			)}
			{...props}
		/>
	);
}

export function StyledSelectContent({
	className,
	...props
}: React.ComponentProps<typeof SelectContent>) {
	return (
		<SelectContent
			className={cn(
				"backdrop-blur-md bg-background/95 dark:bg-background/95",
				className
			)}
			{...props}
		/>
	);
}

// Re-export other select components as-is
export {
	SelectGroup,
	SelectValue,
	SelectItem,
	SelectLabel,
	SelectSeparator,
	SelectScrollUpButton,
	SelectScrollDownButton,
};

