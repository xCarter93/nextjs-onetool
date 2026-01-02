"use client";

import * as React from "react";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";

/**
 * StyledBadge - A wrapper around the base Badge component with consistent styling
 * Maintains all variant functionality from the base component
 */
export function StyledBadge({
	className,
	variant,
	...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
	return (
		<Badge
			className={cn("transition-all duration-200", className)}
			variant={variant}
			{...props}
		/>
	);
}

export { badgeVariants };
