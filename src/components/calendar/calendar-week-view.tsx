"use client";

import React from "react";
import { CalendarEvent } from "@/types/calendar";
import { format, isToday, isSameDay } from "date-fns";
import { getWeekDays, isEventOnDate } from "@/lib/calendar-utils";
import { CalendarEventIcon } from "./calendar-event-icon";
import { CalendarEventBar } from "./calendar-event-bar";

interface CalendarWeekViewProps {
	date: Date;
	events: CalendarEvent[];
	onDayClick: (date: Date, eventId?: string) => void;
}

export function CalendarWeekView({
	date,
	events,
	onDayClick,
}: CalendarWeekViewProps) {
	const weekDays = getWeekDays(date);

	const handleEventClick = (event: CalendarEvent, eventDate: Date) => {
		// Navigate to day view with the event selected
		onDayClick(eventDate, event.id as string);
	};

	const handleDayClick = (day: Date) => {
		onDayClick(day);
	};

	return (
		<div className="flex h-full flex-col">
			{/* Week Header */}
			<div className="grid grid-cols-7 border-b border-border bg-background">
				{weekDays.map((day) => {
					const dayEvents = events.filter((event) => isEventOnDate(event, day));
					const today = isToday(day);

					return (
						<div
							key={day.toString()}
							className={`
								border-r border-border last:border-r-0 p-3 text-center
								cursor-pointer hover:bg-muted/50 transition-colors
								${today ? "bg-primary/5" : ""}
							`}
							onClick={() => handleDayClick(day)}
						>
							<div
								className={`
								text-xs font-medium uppercase tracking-wide
								${today ? "text-primary" : "text-muted-foreground"}
							`}
							>
								{format(day, "EEE")}
							</div>
							<div
								className={`
								text-2xl font-bold mt-1
								${today ? "text-primary" : "text-foreground"}
							`}
							>
								{format(day, "d")}
							</div>
							{dayEvents.length > 0 && (
								<div className="text-xs text-muted-foreground mt-1">
									{dayEvents.length} event{dayEvents.length !== 1 ? "s" : ""}
								</div>
							)}
						</div>
					);
				})}
			</div>

			{/* Week Grid */}
			<div className="flex-1 overflow-y-auto">
				<div className="grid grid-cols-7 h-full">
					{weekDays.map((day) => {
						const dayEvents = events.filter((event) =>
							isEventOnDate(event, day)
						);
						const projects = dayEvents.filter((e) => e.type === "project");
						const tasks = dayEvents.filter((e) => e.type === "task");

						return (
							<div
								key={day.toString()}
								className={`
									border-r border-border last:border-r-0 p-2
									min-h-[400px]
									${isToday(day) ? "bg-primary/5" : ""}
								`}
							>
								<div className="space-y-2">
									{/* Projects */}
									{projects.map((project) => (
										<CalendarEventBar
											key={project.id}
											event={project}
											onClick={() => handleEventClick(project, day)}
											isMultiDay={
												project.endDate
													? !isSameDay(project.startDate, project.endDate)
													: false
											}
										/>
									))}

									{/* Tasks */}
									<div className="flex flex-wrap gap-1 mt-2">
										{tasks.map((task) => (
											<CalendarEventIcon
												key={task.id}
												event={task}
												onClick={() => handleEventClick(task, day)}
												size="md"
											/>
										))}
									</div>

									{/* Empty State */}
									{dayEvents.length === 0 && (
										<div className="h-20 flex items-center justify-center">
											<span className="text-xs text-muted-foreground/30">
												No events
											</span>
										</div>
									)}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
