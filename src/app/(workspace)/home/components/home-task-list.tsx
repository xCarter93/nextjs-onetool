"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskSheet } from "@/components/shared/task-sheet";
import { Card, CardContent } from "@/components/ui/card";
// Note: Toast implementation will be added later
import { motion, AnimatePresence } from "motion/react";
import {
	Calendar,
	Clock,
	User,
	Flag,
	Plus,
	CheckCircle2,
	Circle,
	AlertTriangle,
	ChevronRight,
	Building2,
} from "lucide-react";
import Link from "next/link";

interface Task {
	_id: Id<"tasks">;
	title: string;
	description?: string;
	clientId: Id<"clients">;
	projectId?: Id<"projects">;
	date: number;
	startTime?: string;
	endTime?: string;
	assigneeUserId?: Id<"users">;
	status: "pending" | "in-progress" | "completed" | "cancelled";
	priority?: "low" | "medium" | "high" | "urgent";
	repeat?: "none" | "daily" | "weekly" | "monthly";
	repeatUntil?: number;
}

const priorityConfig = {
	low: {
		color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
		icon: Flag,
	},
	medium: {
		color: "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-300",
		icon: Flag,
	},
	high: {
		color: "bg-amber-100 text-amber-700 dark:bg-amber-800 dark:text-amber-300",
		icon: Flag,
	},
	urgent: {
		color: "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300",
		icon: AlertTriangle,
	},
};

// Status configuration removed - not currently used

interface TaskItemProps {
	task: Task;
	onStatusChange: (taskId: Id<"tasks">, newStatus: Task["status"]) => void;
	isUpdating: boolean;
}

function TaskItem({ task, onStatusChange, isUpdating }: TaskItemProps) {
	const clients = useQuery(api.clients.list, {});
	const projects = useQuery(api.projects.list, {});
	const users = useQuery(api.users.listByOrg, {});

	const client = clients?.find((c) => c._id === task.clientId);
	const project = projects?.find((p) => p._id === task.projectId);
	const assignee = users?.find(
		(u: { _id: Id<"users">; name?: string; email: string }) =>
			u._id === task.assigneeUserId
	);

	const isOverdue = task.date < Date.now() && task.status !== "completed";
	const isToday =
		new Date(task.date).toDateString() === new Date().toDateString();
	const taskDate = new Date(task.date);

	const PriorityIcon = priorityConfig[task.priority || "medium"].icon;

	const formatTime = (time?: string) => {
		if (!time) return null;
		const [hours, minutes] = time.split(":");
		const hour = parseInt(hours);
		const ampm = hour >= 12 ? "PM" : "AM";
		const displayHour = hour % 12 || 12;
		return `${displayHour}:${minutes} ${ampm}`;
	};

	const formatDate = (date: Date) => {
		if (isToday) return "Today";

		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

		const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "short" });
		const month = date.toLocaleDateString("en-US", { month: "short" });
		const day = date.getDate();
		return `${dayOfWeek}, ${month} ${day}`;
	};

	const handleToggleComplete = () => {
		if (isUpdating) return;

		const newStatus = task.status === "completed" ? "pending" : "completed";
		onStatusChange(task._id, newStatus);
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -10 }}
			className={cn(
				"group relative bg-card/50 dark:bg-card/30 rounded-lg p-4 transition-all duration-200",
				"hover:bg-card/70 dark:hover:bg-card/50",
				isOverdue && "bg-red-50/30 dark:bg-red-900/10",
				task.status === "completed" && "opacity-60 bg-muted/30"
			)}
		>
			<div className="flex items-center gap-4">
				{/* Status Toggle Button */}
				<button
					onClick={handleToggleComplete}
					disabled={isUpdating}
					className={cn(
						"flex-shrink-0 p-0.5 rounded-full transition-colors",
						"hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
						isUpdating && "opacity-50 cursor-not-allowed"
					)}
				>
					{task.status === "completed" ? (
						<CheckCircle2 className="h-5 w-5 text-green-600" />
					) : (
						<Circle className="h-5 w-5 text-muted-foreground hover:text-foreground" />
					)}
				</button>

				{/* Tabular Grid Layout - Everything Horizontal */}
				<div className="flex-1 grid grid-cols-[2fr_2fr_1.5fr_1.5fr_auto] gap-6 items-center">
					{/* Column 1: Task Title & Description */}
					<div className="min-w-0">
						<h3
							className={cn(
								"font-medium text-sm text-foreground leading-tight truncate",
								task.status === "completed" &&
									"line-through text-muted-foreground"
							)}
						>
							{task.title}
						</h3>
						{task.description && (
							<p className="text-xs text-muted-foreground mt-1 line-clamp-1">
								{task.description}
							</p>
						)}
					</div>

					{/* Column 2: Client */}
					<div className="min-w-0 flex items-center gap-1.5">
						<Building2 className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
						<span className="text-sm truncate">
							{client?.companyName || "Unknown Client"}
							{project && ` • ${project.title}`}
						</span>
					</div>

					{/* Column 3: Date */}
					<div className="min-w-0 flex items-center gap-1.5">
						<Calendar className="h-3.5 w-3.5 flex-shrink-0" />
						<span
							className={cn(
								"text-sm truncate",
								isOverdue ? "text-red-600 font-medium" : ""
							)}
						>
							{formatDate(taskDate)}
							{(task.startTime || task.endTime) && (
								<span className="text-muted-foreground ml-1">
									{task.startTime && formatTime(task.startTime)}
									{task.startTime && task.endTime && "-"}
									{task.endTime && formatTime(task.endTime)}
								</span>
							)}
						</span>
						{isOverdue && <AlertTriangle className="h-3.5 w-3.5 text-red-600 flex-shrink-0" />}
					</div>

					{/* Column 4: Assignee */}
					<div className="min-w-0 flex items-center gap-1.5">
						<User className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
						<span className="text-sm truncate">
							{assignee ? (assignee.name || assignee.email) : "Unassigned"}
						</span>
					</div>

					{/* Column 5: Priority Badge */}
					<div className="flex-shrink-0">
						{task.priority && (
							<Badge
								variant="secondary"
								className={cn("text-xs", priorityConfig[task.priority].color)}
							>
								<PriorityIcon className="h-3 w-3 mr-1" />
								{task.priority}
							</Badge>
						)}
					</div>
				</div>
			</div>
		</motion.div>
	);
}

export function HomeTaskList() {
	const [updatingTasks, setUpdatingTasks] = useState<Set<Id<"tasks">>>(
		new Set()
	);

	// Get upcoming tasks (next 7 days)
	const upcomingTasks = useQuery(api.tasks.getUpcoming, { daysAhead: 7 });
	const overdueTasks = useQuery(api.tasks.getOverdue, {});

	// Mutations
	const updateTaskMutation = useMutation(api.tasks.update);
	const completeTaskMutation = useMutation(api.tasks.complete);

	// Combine overdue and upcoming tasks
	const allTasks = [...(overdueTasks || []), ...(upcomingTasks || [])]
		.filter(
			(task, index, self) =>
				// Remove duplicates (in case a task appears in both overdue and upcoming)
				self.findIndex((t) => t._id === task._id) === index
		)
		.slice(0, 8); // Limit to 8 tasks for home page

	const isLoading = upcomingTasks === undefined || overdueTasks === undefined;

	const handleStatusChange = async (
		taskId: Id<"tasks">,
		newStatus: Task["status"]
	) => {
		setUpdatingTasks((prev) => new Set(prev).add(taskId));

		try {
			if (newStatus === "completed") {
				await completeTaskMutation({ id: taskId });
				console.log("Task marked as completed!");
			} else {
				await updateTaskMutation({ id: taskId, status: newStatus });
				console.log("Task status updated!");
			}
		} catch (error) {
			console.error("Error updating task:", error);
			console.log("Failed to update task");
		} finally {
			setUpdatingTasks((prev) => {
				const newSet = new Set(prev);
				newSet.delete(taskId);
				return newSet;
			});
		}
	};

	if (isLoading) {
		return (
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-xl font-semibold">Upcoming Tasks</h2>
					<Skeleton className="h-9 w-28" />
				</div>
				<div className="space-y-3">
					{[1, 2, 3, 4].map((i) => (
						<div key={i} className="bg-card/50 dark:bg-card/30 rounded-lg p-4">
							<div className="flex items-start gap-3">
								<Skeleton className="h-5 w-5 rounded-full mt-0.5" />
								<div className="flex-1 space-y-2">
									<Skeleton className="h-5 w-3/4" />
									<Skeleton className="h-4 w-1/2" />
									<div className="flex gap-4">
										<Skeleton className="h-4 w-20" />
										<Skeleton className="h-4 w-16" />
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	const overdueTasksCount = (overdueTasks || []).length;
	const todayTasksCount = allTasks.filter((task) => {
		const taskDate = new Date(task.date).toDateString();
		const today = new Date().toDateString();
		return taskDate === today;
	}).length;

	return (
		<Card className="group relative backdrop-blur-md overflow-hidden ring-1 ring-border/20 dark:ring-border/40">
			{/* Glass morphism overlay */}
			<div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent dark:from-white/5 dark:via-white/2 dark:to-transparent rounded-2xl" />
			<CardContent className="relative z-10">
				<motion.div
					className="space-y-6"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					{/* Header */}
					<div className="flex items-center justify-between">
						<div className="space-y-1">
							<h2 className="text-xl font-semibold text-foreground">
								Your Tasks
							</h2>
							<p className="text-sm text-muted-foreground">
								{overdueTasksCount > 0 && (
									<span className="text-red-600 font-medium">
										{overdueTasksCount} overdue
									</span>
								)}
								{overdueTasksCount > 0 && todayTasksCount > 0 && (
									<span> • </span>
								)}
								{todayTasksCount > 0 && (
									<span>{todayTasksCount} due today</span>
								)}
								{overdueTasksCount === 0 && todayTasksCount === 0 && (
									<span>Stay on top of your schedule</span>
								)}
							</p>
						</div>
						<div className="flex items-center gap-2">
							<TaskSheet
								mode="create"
								trigger={
									<div className="group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-all duration-200 rounded-lg">
										<Plus className="h-4 w-4" />
										Add Task
										<span
											aria-hidden="true"
											className="group-hover:translate-x-1 transition-transform duration-200"
										>
											→
										</span>
									</div>
								}
							/>
						</div>
					</div>

					{/* Tasks List */}
					<div className="space-y-3">
						{allTasks.length > 0 ? (
							<>
								<AnimatePresence>
									{allTasks.map((task) => (
										<TaskItem
											key={task._id}
											task={task}
											onStatusChange={handleStatusChange}
											isUpdating={updatingTasks.has(task._id)}
										/>
									))}
								</AnimatePresence>

								{/* View All Tasks Link */}
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.3 }}
									className="pt-4"
								>
									<Link
										href="/tasks"
										className={cn(
											"inline-flex items-center gap-2 text-sm font-medium text-muted-foreground",
											"hover:text-foreground transition-colors group"
										)}
									>
										<span>View all tasks</span>
										<ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
									</Link>
								</motion.div>
							</>
						) : (
							<motion.div
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								className="text-center py-12 bg-card/50 dark:bg-card/30 rounded-lg"
							>
								<div className="space-y-4">
									<div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full">
										<Calendar className="h-8 w-8 text-muted-foreground" />
									</div>
									<div className="space-y-2">
										<h3 className="text-lg font-medium">No upcoming tasks</h3>
										<p className="text-muted-foreground max-w-md mx-auto">
											Great job staying on top of things! Create a new task to
											get started.
										</p>
									</div>
									<TaskSheet
										mode="create"
										trigger={
											<div className="group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-all duration-200 rounded-lg">
												<Plus className="h-4 w-4" />
												Create Your First Task
												<span
													aria-hidden="true"
													className="group-hover:translate-x-1 transition-transform duration-200"
												>
													→
												</span>
											</div>
										}
									/>
								</div>
							</motion.div>
						)}
					</div>
				</motion.div>
			</CardContent>
		</Card>
	);
}

export default HomeTaskList;
