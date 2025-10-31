"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { StyledButton } from "@/components/ui/styled/styled-button";
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
	isOpen?: boolean;
	initialValues?: {
		clientId?: Id<"clients">;
		projectId?: Id<"projects">;
	};
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
	isOpen,
	initialValues,
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
			// Reset form for create mode with optional initial values
			const today = new Date().toISOString().split("T")[0];
			setFormData({
				title: "",
				description: "",
				clientId: initialValues?.clientId || "",
				projectId: initialValues?.projectId || "",
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
	}, [task, isEditMode, isCreateMode, initialValues, mode]);

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));

		// Clear project when client changes
		if (field === "clientId") {
			setFormData((prev) => ({ ...prev, projectId: "" }));
		}
	};

	const handleSubmit = async (e?: React.FormEvent) => {
		e?.preventDefault();

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
		<SheetContent
			side="right"
			className="w-full sm:max-w-xl overflow-y-auto"
			isBlurred={true}
		>
			<SheetHeader className="border-b border-border pb-4">
				<SheetTitle className="flex items-center gap-2 text-2xl font-semibold">
					{isEditMode ? "Edit Task" : "Create New Task"}
				</SheetTitle>
				<SheetDescription className="text-muted-foreground">
					{isEditMode
						? "Update the task details below."
						: "Add a new task to your schedule. Fill in the details below."}
				</SheetDescription>
			</SheetHeader>

			<SheetBody className="pt-6">
				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Title */}
					<div className="space-y-2.5">
						<label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
							Task Title <span className="text-danger">*</span>
						</label>
						<Input
							value={formData.title}
							onChange={(e) => handleInputChange("title", e.target.value)}
							placeholder="Enter task title..."
							className="w-full transition-all duration-200 hover:border-primary/50 focus:border-primary"
						/>
					</div>

					{/* Description */}
					<div className="space-y-2.5">
						<label className="text-sm font-semibold text-foreground">
							Description
						</label>
						<textarea
							value={formData.description}
							onChange={(e) => handleInputChange("description", e.target.value)}
							placeholder="Add task description..."
							className={cn(
								"flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2.5 text-sm",
								"placeholder:text-muted-foreground",
								"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
								"disabled:cursor-not-allowed disabled:opacity-50",
								"transition-all duration-200 hover:border-primary/50 focus:border-primary",
								"resize-none"
							)}
							rows={4}
						/>
					</div>

					{/* Client Selection */}
					<div className="space-y-2.5">
						<label className="text-sm font-semibold text-foreground flex items-center gap-2">
							<Building2 className="h-4 w-4 text-primary" />
							Client <span className="text-danger">*</span>
						</label>
						<select
							value={formData.clientId}
							onChange={(e) => handleInputChange("clientId", e.target.value)}
							className={cn(
								"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
								"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
								"disabled:cursor-not-allowed disabled:opacity-50",
								"transition-all duration-200 hover:border-primary/50 focus:border-primary",
								"cursor-pointer"
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
					<div className="space-y-2.5">
						<label className="text-sm font-semibold text-foreground flex items-center gap-2">
							<FolderOpen className="h-4 w-4 text-primary" />
							Project{" "}
							<span className="text-muted-foreground text-xs">(Optional)</span>
						</label>
						<select
							value={formData.projectId}
							onChange={(e) => handleInputChange("projectId", e.target.value)}
							disabled={!formData.clientId}
							className={cn(
								"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
								"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
								"disabled:cursor-not-allowed disabled:opacity-50",
								"transition-all duration-200 hover:border-primary/50 focus:border-primary",
								"cursor-pointer"
							)}
						>
							<option value="">No project selected</option>
							{projects?.map((project) => (
								<option key={project._id} value={project._id}>
									{project.title}
								</option>
							))}
						</select>
						{!formData.clientId && (
							<p className="text-xs text-muted-foreground">
								Select a client first to choose a project
							</p>
						)}
					</div>

					{/* Date and Time */}
					<div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border/50">
						<h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
							<Calendar className="h-4 w-4 text-primary" />
							Schedule
						</h3>
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
							<div className="space-y-2">
								<label className="text-xs font-medium text-foreground">
									Date <span className="text-danger">*</span>
								</label>
								<Input
									type="date"
									value={formData.date}
									onChange={(e) => handleInputChange("date", e.target.value)}
									className="w-full transition-all duration-200 hover:border-primary/50 focus:border-primary"
								/>
							</div>
							<div className="space-y-2">
								<label className="text-xs font-medium text-foreground flex items-center gap-1.5">
									<Clock className="h-3.5 w-3.5" />
									Start Time
								</label>
								<Input
									type="time"
									value={formData.startTime}
									onChange={(e) =>
										handleInputChange("startTime", e.target.value)
									}
									className="w-full transition-all duration-200 hover:border-primary/50 focus:border-primary"
								/>
							</div>
							<div className="space-y-2">
								<label className="text-xs font-medium text-foreground flex items-center gap-1.5">
									<Clock className="h-3.5 w-3.5" />
									End Time
								</label>
								<Input
									type="time"
									value={formData.endTime}
									onChange={(e) => handleInputChange("endTime", e.target.value)}
									className="w-full transition-all duration-200 hover:border-primary/50 focus:border-primary"
								/>
							</div>
						</div>
					</div>

					{/* Status and Priority */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="space-y-2.5">
							<label className="text-sm font-semibold text-foreground">
								Status
							</label>
							<select
								value={formData.status}
								onChange={(e) => handleInputChange("status", e.target.value)}
								className={cn(
									"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
									"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
									"transition-all duration-200 hover:border-primary/50 focus:border-primary",
									"cursor-pointer"
								)}
							>
								{statusOptions.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
						</div>
						<div className="space-y-2.5">
							<label className="text-sm font-semibold text-foreground flex items-center gap-2">
								<Flag className="h-4 w-4 text-primary" />
								Priority
							</label>
							<select
								value={formData.priority}
								onChange={(e) => handleInputChange("priority", e.target.value)}
								className={cn(
									"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
									"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
									"transition-all duration-200 hover:border-primary/50 focus:border-primary",
									"cursor-pointer"
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
					<div className="space-y-2.5">
						<label className="text-sm font-semibold text-foreground flex items-center gap-2">
							<User className="h-4 w-4 text-primary" />
							Assign To
						</label>
						<select
							value={formData.assigneeUserId}
							onChange={(e) =>
								handleInputChange("assigneeUserId", e.target.value)
							}
							className={cn(
								"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
								"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
								"transition-all duration-200 hover:border-primary/50 focus:border-primary",
								"cursor-pointer"
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
					<div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border/50">
						<h3 className="text-sm font-semibold text-foreground">
							Recurrence
						</h3>
						<div className="space-y-2.5">
							<label className="text-xs font-medium text-foreground">
								Repeat
							</label>
							<select
								value={formData.repeat}
								onChange={(e) => handleInputChange("repeat", e.target.value)}
								className={cn(
									"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
									"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
									"transition-all duration-200 hover:border-primary/50 focus:border-primary",
									"cursor-pointer"
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
							<div className="space-y-2.5 animate-in fade-in-50 slide-in-from-top-2 duration-200">
								<label className="text-xs font-medium text-foreground">
									Repeat Until
								</label>
								<Input
									type="date"
									value={formData.repeatUntil}
									onChange={(e) =>
										handleInputChange("repeatUntil", e.target.value)
									}
									className="w-full transition-all duration-200 hover:border-primary/50 focus:border-primary"
								/>
							</div>
						)}
					</div>
				</form>
			</SheetBody>

			<SheetFooter className="flex flex-row justify-end gap-3 border-t border-border pt-4 mt-6">
				<SheetClose intent="outline" isDisabled={isSubmitting}>
					Cancel
				</SheetClose>
				<StyledButton
					onClick={() => handleSubmit()}
					intent="primary"
					isLoading={isSubmitting}
					disabled={
						isSubmitting || !formData.title.trim() || !formData.clientId
					}
					label={
						isSubmitting
							? isEditMode
								? "Updating..."
								: "Creating..."
							: isEditMode
								? "Update Task"
								: "Create Task"
					}
					className="min-w-[120px]"
				/>
			</SheetFooter>
		</SheetContent>
	);

	// If trigger is provided, wrap in Sheet with trigger
	if (trigger) {
		return (
			<Sheet>
				<SheetTrigger className="group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/90 transition-all duration-300 px-4 py-2.5 rounded-lg bg-primary/10 hover:bg-primary/15 ring-1 ring-primary/20 hover:ring-primary/30 shadow-sm hover:shadow-md backdrop-blur-sm transform hover:scale-[1.02] active:scale-[0.98]">
					{trigger}
				</SheetTrigger>
				{sheetContent}
			</Sheet>
		);
	}

	// If controlled from parent with isOpen prop
	return (
		<Sheet isOpen={isOpen} onOpenChange={onOpenChange}>
			{sheetContent}
		</Sheet>
	);
}

// Export default for easier importing
export default TaskSheet;
