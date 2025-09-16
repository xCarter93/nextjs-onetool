"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
	CalendarIcon,
	UserIcon,
	MagnifyingGlassIcon,
} from "@heroicons/react/16/solid";
import {
	MapPinIcon,
	PencilIcon,
	TrashIcon,
	PlayIcon,
	CheckIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useMemo, useState } from "react";
import type { Id } from "../../../../../convex/_generated/dataModel";

export default function ProjectDetailPage() {
	const params = useParams();
	const router = useRouter();
	const toast = useToast();
	const [isUpdating, setIsUpdating] = useState(false);

	const projectId = params.projectId as Id<"projects">;

	// Fetch project data
	const project = useQuery(api.projects.get, { id: projectId });
	const allClients = useQuery(api.clients.list, {});

	// Fetch related data - hooks must be called unconditionally
	const client = useQuery(
		api.clients.get,
		project?.clientId ? { id: project.clientId } : "skip"
	);
	const clientContacts = useQuery(
		api.clientContacts.listByClient,
		project?.clientId ? { clientId: project.clientId } : "skip"
	);
	const clientProperties = useQuery(
		api.clientProperties.listByClient,
		project?.clientId ? { clientId: project.clientId } : "skip"
	);
	const projectTasks = useQuery(api.tasks.list, { projectId });
	const projectQuotes = useQuery(api.quotes.list, { projectId });

	// Mutations
	const updateProject = useMutation(api.projects.update);
	const deleteProject = useMutation(api.projects.remove);

	// Inline edit state
	const [isEditing, setIsEditing] = useState(false);
	const [form, setForm] = useState({
		clientId: undefined as Id<"clients"> | undefined,
		title: "",
		description: "",
		instructions: "",
		projectType: "one-off" as "one-off" | "recurring",
		startDate: undefined as number | undefined,
		endDate: undefined as number | undefined,
		dueDate: undefined as number | undefined,
		invoiceReminderEnabled: false as boolean | undefined,
		scheduleForLater: false as boolean | undefined,
	});

	useEffect(() => {
		if (project) {
			setForm({
				clientId: project.clientId,
				title: project.title,
				description: project.description || "",
				instructions: project.instructions || "",
				projectType: project.projectType,
				startDate: project.startDate,
				endDate: project.endDate,
				dueDate: project.dueDate,
				invoiceReminderEnabled: project.invoiceReminderEnabled,
				scheduleForLater: project.scheduleForLater,
			});
		}
	}, [project]);

	const isDirty = useMemo(() => {
		if (!project) return false;
		return (
			(form.clientId || undefined) !== (project.clientId || undefined) ||
			form.title !== project.title ||
			(form.description || "") !== (project.description || "") ||
			(form.instructions || "") !== (project.instructions || "") ||
			form.projectType !== project.projectType ||
			(form.startDate || undefined) !== (project.startDate || undefined) ||
			(form.endDate || undefined) !== (project.endDate || undefined) ||
			(form.dueDate || undefined) !== (project.dueDate || undefined) ||
			(form.invoiceReminderEnabled || false) !==
				(project.invoiceReminderEnabled || false) ||
			(form.scheduleForLater || false) !== (project.scheduleForLater || false)
		);
	}, [form, project]);

	const resetForm = () => {
		if (!project) return;
		setForm({
			clientId: project.clientId,
			title: project.title,
			description: project.description || "",
			instructions: project.instructions || "",
			projectType: project.projectType,
			startDate: project.startDate,
			endDate: project.endDate,
			dueDate: project.dueDate,
			invoiceReminderEnabled: project.invoiceReminderEnabled,
			scheduleForLater: project.scheduleForLater,
		});
	};

	const handleSave = async () => {
		if (!project) return;
		const updates: Partial<{
			clientId?: Id<"clients">;
			title: string;
			description?: string;
			instructions?: string;
			projectType: "one-off" | "recurring";
			startDate?: number;
			endDate?: number;
			dueDate?: number;
			invoiceReminderEnabled?: boolean;
			scheduleForLater?: boolean;
		}> = {};
		if ((form.clientId || undefined) !== (project.clientId || undefined))
			updates.clientId = form.clientId;
		if (form.title !== project.title) updates.title = form.title.trim();
		if ((form.description || "") !== (project.description || ""))
			updates.description = form.description || undefined;
		if ((form.instructions || "") !== (project.instructions || ""))
			updates.instructions = form.instructions || undefined;
		if (form.projectType !== project.projectType)
			updates.projectType = form.projectType;
		if ((form.startDate || undefined) !== (project.startDate || undefined))
			updates.startDate = form.startDate;
		if ((form.endDate || undefined) !== (project.endDate || undefined))
			updates.endDate = form.endDate;
		if ((form.dueDate || undefined) !== (project.dueDate || undefined))
			updates.dueDate = form.dueDate;
		if (
			(form.invoiceReminderEnabled || false) !==
			(project.invoiceReminderEnabled || false)
		)
			updates.invoiceReminderEnabled = !!form.invoiceReminderEnabled;
		if (
			(form.scheduleForLater || false) !== (project.scheduleForLater || false)
		)
			updates.scheduleForLater = !!form.scheduleForLater;

		if (Object.keys(updates).length === 0) {
			setIsEditing(false);
			return;
		}

		setIsUpdating(true);
		try {
			await updateProject({ id: projectId, ...updates });
			toast.success("Project Updated", "Your changes have been saved.");
			setIsEditing(false);
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

	const handleStatusUpdate = async (newStatus: typeof project.status) => {
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
		if (
			!confirm(
				"Are you sure you want to delete this project? This action cannot be undone."
			)
		) {
			return;
		}

		try {
			await deleteProject({ id: projectId });
			toast.success("Project Deleted", "Project has been successfully deleted");
			router.push("/projects");
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Failed to delete project";
			toast.error("Error", message);
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

	const formatStatus = (status: string) => {
		switch (status) {
			case "in-progress":
				return "In Progress";
			case "completed":
				return "Completed";
			case "cancelled":
				return "Cancelled";
			case "planned":
				return "Planned";
			default:
				return status;
		}
	};

	const getStatusActions = () => {
		switch (project.status) {
			case "planned":
				return (
					<Button
						size="sm"
						onClick={() => handleStatusUpdate("in-progress")}
						isDisabled={isUpdating}
						className="bg-green-600 hover:bg-green-700"
					>
						<PlayIcon className="h-4 w-4 mr-1" />
						Start Project
					</Button>
				);
			case "in-progress":
				return (
					<Button
						size="sm"
						onClick={() => handleStatusUpdate("completed")}
						isDisabled={isUpdating}
						className="bg-green-600 hover:bg-green-700"
					>
						<CheckIcon className="h-4 w-4 mr-1" />
						Complete
					</Button>
				);
			case "completed":
				return (
					<Button
						size="sm"
						intent="outline"
						onClick={() => handleStatusUpdate("in-progress")}
						isDisabled={isUpdating}
					>
						Reopen Project
					</Button>
				);
			case "cancelled":
				return (
					<Button
						size="sm"
						intent="outline"
						onClick={() => handleStatusUpdate("planned")}
						isDisabled={isUpdating}
					>
						Restore Project
					</Button>
				);
			default:
				return null;
		}
	};

	const primaryContact =
		clientContacts?.find((contact) => contact.isPrimary) || clientContacts?.[0];
	const primaryProperty =
		clientProperties?.find((property) => property.isPrimary) ||
		clientProperties?.[0];

	return (
		<>
			<div className="w-full px-6">
				<div className="w-full pt-8 pb-24">
					{/* Header */}
					<div className="mb-8">
						<div className="flex items-center justify-between">
							<div>
								<h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
									{project.title}
								</h1>
								<p className="mt-3 text-base text-gray-600 dark:text-gray-400 max-w-2xl">
									Project #{project.projectNumber || projectId.slice(-6)} •{" "}
									{formatStatus(project.status)}
								</p>
							</div>
							<div className="flex items-center gap-2">
								<Badge className={getStatusColor(project.status)}>
									{formatStatus(project.status)}
								</Badge>
								<Badge variant="outline">
									{project.projectType.charAt(0).toUpperCase() +
										project.projectType.slice(1)}
								</Badge>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex items-center gap-2 mt-4">
							{getStatusActions()}
							{isEditing ? (
								<>
									<Button
										size="sm"
										onClick={handleSave}
										isDisabled={isUpdating || !isDirty}
									>
										<CheckIcon className="h-4 w-4 mr-1" />
										Save
									</Button>
									<Button
										size="sm"
										intent="outline"
										onClick={() => {
											resetForm();
											setIsEditing(false);
										}}
									>
										Cancel
									</Button>
								</>
							) : (
								<Button
									size="sm"
									intent="outline"
									onClick={() => setIsEditing(true)}
								>
									<PencilIcon className="h-4 w-4 mr-1" />
									Edit
								</Button>
							)}
							<Button
								size="sm"
								intent="outline"
								onClick={handleDeleteProject}
								className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
							>
								<TrashIcon className="h-4 w-4 mr-1" />
								Delete
							</Button>
						</div>

						{isEditing && isDirty && (
							<Alert className="mt-3">
								<AlertTitle>Unsaved changes</AlertTitle>
								<AlertDescription>
									You have modified this project. Save or cancel your changes.
								</AlertDescription>
							</Alert>
						)}
					</div>

					<div className="space-y-8">
						{/* Client Information */}
						<Card className="shadow-sm border-gray-200/60 dark:border-white/10">
							<CardHeader className="pb-4">
								<CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
									<MagnifyingGlassIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
									Client Information
								</CardTitle>
							</CardHeader>
							<CardContent>
								{client && !isEditing ? (
									<div className="flex items-center justify-between p-4 bg-gray-50 dark:bg:white/5 rounded-lg">
										<span className="flex items-center gap-3">
											<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm text-white font-medium">
												{client.companyName
													.split(" ")
													.map((n) => n[0])
													.join("")}
											</div>
											<div>
												<div className="font-medium text-gray-900 dark:text-gray-400">
													{client.companyName}
												</div>
												<div className="text-sm text-gray-500 dark:text-gray-400">
													{client.industry || "No industry specified"}
												</div>
											</div>
										</span>
										<Button
											intent="outline"
											size="sm"
											onClick={() => router.push(`/clients/${client._id}`)}
										>
											View Client
										</Button>
									</div>
								) : (
									<div className="p-4 border-2 border-dashed border-gray-300 dark:border-white/20 rounded-lg text-center">
										{isEditing ? (
											<div className="grid gap-2">
												<label className="text-sm text-gray-600 dark:text-gray-400 text-left">
													Select Client
												</label>
												<select
													className="w-full h-11 px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-md text-gray-900 dark:text-white"
													value={form.clientId || ""}
													onChange={(e) =>
														setForm((f) => ({
															...f,
															clientId: (e.target.value || undefined) as
																| Id<"clients">
																| undefined,
														}))
													}
												>
													<option value="">-- Select --</option>
													{Array.isArray(allClients) &&
														allClients.map((c) => (
															<option key={c._id} value={c._id}>
																{c.companyName}
															</option>
														))}
												</select>
											</div>
										) : (
											<p className="text-sm text-gray-500 dark:text-gray-400">
												No client information available
											</p>
										)}
									</div>
								)}
							</CardContent>
						</Card>

						{/* Project Information & Team */}
						<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
							{/* Basic Project Information */}
							<Card className="lg:col-span-2 shadow-sm border-gray-200/60 dark:border-white/10">
								<CardHeader className="pb-4">
									<CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
										Project Information
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-6">
									<div className="space-y-6">
										<div>
											<label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
												Project Title
											</label>
											{isEditing ? (
												<Input
													value={form.title}
													onChange={(e) =>
														setForm((f) => ({ ...f, title: e.target.value }))
													}
												/>
											) : (
												<div className="w-full h-11 px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-md text-gray-900 dark:text-white">
													{project.title}
												</div>
											)}
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
												Instructions
											</label>
											{isEditing ? (
												<textarea
													className="w-full min-h-[100px] px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-md text-gray-900 dark:text-white"
													value={form.instructions}
													onChange={(e) =>
														setForm((f) => ({
															...f,
															instructions: e.target.value,
														}))
													}
												/>
											) : project.instructions ? (
												<div className="w-full min-h-[100px] px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-md text-gray-900 dark:text-white whitespace-pre-wrap">
													{project.instructions}
												</div>
											) : null}
										</div>

										<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
											<div>
												<label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
													Project Number
												</label>
												<div className="flex items-center justify-between">
													<span className="text-sm text-gray-900 dark:text-white font-mono">
														#{project.projectNumber || projectId.slice(-6)}
													</span>
												</div>
											</div>

											<div>
												<label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
													Project Type
												</label>
												{isEditing ? (
													<select
														className="w-full h-11 px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-md text-gray-900 dark:text-white capitalize"
														value={form.projectType}
														onChange={(e) =>
															setForm((f) => ({
																...f,
																projectType: e.target.value as
																	| "one-off"
																	| "recurring",
															}))
														}
													>
														<option value="one-off">One-off</option>
														<option value="recurring">Recurring</option>
													</select>
												) : (
													<div className="w-full h-11 px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-md text-gray-900 dark:text-white capitalize flex items-center">
														{project.projectType}
													</div>
												)}
											</div>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Team */}
							<Card className="shadow-sm border-gray-200/60 dark:border-white/10">
								<CardHeader className="pb-4">
									<CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
										Team
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									{project.salespersonId && (
										<div>
											<label className="text-sm font-medium text-gray-500 dark:text-gray-400">
												Salesperson
											</label>
											<div className="mt-2 flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg">
												<div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white font-medium">
													SP
												</div>
												<span className="text-sm text-gray-900 dark:text-white font-medium">
													Salesperson
												</span>
											</div>
										</div>
									)}

									{project.assignedUserIds &&
										project.assignedUserIds.length > 0 && (
											<div>
												<label className="text-sm font-medium text-gray-500 dark:text-gray-400">
													Assigned Team
												</label>
												<div className="mt-2 space-y-2">
													{project.assignedUserIds.map((userId, index) => (
														<div
															key={userId}
															className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg"
														>
															<div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs text-white font-medium">
																T{index + 1}
															</div>
															<span className="text-sm text-gray-900 dark:text-white font-medium">
																Team Member {index + 1}
															</span>
														</div>
													))}
												</div>
											</div>
										)}

									{project.invoiceReminderEnabled && (
										<div className="flex items-center gap-3">
											<input
												type="checkbox"
												checked={
													!!(isEditing
														? form.invoiceReminderEnabled
														: project.invoiceReminderEnabled)
												}
												onChange={(e) =>
													setForm((f) => ({
														...f,
														invoiceReminderEnabled: e.target.checked,
													}))
												}
												readOnly={!isEditing}
												className="h-4 w-4 rounded border-gray-300 dark:border-white/10 text-blue-600 dark:text-indigo-500"
											/>
											<label className="text-sm text-gray-900 dark:text-white">
												Remind me to invoice when I close the project
											</label>
										</div>
									)}
								</CardContent>
							</Card>
						</div>

						{/* Property Address & Contact Details */}
						<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
							{/* Property Address */}
							<Card className="shadow-sm border-gray-200/60 dark:border-white/10">
								<CardHeader className="pb-4">
									<CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
										<MapPinIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
										Property Address
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									{primaryProperty ? (
										<div className="p-4 bg-gray-50 dark:bg-white/5 rounded-lg">
											<p className="text-base text-gray-900 dark:text-white font-medium">
												{primaryProperty.streetAddress}
											</p>
											<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
												{primaryProperty.city}, {primaryProperty.state}{" "}
												{primaryProperty.zipCode}
											</p>
											{primaryProperty.propertyType && (
												<Badge variant="outline" className="mt-2">
													{primaryProperty.propertyType}
												</Badge>
											)}
										</div>
									) : (
										<div className="p-4 border-2 border-dashed border-gray-300 dark:border-white/20 rounded-lg text-center">
											<p className="text-sm text-gray-500 dark:text-gray-400">
												No property address available
											</p>
										</div>
									)}
								</CardContent>
							</Card>

							{/* Contact Details */}
							<Card className="shadow-sm border-gray-200/60 dark:border-white/10">
								<CardHeader className="pb-4">
									<CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
										<UserIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
										Contact Details
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									{primaryContact ? (
										<div className="p-4 bg-gray-50 dark:bg-white/5 rounded-lg space-y-3">
											<div className="flex items-center gap-3">
												<Avatar className="h-10 w-10">
													<div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm text-white font-medium h-full w-full">
														{(
															primaryContact.firstName[0] +
															primaryContact.lastName[0]
														).toUpperCase()}
													</div>
												</Avatar>
												<div className="flex-1">
													<p className="font-medium text-gray-900 dark:text-white">
														{primaryContact.firstName} {primaryContact.lastName}
													</p>
													{primaryContact.jobTitle && (
														<p className="text-sm text-gray-500 dark:text-gray-400">
															{primaryContact.jobTitle}
														</p>
													)}
												</div>
											</div>
											<div className="space-y-2">
												{primaryContact.email && (
													<div className="flex items-center gap-2">
														<span className="text-sm text-gray-500 dark:text-gray-400 min-w-[60px]">
															Email:
														</span>
														<a
															href={`mailto:${primaryContact.email}`}
															className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
														>
															{primaryContact.email}
														</a>
													</div>
												)}
												{primaryContact.phone && (
													<div className="flex items-center gap-2">
														<span className="text-sm text-gray-500 dark:text-gray-400 min-w-[60px]">
															Phone:
														</span>
														<a
															href={`tel:${primaryContact.phone}`}
															className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
														>
															{primaryContact.phone}
														</a>
													</div>
												)}
											</div>
										</div>
									) : (
										<div className="p-4 border-2 border-dashed border-gray-300 dark:border-white/20 rounded-lg text-center">
											<p className="text-sm text-gray-500 dark:text-gray-400">
												No contact information available
											</p>
										</div>
									)}
								</CardContent>
							</Card>
						</div>

						{/* Schedule */}
						<Card className="shadow-sm border-gray-200/60 dark:border-white/10">
							<CardHeader className="pb-4">
								<CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
									<CalendarIcon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
									Schedule & Project Details
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
									{/* Schedule Information */}
									<div className="space-y-6">
										<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
											<div>
												<label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
													Start Date
												</label>
												{isEditing ? (
													<input
														type="date"
														className="w-full h-11 px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-md text-gray-900 dark:text-white"
														value={
															form.startDate
																? new Date(form.startDate)
																		.toISOString()
																		.slice(0, 10)
																: ""
														}
														onChange={(e) =>
															setForm((f) => ({
																...f,
																startDate: e.target.value
																	? new Date(e.target.value).getTime()
																	: undefined,
															}))
														}
													/>
												) : (
													<div className="w-full h-11 px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-md text-gray-900 dark:text-white flex items-center">
														{formatDate(project.startDate)}
													</div>
												)}
											</div>

											<div>
												<label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
													End Date
												</label>
												{isEditing ? (
													<input
														type="date"
														className="w-full h-11 px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-md text-gray-900 dark:text-white"
														value={
															form.endDate
																? new Date(form.endDate)
																		.toISOString()
																		.slice(0, 10)
																: ""
														}
														onChange={(e) =>
															setForm((f) => ({
																...f,
																endDate: e.target.value
																	? new Date(e.target.value).getTime()
																	: undefined,
															}))
														}
													/>
												) : (
													<div className="w-full h-11 px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-md text-gray-900 dark:text-white flex items-center">
														{formatDate(project.endDate)}
													</div>
												)}
											</div>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
												Due Date
											</label>
											{isEditing ? (
												<input
													type="date"
													className="w-full h-11 px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-md text-gray-900 dark:text-white"
													value={
														form.dueDate
															? new Date(form.dueDate)
																	.toISOString()
																	.slice(0, 10)
															: ""
													}
													onChange={(e) =>
														setForm((f) => ({
															...f,
															dueDate: e.target.value
																? new Date(e.target.value).getTime()
																: undefined,
														}))
													}
												/>
											) : (
												<div className="w-full h-11 px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-md text-gray-900 dark:text-white flex items-center">
													{formatDate(project.dueDate)}
												</div>
											)}
										</div>

										<div className="flex items-center gap-3">
											<input
												type="checkbox"
												checked={
													!!(isEditing
														? form.scheduleForLater
														: project.scheduleForLater)
												}
												onChange={(e) =>
													setForm((f) => ({
														...f,
														scheduleForLater: e.target.checked,
													}))
												}
												readOnly={!isEditing}
												className="h-4 w-4 rounded border-gray-300 dark:border-white/10 text-blue-600 dark:text-indigo-500"
											/>
											<label className="text-sm text-gray-900 dark:text-white">
												Scheduled for later
											</label>
										</div>

										{/* Invoicing */}
										<div className="pt-4 border-t border-gray-200 dark:border-white/10">
											<h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
												Invoicing
											</h4>
											<div className="flex items-center gap-3">
												<input
													type="checkbox"
													checked={
														!!(isEditing
															? form.invoiceReminderEnabled
															: project.invoiceReminderEnabled)
													}
													onChange={(e) =>
														setForm((f) => ({
															...f,
															invoiceReminderEnabled: e.target.checked,
														}))
													}
													readOnly={!isEditing}
													className="h-4 w-4 rounded border-gray-300 dark:border-white/10 text-blue-600 dark:text-indigo-500"
												/>
												<label className="text-sm text-gray-900 dark:text-white">
													Remind me to invoice when I close the project
												</label>
											</div>
										</div>
									</div>

									{/* Project Stats */}
									<div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm">
										<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
											Project Statistics
										</h3>
										<div className="space-y-3">
											<div className="flex justify-between">
												<span className="text-sm text-gray-500 dark:text-gray-400">
													Tasks
												</span>
												<span className="text-sm font-medium text-gray-900 dark:text-white">
													{projectTasks?.length || 0}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-sm text-gray-500 dark:text-gray-400">
													Quotes
												</span>
												<span className="text-sm font-medium text-gray-900 dark:text-white">
													{projectQuotes?.length || 0}
												</span>
											</div>
											<div className="border-t border-gray-200 dark:border-white/10 pt-3">
												<div className="flex justify-between">
													<span className="text-sm text-gray-500 dark:text-gray-400">
														Created
													</span>
													<span className="text-sm font-medium text-gray-900 dark:text-white">
														{formatDate(project._creationTime)}
													</span>
												</div>
											</div>
											<div className="flex justify-between">
												<span className="text-sm text-gray-500 dark:text-gray-400">
													Status
												</span>
												<Badge className={getStatusColor(project.status)}>
													{formatStatus(project.status)}
												</Badge>
											</div>
											<div className="flex justify-between">
												<span className="text-sm text-gray-500 dark:text-gray-400">
													Type
												</span>
												<span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
													{project.projectType}
												</span>
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Tasks & Quotes */}
						<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
							{/* Tasks */}
							<Card className="shadow-sm border-gray-200/60 dark:border-white/10">
								<CardHeader className="pb-4">
									<CardTitle className="flex items-center justify-between text-xl font-semibold text-gray-900 dark:text-white">
										<span>Tasks ({projectTasks?.length || 0})</span>
										<Button
											size="sm"
											intent="outline"
											onClick={() =>
												router.push(`/tasks/new?projectId=${projectId}`)
											}
										>
											+ Add Task
										</Button>
									</CardTitle>
								</CardHeader>
								<CardContent>
									{projectTasks && projectTasks.length > 0 ? (
										<div className="space-y-3">
											{projectTasks.slice(0, 4).map((task) => (
												<div
													key={task._id}
													className="flex items-center justify-between p-3 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
												>
													<div className="flex items-center gap-3">
														<div
															className={`w-2 h-2 rounded-full ${
																task.status === "completed"
																	? "bg-green-500"
																	: task.status === "cancelled"
																		? "bg-red-500"
																		: "bg-yellow-500"
															}`}
														/>
														<div>
															<p className="font-medium text-gray-900 dark:text-white">
																{task.title}
															</p>
															{task.date && (
																<p className="text-sm text-gray-500 dark:text-gray-400">
																	{formatDate(task.date)}
																</p>
															)}
														</div>
													</div>
													<Badge className={getStatusColor(task.status)}>
														{task.status}
													</Badge>
												</div>
											))}
											{projectTasks.length > 4 && (
												<Button
													size="sm"
													intent="outline"
													className="w-full mt-3"
													onClick={() =>
														router.push(`/projects/${projectId}/tasks`)
													}
												>
													View All {projectTasks.length} Tasks
												</Button>
											)}
										</div>
									) : (
										<div className="p-6 border-2 border-dashed border-gray-300 dark:border-white/20 rounded-lg text-center">
											<div className="text-4xl mb-3">📋</div>
											<p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
												No tasks created yet
											</p>
											<Button
												size="sm"
												onClick={() =>
													router.push(`/tasks/new?projectId=${projectId}`)
												}
											>
												Create First Task
											</Button>
										</div>
									)}
								</CardContent>
							</Card>

							{/* Quotes */}
							<Card className="shadow-sm border-gray-200/60 dark:border-white/10">
								<CardHeader className="pb-4">
									<CardTitle className="flex items-center justify-between text-xl font-semibold text-gray-900 dark:text-white">
										<span>Quotes ({projectQuotes?.length || 0})</span>
										<Button
											size="sm"
											intent="outline"
											onClick={() =>
												router.push(`/quotes/new?projectId=${projectId}`)
											}
										>
											+ Add Quote
										</Button>
									</CardTitle>
								</CardHeader>
								<CardContent>
									{projectQuotes && projectQuotes.length > 0 ? (
										<div className="space-y-3">
											{projectQuotes.slice(0, 4).map((quote) => (
												<div
													key={quote._id}
													className="flex items-center justify-between p-3 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
													onClick={() => router.push(`/quotes/${quote._id}`)}
												>
													<div className="flex items-center gap-3">
														<div className="w-2 h-2 rounded-full bg-blue-500" />
														<div>
															<p className="font-medium text-gray-900 dark:text-white">
																Quote #
																{quote.quoteNumber || quote._id.slice(-6)}
															</p>
															<p className="text-sm text-gray-500 dark:text-gray-400">
																{formatDate(quote._creationTime)}
															</p>
														</div>
													</div>
													<div className="text-right">
														{quote.total && (
															<p className="font-medium text-gray-900 dark:text-white">
																${quote.total.toLocaleString()}
															</p>
														)}
														<Badge
															className={getStatusColor(
																quote.status || "draft"
															)}
														>
															{quote.status || "draft"}
														</Badge>
													</div>
												</div>
											))}
											{projectQuotes.length > 4 && (
												<Button
													size="sm"
													intent="outline"
													className="w-full mt-3"
													onClick={() =>
														router.push(`/projects/${projectId}/quotes`)
													}
												>
													View All {projectQuotes.length} Quotes
												</Button>
											)}
										</div>
									) : (
										<div className="p-6 border-2 border-dashed border-gray-300 dark:border-white/20 rounded-lg text-center">
											<div className="text-4xl mb-3">💰</div>
											<p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
												No quotes created yet
											</p>
											<Button
												size="sm"
												onClick={() =>
													router.push(`/quotes/new?projectId=${projectId}`)
												}
											>
												Create First Quote
											</Button>
										</div>
									)}
								</CardContent>
							</Card>
						</div>

						{/* Calendar View */}
						<Card className="shadow-sm border-gray-200/60 dark:border-white/10">
							<CardHeader className="pb-4">
								<CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
									<CalendarIcon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
									Project Timeline
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm">
									<div className="flex items-center justify-between mb-6">
										<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
											{new Date().toLocaleDateString("en-US", {
												month: "long",
												year: "numeric",
											})}
										</h3>
										<div className="flex gap-2">
											<Button intent="outline" size="sm">
												<svg
													className="w-4 h-4 mr-1"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M15 19l-7-7 7-7"
													/>
												</svg>
											</Button>
											<Button intent="outline" size="sm">
												<svg
													className="w-4 h-4 ml-1"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M9 5l7 7-7 7"
													/>
												</svg>
											</Button>
										</div>
									</div>
									<div className="grid grid-cols-7 gap-1">
										{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
											(day) => (
												<div
													key={day}
													className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-3 border-b border-gray-100 dark:border-white/5"
												>
													{day}
												</div>
											)
										)}

										{/* Calendar Days */}
										{Array.from({ length: 35 }, (_, i) => {
											const day = i - 5;
											const isCurrentMonth = day > 0 && day <= 31;
											const today = new Date().getDate();
											const isToday = day === today;

											// Check if this day has project dates
											const startDay = project.startDate
												? new Date(project.startDate).getDate()
												: null;
											const endDay = project.endDate
												? new Date(project.endDate).getDate()
												: null;
											const dueDay = project.dueDate
												? new Date(project.dueDate).getDate()
												: null;

											const isStartDate = day === startDay;
											const isEndDate = day === endDay;
											const isDueDate = day === dueDay;
											const hasProjectEvent =
												isStartDate || isEndDate || isDueDate;

											return (
												<div
													key={i}
													className={`
														relative h-10 flex items-center justify-center text-sm cursor-pointer transition-all duration-200
														${
															isCurrentMonth
																? "text-gray-900 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/30"
																: "text-gray-300 dark:text-gray-600"
														}
														${hasProjectEvent ? "bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 font-medium" : ""}
														${
															isToday && !hasProjectEvent
																? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg font-medium"
																: ""
														}
													`}
													title={
														isStartDate
															? "Project Start"
															: isEndDate
																? "Project End"
																: isDueDate
																	? "Due Date"
																	: ""
													}
												>
													{isCurrentMonth ? day : ""}
													{hasProjectEvent && (
														<div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
													)}
												</div>
											);
										})}
									</div>

									{/* Calendar Legend */}
									<div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
										{project.startDate && (
											<div className="flex items-center gap-2">
												<div className="w-3 h-3 bg-blue-600 rounded"></div>
												<span className="text-xs text-gray-500 dark:text-gray-400">
													Start: {formatDate(project.startDate)}
												</span>
											</div>
										)}
										{project.endDate && (
											<div className="flex items-center gap-2">
												<div className="w-3 h-3 bg-blue-600 rounded"></div>
												<span className="text-xs text-gray-500 dark:text-gray-400">
													End: {formatDate(project.endDate)}
												</span>
											</div>
										)}
										{project.dueDate && (
											<div className="flex items-center gap-2">
												<div className="w-3 h-3 bg-blue-600 rounded"></div>
												<span className="text-xs text-gray-500 dark:text-gray-400">
													Due: {formatDate(project.dueDate)}
												</span>
											</div>
										)}
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</>
	);
}
