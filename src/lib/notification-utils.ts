/**
 * Utility functions for notifications
 */

/**
 * Build entity URL based on type and ID
 */
export function buildEntityUrl(
	entityType: "client" | "project" | "quote",
	entityId: string
): string {
	return `/${entityType}s/${entityId}`;
}

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
 * Parse message to extract @mentioned user
 * Returns the userId if found, or null
 */
export function parseMessageForMention(
	message: string
): { userId: string; displayText: string } | null {
	// Look for @[userId:displayName] pattern
	const mentionRegex = /@\[([^:]+):([^\]]+)\]/;
	const match = message.match(mentionRegex);

	if (match) {
		return {
			userId: match[1],
			displayText: match[2],
		};
	}

	return null;
}

/**
 * Format message for display (convert @mentions to readable format)
 * This handles backwards compatibility with old format @[userId:displayName]
 * and passes through the new format @displayName as-is
 */
export function formatMessageForDisplay(message: string): string {
	// Replace old format @[userId:displayName] with @displayName (backwards compatibility)
	return message.replace(/@\[([^:]+):([^\]]+)\]/g, "@$2");
	// New format @displayName is already correct and will pass through unchanged
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
 * Parse @mentions in text and return parts with mention indicators
 * Uses a special delimiter format: @[username] to identify actual mentions
 * This allows us to distinguish between selected mentions and random @ text
 */
export function parseMessageParts(message: string): Array<{ text: string; isMention: boolean }> {
	const parts: Array<{ text: string; isMention: boolean }> = [];
	// Match @[username] format - this is how we store actual mentions
	// Supports usernames with spaces, dots, hyphens, @ symbols, and underscores
	const mentionRegex = /@\[([^\]]+)\]/g;
	let lastIndex = 0;
	let match;

	while ((match = mentionRegex.exec(message)) !== null) {
		// Add text before mention
		if (match.index > lastIndex) {
			parts.push({
				text: message.substring(lastIndex, match.index),
				isMention: false,
			});
		}
		
		// Add mention - just the username without @[]
		parts.push({
			text: `@${match[1]}`,
			isMention: true,
		});
		
		lastIndex = match.index + match[0].length;
	}
	
	// Add remaining text
	if (lastIndex < message.length) {
		parts.push({
			text: message.substring(lastIndex),
			isMention: false,
		});
	}
	
	return parts.length > 0 ? parts : [{ text: message, isMention: false }];
}

/**
 * Parse message for display (convert @[username] to @username)
 */
export function parseMessageForDisplay(message: string): string {
	return message.replace(/@\[([^\]]+)\]/g, "@$1");
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

