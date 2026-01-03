"use client";

import {
	FiltersWithClear,
	type FiltersWithClearProps,
} from "@/components/filters/radius-full";
import type { Filter, FilterFieldConfig } from "@/components/ui/filters";

/**
 * StyledFilters - A styled wrapper around the FiltersWithClear component
 * Applies consistent styling patterns from the unified design system
 * Based on the radius-full.tsx component
 */

export function StyledFilters<T = unknown>({
	variant = "outline",
	size = "md",
	radius = "full",
	showClearButton = true,
	...props
}: FiltersWithClearProps<T>) {
	return (
		<FiltersWithClear<T>
			variant={variant}
			size={size}
			radius={radius}
			showClearButton={showClearButton}
			{...props}
		/>
	);
}

// Re-export types for convenience
export type {
	Filter,
	FilterFieldConfig,
	FiltersWithClearProps as StyledFiltersProps,
};
export { createFilter } from "@/components/ui/filters";
