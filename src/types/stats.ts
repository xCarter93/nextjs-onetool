/**
 * Shared types for statistics and metrics display
 */

/**
 * Represents a single statistic item with optional comparison to previous value
 */
export interface StatItem {
	name: string;
	stat: string;
	previousStat?: string;
	change?: string;
	changeType?: "increase" | "decrease" | "neutral";
	value?: string;
	subtitle?: string;
	icon: React.ComponentType<{ className?: string }>;
	isLoading?: boolean;
}
