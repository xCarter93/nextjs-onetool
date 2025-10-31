"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * StyledInput - A wrapper around the base Input component with consistent styling
 */
export function StyledInput({
	className,
	...props
}: React.ComponentProps<typeof Input>) {
	return (
		<Input
			className={cn(
				"transition-all duration-200 focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/30",
				className
			)}
			{...props}
		/>
	);
}
