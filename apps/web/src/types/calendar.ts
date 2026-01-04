import { Id } from "@onetool/backend/convex/_generated/dataModel";

export type CalendarView = "month" | "week" | "day";

export type CalendarEventType = "project" | "task";

export interface DateRange {
	start: Date;
	end: Date;
}

export interface CalendarEvent {
	id: Id<"projects"> | Id<"tasks">;
	type: CalendarEventType;
	title: string;
	description?: string;
	startDate: Date;
	endDate?: Date; // Tasks have single date, projects span multiple days
	startTime?: string; // HH:MM format for tasks
	endTime?: string;
	status: string;
	clientId?: Id<"clients">; // Optional for internal tasks
	clientName: string;
	assignedUserIds?: Id<"users">[];
	projectId?: Id<"projects">; // For tasks linked to projects
}

export interface EventPosition {
	left: number; // Percentage
	width: number; // Percentage
	top?: number; // For time-based positioning
	height?: number;
}

export interface GroupedEvents {
	[date: string]: CalendarEvent[]; // ISO date string as key
}

export interface CalendarDayCell {
	date: Date;
	isCurrentMonth: boolean;
	isToday: boolean;
	events: CalendarEvent[];
}
