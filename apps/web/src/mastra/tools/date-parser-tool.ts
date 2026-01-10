import { createTool } from "@mastra/core/tools";
import { z } from "zod";

/**
 * Date Parser Tool
 * Converts natural language date expressions to Unix timestamps in milliseconds.
 * This tool helps the AI agent reliably parse dates without doing manual calculations.
 */

// Common date formats and patterns
const MONTH_NAMES: Record<string, number> = {
	january: 0, jan: 0,
	february: 1, feb: 1,
	march: 2, mar: 2,
	april: 3, apr: 3,
	may: 4,
	june: 5, jun: 5,
	july: 6, jul: 6,
	august: 7, aug: 7,
	september: 8, sep: 8, sept: 8,
	october: 9, oct: 9,
	november: 10, nov: 10,
	december: 11, dec: 11,
};

function parseNaturalDate(dateString: string): Date | null {
	const input = dateString.toLowerCase().trim();
	const now = new Date();

	// Handle relative dates
	if (input === "today") {
		return new Date(now.getFullYear(), now.getMonth(), now.getDate());
	}
	if (input === "yesterday") {
		return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
	}
	if (input === "tomorrow") {
		return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
	}

	// Handle "last N days/weeks/months"
	const lastMatch = input.match(/last\s+(\d+)\s+(day|week|month|year)s?/);
	if (lastMatch) {
		const amount = parseInt(lastMatch[1], 10);
		const unit = lastMatch[2];
		const result = new Date(now);
		switch (unit) {
			case "day":
				result.setDate(result.getDate() - amount);
				break;
			case "week":
				result.setDate(result.getDate() - amount * 7);
				break;
			case "month":
				result.setMonth(result.getMonth() - amount);
				break;
			case "year":
				result.setFullYear(result.getFullYear() - amount);
				break;
		}
		result.setHours(0, 0, 0, 0);
		return result;
	}

	// Handle "N days/weeks/months ago"
	const agoMatch = input.match(/(\d+)\s+(day|week|month|year)s?\s+ago/);
	if (agoMatch) {
		const amount = parseInt(agoMatch[1], 10);
		const unit = agoMatch[2];
		const result = new Date(now);
		switch (unit) {
			case "day":
				result.setDate(result.getDate() - amount);
				break;
			case "week":
				result.setDate(result.getDate() - amount * 7);
				break;
			case "month":
				result.setMonth(result.getMonth() - amount);
				break;
			case "year":
				result.setFullYear(result.getFullYear() - amount);
				break;
		}
		result.setHours(0, 0, 0, 0);
		return result;
	}

	// Handle "start of this month/year/quarter"
	if (input.includes("start of this month") || input === "this month start") {
		return new Date(now.getFullYear(), now.getMonth(), 1);
	}
	if (input.includes("start of this year") || input === "this year start") {
		return new Date(now.getFullYear(), 0, 1);
	}
	if (input.includes("start of this quarter")) {
		const quarter = Math.floor(now.getMonth() / 3);
		return new Date(now.getFullYear(), quarter * 3, 1);
	}

	// Handle "end of this month/year"
	if (input.includes("end of this month") || input === "this month end") {
		return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
	}
	if (input.includes("end of this year") || input === "this year end") {
		return new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
	}

	// Handle specific date formats
	// "Month Day, Year" (e.g., "December 1, 2025")
	const monthDayYearMatch = input.match(/([a-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s*(\d{4})/);
	if (monthDayYearMatch) {
		const month = MONTH_NAMES[monthDayYearMatch[1]];
		const day = parseInt(monthDayYearMatch[2], 10);
		const year = parseInt(monthDayYearMatch[3], 10);
		if (month !== undefined && day >= 1 && day <= 31 && year >= 1900 && year <= 2100) {
			return new Date(year, month, day);
		}
	}

	// "Day Month Year" (e.g., "1 December 2025")
	const dayMonthYearMatch = input.match(/(\d{1,2})(?:st|nd|rd|th)?\s+([a-z]+),?\s*(\d{4})/);
	if (dayMonthYearMatch) {
		const day = parseInt(dayMonthYearMatch[1], 10);
		const month = MONTH_NAMES[dayMonthYearMatch[2]];
		const year = parseInt(dayMonthYearMatch[3], 10);
		if (month !== undefined && day >= 1 && day <= 31 && year >= 1900 && year <= 2100) {
			return new Date(year, month, day);
		}
	}

	// "Month Year" (e.g., "December 2025" - assumes first of month)
	const monthYearMatch = input.match(/([a-z]+)\s+(\d{4})/);
	if (monthYearMatch) {
		const month = MONTH_NAMES[monthYearMatch[1]];
		const year = parseInt(monthYearMatch[2], 10);
		if (month !== undefined && year >= 1900 && year <= 2100) {
			return new Date(year, month, 1);
		}
	}

	// ISO format or slash format (YYYY-MM-DD or MM/DD/YYYY)
	const isoMatch = input.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
	if (isoMatch) {
		const year = parseInt(isoMatch[1], 10);
		const month = parseInt(isoMatch[2], 10) - 1;
		const day = parseInt(isoMatch[3], 10);
		return new Date(year, month, day);
	}

	const slashMatch = input.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
	if (slashMatch) {
		const month = parseInt(slashMatch[1], 10) - 1;
		const day = parseInt(slashMatch[2], 10);
		const year = parseInt(slashMatch[3], 10);
		return new Date(year, month, day);
	}

	// Q1/Q2/Q3/Q4 Year (e.g., "Q4 2025")
	const quarterMatch = input.match(/q([1-4])\s*(\d{4})/);
	if (quarterMatch) {
		const quarter = parseInt(quarterMatch[1], 10);
		const year = parseInt(quarterMatch[2], 10);
		const startMonth = (quarter - 1) * 3;
		return new Date(year, startMonth, 1);
	}

	return null;
}

function getEndOfPeriod(dateString: string, startDate: Date): Date | null {
	const input = dateString.toLowerCase().trim();

	// If it's a quarter reference, return end of quarter
	const quarterMatch = input.match(/q([1-4])\s*(\d{4})/);
	if (quarterMatch) {
		const quarter = parseInt(quarterMatch[1], 10);
		const year = parseInt(quarterMatch[2], 10);
		const endMonth = quarter * 3;
		return new Date(year, endMonth, 0, 23, 59, 59, 999);
	}

	// If it's just "Month Year", return end of that month
	const monthYearMatch = input.match(/^([a-z]+)\s+(\d{4})$/);
	if (monthYearMatch) {
		const month = MONTH_NAMES[monthYearMatch[1]];
		const year = parseInt(monthYearMatch[2], 10);
		if (month !== undefined) {
			return new Date(year, month + 1, 0, 23, 59, 59, 999);
		}
	}

	return null;
}

export const dateParserTool = createTool({
	id: "parse-date",
	description: `Converts natural language date expressions to Unix timestamps in milliseconds.
USE THIS TOOL whenever the user mentions specific dates in their report request.

Examples of inputs this tool handles:
- "December 1, 2025" → start timestamp for that date
- "November 2025" → start of November 2025
- "Q4 2025" → start and end of Q4 2025
- "last 30 days" → timestamp for 30 days ago
- "2 weeks ago" → timestamp for 2 weeks ago
- "today", "yesterday" → current/previous day timestamps

ALWAYS call this tool when you see date references in user prompts like:
- "starting on [date]"
- "from [date]"
- "since [date]"
- "[date] to [date]"
- "in [month] [year]"`,
	inputSchema: z.object({
		dateExpression: z
			.string()
			.describe("The natural language date expression to parse (e.g., 'December 1, 2025', 'last 30 days', 'Q4 2025')"),
		isEndDate: z
			.boolean()
			.optional()
			.default(false)
			.describe("If true, returns end of day/period timestamp (23:59:59.999) instead of start"),
	}),
	outputSchema: z.object({
		timestamp: z.number().describe("Unix timestamp in milliseconds"),
		isoDate: z.string().describe("ISO 8601 formatted date string"),
		humanReadable: z.string().describe("Human-readable date format"),
		success: z.boolean().describe("Whether parsing was successful"),
		errorMessage: z.string().optional().describe("Error message if parsing failed"),
	}),
	execute: async (input) => {
		const { dateExpression, isEndDate } = input;

		try {
			const parsedDate = parseNaturalDate(dateExpression);

			if (!parsedDate || isNaN(parsedDate.getTime())) {
				return {
					timestamp: 0,
					isoDate: "",
					humanReadable: "",
					success: false,
					errorMessage: `Could not parse date expression: "${dateExpression}". Try formats like "December 1, 2025", "last 30 days", or "Q4 2025".`,
				};
			}

			let finalDate = parsedDate;

			// If end date requested, try to get end of period or just end of day
			if (isEndDate) {
				const endOfPeriod = getEndOfPeriod(dateExpression, parsedDate);
				if (endOfPeriod) {
					finalDate = endOfPeriod;
				} else {
					// Default to end of the parsed day
					finalDate = new Date(parsedDate);
					finalDate.setHours(23, 59, 59, 999);
				}
			}

			return {
				timestamp: finalDate.getTime(),
				isoDate: finalDate.toISOString(),
				humanReadable: finalDate.toLocaleDateString("en-US", {
					weekday: "long",
					year: "numeric",
					month: "long",
					day: "numeric",
				}),
				success: true,
			};
		} catch (err) {
			return {
				timestamp: 0,
				isoDate: "",
				humanReadable: "",
				success: false,
				errorMessage: `Error parsing date: ${err instanceof Error ? err.message : "Unknown error"}`,
			};
		}
	},
});
