"use client";

import React, { useState, useMemo } from "react";
import { CalendarView, CalendarEvent } from "@/types/calendar";
import { getViewDateRange } from "@/lib/calendar-utils";
import { CalendarMonthView } from "./calendar-month-view";
import { CalendarWeekView } from "./calendar-week-view";
import { CalendarDayView } from "./calendar-day-view";
import { StyledButton } from "@/components/ui/styled-button";
import {
	ChevronLeft,
	ChevronRight,
	Calendar,
	CalendarDays,
	CalendarRange,
} from "lucide-react";
import { format, addMonths, addWeeks, addDays } from "date-fns";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion } from "motion/react";

export function CalendarContainer() {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [view, setView] = useState<CalendarView>("month");
	const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

	// Calculate date range for data fetching based on current view
	const dateRange = useMemo(
		() => getViewDateRange(currentDate, view),
		[currentDate, view]
	);

	// Fetch calendar events for the current date range
	const calendarData = useQuery(api.calendar.getCalendarEvents, {
		startDate: dateRange.start.getTime(),
		endDate: dateRange.end.getTime(),
	});

	// Combine and normalize events
	const events: CalendarEvent[] = useMemo(() => {
		if (!calendarData) return [];

		const projectEvents: CalendarEvent[] = calendarData.projects.map((p) => ({
			id: p.id,
			type: "project" as const,
			title: p.title,
			description: p.description,
			startDate: new Date(p.startDate),
			endDate: p.endDate ? new Date(p.endDate) : undefined,
			status: p.status,
			clientId: p.clientId,
			clientName: p.clientName,
			assignedUserIds: p.assignedUserIds,
		}));

		const taskEvents: CalendarEvent[] = calendarData.tasks.map((t) => ({
			id: t.id,
			type: "task" as const,
			title: t.title,
			description: t.description,
			startDate: new Date(t.startDate),
			startTime: t.startTime,
			endTime: t.endTime,
			status: t.status,
			priority: t.priority,
			clientId: t.clientId,
			clientName: t.clientName,
			assignedUserIds: t.assigneeUserId ? [t.assigneeUserId] : undefined,
			projectId: t.projectId,
		}));

		return [...projectEvents, ...taskEvents];
	}, [calendarData]);

	// Navigation handlers
	const handlePrevious = () => {
		switch (view) {
			case "month":
				setCurrentDate((prev) => addMonths(prev, -1));
				break;
			case "week":
				setCurrentDate((prev) => addWeeks(prev, -1));
				break;
			case "day":
				setCurrentDate((prev) => addDays(prev, -1));
				break;
		}
	};

	const handleNext = () => {
		switch (view) {
			case "month":
				setCurrentDate((prev) => addMonths(prev, 1));
				break;
			case "week":
				setCurrentDate((prev) => addWeeks(prev, 1));
				break;
			case "day":
				setCurrentDate((prev) => addDays(prev, 1));
				break;
		}
	};

	const handleToday = () => {
		setCurrentDate(new Date());
	};

	const handleDayClick = (date: Date, eventId?: string) => {
		setCurrentDate(date);
		setView("day");
		if (eventId) {
			setSelectedEventId(eventId);
		}
	};

	// Format title based on view
	const getTitle = () => {
		switch (view) {
			case "month":
				return format(currentDate, "MMMM yyyy");
			case "week":
				return `Week of ${format(currentDate, "MMM d, yyyy")}`;
			case "day":
				return format(currentDate, "EEEE, MMMM d, yyyy");
		}
	};

	return (
		<div className="flex flex-col h-full">
			{/* Calendar Header */}
			<div className="border-b border-border bg-background px-4 py-4">
				<div className="flex items-center justify-between">
					{/* Title and Navigation */}
					<div className="flex items-center gap-4">
						<h1 className="text-2xl font-bold text-foreground">{getTitle()}</h1>
						<div className="flex items-center gap-2">
							<StyledButton
								intent="outline"
								size="sm"
								onClick={handlePrevious}
								icon={<ChevronLeft className="w-4 h-4" />}
								showArrow={false}
							/>
							<StyledButton
								intent="outline"
								size="sm"
								onClick={handleToday}
								showArrow={false}
							>
								Today
							</StyledButton>
							<StyledButton
								intent="outline"
								size="sm"
								onClick={handleNext}
								icon={<ChevronRight className="w-4 h-4" />}
								showArrow={false}
							/>
						</div>
					</div>

					{/* View Switcher */}
					<div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
						<StyledButton
							intent={view === "month" ? "primary" : "plain"}
							size="sm"
							onClick={() => setView("month")}
							icon={<CalendarRange className="w-4 h-4" />}
							showArrow={false}
						>
							Month
						</StyledButton>
						<StyledButton
							intent={view === "week" ? "primary" : "plain"}
							size="sm"
							onClick={() => setView("week")}
							icon={<CalendarDays className="w-4 h-4" />}
							showArrow={false}
						>
							Week
						</StyledButton>
						<StyledButton
							intent={view === "day" ? "primary" : "plain"}
							size="sm"
							onClick={() => setView("day")}
							icon={<Calendar className="w-4 h-4" />}
							showArrow={false}
						>
							Day
						</StyledButton>
					</div>
				</div>

				{/* Stats */}
				{!calendarData ? (
					<div className="mt-2 text-sm text-muted-foreground">Loading...</div>
				) : (
					<div className="mt-2 text-sm text-muted-foreground">
						{calendarData.projects.length} project
						{calendarData.projects.length !== 1 ? "s" : ""},{" "}
						{calendarData.tasks.length} task
						{calendarData.tasks.length !== 1 ? "s" : ""}
					</div>
				)}
			</div>

			{/* Calendar View */}
			<div className="flex-1 overflow-hidden">
				<motion.div
					key={view}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
					className="h-full"
				>
					{view === "month" && (
						<CalendarMonthView
							date={currentDate}
							events={events}
							onDayClick={handleDayClick}
						/>
					)}
					{view === "week" && (
						<CalendarWeekView
							date={currentDate}
							events={events}
							onDayClick={handleDayClick}
						/>
					)}
					{view === "day" && (
						<CalendarDayView
							date={currentDate}
							events={events}
							selectedEventId={selectedEventId}
						/>
					)}
				</motion.div>
			</div>
		</div>
	);
}
