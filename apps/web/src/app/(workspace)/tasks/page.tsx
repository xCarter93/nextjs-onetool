"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { useSearchParams } from "next/navigation";
import { api } from "@onetool/backend/convex/_generated/api";
import { Id } from "@onetool/backend/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskSheet } from "@/components/shared/task-sheet";
import { StyledButton } from "@/components/ui/styled/styled-button";
import {
	StyledFilters,
	type Filter,
	type FilterFieldConfig,
} from "@/components/ui/styled/styled-filters";
import { motion, AnimatePresence } from "motion/react";
import {
	Calendar,
	Clock,
	User,
	Flag,
	Plus,
	CheckCircle2,
	Circle,
	Search,
	SortAsc,
	SortDesc,
	AlertTriangle,
	Building2,
	FolderOpen,
	Edit,
	Trash2,
	Filter as FilterIcon,
	X,
} from "lucide-react";
import { Task } from "@/types/task";

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

const statusConfig = {
	pending: {
		color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
		label: "Pending",
	},
	"in-progress": {
		color: "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-300",
		label: "In Progress",
	},
	completed: {
		color: "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300",
		label: "Completed",
	},
	cancelled: {
		color: "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300",
		label: "Cancelled",
	},
};

interface TaskRowProps {
	task: Task;
	onStatusChange: (taskId: Id<"tasks">, newStatus: Task["status"]) => void;
	onEdit: (task: Task) => void;
	onDelete: (taskId: Id<"tasks">) => void;
	isUpdating: boolean;
}

function TaskRow({
	task,
	onStatusChange,
	onEdit,
	onDelete,
	isUpdating,
}: TaskRowProps) {
	const [showActions, setShowActions] = useState(false);

	const clients = useQuery(api.clients.list, {});
	const projects = useQuery(api.projects.list, {});
	const users = useQuery(api.users.listByOrg, {});

	const client = clients?.find((c) => c._id === task.clientId);
	const project = projects?.find((p) => p._id === task.projectId);
	const assignee = users?.find(
		(u: { _id: Id<"users">; name?: string; email: string }) =>
			u._id === task.assigneeUserId
	);

	// Create date in UTC to avoid timezone shifts
	const taskDate = new Date(task.date);
	const taskDateUTC = new Date(
		taskDate.getUTCFullYear(),
		taskDate.getUTCMonth(),
		taskDate.getUTCDate()
	);

	const todayUTC = new Date();
	todayUTC.setHours(0, 0, 0, 0);
	const todayUTCDate = new Date(
		Date.UTC(todayUTC.getFullYear(), todayUTC.getMonth(), todayUTC.getDate())
	);

	const isOverdue =
		task.date < todayUTCDate.getTime() && task.status !== "completed";
	const isToday = task.date === todayUTCDate.getTime();

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

		const tomorrow = new Date(todayUTCDate);
		tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

		if (date.getTime() === tomorrow.getTime()) return "Tomorrow";

		// Use UTC methods to display the date consistently
		return date.toLocaleDateString("en-US", {
			weekday: "short",
			month: "short",
			day: "numeric",
			year:
				date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
		});
	};

	const handleToggleComplete = () => {
		if (isUpdating) return;

		const newStatus = task.status === "completed" ? "pending" : "completed";
		onStatusChange(task._id, newStatus);
	};

	return (
		<motion.tr
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -10 }}
			className={cn(
				"group hover:bg-muted/50 transition-colors",
				isOverdue && "bg-red-50/30 dark:bg-red-900/10",
				task.status === "completed" && "opacity-60"
			)}
			onMouseEnter={() => setShowActions(true)}
			onMouseLeave={() => setShowActions(false)}
		>
			{/* Status/Checkbox */}
			<td className="w-12 px-4 py-3">
				<button
					onClick={handleToggleComplete}
					disabled={isUpdating}
					className={cn(
						"p-0.5 rounded-full transition-colors",
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
			</td>

			{/* Title and Description */}
			<td className="px-4 py-3">
				<div className="min-w-0">
					<div className="flex items-center gap-2 mb-1">
						<h3
							className={cn(
								"font-medium text-foreground truncate",
								task.status === "completed" &&
									"line-through text-muted-foreground"
							)}
						>
							{task.title}
						</h3>
						{isOverdue && (
							<AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
						)}
					</div>
					{task.description && (
						<p className="text-sm text-muted-foreground truncate">
							{task.description}
						</p>
					)}
				</div>
			</td>

			{/* Client */}
			<td className="px-4 py-3">
				<div className="flex items-center gap-1 text-sm">
					<Building2 className="h-3 w-3 text-muted-foreground shrink-0" />
					<span className="truncate">{client?.companyName || "Unknown"}</span>
				</div>
			</td>

			{/* Project */}
			<td className="px-4 py-3">
				{project ? (
					<div className="flex items-center gap-1 text-sm">
						<FolderOpen className="h-3 w-3 text-muted-foreground shrink-0" />
						<span className="truncate">{project.title}</span>
					</div>
				) : (
					<span className="text-sm text-muted-foreground">—</span>
				)}
			</td>

			{/* Date */}
			<td className="px-4 py-3">
				<div
					className={cn(
						"flex items-center gap-1 text-sm",
						isOverdue ? "text-red-600" : "text-muted-foreground"
					)}
				>
					<Calendar className="h-3 w-3 shrink-0" />
					<span>{formatDate(taskDateUTC)}</span>
				</div>
			</td>

			{/* Time */}
			<td className="px-4 py-3">
				{task.startTime || task.endTime ? (
					<div className="flex items-center gap-1 text-sm text-muted-foreground">
						<Clock className="h-3 w-3 shrink-0" />
						<span>
							{task.startTime && formatTime(task.startTime)}
							{task.startTime && task.endTime && " - "}
							{task.endTime && formatTime(task.endTime)}
						</span>
					</div>
				) : (
					<span className="text-sm text-muted-foreground">—</span>
				)}
			</td>

			{/* Assignee */}
			<td className="px-4 py-3">
				{assignee ? (
					<div className="flex items-center gap-1 text-sm">
						<User className="h-3 w-3 text-muted-foreground shrink-0" />
						<span className="truncate">{assignee.name || assignee.email}</span>
					</div>
				) : (
					<span className="text-sm text-muted-foreground">Unassigned</span>
				)}
			</td>

			{/* Status */}
			<td className="px-4 py-3">
				<Badge variant="secondary" className={statusConfig[task.status].color}>
					{statusConfig[task.status].label}
				</Badge>
			</td>

			{/* Priority */}
			<td className="px-4 py-3">
				<Badge
					variant="secondary"
					className={cn(
						"text-xs",
						priorityConfig[task.priority || "medium"].color
					)}
				>
					<PriorityIcon className="h-3 w-3 mr-1" />
					{task.priority || "medium"}
				</Badge>
			</td>

			{/* Actions */}
			<td className="w-16 px-4 py-3">
				<AnimatePresence>
					{(showActions || isUpdating) && (
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							className="flex items-center gap-1"
						>
							<button
								onClick={() => onEdit(task)}
								disabled={isUpdating}
								className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
								title="Edit task"
							>
								<Edit className="h-3 w-3" />
							</button>
							<button
								onClick={() => onDelete(task._id)}
								disabled={isUpdating}
								className="p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-900/20 text-muted-foreground hover:text-red-600 transition-colors"
								title="Delete task"
							>
								<Trash2 className="h-3 w-3" />
							</button>
						</motion.div>
					)}
				</AnimatePresence>
			</td>
		</motion.tr>
	);
}

export default function TasksPage() {
	const searchParams = useSearchParams();
	const projectIdFromUrl = searchParams.get(
		"projectId"
	) as Id<"projects"> | null;

	const [searchQuery, setSearchQuery] = useState("");
	const [filters, setFilters] = useState<Filter<unknown>[]>([]);
	const [sortBy, setSortBy] = useState<"date" | "priority" | "status">("date");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
	const [editingTask, setEditingTask] = useState<Task | null>(null);
	const [updatingTasks, setUpdatingTasks] = useState<Set<Id<"tasks">>>(
		new Set()
	);

	// Queries
	const allTasks = useQuery(api.tasks.list, {});
	const projects = useQuery(api.projects.list, {});
	const clients = useQuery(api.clients.list, {});
	const users = useQuery(api.users.listByOrg, {});

	// Mutations
	const updateTaskMutation = useMutation(api.tasks.update);
	const completeTaskMutation = useMutation(api.tasks.complete);
	const deleteTaskMutation = useMutation(api.tasks.remove);

	const isLoading = allTasks === undefined;

	// Get project name if filtering by project
	const filteredProject = projectIdFromUrl
		? projects?.find((p) => p._id === projectIdFromUrl)
		: null;

	// Define filter fields configuration
	const filterFields: FilterFieldConfig<unknown>[] = useMemo(() => {
		const statusOptions = [
			{ value: "pending", label: "Pending" },
			{ value: "in-progress", label: "In Progress" },
			{ value: "completed", label: "Completed" },
			{ value: "cancelled", label: "Cancelled" },
		];

		const priorityOptions = [
			{
				value: "low",
				label: "Low",
				icon: <Flag className="h-3 w-3 text-gray-500" />,
			},
			{
				value: "medium",
				label: "Medium",
				icon: <Flag className="h-3 w-3 text-blue-500" />,
			},
			{
				value: "high",
				label: "High",
				icon: <Flag className="h-3 w-3 text-amber-500" />,
			},
			{
				value: "urgent",
				label: "Urgent",
				icon: <AlertTriangle className="h-3 w-3 text-red-500" />,
			},
		];

		const clientOptions =
			clients?.map((client) => ({
				value: client._id,
				label: client.companyName,
			})) || [];

		const projectOptions =
			projects?.map((project) => ({
				value: project._id,
				label: project.title,
			})) || [];

		const assigneeOptions =
			users?.map(
				(user: { _id: Id<"users">; name?: string; email: string }) => ({
					value: user._id,
					label: user.name || user.email,
				})
			) || [];

		return [
			{
				key: "status",
				label: "Status",
				icon: <CheckCircle2 className="h-3 w-3" />,
				type: "multiselect",
				options: statusOptions,
			},
			{
				key: "priority",
				label: "Priority",
				icon: <Flag className="h-3 w-3" />,
				type: "multiselect",
				options: priorityOptions,
			},
			{
				key: "client",
				label: "Client",
				icon: <Building2 className="h-3 w-3" />,
				type: "multiselect",
				options: clientOptions,
				searchable: true,
			},
			{
				key: "project",
				label: "Project",
				icon: <FolderOpen className="h-3 w-3" />,
				type: "multiselect",
				options: projectOptions,
				searchable: true,
			},
			{
				key: "assignee",
				label: "Assignee",
				icon: <User className="h-3 w-3" />,
				type: "multiselect",
				options: assigneeOptions,
				searchable: true,
			},
			{
				key: "date",
				label: "Date",
				icon: <Calendar className="h-3 w-3" />,
				type: "daterange",
			},
		];
	}, [clients, projects, users]);

	// Filter and sort tasks
	const filteredAndSortedTasks = useMemo(() => {
		if (!allTasks) return [];

		let filtered = allTasks;

		// Project filter (from URL parameter)
		if (projectIdFromUrl) {
			filtered = filtered.filter((task) => task.projectId === projectIdFromUrl);
		}

		// Apply filters from the Filters component
		filters.forEach((filter) => {
			if (filter.values.length === 0) return;

			switch (filter.field) {
				case "status":
					filtered = filtered.filter((task) =>
						filter.values.includes(task.status as unknown)
					);
					break;
				case "priority":
					filtered = filtered.filter((task) =>
						filter.values.includes((task.priority || "medium") as unknown)
					);
					break;
				case "client":
					filtered = filtered.filter((task) =>
						filter.values.includes(task.clientId as unknown)
					);
					break;
				case "project":
					filtered = filtered.filter((task) =>
						filter.values.includes(task.projectId as unknown)
					);
					break;
				case "assignee":
					filtered = filtered.filter(
						(task) =>
							task.assigneeUserId &&
							filter.values.includes(task.assigneeUserId as unknown)
					);
					break;
				case "date":
					if (filter.operator === "between" && filter.values.length === 2) {
						const [startDate, endDate] = filter.values as [string, string];
						if (startDate) {
							const startTimestamp = new Date(startDate).getTime();
							filtered = filtered.filter((task) => task.date >= startTimestamp);
						}
						if (endDate) {
							const endTimestamp = new Date(endDate).getTime();
							filtered = filtered.filter((task) => task.date <= endTimestamp);
						}
					}
					break;
			}
		});

		// Search filter (applies to filtered results)
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(task) =>
					task.title.toLowerCase().includes(query) ||
					task.description?.toLowerCase().includes(query)
			);
		}

		// Sort
		filtered.sort((a, b) => {
			let comparison = 0;

			switch (sortBy) {
				case "date":
					comparison = a.date - b.date;
					break;
				case "priority":
					const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
					const aPriority = priorityOrder[a.priority || "medium"];
					const bPriority = priorityOrder[b.priority || "medium"];
					comparison = bPriority - aPriority; // Higher priority first by default
					break;
				case "status":
					comparison = a.status.localeCompare(b.status);
					break;
			}

			return sortOrder === "desc" ? -comparison : comparison;
		});

		return filtered;
	}, [allTasks, projectIdFromUrl, filters, searchQuery, sortBy, sortOrder]);

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
		} finally {
			setUpdatingTasks((prev) => {
				const newSet = new Set(prev);
				newSet.delete(taskId);
				return newSet;
			});
		}
	};

	const handleEdit = (task: Task) => {
		setEditingTask(task);
	};

	const handleDelete = async (taskId: Id<"tasks">) => {
		if (!window.confirm("Are you sure you want to delete this task?")) return;

		setUpdatingTasks((prev) => new Set(prev).add(taskId));

		try {
			await deleteTaskMutation({ id: taskId });
			console.log("Task deleted successfully!");
		} catch (error) {
			console.error("Error deleting task:", error);
		} finally {
			setUpdatingTasks((prev) => {
				const newSet = new Set(prev);
				newSet.delete(taskId);
				return newSet;
			});
		}
	};

	const toggleSort = (field: typeof sortBy) => {
		if (sortBy === field) {
			setSortOrder(sortOrder === "asc" ? "desc" : "asc");
		} else {
			setSortBy(field);
			setSortOrder("asc");
		}
	};

	// Stats - Calculate today in UTC for consistent comparisons
	const todayUTC = new Date();
	todayUTC.setHours(0, 0, 0, 0);
	const todayUTCTimestamp = Date.UTC(
		todayUTC.getFullYear(),
		todayUTC.getMonth(),
		todayUTC.getDate()
	);

	const totalTasks = allTasks?.length || 0;
	const completedTasks =
		allTasks?.filter((t) => t.status === "completed").length || 0;
	const overdueTasks =
		allTasks?.filter(
			(t) => t.date < todayUTCTimestamp && t.status !== "completed"
		).length || 0;

	return (
		<motion.div
			className="p-4 sm:p-6 lg:p-8 space-y-6"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			{/* Header */}
			<div className="flex items-start justify-between gap-4">
				<div className="space-y-1">
					<h1 className="text-2xl sm:text-3xl font-bold text-foreground">
						Tasks
						{filteredProject && (
							<span className="text-lg sm:text-xl font-normal text-muted-foreground ml-2">
								for {filteredProject.title}
							</span>
						)}
					</h1>
					<p className="text-muted-foreground">
						{isLoading
							? "Loading tasks..."
							: `${totalTasks} total • ${completedTasks} completed • ${overdueTasks} overdue`}
					</p>
				</div>
				<TaskSheet
					mode="create"
					trigger={
						<StyledButton
							label="New Task"
							icon={<Plus className="h-4 w-4" />}
							intent="primary"
						/>
					}
				/>
			</div>

		{/* Filters and Search */}
		<div className="flex flex-col sm:flex-row gap-4 items-start">
			{/* Filters with integrated clear button on the left */}
			<StyledFilters
				filters={filters}
				fields={filterFields}
				onChange={setFilters}
				addButtonText="Filter"
				addButtonIcon={<FilterIcon className="h-4 w-4" />}
				size="md"
				variant="outline"
				showClearButton={true}
				clearButtonText="Clear"
				clearButtonIcon={<X className="h-4 w-4" />}
			/>

			{/* Search in the middle */}
			<div className="relative flex-1">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
				<Input
					placeholder="Search tasks..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="pl-10"
				/>
			</div>

			{/* Additional clear button for search only */}
			{searchQuery.trim() !== "" && filters.length === 0 && (
				<StyledButton
					label="Clear"
					icon={<X className="h-4 w-4" />}
					intent="outline"
					onClick={() => setSearchQuery("")}
					showArrow={false}
				/>
			)}
		</div>

			{/* Tasks Table */}
			<div className="bg-card rounded-lg border overflow-hidden">
				{isLoading ? (
					<div className="p-8">
						<div className="space-y-4">
							{[1, 2, 3, 4, 5].map((i) => (
								<div key={i} className="flex items-center gap-4">
									<Skeleton className="h-5 w-5 rounded-full" />
									<Skeleton className="h-5 flex-1" />
									<Skeleton className="h-5 w-20" />
									<Skeleton className="h-5 w-16" />
									<Skeleton className="h-5 w-24" />
								</div>
							))}
						</div>
					</div>
				) : filteredAndSortedTasks.length > 0 ? (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-muted/30">
								<tr className="text-left">
									<th className="w-12 px-4 py-3"></th>
									<th className="px-4 py-3 font-medium text-muted-foreground">
										Task
									</th>
									<th className="px-4 py-3 font-medium text-muted-foreground">
										Client
									</th>
									<th className="px-4 py-3 font-medium text-muted-foreground">
										Project
									</th>
									<th className="px-4 py-3 font-medium text-muted-foreground">
										<button
											onClick={() => toggleSort("date")}
											className="flex items-center gap-1 hover:text-foreground"
										>
											Date
											{sortBy === "date" &&
												(sortOrder === "asc" ? (
													<SortAsc className="h-3 w-3" />
												) : (
													<SortDesc className="h-3 w-3" />
												))}
										</button>
									</th>
									<th className="px-4 py-3 font-medium text-muted-foreground">
										Time
									</th>
									<th className="px-4 py-3 font-medium text-muted-foreground">
										Assignee
									</th>
									<th className="px-4 py-3 font-medium text-muted-foreground">
										<button
											onClick={() => toggleSort("status")}
											className="flex items-center gap-1 hover:text-foreground"
										>
											Status
											{sortBy === "status" &&
												(sortOrder === "asc" ? (
													<SortAsc className="h-3 w-3" />
												) : (
													<SortDesc className="h-3 w-3" />
												))}
										</button>
									</th>
									<th className="px-4 py-3 font-medium text-muted-foreground">
										<button
											onClick={() => toggleSort("priority")}
											className="flex items-center gap-1 hover:text-foreground"
										>
											Priority
											{sortBy === "priority" &&
												(sortOrder === "asc" ? (
													<SortAsc className="h-3 w-3" />
												) : (
													<SortDesc className="h-3 w-3" />
												))}
										</button>
									</th>
									<th className="w-16 px-4 py-3"></th>
								</tr>
							</thead>
							<tbody>
								<AnimatePresence>
									{filteredAndSortedTasks.map((task) => (
										<TaskRow
											key={task._id}
											task={task}
											onStatusChange={handleStatusChange}
											onEdit={handleEdit}
											onDelete={handleDelete}
											isUpdating={updatingTasks.has(task._id)}
										/>
									))}
								</AnimatePresence>
							</tbody>
						</table>
					</div>
				) : (
					<div className="text-center py-12">
						<div className="space-y-4">
							<div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full">
								<Calendar className="h-8 w-8 text-muted-foreground" />
							</div>
							<div className="space-y-2">
								<h3 className="text-lg font-medium">No tasks found</h3>
								<p className="text-muted-foreground max-w-md mx-auto">
									{searchQuery || filters.length > 0
										? "No tasks match your current filters or search. Try adjusting your filters or clearing them."
										: "You haven't created any tasks yet. Create your first task to get started."}
								</p>
							</div>
							{!searchQuery && filters.length === 0 && (
								<TaskSheet
									mode="create"
									trigger={
										<StyledButton
											label="Create Your First Task"
											icon={<Plus className="h-4 w-4" />}
											intent="primary"
										/>
									}
								/>
							)}
						</div>
					</div>
				)}
			</div>

			{/* Edit Task Sheet */}
			{editingTask && (
				<TaskSheet
					task={editingTask}
					mode="edit"
					onOpenChange={(open) => !open && setEditingTask(null)}
				/>
			)}
		</motion.div>
	);
}
