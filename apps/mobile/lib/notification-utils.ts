/**
 * Utility functions for notifications - mobile version
 */

/**
 * Format timestamp as relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(timestamp: number): string {
	const now = Date.now();
	const diff = now - timestamp;

	const seconds = Math.floor(diff / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);
	const weeks = Math.floor(days / 7);
	const months = Math.floor(days / 30);
	const years = Math.floor(days / 365);

	if (seconds < 60) {
		return "just now";
	} else if (minutes < 60) {
		return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
	} else if (hours < 24) {
		return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
	} else if (days < 7) {
		return `${days} ${days === 1 ? "day" : "days"} ago`;
	} else if (weeks < 4) {
		return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
	} else if (months < 12) {
		return `${months} ${months === 1 ? "month" : "months"} ago`;
	} else {
		return `${years} ${years === 1 ? "year" : "years"} ago`;
	}
}

/**
 * Strip author ID prefix from notification message
 * Messages are stored as "authorId:message" internally
 */
export function stripAuthorIdFromMessage(message: string): string {
	const colonIndex = message.indexOf(":");
	if (colonIndex > 0) {
		// Check if the part before colon looks like an ID (starts with 'j' and is long)
		const prefix = message.substring(0, colonIndex);
		if (prefix.length > 20 && /^[a-z0-9]+$/.test(prefix)) {
			return message.substring(colonIndex + 1);
		}
	}
	return message;
}

/**
 * Truncate text to a specific length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
	if (text.length <= maxLength) {
		return text;
	}
	return text.slice(0, maxLength).trim() + "...";
}
