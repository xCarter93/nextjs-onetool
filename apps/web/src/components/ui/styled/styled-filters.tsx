"use client";

import type React from "react";
import { Filters, type FiltersProps, type Filter, type FilterFieldConfig } from "@/components/ui/filters";

/**
 * StyledFilters - A styled wrapper around the base Filters component
 * Applies consistent styling patterns from the unified design system
 */

export interface StyledFiltersProps<T = unknown> extends Omit<FiltersProps<T>, "variant" | "size" | "radius"> {
  // Override styling props with our defaults
  variant?: "solid" | "outline";
  size?: "sm" | "md" | "lg";
  radius?: "md" | "full";
}

export function StyledFilters<T = unknown>({
  variant = "outline",
  size = "md",
  radius = "md",
  className = "",
  addButtonClassName = "",
  ...props
}: StyledFiltersProps<T>) {
  return (
    <Filters<T>
      variant={variant}
      size={size}
      radius={radius}
      className={className}
      addButtonClassName={addButtonClassName}
      {...props}
    />
  );
}

// Re-export types for convenience
export type { Filter, FilterFieldConfig };
export { createFilter } from "@/components/ui/filters";

