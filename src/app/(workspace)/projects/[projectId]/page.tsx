"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Announcement from "@/components/ui/announcement";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import ComboBox from "@/components/ui/combo-box";
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
import { StickyFormFooter } from "@/components/sticky-form-footer";
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

	// Calendar state
	const [calendarDate, setCalendarDate] = useState(new Date());

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

	// Calendar helper functions
	const getCalendarDays = (date: Date) => {
		const year = date.getFullYear();
		const month = date.getMonth();

		// First day of the month
		const firstDay = new Date(year, month, 1);
		// Last day of the month
		const lastDay = new Date(year, month + 1, 0);
		// Day of week for first day (0 = Sunday)
		const startingDayOfWeek = firstDay.getDay();
		// Number of days in month
		const daysInMonth = lastDay.getDate();

		const calendarDays = [];

		// Add empty cells for days before the first day of the month
		for (let i = 0; i < startingDayOfWeek; i++) {
			calendarDays.push(null);
		}

		// Add all days of the month
		for (let day = 1; day <= daysInMonth; day++) {
			calendarDays.push(day);
		}

		// Fill remaining cells to make 42 (6 rows × 7 days)
		while (calendarDays.length < 42) {
			calendarDays.push(null);
		}

		return calendarDays;
	};

	const handleCalendarNavigation = (direction: "prev" | "next") => {
		setCalendarDate((prevDate) => {
			const newDate = new Date(prevDate);
			if (direction === "prev") {
				newDate.setMonth(newDate.getMonth() - 1);
			} else {
				newDate.setMonth(newDate.getMonth() + 1);
			}
			return newDate;
		});
	};

	const handleDateClick = (day: number | null) => {
		if (!day || !isEditing) return;

		const clickedDate = new Date(
			calendarDate.getFullYear(),
			calendarDate.getMonth(),
			day
		);
		const timestamp = clickedDate.getTime();

		// Set as start date if none exists, otherwise set as end date
		if (!form.startDate) {
			setForm((f) => ({ ...f, startDate: timestamp }));
		} else if (!form.endDate) {
			setForm((f) => ({ ...f, endDate: timestamp }));
		} else if (!form.dueDate) {
			setForm((f) => ({ ...f, dueDate: timestamp }));
		} else {
			// Cycle through: reset and set as start date
			setForm((f) => ({
				...f,
				startDate: timestamp,
				endDate: undefined,
				dueDate: undefined,
			}));
		}
	};

	const primaryContact =
		clientContacts?.find((contact) => contact.isPrimary) || clientContacts?.[0];
	const primaryProperty =
		clientProperties?.find((property) => property.isPrimary) ||
		clientProperties?.[0];

	// Create sticky footer buttons based on current state
	const getFooterButtons = () => {
		const buttons = [];

		// Left side buttons - Primary actions
		if (isEditing) {
			buttons.push({
				label: isUpdating ? "Saving..." : "Save",
				onClick: handleSave,
				intent: "primary" as const,
				disabled: isUpdating || !isDirty,
				icon: <CheckIcon className="h-4 w-4" />,
			});
			buttons.push({
				label: "Cancel",
				onClick: () => {
					resetForm();
					setIsEditing(false);
				},
				intent: "outline" as const,
			});
		} else {
			buttons.push({
				label: "Edit",
				onClick: () => setIsEditing(true),
				intent: "outline" as const,
				icon: <PencilIcon className="h-4 w-4" />,
			});
		}

		// Right side buttons - Status actions and secondary actions
		if (project) {
			switch (project.status) {
				case "planned":
					buttons.push({
						label: "Start Project",
						onClick: () => handleStatusUpdate("in-progress"),
						intent: "success" as const,
						disabled: isUpdating,
						icon: <PlayIcon className="h-4 w-4" />,
						position: "right" as const,
					});
					break;
				case "in-progress":
					buttons.push({
						label: "Complete",
						onClick: () => handleStatusUpdate("completed"),
						intent: "success" as const,
						disabled: isUpdating,
						icon: <CheckIcon className="h-4 w-4" />,
						position: "right" as const,
					});
					break;
				case "completed":
					buttons.push({
						label: "Reopen Project",
						onClick: () => handleStatusUpdate("in-progress"),
						intent: "outline" as const,
						disabled: isUpdating,
						position: "right" as const,
					});
					break;
				case "cancelled":
					buttons.push({
						label: "Restore Project",
						onClick: () => handleStatusUpdate("planned"),
						intent: "outline" as const,
						disabled: isUpdating,
						position: "right" as const,
					});
					break;
			}
		}

		buttons.push({
			label: "Delete",
			onClick: handleDeleteProject,
			intent: "destructive" as const,
			icon: <TrashIcon className="h-4 w-4" />,
			position: "right" as const,
		});

		return buttons;
	};

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

						{isEditing && isDirty && (
							<Announcement
								variant="warning"
								className="mt-3 cursor-default"
								disabled={true}
							>
								Unsaved changes - Save or cancel your changes
							</Announcement>
						)}
					</div>

					<div className="space-y-8">
						{/* Client Information, Property Address & Contact Details */}
						<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
							{/* Client Information */}
							<Card className="shadow-sm border-gray-200/60 dark:border-white/10">
								<CardHeader className="pb-4">
									<CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
										<MagnifyingGlassIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
										Client Information
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									{/* Always show ComboBox at top */}
									<div className="grid gap-2">
										<label className="text-sm text-gray-600 dark:text-gray-400 text-left">
											Selected Client
										</label>
										<ComboBox
											options={
												Array.isArray(allClients)
													? allClients.map((c) => c.companyName)
													: []
											}
											placeholder={
												client ? client.companyName : "No client selected..."
											}
											disabled={!isEditing}
											onSelect={(option) => {
												if (isEditing) {
													const selectedClient = Array.isArray(allClients)
														? allClients.find((c) => c.companyName === option)
														: null;
													setForm((f) => ({
														...f,
														clientId: selectedClient
															? selectedClient._id
															: undefined,
													}));
												}
											}}
										/>
									</div>

									{/* Show details only when not editing and client exists */}
									{client && !isEditing ? (
										<div className="grid grid-cols-2 gap-4 text-sm">
											<div>
												<span className="text-gray-500 dark:text-gray-400">
													Status:
												</span>
												<div className="flex items-center gap-2 mt-1">
													<Badge
														className={getStatusColor(client.status)}
														variant="outline"
													>
														{client.status}
													</Badge>
												</div>
											</div>
											<div>
												<span className="text-gray-500 dark:text-gray-400">
													Type:
												</span>
												<div className="mt-1 text-gray-900 dark:text-white capitalize">
													{client.clientType || "Not specified"}
												</div>
											</div>
											<div>
												<span className="text-gray-500 dark:text-gray-400">
													Industry:
												</span>
												<div className="mt-1 text-gray-900 dark:text-white">
													{client.industry || "No industry specified"}
												</div>
											</div>
											{client.companyDescription && (
												<div className="col-span-2">
													<span className="text-gray-500 dark:text-gray-400">
														Description:
													</span>
													<div className="mt-1 text-gray-900 dark:text-white">
														{client.companyDescription}
													</div>
												</div>
											)}
											{primaryContact?.email && (
												<div>
													<span className="text-gray-500 dark:text-gray-400">
														Email:
													</span>
													<div className="mt-1">
														<a
															href={`mailto:${primaryContact.email}`}
															className="text-blue-600 dark:text-blue-400 hover:underline"
														>
															{primaryContact.email}
														</a>
													</div>
												</div>
											)}
											{primaryContact?.phone && (
												<div>
													<span className="text-gray-500 dark:text-gray-400">
														Phone:
													</span>
													<div className="mt-1">
														<a
															href={`tel:${primaryContact.phone}`}
															className="text-blue-600 dark:text-blue-400 hover:underline"
														>
															{primaryContact.phone}
														</a>
													</div>
												</div>
											)}
											<div className="col-span-2 pt-2 border-t border-gray-200 dark:border-white/10">
												<Button
													intent="outline"
													size="sm"
													onClick={() => router.push(`/clients/${client._id}`)}
													className="w-full"
												>
													View Full Client Details
												</Button>
											</div>
										</div>
									) : isEditing ? (
										<div className="text-center py-8 text-gray-500 dark:text-gray-400">
											<p className="text-sm">
												Select a client above to see details
											</p>
										</div>
									) : (
										<div className="text-center py-8 text-gray-500 dark:text-gray-400">
											<p className="text-sm">No client selected</p>
										</div>
									)}
								</CardContent>
							</Card>

							{/* Property Address */}
							<Card className="shadow-sm border-gray-200/60 dark:border-white/10">
								<CardHeader className="pb-4">
									<CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
										<MapPinIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
										Property Address
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									{/* Always show ComboBox at top */}
									<div className="grid gap-2">
										<label className="text-sm text-gray-600 dark:text-gray-400 text-left">
											Selected Property
										</label>
										<ComboBox
											options={
												clientProperties && clientProperties.length > 0
													? clientProperties.map((property) =>
															property.propertyName
																? `${property.propertyName} - ${property.streetAddress}`
																: property.streetAddress
														)
													: []
											}
											placeholder={
												primaryProperty
													? primaryProperty.propertyName
														? `${primaryProperty.propertyName} - ${primaryProperty.streetAddress}`
														: primaryProperty.streetAddress
													: client &&
														  clientProperties &&
														  clientProperties.length > 0
														? "Select a property..."
														: client
															? "No properties available..."
															: "Select a client first..."
											}
											disabled={!isEditing}
											onSelect={(option) => {
												if (isEditing && clientProperties) {
													const selectedProperty = clientProperties.find(
														(property) => {
															const displayName = property.propertyName
																? `${property.propertyName} - ${property.streetAddress}`
																: property.streetAddress;
															return displayName === option;
														}
													);
													console.log("Selected property:", selectedProperty);
												}
											}}
										/>
									</div>

									{/* Show details only when not editing and property exists */}
									{primaryProperty && !isEditing ? (
										<div className="grid grid-cols-2 gap-4 text-sm">
											{primaryProperty.propertyName && (
												<div className="col-span-2">
													<span className="text-gray-500 dark:text-gray-400">
														Property Name:
													</span>
													<div className="mt-1 text-gray-900 dark:text-white font-medium">
														{primaryProperty.propertyName}
													</div>
												</div>
											)}
											<div>
												<span className="text-gray-500 dark:text-gray-400">
													Type:
												</span>
												<div className="mt-1 text-gray-900 dark:text-white capitalize">
													{primaryProperty.propertyType || "Not specified"}
												</div>
											</div>
											{primaryProperty.squareFootage && (
												<div>
													<span className="text-gray-500 dark:text-gray-400">
														Square Footage:
													</span>
													<div className="mt-1 text-gray-900 dark:text-white">
														{primaryProperty.squareFootage.toLocaleString()} sq
														ft
													</div>
												</div>
											)}
											<div className="col-span-2">
												<span className="text-gray-500 dark:text-gray-400">
													Address:
												</span>
												<div className="mt-1 text-gray-900 dark:text-white">
													<div className="font-medium">
														{primaryProperty.streetAddress}
													</div>
													<div className="text-gray-600 dark:text-gray-400">
														{primaryProperty.city}, {primaryProperty.state}{" "}
														{primaryProperty.zipCode}
														{primaryProperty.country &&
															`, ${primaryProperty.country}`}
													</div>
												</div>
											</div>
											{primaryProperty.description && (
												<div className="col-span-2">
													<span className="text-gray-500 dark:text-gray-400">
														Description:
													</span>
													<div className="mt-1 text-gray-900 dark:text-white">
														{primaryProperty.description}
													</div>
												</div>
											)}
										</div>
									) : isEditing ? (
										<div className="text-center py-8 text-gray-500 dark:text-gray-400">
											<p className="text-sm">
												{client
													? clientProperties && clientProperties.length > 0
														? "Select a property above to see details"
														: "No properties available for this client"
													: "Select a client first to see properties"}
											</p>
										</div>
									) : (
										<div className="text-center py-8 text-gray-500 dark:text-gray-400">
											<p className="text-sm">No property selected</p>
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
									{/* Always show ComboBox at top */}
									<div className="grid gap-2">
										<label className="text-sm text-gray-600 dark:text-gray-400 text-left">
											Selected Contact
										</label>
										<ComboBox
											options={
												clientContacts && clientContacts.length > 0
													? clientContacts.map(
															(contact) =>
																`${contact.firstName} ${contact.lastName}${contact.jobTitle ? ` - ${contact.jobTitle}` : ""}`
														)
													: []
											}
											placeholder={
												primaryContact
													? `${primaryContact.firstName} ${primaryContact.lastName}${primaryContact.jobTitle ? ` - ${primaryContact.jobTitle}` : ""}`
													: client &&
														  clientContacts &&
														  clientContacts.length > 0
														? "Select a contact..."
														: client
															? "No contacts available..."
															: "Select a client first..."
											}
											disabled={!isEditing}
											onSelect={(option) => {
												if (isEditing && clientContacts) {
													const selectedContact = clientContacts.find(
														(contact) => {
															const displayName = `${contact.firstName} ${contact.lastName}${contact.jobTitle ? ` - ${contact.jobTitle}` : ""}`;
															return displayName === option;
														}
													);
													console.log("Selected contact:", selectedContact);
												}
											}}
										/>
									</div>

									{/* Show details only when not editing and contact exists */}
									{primaryContact && !isEditing ? (
										<div className="grid grid-cols-2 gap-4 text-sm">
											<div className="col-span-2">
												<span className="text-gray-500 dark:text-gray-400">
													Name:
												</span>
												<div className="mt-1 text-gray-900 dark:text-white font-medium">
													{primaryContact.firstName} {primaryContact.lastName}
												</div>
											</div>
											{primaryContact.jobTitle && (
												<div>
													<span className="text-gray-500 dark:text-gray-400">
														Job Title:
													</span>
													<div className="mt-1 text-gray-900 dark:text-white">
														{primaryContact.jobTitle}
													</div>
												</div>
											)}
											{primaryContact.role && (
												<div>
													<span className="text-gray-500 dark:text-gray-400">
														Role:
													</span>
													<div className="mt-1 text-gray-900 dark:text-white capitalize">
														{primaryContact.role}
													</div>
												</div>
											)}
											{primaryContact.department && (
												<div>
													<span className="text-gray-500 dark:text-gray-400">
														Department:
													</span>
													<div className="mt-1 text-gray-900 dark:text-white">
														{primaryContact.department}
													</div>
												</div>
											)}
											{primaryContact.email && (
												<div>
													<span className="text-gray-500 dark:text-gray-400">
														Email:
													</span>
													<div className="mt-1">
														<a
															href={`mailto:${primaryContact.email}`}
															className="text-blue-600 dark:text-blue-400 hover:underline"
														>
															{primaryContact.email}
														</a>
													</div>
												</div>
											)}
											{primaryContact.phone && (
												<div>
													<span className="text-gray-500 dark:text-gray-400">
														Phone:
													</span>
													<div className="mt-1">
														<a
															href={`tel:${primaryContact.phone}`}
															className="text-blue-600 dark:text-blue-400 hover:underline"
														>
															{primaryContact.phone}
														</a>
													</div>
												</div>
											)}
										</div>
									) : isEditing ? (
										<div className="text-center py-8 text-gray-500 dark:text-gray-400">
											<p className="text-sm">
												{client
													? clientContacts && clientContacts.length > 0
														? "Select a contact above to see details"
														: "No contacts available for this client"
													: "Select a client first to see contacts"}
											</p>
										</div>
									) : (
										<div className="text-center py-8 text-gray-500 dark:text-gray-400">
											<p className="text-sm">No contact selected</p>
										</div>
									)}
								</CardContent>
							</Card>
						</div>

						{/* Project Information */}
						<div className="grid grid-cols-1 gap-6">
							{/* Basic Project Information */}
							<Card className="shadow-sm border-gray-200/60 dark:border-white/10">
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

										{/* Invoice Reminder Checkbox */}
										<div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-white/10">
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
									</div>

									{/* Project Timeline Calendar */}
									<div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm">
										<div className="flex items-center justify-between mb-6">
											<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
												{calendarDate.toLocaleDateString("en-US", {
													month: "long",
													year: "numeric",
												})}
											</h3>
											<div className="flex gap-2">
												<Button
													intent="outline"
													size="sm"
													onClick={() => handleCalendarNavigation("prev")}
												>
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
												<Button
													intent="outline"
													size="sm"
													onClick={() => handleCalendarNavigation("next")}
												>
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
											{getCalendarDays(calendarDate).map((day, i) => {
												const isCurrentMonth = day !== null;
												const today = new Date();
												const isToday =
													isCurrentMonth &&
													day === today.getDate() &&
													calendarDate.getMonth() === today.getMonth() &&
													calendarDate.getFullYear() === today.getFullYear();

												// Check if this day has project dates
												let isStartDate = false;
												let isEndDate = false;
												let isDueDate = false;

												if (day && project.startDate) {
													const startDateObj = new Date(project.startDate);
													isStartDate =
														day === startDateObj.getDate() &&
														calendarDate.getMonth() ===
															startDateObj.getMonth() &&
														calendarDate.getFullYear() ===
															startDateObj.getFullYear();
												}

												if (day && project.endDate) {
													const endDateObj = new Date(project.endDate);
													isEndDate =
														day === endDateObj.getDate() &&
														calendarDate.getMonth() === endDateObj.getMonth() &&
														calendarDate.getFullYear() ===
															endDateObj.getFullYear();
												}

												if (day && project.dueDate) {
													const dueDateObj = new Date(project.dueDate);
													isDueDate =
														day === dueDateObj.getDate() &&
														calendarDate.getMonth() === dueDateObj.getMonth() &&
														calendarDate.getFullYear() ===
															dueDateObj.getFullYear();
												}

												const hasProjectEvent =
													isStartDate || isEndDate || isDueDate;
												const isClickable = isEditing && isCurrentMonth;

												return (
													<div
														key={i}
														onClick={() => handleDateClick(day)}
														className={`
															relative h-10 flex items-center justify-center text-sm transition-all duration-200
															${isClickable ? "cursor-pointer" : "cursor-default"}
															${
																isCurrentMonth
																	? "text-gray-900 dark:text-white"
																	: "text-gray-300 dark:text-gray-600"
															}
															${
																isClickable && !hasProjectEvent
																	? "hover:bg-blue-50 dark:hover:bg-blue-900/30"
																	: ""
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
																		: isClickable
																			? "Click to set date"
																			: ""
														}
													>
														{day || ""}
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
					</div>
				</div>
			</div>
			<StickyFormFooter buttons={getFooterButtons()} />
		</>
	);
}
