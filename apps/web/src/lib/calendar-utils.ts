import {
	startOfMonth,
	endOfMonth,
	startOfWeek,
	endOfWeek,
	eachDayOfInterval,
	format,
	isSameMonth,
	isToday,
	addDays,
	startOfDay,
	endOfDay,
	differenceInDays,
} from "date-fns";
import type {
	CalendarEvent,
	DateRange,
	EventPosition,
	GroupedEvents,
	CalendarDayCell,
} from "@/types/calendar";

/**
 * Get all days for a month view (including days from previous/next month to fill grid)
 */
export function getMonthDays(date: Date): CalendarDayCell[] {
	const monthStart = startOfMonth(date);
	const monthEnd = endOfMonth(date);
	const calendarStart = startOfWeek(monthStart);
	const calendarEnd = endOfWeek(monthEnd);

	const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

	return days.map((day) => ({
		date: day,
		isCurrentMonth: isSameMonth(day, date),
		isToday: isToday(day),
		events: [],
	}));
}

/**
 * Get 7 days for week view starting from the given date
 */
export function getWeekDays(date: Date): Date[] {
	const weekStart = startOfWeek(date);
	return eachDayOfInterval({
		start: weekStart,
		end: addDays(weekStart, 6),
	});
}

/**
 * Get the date range for the current view
 */
export function getViewDateRange(
	date: Date,
	view: "month" | "week" | "day"
): DateRange {
	switch (view) {
		case "month": {
			const monthStart = startOfMonth(date);
			const monthEnd = endOfMonth(date);
			return {
				start: startOfWeek(monthStart),
				end: endOfWeek(monthEnd),
			};
		}
		case "week": {
			const weekStart = startOfWeek(date);
			return {
				start: weekStart,
				end: endOfWeek(weekStart),
			};
		}
		case "day":
			return {
				start: startOfDay(date),
				end: endOfDay(date),
			};
	}
}

/**
 * Calculate the position and width of an event bar based on date range
 * Returns percentage values for positioning
 */
export function calculateEventPosition(
	eventStart: Date,
	eventEnd: Date,
	viewStart: Date,
	viewEnd: Date,
	totalDays: number
): EventPosition {
	const eventStartDay = startOfDay(eventStart);
	const eventEndDay = startOfDay(eventEnd);
	const viewStartDay = startOfDay(viewStart);
	const viewEndDay = startOfDay(viewEnd);

	// Clamp event to view range
	const displayStart =
		eventStartDay < viewStartDay ? viewStartDay : eventStartDay;
	const displayEnd = eventEndDay > viewEndDay ? viewEndDay : eventEndDay;

	// Calculate position as day offset from view start
	const startOffset = differenceInDays(displayStart, viewStartDay);
	const eventDays = differenceInDays(displayEnd, displayStart) + 1;

	const left = (startOffset / totalDays) * 100;
	const width = (eventDays / totalDays) * 100;

	return { left, width };
}

/**
 * Group events by date for easier rendering
 */
export function groupEventsByDay(events: CalendarEvent[]): GroupedEvents {
	const grouped: GroupedEvents = {};

	events.forEach((event) => {
		if (event.type === "task") {
			// Tasks have a single date
			const dateKey = format(event.startDate, "yyyy-MM-dd");
			if (!grouped[dateKey]) {
				grouped[dateKey] = [];
			}
			grouped[dateKey].push(event);
		} else {
			// Projects span multiple days
			const start = startOfDay(event.startDate);
			const end = event.endDate ? startOfDay(event.endDate) : start;
			const days = eachDayOfInterval({ start, end });

			days.forEach((day) => {
				const dateKey = format(day, "yyyy-MM-dd");
				if (!grouped[dateKey]) {
					grouped[dateKey] = [];
				}
				// Only add if not already added for this day
				if (!grouped[dateKey].find((e) => e.id === event.id)) {
					grouped[dateKey].push(event);
				}
			});
		}
	});

	return grouped;
}

/**
 * Check if an event falls within a date range
 */
export function isEventInRange(
	event: CalendarEvent,
	rangeStart: Date,
	rangeEnd: Date
): boolean {
	const eventStart = startOfDay(event.startDate);
	const eventEnd = event.endDate
		? startOfDay(event.endDate)
		: startOfDay(event.startDate);
	const rangeStartDay = startOfDay(rangeStart);
	const rangeEndDay = startOfDay(rangeEnd);

	// Event overlaps if:
	// - Event starts within range, OR
	// - Event ends within range, OR
	// - Event spans the entire range
	return (
		(eventStart >= rangeStartDay && eventStart <= rangeEndDay) ||
		(eventEnd >= rangeStartDay && eventEnd <= rangeEndDay) ||
		(eventStart <= rangeStartDay && eventEnd >= rangeEndDay)
	);
}

/**
 * Get color classes based on event type and status
 */
export function getEventColor(
	type: "project" | "task",
	status: string
): {
	bg: string;
	border: string;
	text: string;
	hover: string;
} {
	if (type === "project") {
		switch (status) {
			case "planned":
				return {
					bg: "bg-blue-100 dark:bg-blue-900/30",
					border: "border-blue-300 dark:border-blue-700",
					text: "text-blue-900 dark:text-blue-100",
					hover: "hover:bg-blue-200 dark:hover:bg-blue-900/50",
				};
			case "in-progress":
				return {
					bg: "bg-blue-500 dark:bg-blue-600",
					border: "border-blue-600 dark:border-blue-500",
					text: "text-white dark:text-white",
					hover: "hover:bg-blue-600 dark:hover:bg-blue-700",
				};
			case "completed":
				return {
					bg: "bg-green-100 dark:bg-green-900/30",
					border: "border-green-300 dark:border-green-700",
					text: "text-green-900 dark:text-green-100",
					hover: "hover:bg-green-200 dark:hover:bg-green-900/50",
				};
			case "cancelled":
				return {
					bg: "bg-gray-100 dark:bg-gray-800/30",
					border: "border-gray-300 dark:border-gray-700",
					text: "text-gray-600 dark:text-gray-400",
					hover: "hover:bg-gray-200 dark:hover:bg-gray-800/50",
				};
			default:
				return {
					bg: "bg-blue-100 dark:bg-blue-900/30",
					border: "border-blue-300 dark:border-blue-700",
					text: "text-blue-900 dark:text-blue-100",
					hover: "hover:bg-blue-200 dark:hover:bg-blue-900/50",
				};
		}
	} else {
		// Tasks - use purple shades with priority variations
		const priority = status; // For tasks, we'll use priority here
		switch (priority) {
			case "urgent":
				return {
					bg: "bg-red-500 dark:bg-red-600",
					border: "border-red-600 dark:border-red-500",
					text: "text-white dark:text-white",
					hover: "hover:bg-red-600 dark:hover:bg-red-700",
				};
			case "high":
				return {
					bg: "bg-purple-500 dark:bg-purple-600",
					border: "border-purple-600 dark:border-purple-500",
					text: "text-white dark:text-white",
					hover: "hover:bg-purple-600 dark:hover:bg-purple-700",
				};
			case "medium":
				return {
					bg: "bg-purple-300 dark:bg-purple-700",
					border: "border-purple-400 dark:border-purple-600",
					text: "text-purple-900 dark:text-purple-100",
					hover: "hover:bg-purple-400 dark:hover:bg-purple-800",
				};
			case "low":
				return {
					bg: "bg-purple-100 dark:bg-purple-900/30",
					border: "border-purple-300 dark:border-purple-700",
					text: "text-purple-900 dark:text-purple-100",
					hover: "hover:bg-purple-200 dark:hover:bg-purple-900/50",
				};
			default:
				return {
					bg: "bg-purple-200 dark:bg-purple-800",
					border: "border-purple-300 dark:border-purple-700",
					text: "text-purple-900 dark:text-purple-100",
					hover: "hover:bg-purple-300 dark:hover:bg-purple-900",
				};
		}
	}
}

/**
 * Format time string to 12-hour format
 */
export function formatTime(time: string): string {
	const [hours, minutes] = time.split(":").map(Number);
	const period = hours >= 12 ? "PM" : "AM";
	const displayHours = hours % 12 || 12;
	return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

/**
 * Check if an event is happening on a specific date
 * Note: Events come with Date objects that represent local dates (from calendar-container)
 */
export function isEventOnDate(event: CalendarEvent, date: Date): boolean {
	// Normalize the check date to start of day for comparison
	const checkYear = date.getFullYear();
	const checkMonth = date.getMonth();
	const checkDay = date.getDate();

	if (event.type === "task") {
		// For tasks, check if the dates match (year, month, day)
		const eventYear = event.startDate.getFullYear();
		const eventMonth = event.startDate.getMonth();
		const eventDay = event.startDate.getDate();
		
		return (
			eventYear === checkYear &&
			eventMonth === checkMonth &&
			eventDay === checkDay
		);
	} else {
		// Project - check if date falls within project range
		const eventStartYear = event.startDate.getFullYear();
		const eventStartMonth = event.startDate.getMonth();
		const eventStartDay = event.startDate.getDate();

		// Create comparable timestamps at midnight
		const checkTimestamp = new Date(checkYear, checkMonth, checkDay).getTime();
		const startTimestamp = new Date(
			eventStartYear,
			eventStartMonth,
			eventStartDay
		).getTime();

		let endTimestamp = startTimestamp;
		if (event.endDate) {
			const eventEndYear = event.endDate.getFullYear();
			const eventEndMonth = event.endDate.getMonth();
			const eventEndDay = event.endDate.getDate();
			endTimestamp = new Date(
				eventEndYear,
				eventEndMonth,
				eventEndDay
			).getTime();
		}

		return checkTimestamp >= startTimestamp && checkTimestamp <= endTimestamp;
	}
}
