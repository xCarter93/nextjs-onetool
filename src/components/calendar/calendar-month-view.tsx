"use client";

import React from "react";
import { CalendarEvent } from "@/types/calendar";
import { format } from "date-fns";
import { getMonthDays, isEventOnDate } from "@/lib/calendar-utils";
import { CalendarEventIcon } from "./calendar-event-icon";
import { CalendarEventBar } from "./calendar-event-bar";

interface CalendarMonthViewProps {
	date: Date;
	events: CalendarEvent[];
	onDayClick: (date: Date, eventId?: string) => void;
}

export function CalendarMonthView({
	date,
	events,
	onDayClick,
}: CalendarMonthViewProps) {
	const monthDays = getMonthDays(date);

	const handleEventClick = (event: CalendarEvent, eventDate: Date) => {
		// Navigate to day view with the event selected
		onDayClick(eventDate, event.id as string);
	};

	const handleDayClick = (day: Date) => {
		onDayClick(day);
	};

	// Group days into weeks (7 days each)
	const weeks: (typeof monthDays)[] = [];
	for (let i = 0; i < monthDays.length; i += 7) {
		weeks.push(monthDays.slice(i, i + 7));
	}

	return (
		<div className="flex h-full flex-col">
			{/* Day Labels */}
			<div className="grid grid-cols-7 border-b border-border bg-muted/30">
				{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
					<div
						key={day}
						className="border-r border-border last:border-r-0 p-2 text-center text-xs font-medium text-muted-foreground"
					>
						{day}
					</div>
				))}
			</div>

			{/* Calendar Grid */}
			<div
				className="flex-1 grid grid-cols-7 auto-rows-fr"
				style={{
					gridTemplateRows: `repeat(${weeks.length}, 1fr)`,
				}}
			>
				{weeks.map((week, weekIndex) => (
					<React.Fragment key={weekIndex}>
						{week.map((dayCell) => {
							const dayEvents = events.filter((event) =>
								isEventOnDate(event, dayCell.date)
							);
							const projects = dayEvents.filter((e) => e.type === "project");
							const tasks = dayEvents.filter((e) => e.type === "task");

							// Limit visible events to avoid overflow
							const maxVisibleProjects = 2;
							const maxVisibleTasks = 6;
							const visibleProjects = projects.slice(0, maxVisibleProjects);
							const visibleTasks = tasks.slice(0, maxVisibleTasks);
							const hiddenCount =
								projects.length -
								visibleProjects.length +
								(tasks.length - visibleTasks.length);

							return (
								<div
									key={dayCell.date.toString()}
									className={`
											border-r border-b last:border-r-0
											border-border
											p-2 cursor-pointer
											hover:bg-muted/50 transition-colors
											flex flex-col
											${dayCell.isToday ? "bg-primary/5" : ""}
											${!dayCell.isCurrentMonth ? "bg-muted/20" : ""}
										`}
									onClick={() => handleDayClick(dayCell.date)}
								>
									{/* Day Number */}
									<div className="flex items-center justify-between mb-1">
										<span
											className={`
													text-sm font-medium
													${
														dayCell.isToday
															? "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center"
															: dayCell.isCurrentMonth
																? "text-foreground"
																: "text-muted-foreground"
													}
												`}
										>
											{format(dayCell.date, "d")}
										</span>
										{dayEvents.length > 0 && (
											<span className="text-xs text-muted-foreground">
												{dayEvents.length}
											</span>
										)}
									</div>

									{/* Events */}
									<div className="space-y-1">
										{/* Projects */}
										{visibleProjects.map((project) => (
											<div
												key={project.id}
												onClick={(e) => {
													e.stopPropagation();
													handleEventClick(project, dayCell.date);
												}}
											>
												<CalendarEventBar event={project} isMultiDay={true} />
											</div>
										))}

										{/* Tasks */}
										{visibleTasks.length > 0 && (
											<div className="flex flex-wrap gap-1">
												{visibleTasks.map((task) => (
													<div
														key={task.id}
														onClick={(e) => {
															e.stopPropagation();
															handleEventClick(task, dayCell.date);
														}}
													>
														<CalendarEventIcon event={task} size="sm" />
													</div>
												))}
											</div>
										)}

										{/* More Indicator */}
										{hiddenCount > 0 && (
											<div className="text-xs text-muted-foreground mt-1">
												+{hiddenCount} more
											</div>
										)}
									</div>
								</div>
							);
						})}
					</React.Fragment>
				))}
			</div>
		</div>
	);
}
