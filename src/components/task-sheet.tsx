"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetDescription,
	SheetBody,
	SheetFooter,
	SheetClose,
	SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import {
	Calendar,
	Clock,
	User,
	Flag,
	Building2,
	FolderOpen,
} from "lucide-react";

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

interface TaskSheetProps {
	task?: Task | null;
	onOpenChange?: (open: boolean) => void;
	trigger?: React.ReactNode;
	mode?: "create" | "edit";
}

const priorityOptions = [
	{ value: "low", label: "Low", color: "text-gray-600" },
	{ value: "medium", label: "Medium", color: "text-blue-600" },
	{ value: "high", label: "High", color: "text-amber-600" },
	{ value: "urgent", label: "Urgent", color: "text-red-600" },
];

const statusOptions = [
	{ value: "pending", label: "Pending", color: "text-gray-600" },
	{ value: "in-progress", label: "In Progress", color: "text-blue-600" },
	{ value: "completed", label: "Completed", color: "text-green-600" },
	{ value: "cancelled", label: "Cancelled", color: "text-red-600" },
];

const repeatOptions = [
	{ value: "none", label: "No repeat" },
	{ value: "daily", label: "Daily" },
	{ value: "weekly", label: "Weekly" },
	{ value: "monthly", label: "Monthly" },
];

export function TaskSheet({
	task,
	onOpenChange,
	trigger,
	mode,
}: TaskSheetProps) {
	const { error: toastError, success: toastSuccess } = useToast();
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		clientId: "" as Id<"clients"> | "",
		projectId: "" as Id<"projects"> | "",
		date: "",
		startTime: "",
		endTime: "",
		assigneeUserId: "" as Id<"users"> | "",
		status: "pending" as Task["status"],
		priority: "medium" as Task["priority"],
		repeat: "none" as Task["repeat"],
		repeatUntil: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Queries for form data
	const clients = useQuery(api.clients.list, {});
	const projects = useQuery(
		api.projects.list,
		formData.clientId ? { clientId: formData.clientId as Id<"clients"> } : {}
	);
	const users = useQuery(api.users.listByOrg);

	// Mutations
	const createTask = useMutation(api.tasks.create);
	const updateTask = useMutation(api.tasks.update);

	// Determine if this is create or edit mode
	const isEditMode = mode === "edit" || !!task;
	const isCreateMode = mode === "create" || !task;

	// Initialize form with task data if editing
	useEffect(() => {
		if (isEditMode && task) {
			const taskDate = new Date(task.date);
			setFormData({
				title: task.title,
				description: task.description || "",
				clientId: task.clientId,
				projectId: task.projectId || "",
				date: taskDate.toISOString().split("T")[0], // Convert to YYYY-MM-DD format
				startTime: task.startTime || "",
				endTime: task.endTime || "",
				assigneeUserId: task.assigneeUserId || "",
				status: task.status,
				priority: task.priority || "medium",
				repeat: task.repeat || "none",
				repeatUntil: task.repeatUntil
					? new Date(task.repeatUntil).toISOString().split("T")[0]
					: "",
			});
		} else if (isCreateMode) {
			// Reset form for create mode
			const today = new Date().toISOString().split("T")[0];
			setFormData({
				title: "",
				description: "",
				clientId: "",
				projectId: "",
				date: today,
				startTime: "",
				endTime: "",
				assigneeUserId: "",
				status: "pending",
				priority: "medium",
				repeat: "none",
				repeatUntil: "",
			});
		}
	}, [task, isEditMode, isCreateMode]);

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));

		// Clear project when client changes
		if (field === "clientId") {
			setFormData((prev) => ({ ...prev, projectId: "" }));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.title.trim()) {
			toastError("Task title is required");
			return;
		}

		if (!formData.clientId) {
			toastError("Please select a client");
			return;
		}

		if (!formData.date) {
			toastError("Please select a date");
			return;
		}

		setIsSubmitting(true);

		try {
			const taskDate = new Date(formData.date).getTime();
			const repeatUntil = formData.repeatUntil
				? new Date(formData.repeatUntil).getTime()
				: undefined;

			const taskData = {
				title: formData.title.trim(),
				description: formData.description.trim() || undefined,
				clientId: formData.clientId as Id<"clients">,
				projectId: formData.projectId
					? (formData.projectId as Id<"projects">)
					: undefined,
				date: taskDate,
				startTime: formData.startTime || undefined,
				endTime: formData.endTime || undefined,
				assigneeUserId: formData.assigneeUserId
					? (formData.assigneeUserId as Id<"users">)
					: undefined,
				status: formData.status,
				priority: formData.priority,
				repeat: formData.repeat,
				repeatUntil,
			};

			if (isEditMode && task) {
				await updateTask({
					id: task._id,
					...taskData,
				});
				toastSuccess("Task updated successfully!");
			} else {
				await createTask(taskData);
				toastSuccess("Task created successfully!");
			}

			if (onOpenChange) onOpenChange(false);
		} catch (error) {
			console.error("Error saving task:", error);
			toastError(
				error instanceof Error ? error.message : "Failed to save task"
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const sheetContent = (
		<SheetContent className="w-full sm:max-w-md bg-white dark:bg-gray-900">
			<SheetHeader>
				<SheetTitle className="flex items-center gap-2">
					{isEditMode ? "Edit Task" : "Create New Task"}
				</SheetTitle>
				<SheetDescription>
					{isEditMode
						? "Update the task details below."
						: "Add a new task to your schedule. Fill in the details below."}
				</SheetDescription>
			</SheetHeader>

			<SheetBody>
				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Title */}
					<div className="space-y-2">
						<label className="text-sm font-medium text-foreground">
							Task Title <span className="text-red-500">*</span>
						</label>
						<Input
							value={formData.title}
							onChange={(e) => handleInputChange("title", e.target.value)}
							placeholder="Enter task title..."
							className="w-full"
						/>
					</div>

					{/* Description */}
					<div className="space-y-2">
						<label className="text-sm font-medium text-foreground">
							Description
						</label>
						<textarea
							value={formData.description}
							onChange={(e) => handleInputChange("description", e.target.value)}
							placeholder="Add task description..."
							className={cn(
								"flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm",
								"placeholder:text-muted-foreground",
								"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
								"disabled:cursor-not-allowed disabled:opacity-50"
							)}
							rows={3}
						/>
					</div>

					{/* Client Selection */}
					<div className="space-y-2">
						<label className="text-sm font-medium text-foreground flex items-center gap-2">
							<Building2 className="h-4 w-4" />
							Client <span className="text-red-500">*</span>
						</label>
						<select
							value={formData.clientId}
							onChange={(e) => handleInputChange("clientId", e.target.value)}
							className={cn(
								"flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm",
								"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
								"disabled:cursor-not-allowed disabled:opacity-50"
							)}
						>
							<option value="">Select a client...</option>
							{clients?.map((client) => (
								<option key={client._id} value={client._id}>
									{client.companyName}
								</option>
							))}
						</select>
					</div>

					{/* Project Selection */}
					<div className="space-y-2">
						<label className="text-sm font-medium text-foreground flex items-center gap-2">
							<FolderOpen className="h-4 w-4" />
							Project (Optional)
						</label>
						<select
							value={formData.projectId}
							onChange={(e) => handleInputChange("projectId", e.target.value)}
							disabled={!formData.clientId}
							className={cn(
								"flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm",
								"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
								"disabled:cursor-not-allowed disabled:opacity-50"
							)}
						>
							<option value="">No project selected</option>
							{projects?.map((project) => (
								<option key={project._id} value={project._id}>
									{project.title}
								</option>
							))}
						</select>
					</div>

					{/* Date and Time */}
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						<div className="space-y-2">
							<label className="text-sm font-medium text-foreground flex items-center gap-2">
								<Calendar className="h-4 w-4" />
								Date <span className="text-red-500">*</span>
							</label>
							<Input
								type="date"
								value={formData.date}
								onChange={(e) => handleInputChange("date", e.target.value)}
								className="w-full"
							/>
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium text-foreground flex items-center gap-2">
								<Clock className="h-4 w-4" />
								Start Time
							</label>
							<Input
								type="time"
								value={formData.startTime}
								onChange={(e) => handleInputChange("startTime", e.target.value)}
								className="w-full"
							/>
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium text-foreground flex items-center gap-2">
								<Clock className="h-4 w-4" />
								End Time
							</label>
							<Input
								type="time"
								value={formData.endTime}
								onChange={(e) => handleInputChange("endTime", e.target.value)}
								className="w-full"
							/>
						</div>
					</div>

					{/* Status and Priority */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="space-y-2">
							<label className="text-sm font-medium text-foreground">
								Status
							</label>
							<select
								value={formData.status}
								onChange={(e) => handleInputChange("status", e.target.value)}
								className={cn(
									"flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm",
									"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
								)}
							>
								{statusOptions.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium text-foreground flex items-center gap-2">
								<Flag className="h-4 w-4" />
								Priority
							</label>
							<select
								value={formData.priority}
								onChange={(e) => handleInputChange("priority", e.target.value)}
								className={cn(
									"flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm",
									"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
								)}
							>
								{priorityOptions.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
						</div>
					</div>

					{/* Assignee */}
					<div className="space-y-2">
						<label className="text-sm font-medium text-foreground flex items-center gap-2">
							<User className="h-4 w-4" />
							Assign To
						</label>
						<select
							value={formData.assigneeUserId}
							onChange={(e) =>
								handleInputChange("assigneeUserId", e.target.value)
							}
							className={cn(
								"flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm",
								"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
							)}
						>
							<option value="">Unassigned</option>
							{users?.map((user) => (
								<option key={user._id} value={user._id}>
									{user.name || user.email}
								</option>
							))}
						</select>
					</div>

					{/* Repeat Options */}
					<div className="space-y-4">
						<div className="space-y-2">
							<label className="text-sm font-medium text-foreground">
								Repeat
							</label>
							<select
								value={formData.repeat}
								onChange={(e) => handleInputChange("repeat", e.target.value)}
								className={cn(
									"flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm",
									"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
								)}
							>
								{repeatOptions.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
						</div>

						{formData.repeat !== "none" && (
							<div className="space-y-2">
								<label className="text-sm font-medium text-foreground">
									Repeat Until
								</label>
								<Input
									type="date"
									value={formData.repeatUntil}
									onChange={(e) =>
										handleInputChange("repeatUntil", e.target.value)
									}
									className="w-full"
								/>
							</div>
						)}
					</div>
				</form>
			</SheetBody>

			<SheetFooter className="flex flex-row justify-end gap-2">
				<SheetClose intent="outline" isDisabled={isSubmitting}>
					Cancel
				</SheetClose>
				<Button
					onClick={handleSubmit}
					isPending={isSubmitting}
					isDisabled={
						isSubmitting || !formData.title.trim() || !formData.clientId
					}
				>
					{isSubmitting
						? isEditMode
							? "Updating..."
							: "Creating..."
						: isEditMode
							? "Update Task"
							: "Create Task"}
				</Button>
			</SheetFooter>
		</SheetContent>
	);

	// If trigger is provided, wrap in Sheet with trigger
	if (trigger) {
		return (
			<Sheet>
				<SheetTrigger className="group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-all duration-200 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/15 ring-1 ring-primary/30 hover:ring-primary/40 shadow-sm hover:shadow-md backdrop-blur-sm">
					{trigger}
				</SheetTrigger>
				{sheetContent}
			</Sheet>
		);
	}

	// If controlled from parent, just return content
	return <Sheet>{sheetContent}</Sheet>;
}

// Export default for easier importing
export default TaskSheet;
