/**
 * Shared utilities that are truly reusable across all document types
 * Only contains table-agnostic helper functions
 */

/**
 * Generate a random public token for public access
 * Used by quotes and invoices for client-facing URLs
 */
export function generatePublicToken(): string {
	return (
		Math.random().toString(36).substring(2, 15) +
		Math.random().toString(36).substring(2, 15)
	);
}

/**
 * Common validation patterns
 */
export const ValidationPatterns = {
	/**
	 * Validate email format
	 */
	isValidEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	},

	/**
	 * Validate phone number (basic format)
	 */
	isValidPhone(phone: string): boolean {
		const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
		return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
	},

	/**
	 * Sanitize string input
	 */
	sanitizeString(input: string): string {
		return input.trim().replace(/\s+/g, " ");
	},
};

/**
 * Common date utilities
 */
export const DateUtils = {
	/**
	 * Get start of day timestamp
	 */
	startOfDay(timestamp: number): number {
		const date = new Date(timestamp);
		date.setHours(0, 0, 0, 0);
		return date.getTime();
	},

	/**
	 * Get end of day timestamp
	 */
	endOfDay(timestamp: number): number {
		const date = new Date(timestamp);
		date.setHours(23, 59, 59, 999);
		return date.getTime();
	},

	/**
	 * Add days to timestamp
	 */
	addDays(timestamp: number, days: number): number {
		return timestamp + days * 24 * 60 * 60 * 1000;
	},

	/**
	 * Check if timestamp is within the last N days
	 */
	isWithinLastDays(timestamp: number, days: number): boolean {
		const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
		return timestamp > cutoff;
	},
};

/**
 * Common business logic helpers
 */
export const BusinessUtils = {
	/**
	 * Calculate percentage
	 */
	calculatePercentage(part: number, total: number): number {
		if (total === 0) return 0;
		return Math.round((part / total) * 100);
	},

	/**
	 * Format currency (basic formatting)
	 */
	formatCurrency(amount: number, currency = "USD"): string {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency,
		}).format(amount);
	},

	/**
	 * Calculate tax amount
	 */
	calculateTax(subtotal: number, taxRate: number): number {
		return Math.round(subtotal * (taxRate / 100) * 100) / 100;
	},

	/**
	 * Apply discount
	 */
	applyDiscount(
		amount: number,
		discount: number,
		isPercentage: boolean
	): number {
		if (isPercentage) {
			return Math.round(amount * (1 - discount / 100) * 100) / 100;
		}
		return Math.max(0, amount - discount);
	},
};
