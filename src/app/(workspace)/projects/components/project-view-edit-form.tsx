/* eslint-disable react/no-children-prop */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import ComboBox from "@/components/ui/combo-box";
import { CalendarWidget } from "@/components/ui/calendar-widget";
import { StickyFormFooter } from "@/components/shared/sticky-form-footer";
import { ButtonGroup } from "@/components/ui/button-group";
import { cn } from "@/lib/utils";
import {
	MagnifyingGlassIcon,
	UserIcon,
	CheckIcon,
} from "@heroicons/react/16/solid";
import {
	MapPinIcon,
	PencilIcon,
	TrashIcon,
	PlayIcon,
} from "@heroicons/react/24/outline";
import { CalendarIcon, Plus, ClipboardList, Receipt, FileText } from "lucide-react";

type ClientId = Id<"clients">;

interface ProjectData {
	_id: Id<"projects">;
	clientId?: ClientId;
	title: string;
	description?: string;
	instructions?: string;
	projectType: "one-off" | "recurring";
	startDate?: number;
	endDate?: number;
	invoiceReminderEnabled?: boolean;
	scheduleForLater?: boolean;
	status: "planned" | "in-progress" | "completed" | "cancelled";
	projectNumber?: string;
}

interface ProjectViewEditFormProps {
	projectId: Id<"projects">;
	project: ProjectData;
	onUpdate: (updates: Partial<ProjectData>) => Promise<void>;
	onDelete: () => Promise<void>;
	onStatusUpdate: (
		status: "planned" | "in-progress" | "completed" | "cancelled"
	) => Promise<void>;
	isUpdating: boolean;
	projectTasks?: Array<{
		_id: Id<"tasks">;
		title: string;
		status: string;
		date?: number;
	}>;
	projectQuotes?: Array<{
		_id: Id<"quotes">;
		quoteNumber?: string;
		status?: string;
		total?: number;
		_creationTime: number;
	}>;
	approvedQuotesCount: number;
	onTaskSheetOpen: () => void;
	onNavigate: (path: string) => void;
	onGenerateInvoice: () => void;
}

// Zod validation schema
const formSchema = z.object({
	clientId: z.string().optional(),
	title: z.string().min(1, "Project title is required"),
	instructions: z.string().optional(),
	projectType: z.enum(["one-off", "recurring"]),
	startDate: z.date().optional(),
	endDate: z.date().optional(),
	invoiceReminderEnabled: z.boolean(),
	scheduleForLater: z.boolean(),
});

const formatDisplayDate = (date?: Date | number) => {
	if (!date) return "Not set";
	const dateObj = typeof date === "number" ? new Date(date) : date;
	return dateObj.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
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
		case "lead":
		case "prospect":
			return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
		case "active":
			return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
		case "inactive":
			return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
		case "archived":
			return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
		default:
			return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
	}
};

export function ProjectViewEditForm({
	projectId,
	project,
	onUpdate,
	onDelete,
	onStatusUpdate,
	isUpdating,
	projectTasks,
	projectQuotes,
	approvedQuotesCount,
	onTaskSheetOpen,
	onNavigate,
	onGenerateInvoice,
}: ProjectViewEditFormProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [calendarDate, setCalendarDate] = useState(() => {
		const date = new Date();
		date.setHours(0, 0, 0, 0);
		return date;
	});
	const [startDateOpen, setStartDateOpen] = useState(false);
	const [endDateOpen, setEndDateOpen] = useState(false);

	// Fetch related data
	const allClients = useQuery(api.clients.list, {});
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

	const form = useForm({
		defaultValues: {
			clientId: project.clientId?.toString() || "",
			title: project.title,
			instructions: project.instructions || "",
			projectType: project.projectType,
			startDate: project.startDate ? new Date(project.startDate) : undefined,
			endDate: project.endDate ? new Date(project.endDate) : undefined,
			invoiceReminderEnabled: project.invoiceReminderEnabled || false,
			scheduleForLater: project.scheduleForLater || false,
		},
		onSubmit: async ({ value }) => {
			const result = formSchema.safeParse(value);
			if (!result.success) {
				console.error("Validation errors:", result.error.flatten());
				return;
			}

			const updates: Partial<ProjectData> = {};
			if ((value.clientId || undefined) !== (project.clientId || undefined))
				updates.clientId = value.clientId as ClientId | undefined;
			if (value.title !== project.title) updates.title = value.title.trim();
			if ((value.instructions || "") !== (project.instructions || ""))
				updates.instructions = value.instructions || undefined;
			if (value.projectType !== project.projectType)
				updates.projectType = value.projectType;
			if (
				(value.startDate ? value.startDate.getTime() : undefined) !==
				(project.startDate || undefined)
			)
				updates.startDate = value.startDate
					? value.startDate.getTime()
					: undefined;
			if (
				(value.endDate ? value.endDate.getTime() : undefined) !==
				(project.endDate || undefined)
			)
				updates.endDate = value.endDate ? value.endDate.getTime() : undefined;
			if (
				(value.invoiceReminderEnabled || false) !==
				(project.invoiceReminderEnabled || false)
			)
				updates.invoiceReminderEnabled = !!value.invoiceReminderEnabled;
			if (
				(value.scheduleForLater || false) !==
				(project.scheduleForLater || false)
			)
				updates.scheduleForLater = !!value.scheduleForLater;

			if (Object.keys(updates).length === 0) {
				setIsEditing(false);
				return;
			}

			await onUpdate(updates);
			setIsEditing(false);
		},
	});

	// Update form when project changes
	useEffect(() => {
		if (project) {
			form.setFieldValue("clientId", project.clientId?.toString() || "");
			form.setFieldValue("title", project.title);
			form.setFieldValue("instructions", project.instructions || "");
			form.setFieldValue("projectType", project.projectType);
			form.setFieldValue(
				"startDate",
				project.startDate ? new Date(project.startDate) : undefined
			);
			form.setFieldValue(
				"endDate",
				project.endDate ? new Date(project.endDate) : undefined
			);
			form.setFieldValue(
				"invoiceReminderEnabled",
				project.invoiceReminderEnabled || false
			);
			form.setFieldValue("scheduleForLater", project.scheduleForLater || false);
		}
	}, [project, form]);

	const resetForm = () => {
		form.setFieldValue("clientId", project.clientId?.toString() || "");
		form.setFieldValue("title", project.title);
		form.setFieldValue("instructions", project.instructions || "");
		form.setFieldValue("projectType", project.projectType);
		form.setFieldValue(
			"startDate",
			project.startDate ? new Date(project.startDate) : undefined
		);
		form.setFieldValue(
			"endDate",
			project.endDate ? new Date(project.endDate) : undefined
		);
		form.setFieldValue(
			"invoiceReminderEnabled",
			project.invoiceReminderEnabled || false
		);
		form.setFieldValue("scheduleForLater", project.scheduleForLater || false);
	};

	const primaryContact =
		clientContacts?.find((contact) => contact.isPrimary) || clientContacts?.[0];
	const primaryProperty =
		clientProperties?.find((property) => property.isPrimary) ||
		clientProperties?.[0];

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
		clickedDate.setHours(0, 0, 0, 0);

		const currentStartDate = form.getFieldValue("startDate");
		const currentEndDate = form.getFieldValue("endDate");

		// Set as start date if none exists
		if (!currentStartDate) {
			form.setFieldValue("startDate", clickedDate);
		} else if (!currentEndDate) {
			form.setFieldValue("endDate", clickedDate);
		} else {
			// Cycle through: reset and set as start date
			form.setFieldValue("startDate", clickedDate);
			form.setFieldValue("endDate", undefined);
		}
	};

	const handleProjectTypeChange = (type: "one-off" | "recurring") => {
		form.setFieldValue("projectType", type);
	};

	const clientOptions = useMemo(
		() => (allClients ?? []).map((c) => c.companyName),
		[allClients]
	);

	const getFooterButtons = (isDirty: boolean) => {
		const buttons = [];

		// Left side buttons - Primary actions
		if (isEditing) {
			buttons.push({
				label: isUpdating ? "Saving..." : "Save",
				onClick: () => form.handleSubmit(),
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
						onClick: () => onStatusUpdate("in-progress"),
						intent: "success" as const,
						disabled: isUpdating,
						icon: <PlayIcon className="h-4 w-4" />,
						position: "right" as const,
					});
					break;
				case "in-progress":
					buttons.push({
						label: "Complete",
						onClick: () => onStatusUpdate("completed"),
						intent: "success" as const,
						disabled: isUpdating,
						icon: <CheckIcon className="h-4 w-4" />,
						position: "right" as const,
					});
					break;
				case "completed":
					buttons.push({
						label: "Reopen Project",
						onClick: () => onStatusUpdate("in-progress"),
						intent: "outline" as const,
						disabled: isUpdating,
						position: "right" as const,
					});
					break;
				case "cancelled":
					buttons.push({
						label: "Restore Project",
						onClick: () => onStatusUpdate("planned"),
						intent: "outline" as const,
						disabled: isUpdating,
						position: "right" as const,
					});
					break;
			}
		}

		// Add Generate Invoice button (right side, before Delete)
		buttons.push({
			label: "Generate Invoice",
			onClick: onGenerateInvoice,
			intent: "primary" as const,
			icon: <FileText className="h-4 w-4" />,
			position: "right" as const,
			disabled: approvedQuotesCount === 0,
		});

		buttons.push({
			label: "Delete",
			onClick: onDelete,
			intent: "destructive" as const,
			icon: <TrashIcon className="h-4 w-4" />,
			position: "right" as const,
		});

		return buttons;
	};

	return (
		<>

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
								<form.Field
									name="clientId"
									children={(field) => (
										<ComboBox
											options={clientOptions}
											placeholder={
												client ? client.companyName : "No client selected..."
											}
											disabled={!isEditing}
											onSelect={(option) => {
												if (isEditing) {
													const selectedClient = allClients?.find(
														(c) => c.companyName === option
													);
													field.handleChange(
														selectedClient ? selectedClient._id : ""
													);
												}
											}}
										/>
									)}
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
												{primaryProperty.squareFootage.toLocaleString()} sq ft
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
											: client && clientContacts && clientContacts.length > 0
												? "Select a contact..."
												: client
													? "No contacts available..."
													: "Select a client first..."
									}
									disabled={!isEditing}
									onSelect={(option) => {
										if (isEditing && clientContacts) {
											const selectedContact = clientContacts.find((contact) => {
												const displayName = `${contact.firstName} ${contact.lastName}${contact.jobTitle ? ` - ${contact.jobTitle}` : ""}`;
												return displayName === option;
											});
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
					<Card className="shadow-sm border-gray-200/60 dark:border-white/10">
						<CardHeader className="pb-4">
							<CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
								Project Information
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-6">
								<FieldGroup>
									<form.Field
										name="title"
										children={(field) => {
											const isInvalid =
												field.state.meta.isTouched &&
												field.state.meta.errors.length > 0;
											return (
												<Field data-invalid={isInvalid}>
													<FieldLabel htmlFor={field.name}>
														Project Title
													</FieldLabel>
													<Input
														id={field.name}
														name={field.name}
														value={field.state.value}
														onBlur={field.handleBlur}
														onChange={(e) => field.handleChange(e.target.value)}
														aria-invalid={isInvalid}
														disabled={!isEditing}
													/>
													{isInvalid && (
														<FieldError errors={field.state.meta.errors} />
													)}
												</Field>
											);
										}}
									/>
								</FieldGroup>

								<FieldGroup>
									<form.Field
										name="instructions"
										children={(field) => {
											const isInvalid =
												field.state.meta.isTouched &&
												field.state.meta.errors.length > 0;
											return (
												<Field data-invalid={isInvalid}>
													<FieldLabel htmlFor={field.name}>
														Instructions
													</FieldLabel>
													<Textarea
														id={field.name}
														name={field.name}
														value={field.state.value}
														onBlur={field.handleBlur}
														onChange={(e) => field.handleChange(e.target.value)}
														aria-invalid={isInvalid}
														rows={4}
														disabled={!isEditing}
													/>
													{isInvalid && (
														<FieldError errors={field.state.meta.errors} />
													)}
												</Field>
											);
										}}
									/>
								</FieldGroup>

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

								{/* Invoice Reminder Checkbox */}
								<div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-white/10">
									<form.Field
										name="invoiceReminderEnabled"
										children={(field) => (
											<>
												<input
													type="checkbox"
													checked={field.state.value}
													onChange={(e) => field.handleChange(e.target.checked)}
													readOnly={!isEditing}
													disabled={!isEditing}
													className="h-4 w-4 rounded border-gray-300 dark:border-white/10 text-blue-600 dark:text-indigo-500"
												/>
												<label className="text-sm text-gray-900 dark:text-white">
													Remind me to invoice when I close the project
												</label>
											</>
										)}
									/>
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
						<div>
							<label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
								Project Type
							</label>
							<form.Field
								name="projectType"
								children={(field) => (
									<ButtonGroup>
										<button
											type="button"
											onClick={() => {
												if (isEditing) {
													handleProjectTypeChange("one-off");
												}
											}}
											disabled={!isEditing}
											className={cn(
												"inline-flex items-center gap-2 font-semibold transition-all duration-200 text-xs px-3 py-1.5 ring-1 shadow-sm hover:shadow-md backdrop-blur-sm",
												field.state.value === "one-off"
													? "text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/15 ring-primary/30 hover:ring-primary/40"
													: "text-gray-600 hover:text-gray-700 bg-transparent hover:bg-gray-50 ring-transparent hover:ring-gray-200 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800 dark:hover:ring-gray-700"
											)}
										>
											One-off Project
										</button>
										<button
											type="button"
											onClick={() => {
												if (isEditing) {
													handleProjectTypeChange("recurring");
												}
											}}
											disabled={!isEditing}
											className={cn(
												"inline-flex items-center gap-2 font-semibold transition-all duration-200 text-xs px-3 py-1.5 ring-1 shadow-sm hover:shadow-md backdrop-blur-sm",
												field.state.value === "recurring"
													? "text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/15 ring-primary/30 hover:ring-primary/40"
													: "text-gray-600 hover:text-gray-700 bg-transparent hover:bg-gray-50 ring-transparent hover:ring-gray-200 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800 dark:hover:ring-gray-700"
											)}
										>
											Recurring Project
										</button>
									</ButtonGroup>
								)}
							/>
						</div>

						<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
							{/* Schedule Information */}
							<div className="space-y-6">
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<div>
										<label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
											Start Date
										</label>
										<form.Field
											name="startDate"
											children={(field) => (
												<Popover
													open={startDateOpen}
													onOpenChange={setStartDateOpen}
												>
													<PopoverTrigger asChild>
														<Button
															intent="outline"
															className="w-full justify-start text-left font-normal"
															isDisabled={!isEditing || isUpdating}
														>
															<CalendarIcon className="mr-2 h-4 w-4" />
															{field.state.value
																? formatDisplayDate(field.state.value)
																: "Select start date"}
														</Button>
													</PopoverTrigger>
													<PopoverContent
														className="w-auto p-0 bg-white dark:bg-gray-950"
														align="start"
													>
														<Calendar
															mode="single"
															selected={field.state.value}
															onSelect={(date) => {
																field.handleChange(date);
																setStartDateOpen(false);
															}}
															disabled={isUpdating}
															className="!bg-white dark:!bg-gray-950"
														/>
													</PopoverContent>
												</Popover>
											)}
										/>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
											End Date
										</label>
										<form.Field
											name="endDate"
											children={(field) => {
												const startDateValue = form.getFieldValue("startDate");
												return (
													<Popover
														open={endDateOpen}
														onOpenChange={setEndDateOpen}
													>
														<PopoverTrigger asChild>
															<Button
																intent="outline"
																className="w-full justify-start text-left font-normal"
																isDisabled={!isEditing || isUpdating}
															>
																<CalendarIcon className="mr-2 h-4 w-4" />
																{field.state.value
																	? formatDisplayDate(field.state.value)
																	: "Select end date"}
															</Button>
														</PopoverTrigger>
														<PopoverContent
															className="w-auto p-0 bg-white dark:bg-gray-950"
															align="start"
														>
															<Calendar
																mode="single"
																selected={field.state.value}
																onSelect={(date) => {
																	field.handleChange(date);
																	setEndDateOpen(false);
																}}
																disabled={(date) => {
																	if (isUpdating) return true;
																	if (!startDateValue) return false;
																	const start =
																		typeof startDateValue === "number"
																			? new Date(startDateValue)
																			: new Date(startDateValue.getTime());
																	start.setHours(0, 0, 0, 0);
																	const checkDate = new Date(date);
																	checkDate.setHours(0, 0, 0, 0);
																	return checkDate < start;
																}}
																className="!bg-white dark:!bg-gray-950"
															/>
														</PopoverContent>
													</Popover>
												);
											}}
										/>
									</div>
								</div>

								<div className="flex items-center gap-3">
									<form.Field
										name="scheduleForLater"
										children={(field) => (
											<>
												<input
													type="checkbox"
													checked={field.state.value}
													onChange={(e) => field.handleChange(e.target.checked)}
													readOnly={!isEditing}
													disabled={!isEditing}
													className="h-4 w-4 rounded border-gray-300 dark:border-white/10 text-blue-600 dark:text-indigo-500"
												/>
												<label className="text-sm text-gray-900 dark:text-white">
													Scheduled for later
												</label>
											</>
										)}
									/>
								</div>
							</div>

							{/* Project Timeline Calendar */}
							<CalendarWidget
								form={form}
								calendarDate={calendarDate}
								handleCalendarNavigation={handleCalendarNavigation}
								handleDateClick={handleDateClick}
								formatDisplayDate={formatDisplayDate}
								variant="default"
							/>
						</div>
					</CardContent>
				</Card>

				{/* Tasks & Quotes - Only show when not editing */}
				{!isEditing && (
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
						{/* Tasks */}
						<Card className="shadow-sm border-gray-200/60 dark:border-white/10">
							<CardHeader className="pb-4">
								<CardTitle className="flex items-center justify-between text-xl font-semibold text-gray-900 dark:text-white">
									<span>Tasks ({projectTasks?.length || 0})</span>
									<button
										type="button"
										onClick={onTaskSheetOpen}
										className="group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-all duration-200 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/15 ring-1 ring-primary/30 hover:ring-primary/40 shadow-sm hover:shadow-md backdrop-blur-sm"
									>
										<Plus className="h-4 w-4" />
										Add Task
										<span
											aria-hidden="true"
											className="group-hover:translate-x-1 transition-transform duration-200"
										>
											→
										</span>
									</button>
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
																{formatDisplayDate(task.date)}
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
											<button
												type="button"
												onClick={() =>
													onNavigate(`/projects/${projectId}/tasks`)
												}
												className="w-full mt-3 h-9 px-3 py-2 text-sm border border-gray-200 dark:border-white/10 rounded-md hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
											>
												View All {projectTasks.length} Tasks
											</button>
										)}
									</div>
								) : (
									<div className="p-6 border-2 border-dashed border-gray-300 dark:border-white/20 rounded-lg text-center">
										<div className="flex justify-center mb-3">
											<ClipboardList className="h-12 w-12 text-gray-400 dark:text-gray-600" />
										</div>
										<p className="text-sm text-gray-500 dark:text-gray-400">
											No tasks created yet
										</p>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Quotes */}
						<Card className="shadow-sm border-gray-200/60 dark:border-white/10">
							<CardHeader className="pb-4">
								<CardTitle className="flex items-center justify-between text-xl font-semibold text-gray-900 dark:text-white">
									<span>Quotes ({projectQuotes?.length || 0})</span>
									<button
										type="button"
										onClick={() =>
											onNavigate(`/quotes/new?projectId=${projectId}`)
										}
										className="group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-all duration-200 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/15 ring-1 ring-primary/30 hover:ring-primary/40 shadow-sm hover:shadow-md backdrop-blur-sm"
									>
										<Plus className="h-4 w-4" />
										Add Quote
										<span
											aria-hidden="true"
											className="group-hover:translate-x-1 transition-transform duration-200"
										>
											→
										</span>
									</button>
								</CardTitle>
							</CardHeader>
							<CardContent>
								{projectQuotes && projectQuotes.length > 0 ? (
									<div className="space-y-3">
										{projectQuotes.slice(0, 4).map((quote) => (
											<div
												key={quote._id}
												className="flex items-center justify-between p-3 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
												onClick={() => onNavigate(`/quotes/${quote._id}`)}
											>
												<div className="flex items-center gap-3">
													<div className="w-2 h-2 rounded-full bg-blue-500" />
													<div>
														<p className="font-medium text-gray-900 dark:text-white">
															Quote #{quote.quoteNumber || quote._id.slice(-6)}
														</p>
														<p className="text-sm text-gray-500 dark:text-gray-400">
															{formatDisplayDate(quote._creationTime)}
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
														className={getStatusColor(quote.status || "draft")}
													>
														{quote.status || "draft"}
													</Badge>
												</div>
											</div>
										))}
										{projectQuotes.length > 4 && (
											<button
												type="button"
												onClick={() =>
													onNavigate(`/projects/${projectId}/quotes`)
												}
												className="w-full mt-3 h-9 px-3 py-2 text-sm border border-gray-200 dark:border-white/10 rounded-md hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
											>
												View All {projectQuotes.length} Quotes
											</button>
										)}
									</div>
								) : (
									<div className="p-6 border-2 border-dashed border-gray-300 dark:border-white/20 rounded-lg text-center">
										<div className="flex justify-center mb-3">
											<Receipt className="h-12 w-12 text-gray-400 dark:text-gray-600" />
										</div>
										<p className="text-sm text-gray-500 dark:text-gray-400">
											No quotes created yet
										</p>
									</div>
								)}
							</CardContent>
						</Card>
					</div>
				)}
			</div>

			<form.Subscribe
				selector={(state) => state.values}
				children={(formValues) => {
					// Recalculate isDirty with current form values
					const currentIsDirty =
						(formValues.clientId || "") !==
							(project.clientId?.toString() || "") ||
						formValues.title !== project.title ||
						(formValues.instructions || "") !== (project.instructions || "") ||
						formValues.projectType !== project.projectType ||
						(formValues.startDate
							? formValues.startDate.getTime()
							: undefined) !== (project.startDate || undefined) ||
						(formValues.endDate ? formValues.endDate.getTime() : undefined) !==
							(project.endDate || undefined) ||
						(formValues.invoiceReminderEnabled || false) !==
							(project.invoiceReminderEnabled || false) ||
						(formValues.scheduleForLater || false) !==
							(project.scheduleForLater || false);

					return (
						<StickyFormFooter
							buttons={getFooterButtons(currentIsDirty)}
							fullWidth
							hasUnsavedChanges={currentIsDirty}
							isEditing={isEditing}
						/>
					);
				}}
			/>
		</>
	);
}

ProjectViewEditForm.displayName = "ProjectViewEditForm";
