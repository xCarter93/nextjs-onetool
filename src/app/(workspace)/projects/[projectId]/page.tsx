"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, ClipboardList, Receipt } from "lucide-react";
import { TaskSheet } from "@/components/shared/task-sheet";
import { ProjectViewEditForm } from "@/app/(workspace)/projects/components/project-view-edit-form";
import { MentionSection } from "@/components/shared/mention-section";
import { StatusProgressBar } from "@/components/shared/status-progress-bar";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover";
import DeleteConfirmationModal from "@/components/ui/delete-confirmation-modal";
import { InvoiceGenerationModal } from "@/app/(workspace)/projects/components/invoice-generation-modal";
import { useState } from "react";
import type { Id } from "../../../../../convex/_generated/dataModel";

export default function ProjectDetailPage() {
	const params = useParams();
	const router = useRouter();
	const toast = useToast();
	const [isUpdating, setIsUpdating] = useState(false);
	const [isTaskSheetOpen, setIsTaskSheetOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

	const projectId = params.projectId as Id<"projects">;

	// Fetch project data
	const project = useQuery(api.projects.get, { id: projectId });
	// Skip queries if project is null or deletion is in progress
	const projectTasks = useQuery(
		api.tasks.list,
		project === null || isDeleting ? "skip" : { projectId }
	);
	const projectQuotes = useQuery(
		api.quotes.list,
		project === null || isDeleting ? "skip" : { projectId }
	);

	// Mutations
	const updateProject = useMutation(api.projects.update);
	const deleteProject = useMutation(api.projects.remove);

	const handleUpdate = async (updates: Partial<typeof project>) => {
		setIsUpdating(true);
		try {
			await updateProject({ id: projectId, ...updates });
			toast.success("Project Updated", "Your changes have been saved.");
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Failed to save changes";
			toast.error("Error", message);
		} finally {
			setIsUpdating(false);
		}
	};

	// Loading state
	if (project === undefined) {
		return (
			<div className="w-full px-6">
				<div className="w-full pt-8 pb-24">
					<div className="animate-pulse space-y-8">
						<div className="mb-8">
							<div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3"></div>
							<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
						</div>
						<div className="space-y-8">
							<div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
							<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
								<div className="lg:col-span-2 h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
								<div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Project not found
	if (project === null) {
		return (
			<div className="w-full px-6">
				<div className="w-full pt-8 pb-24 flex flex-col items-center justify-center h-96 space-y-4">
					<div className="text-6xl">📋</div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
						Project Not Found
					</h1>
					<p className="text-gray-600 dark:text-gray-400 text-center">
						The project you&apos;re looking for doesn&apos;t exist or you
						don&apos;t have permission to view it.
					</p>
					<Button onClick={() => router.push("/projects")}>
						Back to Projects
					</Button>
				</div>
			</div>
		);
	}

	const handleStatusUpdate = async (
		newStatus: "planned" | "in-progress" | "completed" | "cancelled"
	) => {
		setIsUpdating(true);
		try {
			await updateProject({
				id: projectId,
				status: newStatus,
			});
			toast.success(
				"Project Updated",
				`Project status changed to ${newStatus}`
			);
		} catch {
			toast.error("Error", "Failed to update project status");
		} finally {
			setIsUpdating(false);
		}
	};

	const handleDeleteProject = async () => {
		setIsDeleteModalOpen(true);
	};

	const confirmDeleteProject = async () => {
		setIsDeleting(true);
		try {
			await deleteProject({ id: projectId });
			toast.success("Project Deleted", "Project has been successfully deleted");
			setIsDeleteModalOpen(false);
			router.push("/projects");
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Failed to delete project";
			toast.error("Error", message);
			setIsDeleteModalOpen(false);
			setIsDeleting(false);
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "planned":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
			case "in-progress":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
			case "completed":
				return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
			case "cancelled":
				return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
		}
	};

	const formatDate = (timestamp?: number) => {
		if (!timestamp) return "Not set";
		return new Date(timestamp).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	// Filter approved quotes for invoice generation
	const approvedQuotes =
		projectQuotes?.filter((quote) => quote.status === "approved") || [];

	return (
		<>
			<TaskSheet
				mode="create"
				isOpen={isTaskSheetOpen}
				onOpenChange={setIsTaskSheetOpen}
				initialValues={{
					clientId: project?.clientId,
					projectId: projectId,
				}}
			/>
			<DeleteConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				onConfirm={confirmDeleteProject}
				title="Delete Project"
				itemName={project.title}
				itemType="Project"
				isArchive={false}
			/>
			<InvoiceGenerationModal
				isOpen={isInvoiceModalOpen}
				onClose={() => setIsInvoiceModalOpen(false)}
				approvedQuotes={approvedQuotes}
			/>
			<div className="w-full px-6">
				<div className="w-full pt-8 pb-24">
					{/* Header */}
					<div className="mb-8">
						<div className="flex items-center gap-8 mb-6">
							<div>
								<h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
									{project.title}
								</h1>
								<p className="text-base text-gray-600 dark:text-gray-400">
									Project #{project.projectNumber || projectId.slice(-6)}
								</p>
							</div>
							<div className="flex-1">
								<StatusProgressBar
									status={project.status}
									steps={[
										{ id: "planned", name: "Planned", order: 1 },
										{ id: "in-progress", name: "In Progress", order: 2 },
										{ id: "completed", name: "Completed", order: 3 },
									]}
									events={[
										...(project._creationTime
											? [{ type: "planned", timestamp: project._creationTime }]
											: []),
										...(project.startDate
											? [{ type: "in-progress", timestamp: project.startDate }]
											: []),
										...(project.completedAt
											? [{ type: "completed", timestamp: project.completedAt }]
											: []),
									]}
									failureStatuses={["cancelled"]}
									successStatuses={["completed"]}
								/>
							</div>
						</div>
						<div className="flex items-center justify-end">
							<div className="flex items-center gap-3">
								{/* Tasks Summary - Compact */}
								<Popover>
									<PopoverTrigger asChild>
										<button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-200/60 dark:border-white/10 hover:border-primary/30 dark:hover:border-primary/30 hover:bg-gray-50 dark:hover:bg-white/5 transition-all cursor-pointer group">
											<svg
												className="w-4 h-4 text-blue-600 dark:text-blue-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
												/>
											</svg>
											<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
												{projectTasks?.length || 0}
											</span>
											<span className="text-xs text-gray-500 dark:text-gray-400">
												Tasks
											</span>
										</button>
									</PopoverTrigger>
									<PopoverContent
										className="w-96 p-0 bg-white dark:bg-gray-900"
										align="end"
										side="bottom"
									>
										<div className="p-4 border-b border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900">
											<div className="flex items-center justify-between">
												<h3 className="font-semibold text-gray-900 dark:text-white">
													Project Tasks
												</h3>
												<button
													onClick={() => setIsTaskSheetOpen(true)}
													className="group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-all duration-200 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/15 ring-1 ring-primary/30 hover:ring-primary/40 shadow-sm hover:shadow-md backdrop-blur-sm"
												>
													<Plus className="h-4 w-4" />
													New Task
													<span
														aria-hidden="true"
														className="group-hover:translate-x-1 transition-transform duration-200"
													>
														→
													</span>
												</button>
											</div>
										</div>
										<div className="max-h-96 overflow-y-auto bg-white dark:bg-gray-900">
											{projectTasks && projectTasks.length > 0 ? (
												<div className="p-2">
													{projectTasks.map((task) => (
														<div
															key={task._id}
															className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors"
														>
															<div className="flex items-center gap-3 flex-1 min-w-0">
																<div
																	className={`w-2 h-2 rounded-full shrink-0 ${
																		task.status === "completed"
																			? "bg-green-500"
																			: task.status === "cancelled"
																				? "bg-red-500"
																				: "bg-yellow-500"
																	}`}
																/>
																<div className="flex-1 min-w-0">
																	<p className="font-medium text-sm text-gray-900 dark:text-white truncate">
																		{task.title}
																	</p>
																	{task.date && (
																		<p className="text-xs text-gray-500 dark:text-gray-400">
																			{formatDate(task.date)}
																		</p>
																	)}
																</div>
															</div>
															<Badge
																className={getStatusColor(task.status)}
																variant="outline"
															>
																{task.status}
															</Badge>
														</div>
													))}
												</div>
											) : (
												<div className="p-8 text-center">
													<div className="flex justify-center mb-3">
														<ClipboardList className="h-12 w-12 text-gray-400 dark:text-gray-600" />
													</div>
													<p className="text-sm text-gray-500 dark:text-gray-400">
														No tasks yet
													</p>
												</div>
											)}
										</div>
									</PopoverContent>
								</Popover>

								{/* Quotes Summary - Compact */}
								<Popover>
									<PopoverTrigger asChild>
										<button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-200/60 dark:border-white/10 hover:border-primary/30 dark:hover:border-primary/30 hover:bg-gray-50 dark:hover:bg-white/5 transition-all cursor-pointer group">
											<svg
												className="w-4 h-4 text-green-600 dark:text-green-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
												/>
											</svg>
											<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
												{projectQuotes?.length || 0}
											</span>
											<span className="text-xs text-gray-500 dark:text-gray-400">
												Quotes
											</span>
										</button>
									</PopoverTrigger>
									<PopoverContent
										className="w-96 p-0 bg-white dark:bg-gray-900"
										align="end"
										side="bottom"
									>
										<div className="p-4 border-b border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900">
											<div className="flex items-center justify-between">
												<h3 className="font-semibold text-gray-900 dark:text-white">
													Project Quotes
												</h3>
												<button
													onClick={() =>
														router.push(`/quotes/new?projectId=${projectId}`)
													}
													className="group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-all duration-200 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/15 ring-1 ring-primary/30 hover:ring-primary/40 shadow-sm hover:shadow-md backdrop-blur-sm"
												>
													<Plus className="h-4 w-4" />
													New Quote
													<span
														aria-hidden="true"
														className="group-hover:translate-x-1 transition-transform duration-200"
													>
														→
													</span>
												</button>
											</div>
										</div>
										<div className="max-h-96 overflow-y-auto bg-white dark:bg-gray-900">
											{projectQuotes && projectQuotes.length > 0 ? (
												<div className="p-2">
													{projectQuotes.map((quote) => (
														<div
															key={quote._id}
															className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
															onClick={() =>
																router.push(`/quotes/${quote._id}`)
															}
														>
															<div className="flex items-center gap-3 flex-1 min-w-0">
																<div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
																<div className="flex-1 min-w-0">
																	<p className="font-medium text-sm text-gray-900 dark:text-white truncate">
																		Quote #
																		{quote.quoteNumber || quote._id.slice(-6)}
																	</p>
																	<p className="text-xs text-gray-500 dark:text-gray-400">
																		{formatDate(quote._creationTime)}
																	</p>
																</div>
															</div>
															<div className="text-right shrink-0">
																{quote.total && (
																	<p className="font-medium text-sm text-gray-900 dark:text-white">
																		${quote.total.toLocaleString()}
																	</p>
																)}
																<Badge
																	className={getStatusColor(
																		quote.status || "draft"
																	)}
																	variant="outline"
																>
																	{quote.status || "draft"}
																</Badge>
															</div>
														</div>
													))}
												</div>
											) : (
												<div className="p-8 text-center">
													<div className="flex justify-center mb-3">
														<Receipt className="h-12 w-12 text-gray-400 dark:text-gray-600" />
													</div>
													<p className="text-sm text-gray-500 dark:text-gray-400">
														No quotes yet
													</p>
												</div>
											)}
										</div>
									</PopoverContent>
								</Popover>

								<Badge variant="outline">
									{project.projectType.charAt(0).toUpperCase() +
										project.projectType.slice(1)}
								</Badge>
							</div>
						</div>
					</div>

					{/* Project View/Edit Form Component */}
					<ProjectViewEditForm
						projectId={projectId}
						project={project}
						onUpdate={handleUpdate}
						onDelete={handleDeleteProject}
						onStatusUpdate={handleStatusUpdate}
						isUpdating={isUpdating}
						projectTasks={projectTasks}
						projectQuotes={projectQuotes}
						approvedQuotesCount={approvedQuotes.length}
						onTaskSheetOpen={() => setIsTaskSheetOpen(true)}
						onNavigate={(path) => router.push(path)}
						onGenerateInvoice={() => setIsInvoiceModalOpen(true)}
					/>

					{/* Team Communication Section */}
					<div className="mt-8">
						<MentionSection
							entityType="project"
							entityId={projectId}
							entityName={project.title}
						/>
					</div>
				</div>
			</div>
		</>
	);
}
