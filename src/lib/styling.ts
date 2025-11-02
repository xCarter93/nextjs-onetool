/**
 * Styling utilities for consistent application styling
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Common styling patterns used throughout the application
 */
export const stylingPatterns = {
	/**
	 * Glassmorphism card styling
	 */
	glassCard:
		"group relative backdrop-blur-md overflow-hidden ring-1 ring-border/20 dark:ring-border/40",
	
	/**
	 * Glassmorphism gradient overlay
	 */
	glassOverlay:
		"absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent dark:from-white/5 dark:via-white/2 dark:to-transparent rounded-2xl pointer-events-none",
	
	/**
	 * Consistent button styling
	 */
	buttonBase:
		"group inline-flex items-center gap-2 font-semibold transition-all duration-200 rounded-lg ring-1 shadow-sm hover:shadow-md backdrop-blur-sm",
	
	/**
	 * Page header styling
	 */
	pageHeader:
		"flex items-center gap-3",
	
	/**
	 * Page header accent bar
	 */
	pageHeaderAccent:
		"w-1.5 h-6 bg-gradient-to-b from-primary to-primary/60 rounded-full",
	
	/**
	 * Page title styling
	 */
	pageTitle:
		"text-2xl font-bold text-foreground",
	
	/**
	 * Page description styling
	 */
	pageDescription:
		"text-muted-foreground text-sm",
} as const;

/**
 * Intent variants for buttons and other components
 */
export const intentVariants = {
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
} as const;

/**
 * Size variants for components
 */
export const sizeVariants = {
	sm: "text-xs px-3 py-1.5",
	md: "text-sm px-4 py-2",
	lg: "text-base px-5 py-2.5",
} as const;

/**
 * Utility function to merge class names
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Helper to generate page header structure
 */
export function getPageHeaderClasses() {
	return {
		container: stylingPatterns.pageHeader,
		accent: stylingPatterns.pageHeaderAccent,
		title: stylingPatterns.pageTitle,
		description: stylingPatterns.pageDescription,
	};
}

/**
 * Helper to generate glass card classes
 */
export function getGlassCardClasses() {
	return {
		card: stylingPatterns.glassCard,
		overlay: stylingPatterns.glassOverlay,
	};
}

/**
 * Helper to generate button classes with intent
 */
export function getButtonClasses(intent: keyof typeof intentVariants, size: keyof typeof sizeVariants = "md") {
	return `${stylingPatterns.buttonBase} ${intentVariants[intent]} ${sizeVariants[size]}`;
}

