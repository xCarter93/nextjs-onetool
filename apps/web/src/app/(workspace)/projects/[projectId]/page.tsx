"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@onetool/backend/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { TaskSheet } from "@/components/shared/task-sheet";
import { ProjectViewEditForm } from "@/app/(workspace)/projects/components/project-view-edit-form";
import { MentionSection } from "@/components/shared/mention-section";
import DeleteConfirmationModal from "@/components/ui/delete-confirmation-modal";
import { InvoiceGenerationModal } from "@/app/(workspace)/projects/components/invoice-generation-modal";
import { ProjectHeader } from "@/app/(workspace)/projects/components/project-header";
import { useState } from "react";
import type { Id } from "@onetool/backend/convex/_generated/dataModel";

export default function ProjectDetailPage() {
	const params = useParams();
	const router = useRouter();
	const toast = useToast();
	const [isUpdating, setIsUpdating] = useState(false);
	const [isTaskSheetOpen, setIsTaskSheetOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);

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
					{/* Project Header - Salesforce inspired */}
					<ProjectHeader
						project={project}
						projectId={projectId}
						isEditing={isEditing}
						onEditClick={() => setIsEditing(true)}
						statusValue={project.status}
						onStatusChange={(value) => {
							handleStatusUpdate(
								value as "planned" | "in-progress" | "completed" | "cancelled"
							);
						}}
						tasks={projectTasks}
						quotes={projectQuotes}
						onTaskSheetOpen={() => setIsTaskSheetOpen(true)}
						onStatusUpdate={handleStatusUpdate}
					/>

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
						isEditing={isEditing}
						onEditingChange={setIsEditing}
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
