/**
 * Secure error logging utility
 *
 * In production, this would send errors to your error reporting service
 * (e.g., Sentry, LogRocket, Rollbar, etc.)
 *
 * For now, it logs at debug level in development and can be configured
 * to send to an error reporting service in production.
 */

interface ErrorContext {
	userId?: string;
	action?: string;
	metadata?: Record<string, unknown>;
}

/**
 * Log an error securely
 * @param error - The error object or message
 * @param context - Additional context about the error
 */
export function logError(error: unknown, context?: ErrorContext): void {
	const errorMessage = error instanceof Error ? error.message : String(error);
	const errorStack = error instanceof Error ? error.stack : undefined;

	// In development, log to console for debugging
	if (process.env.NODE_ENV === "development") {
		console.error("[Error Logger]", {
			message: errorMessage,
			stack: errorStack,
			context,
			timestamp: new Date().toISOString(),
		});
	}

	// In production, send to error reporting service
	// Example: Sentry.captureException(error, { extra: context });
	// Example: LogRocket.captureException(error, { extra: context });

	// For now, we'll just log at a lower level
	if (process.env.NODE_ENV === "production") {
		// Send to your error reporting service here
		// This prevents exposing sensitive error details to the browser console
		// Placeholder for error reporting service integration
		// errorReportingService.captureException(error, {
		//   user: context?.userId,
		//   tags: { action: context?.action },
		//   extra: context?.metadata,
		// });
	}
}

/**
 * Get a user-friendly error message
 * @param error - The error object
 * @returns A safe error message to display to users
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
	if (error instanceof Error) {
		// In production, you might want to return a generic message
		// unless it's a known user-facing error
		return error.message;
	}
	return "An unexpected error occurred";
}

/**
 * Check if an error is a specific type of known error
 * @param error - The error to check
 * @param errorType - The error type to check against
 */
export function isErrorOfType(error: unknown, errorType: string): boolean {
	return error instanceof Error && error.name === errorType;
}
