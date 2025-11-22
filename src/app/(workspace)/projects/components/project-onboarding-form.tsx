/* eslint-disable react/no-children-prop */
"use client";

import React, { useEffect, useMemo } from "react";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { useToastOperations } from "@/hooks/use-toast";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { CalendarWidget } from "@/components/ui/calendar-widget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StickyFormFooter } from "@/components/shared/sticky-form-footer";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { MagnifyingGlassIcon, UserIcon } from "@heroicons/react/16/solid";
import { MapPinIcon } from "@heroicons/react/24/outline";
import ComboBox from "@/components/ui/combo-box";
import { ButtonGroup } from "@/components/ui/button-group";
import { cn } from "@/lib/utils";
import {
	StyledSelect,
	StyledSelectTrigger,
	StyledSelectContent,
	SelectValue,
	SelectItem,
} from "@/components/ui/styled/styled-select";
import { User } from "lucide-react";

type ClientId = Id<"clients">;
type ClientContactId = Id<"clientContacts">;
type ClientPropertyId = Id<"clientProperties">;

export interface ProjectFormData {
	// Client Selection
	clientId: string;

	// Project Information
	title: string;
	instructions: string;
	projectType: "one-off" | "recurring";

	// Dates
	startDate: Date | undefined;
	endDate: Date | undefined;

	// Time (for recurring projects)
	startTime: string;
	endTime: string;

	// Assignment
	assignedUserIds: string;

	// Settings
	invoiceReminderEnabled: boolean;
	scheduleForLater: boolean;
}

interface ProjectOnboardingFormProps {
	preselectedClientId?: ClientId | null;
	onSubmit?: (data: ProjectFormData) => void;
	isLoading?: boolean;
}

const initialFormData: ProjectFormData = {
	clientId: "",
	title: "",
	instructions: "",
	projectType: "one-off",
	startDate: undefined,
	endDate: undefined,
	startTime: "",
	endTime: "",
	assignedUserIds: "",
	invoiceReminderEnabled: true,
	scheduleForLater: false,
};

// Zod validation schema
const formSchema = z
	.object({
		clientId: z.string().min(1, "Client selection is required"),
		title: z.string().min(1, "Project title is required"),
		instructions: z.string(),
		projectType: z.enum(["one-off", "recurring"]),
		startDate: z.date().optional(),
		endDate: z.date().optional(),
		startTime: z.string(),
		endTime: z.string(),
		assignedUserIds: z.string(),
		invoiceReminderEnabled: z.boolean(),
		scheduleForLater: z.boolean(),
	})
	.refine(
		(data) => {
			if (data.startDate && data.endDate) {
				return data.endDate >= data.startDate;
			}
			return true;
		},
		{
			message: "End date must be on or after start date",
			path: ["endDate"],
		}
	);

const formatDisplayDate = (date?: Date | number) => {
	if (!date) return "Not set";
	const dateObj = typeof date === "number" ? new Date(date) : date;
	return dateObj.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};


const getStatusBadgeClass = (status?: string) => {
	switch (status) {
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

const getPropertyDisplayName = (property: {
	propertyName?: string;
	streetAddress: string;
}) =>
	property.propertyName
		? `${property.propertyName} - ${property.streetAddress}`
		: property.streetAddress;

const getContactDisplayName = (contact: {
	firstName: string;
	lastName: string;
	jobTitle?: string;
}) =>
	`${contact.firstName} ${contact.lastName}${contact.jobTitle ? ` - ${contact.jobTitle}` : ""}`;

// Separate component for date fields to handle state properly
function DateFieldsSection({
	form,
	isLoading,
}: {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	form: any;
	isLoading: boolean;
}) {
	const [startDateOpen, setStartDateOpen] = React.useState(false);
	const [endDateOpen, setEndDateOpen] = React.useState(false);

	return (
		<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
			{/* Start Date */}
			<form.Field
				name="startDate"
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				children={(field: any) => (
					<Field>
						<FieldLabel>Start Date</FieldLabel>
						<Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
							<PopoverTrigger asChild>
								<Button
									intent="outline"
									className="w-full justify-start text-left font-normal"
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
									disabled={isLoading}
									className="!bg-white dark:!bg-gray-950"
								/>
							</PopoverContent>
						</Popover>
					</Field>
				)}
			/>

			{/* End Date */}
			<form.Field
				name="endDate"
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				children={(field: any) => {
					const startDateValue = form.getFieldValue("startDate");
					return (
						<Field>
							<FieldLabel>End Date</FieldLabel>
							<Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
								<PopoverTrigger asChild>
									<Button
										intent="outline"
										className="w-full justify-start text-left font-normal"
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
											if (isLoading) return true;
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
						</Field>
					);
				}}
			/>
		</div>
	);
}

export function ProjectOnboardingForm({
	preselectedClientId,
	onSubmit,
	isLoading = false,
}: ProjectOnboardingFormProps) {
	const router = useRouter();
	const toast = useToastOperations();

	const [selectedClientId, setSelectedClientId] =
		React.useState<ClientId | null>(preselectedClientId || null);
	const [selectedPropertyId, setSelectedPropertyId] =
		React.useState<ClientPropertyId | null>(null);
	const [selectedContactId, setSelectedContactId] =
		React.useState<ClientContactId | null>(null);

	const [calendarDate, setCalendarDate] = React.useState(() => {
		const date = new Date();
		date.setHours(0, 0, 0, 0);
		return date;
	});

	const [projectType, setProjectType] = React.useState<"one-off" | "recurring">("one-off");

	const clientsResult = useQuery(api.clients.list, {});
	const clients = useMemo(() => clientsResult ?? [], [clientsResult]);
	const clientDetails = useQuery(
		api.clients.get,
		selectedClientId ? { id: selectedClientId } : "skip"
	);

	const clientContacts = useQuery(
		api.clientContacts.listByClient,
		selectedClientId ? { clientId: selectedClientId } : "skip"
	);
	const clientProperties = useQuery(
		api.clientProperties.listByClient,
		selectedClientId ? { clientId: selectedClientId } : "skip"
	);

	const users = useQuery(api.users.listByOrg);

	const createProject = useMutation(api.projects.create);

	// Set up form with preselected client
	const form = useForm({
		defaultValues: {
			...initialFormData,
			clientId: preselectedClientId || "",
		},
		onSubmit: async ({ value }) => {
			// Validate with Zod
			const result = formSchema.safeParse(value);
			if (!result.success) {
				const errors = result.error.flatten();
				console.error("Validation errors:", errors);
				toast.error(
					"Validation Error",
					"Please fix the errors in the form before submitting."
				);
				return;
			}

			try {
				const payload = {
					clientId: value.clientId as ClientId,
					title: value.title.trim(),
					description: value.instructions || undefined,
					instructions: value.instructions || undefined,
					status: "planned" as const,
					projectType: value.projectType,
					startDate: value.startDate ? value.startDate.getTime() : undefined,
					endDate: value.endDate ? value.endDate.getTime() : undefined,
					assignedUserIds: value.assignedUserIds || undefined,
					invoiceReminderEnabled: value.invoiceReminderEnabled,
					scheduleForLater: value.scheduleForLater,
				};

				if (onSubmit) {
					onSubmit(value);
				} else {
					const projectId = await createProject(payload);
					toast.success(
						"Project Created",
						"Project has been successfully created!"
					);
					router.push(`/projects/${projectId}`);
				}
			} catch (error) {
				console.error("Failed to submit form:", error);
				toast.error("Error", "Failed to create project. Please try again.");
			}
		},
	});

	// Update form when preselected client changes
	useEffect(() => {
		if (preselectedClientId) {
			setSelectedClientId(preselectedClientId);
			form.setFieldValue("clientId", preselectedClientId);
		}
	}, [preselectedClientId, form]);

	// Reset property and contact when client changes
	useEffect(() => {
		setSelectedPropertyId(null);
		setSelectedContactId(null);
	}, [selectedClientId]);

	// Auto-select primary property
	useEffect(() => {
		if (!clientProperties) return;
		setSelectedPropertyId((current) => {
			if (
				current &&
				clientProperties.some((property) => property._id === current)
			) {
				return current;
			}
			const primary =
				clientProperties.find((property) => property.isPrimary) ??
				clientProperties[0] ??
				null;
			return primary ? primary._id : null;
		});
	}, [clientProperties]);

	// Auto-select primary contact
	useEffect(() => {
		if (!clientContacts) return;
		setSelectedContactId((current) => {
			if (
				current &&
				clientContacts.some((contact) => contact._id === current)
			) {
				return current;
			}
			const primary =
				clientContacts.find((contact) => contact.isPrimary) ??
				clientContacts[0] ??
				null;
			return primary ? primary._id : null;
		});
	}, [clientContacts]);

	const selectedClient = useMemo(() => {
		if (!selectedClientId) return null;
		return clients.find((client) => client._id === selectedClientId) ?? null;
	}, [clients, selectedClientId]);

	const propertyOptions = useMemo(
		() =>
			clientProperties?.map((property) => getPropertyDisplayName(property)) ??
			[],
		[clientProperties]
	);

	const contactOptions = useMemo(
		() =>
			clientContacts?.map((contact) => getContactDisplayName(contact)) ?? [],
		[clientContacts]
	);

	const selectedProperty = useMemo(() => {
		if (!clientProperties || !selectedPropertyId) return null;
		return (
			clientProperties.find(
				(property) => property._id === selectedPropertyId
			) ?? null
		);
	}, [clientProperties, selectedPropertyId]);

	const selectedContact = useMemo(() => {
		if (!clientContacts || !selectedContactId) return null;
		return (
			clientContacts.find((contact) => contact._id === selectedContactId) ??
			null
		);
	}, [clientContacts, selectedContactId]);

	const clientOptions = useMemo(
		() => clients.map((client) => client.companyName),
		[clients]
	);

	const handleClientSelect = (selection: string | null) => {
		if (!selection) {
			setSelectedClientId(null);
			form.setFieldValue("clientId", "");
			return;
		}
		const client = clients.find((item) => item.companyName === selection);
		if (client) {
			setSelectedClientId(client._id);
			form.setFieldValue("clientId", client._id);
		}
	};

	const handlePropertySelect = (selection: string | null) => {
		if (!clientProperties) return;
		if (!selection) {
			setSelectedPropertyId(null);
			return;
		}
		const property = clientProperties.find(
			(item) => getPropertyDisplayName(item) === selection
		);
		if (property) {
			setSelectedPropertyId(property._id);
		}
	};

	const handleContactSelect = (selection: string | null) => {
		if (!clientContacts) return;
		if (!selection) {
			setSelectedContactId(null);
			return;
		}
		const contact = clientContacts.find(
			(item) => getContactDisplayName(item) === selection
		);
		if (contact) {
			setSelectedContactId(contact._id);
		}
	};

	const handleProjectTypeChange = (type: "one-off" | "recurring") => {
		setProjectType(type);
		form.setFieldValue("projectType", type);
	};

	const handleCalendarNavigation = (direction: "prev" | "next") => {
		setCalendarDate((previous) => {
			const nextDate = new Date(previous);
			nextDate.setMonth(
				direction === "prev" ? nextDate.getMonth() - 1 : nextDate.getMonth() + 1
			);
			return nextDate;
		});
	};

	const handleDateClick = (day: number | null) => {
		if (!day) return;
		const clickedDate = new Date(
			calendarDate.getFullYear(),
			calendarDate.getMonth(),
			day
		);
		clickedDate.setHours(0, 0, 0, 0);

		const currentStartDate = form.getFieldValue("startDate");
		const currentEndDate = form.getFieldValue("endDate");

		if (!currentStartDate) {
			// Set start date
			form.setFieldValue("startDate", clickedDate);
			return;
		}

		if (!currentEndDate) {
			// Validate that end date is not before start date
			const startNormalized = new Date(
				typeof currentStartDate === "number"
					? currentStartDate
					: currentStartDate.getTime()
			);
			startNormalized.setHours(0, 0, 0, 0);

			if (clickedDate < startNormalized) {
				// If clicked date is before start, reset start date to clicked date
				form.setFieldValue("startDate", clickedDate);
				form.setFieldValue("endDate", undefined);
				toast.error(
					"Invalid Date Selection",
					"End date cannot be before start date. Resetting to new start date."
				);
				return;
			}

			// Set end date
			form.setFieldValue("endDate", clickedDate);
			return;
		}

		// Reset and start over
		form.setFieldValue("startDate", clickedDate);
		form.setFieldValue("endDate", undefined);
	};

	return (
		<>
			<div className="w-full px-6">
				<div className="w-full pt-8 pb-24">
					{/* Header */}
					<div className="mb-8">
						<h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
							Create New Project
						</h1>
						<p className="mt-3 text-base text-gray-600 dark:text-gray-400 max-w-2xl">
							Set up your project with all the essential details for successful
							execution.
						</p>
					</div>

					<form
						id="project-onboarding-form"
						onSubmit={(e) => {
							e.preventDefault();
							form.handleSubmit();
						}}
					>
						{/* Client, Property, Contact Cards */}
						<div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
							{/* Client Information Card */}
							<Card className="shadow-sm border-gray-200/60 dark:border-white/10">
								<CardHeader className="pb-4">
									<CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
										<MagnifyingGlassIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
										Client Information
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid gap-2">
										<label className="text-sm text-gray-600 dark:text-gray-400 text-left">
											Selected Client *
										</label>
										<form.Field
											name="clientId"
											children={(field) => (
												<ComboBox
													options={clientOptions}
													placeholder={
														selectedClient?.companyName ?? "Select a client..."
													}
													onSelect={(value) => {
														handleClientSelect(value);
														field.handleChange(
															value
																? clients.find((c) => c.companyName === value)
																		?._id || ""
																: ""
														);
													}}
													disabled={isLoading}
												/>
											)}
										/>
									</div>

									{clientDetails ? (
										<div className="grid grid-cols-2 gap-4 text-sm">
											<div>
												<span className="text-gray-500 dark:text-gray-400">
													Status:
												</span>
												<div className="flex items-center gap-2 mt-1">
													<Badge
														className={getStatusBadgeClass(
															clientDetails.status
														)}
														variant="outline"
													>
														{clientDetails.status}
													</Badge>
												</div>
											</div>
											<div>
												<span className="text-gray-500 dark:text-gray-400">
													Type:
												</span>
												<div className="mt-1 text-gray-900 dark:text-white capitalize">
													{clientDetails.clientType || "Not specified"}
												</div>
											</div>
											<div>
												<span className="text-gray-500 dark:text-gray-400">
													Industry:
												</span>
												<div className="mt-1 text-gray-900 dark:text-white">
													{clientDetails.industry || "No industry specified"}
												</div>
											</div>
											{clientDetails.companyDescription && (
												<div className="col-span-2">
													<span className="text-gray-500 dark:text-gray-400">
														Description:
													</span>
													<div className="mt-1 text-gray-900 dark:text-white">
														{clientDetails.companyDescription}
													</div>
												</div>
											)}
										</div>
									) : selectedClientId ? (
										<div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
											Loading client details...
										</div>
									) : (
										<div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
											Select a client to view details
										</div>
									)}
								</CardContent>
							</Card>

							{/* Property Address Card */}
							<Card className="shadow-sm border-gray-200/60 dark:border-white/10">
								<CardHeader className="pb-4">
									<CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
										<MapPinIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
										Property Address
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid gap-2">
										<label className="text-sm text-gray-600 dark:text-gray-400 text-left">
											Selected Property
										</label>
										<ComboBox
											options={propertyOptions}
											placeholder={
												selectedProperty
													? getPropertyDisplayName(selectedProperty)
													: selectedClientId
														? propertyOptions.length > 0
															? "Select a property..."
															: "No properties for this client"
														: "Select a client first..."
											}
											onSelect={handlePropertySelect}
											disabled={
												!selectedClientId || propertyOptions.length === 0
											}
										/>
									</div>

									{selectedProperty ? (
										<div className="grid grid-cols-2 gap-4 text-sm">
											{selectedProperty.propertyName && (
												<div className="col-span-2">
													<span className="text-gray-500 dark:text-gray-400">
														Property Name:
													</span>
													<div className="mt-1 text-gray-900 dark:text-white font-medium">
														{selectedProperty.propertyName}
													</div>
												</div>
											)}
											<div>
												<span className="text-gray-500 dark:text-gray-400">
													Type:
												</span>
												<div className="mt-1 text-gray-900 dark:text-white capitalize">
													{selectedProperty.propertyType || "Not specified"}
												</div>
											</div>
											{selectedProperty.squareFootage && (
												<div>
													<span className="text-gray-500 dark:text-gray-400">
														Square Footage:
													</span>
													<div className="mt-1 text-gray-900 dark:text-white">
														{selectedProperty.squareFootage.toLocaleString()} sq
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
														{selectedProperty.streetAddress}
													</div>
													<div className="text-gray-600 dark:text-gray-400">
														{selectedProperty.city}, {selectedProperty.state}{" "}
														{selectedProperty.zipCode}
														{selectedProperty.country
															? `, ${selectedProperty.country}`
															: ""}
													</div>
												</div>
											</div>
											{selectedProperty.description && (
												<div className="col-span-2">
													<span className="text-gray-500 dark:text-gray-400">
														Description:
													</span>
													<div className="mt-1 text-gray-900 dark:text-white">
														{selectedProperty.description}
													</div>
												</div>
											)}
										</div>
									) : selectedClientId ? (
										<div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
											{propertyOptions.length === 0
												? "No properties available for this client"
												: "Select a property above to view details"}
										</div>
									) : (
										<div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
											Select a client to view property information
										</div>
									)}
								</CardContent>
							</Card>

							{/* Contact Details Card */}
							<Card className="shadow-sm border-gray-200/60 dark:border-white/10">
								<CardHeader className="pb-4">
									<CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
										<UserIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
										Contact Details
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid gap-2">
										<label className="text-sm text-gray-600 dark:text-gray-400 text-left">
											Selected Contact
										</label>
										<ComboBox
											options={contactOptions}
											placeholder={
												selectedContact
													? getContactDisplayName(selectedContact)
													: selectedClientId
														? contactOptions.length > 0
															? "Select a contact..."
															: "No contacts for this client"
														: "Select a client first..."
											}
											onSelect={handleContactSelect}
											disabled={
												!selectedClientId || contactOptions.length === 0
											}
										/>
									</div>

									{selectedContact ? (
										<div className="grid grid-cols-2 gap-4 text-sm">
											<div className="col-span-2">
												<span className="text-gray-500 dark:text-gray-400">
													Name:
												</span>
												<div className="mt-1 text-gray-900 dark:text-white font-medium">
													{selectedContact.firstName} {selectedContact.lastName}
												</div>
											</div>
											{selectedContact.jobTitle && (
												<div>
													<span className="text-gray-500 dark:text-gray-400">
														Job Title:
													</span>
													<div className="mt-1 text-gray-900 dark:text-white">
														{selectedContact.jobTitle}
													</div>
												</div>
											)}
											{selectedContact.role && (
												<div>
													<span className="text-gray-500 dark:text-gray-400">
														Role:
													</span>
													<div className="mt-1 text-gray-900 dark:text-white capitalize">
														{selectedContact.role}
													</div>
												</div>
											)}
											{selectedContact.department && (
												<div>
													<span className="text-gray-500 dark:text-gray-400">
														Department:
													</span>
													<div className="mt-1 text-gray-900 dark:text-white">
														{selectedContact.department}
													</div>
												</div>
											)}
											{selectedContact.email && (
												<div>
													<span className="text-gray-500 dark:text-gray-400">
														Email:
													</span>
													<div className="mt-1">
														<a
															href={`mailto:${selectedContact.email}`}
															className="text-blue-600 dark:text-blue-400 hover:underline"
														>
															{selectedContact.email}
														</a>
													</div>
												</div>
											)}
											{selectedContact.phone && (
												<div>
													<span className="text-gray-500 dark:text-gray-400">
														Phone:
													</span>
													<div className="mt-1">
														<a
															href={`tel:${selectedContact.phone}`}
															className="text-blue-600 dark:text-blue-400 hover:underline"
														>
															{selectedContact.phone}
														</a>
													</div>
												</div>
											)}
										</div>
									) : selectedClientId ? (
										<div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
											{contactOptions.length === 0
												? "No contacts available for this client"
												: "Select a contact above to view details"}
										</div>
									) : (
										<div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
											Select a client to view contact information
										</div>
									)}
								</CardContent>
							</Card>
						</div>

						{/* Project Information Section */}
						<div className="space-y-8">
							<Card className="shadow-sm border-gray-200/60 dark:border-white/10">
								<CardHeader className="pb-4">
									<CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
										Project Information
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-6">
									<FieldGroup className="sm:col-span-4">
										<form.Field
											name="title"
											children={(field) => {
												const isInvalid =
													field.state.meta.isTouched &&
													field.state.meta.errors.length > 0;
												return (
													<Field data-invalid={isInvalid}>
														<FieldLabel htmlFor={field.name}>
															Project Title *
														</FieldLabel>
														<Input
															id={field.name}
															name={field.name}
															value={field.state.value}
															onBlur={field.handleBlur}
															onChange={(e) =>
																field.handleChange(e.target.value)
															}
															aria-invalid={isInvalid}
															placeholder="e.g., Workshop & Festival"
															disabled={isLoading}
														/>
														{isInvalid && (
															<FieldError errors={field.state.meta.errors} />
														)}
													</Field>
												);
											}}
										/>
									</FieldGroup>

									<FieldGroup className="col-span-full">
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
															onChange={(e) =>
																field.handleChange(e.target.value)
															}
															aria-invalid={isInvalid}
															rows={4}
															placeholder="Describe any special instructions or context for this project"
															disabled={isLoading}
														/>
														{isInvalid && (
															<FieldError errors={field.state.meta.errors} />
														)}
													</Field>
												);
											}}
										/>
									</FieldGroup>

									{/* Assigned User */}
									<FieldGroup className="sm:col-span-4">
										<form.Field
											name="assignedUserIds"
											children={(field) => (
												<Field>
													<FieldLabel htmlFor={field.name} className="flex items-center gap-2">
														<User className="h-4 w-4 text-primary" />
														Assign To
													</FieldLabel>
													<StyledSelect
														value={field.state.value || undefined}
														onValueChange={(value) => field.handleChange(value)}
													>
														<StyledSelectTrigger className="w-full" disabled={isLoading}>
															<SelectValue placeholder="Unassigned" />
														</StyledSelectTrigger>
														<StyledSelectContent>
															{users?.map((user) => (
																<SelectItem key={user._id} value={user._id}>
																	{user.name || user.email}
																</SelectItem>
															))}
														</StyledSelectContent>
													</StyledSelect>
												</Field>
											)}
										/>
									</FieldGroup>

									<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
										<div>
											<span className="block text-sm font-medium text-gray-900 dark:text-white">
												Project Number
											</span>
											<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
												Automatically assigned after creation
											</p>
										</div>
									</div>

									<div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-white/10">
										<form.Field
											name="invoiceReminderEnabled"
											children={(field) => (
												<>
													<Checkbox
														id="invoiceReminder"
														checked={field.state.value}
														onCheckedChange={(checked) =>
															field.handleChange(!!checked)
														}
														disabled={isLoading}
													/>
													<Label
														htmlFor="invoiceReminder"
														className="text-sm text-gray-900 dark:text-white"
													>
														Remind me to invoice when I close the project
													</Label>
												</>
											)}
										/>
									</div>
								</CardContent>
							</Card>

							{/* Schedule & Project Details */}
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
										<ButtonGroup>
											<button
												type="button"
												onClick={() => handleProjectTypeChange("one-off")}
												className={cn(
													"inline-flex items-center gap-2 font-semibold transition-all duration-200 text-xs px-3 py-1.5 ring-1 shadow-sm hover:shadow-md backdrop-blur-sm",
													projectType === "one-off"
														? "text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/15 ring-primary/30 hover:ring-primary/40"
														: "text-gray-600 hover:text-gray-700 bg-transparent hover:bg-gray-50 ring-transparent hover:ring-gray-200 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800 dark:hover:ring-gray-700"
												)}
											>
												One-off Project
											</button>
											<button
												type="button"
												onClick={() => handleProjectTypeChange("recurring")}
												className={cn(
													"inline-flex items-center gap-2 font-semibold transition-all duration-200 text-xs px-3 py-1.5 ring-1 shadow-sm hover:shadow-md backdrop-blur-sm",
													projectType === "recurring"
														? "text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/15 ring-primary/30 hover:ring-primary/40"
														: "text-gray-600 hover:text-gray-700 bg-transparent hover:bg-gray-50 ring-transparent hover:ring-gray-200 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800 dark:hover:ring-gray-700"
												)}
											>
												Recurring Project
											</button>
										</ButtonGroup>
									</div>

									<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
										<div className="space-y-6">
											<DateFieldsSection form={form} isLoading={isLoading} />

											{/* Time inputs for recurring projects */}
											<form.Field
												name="projectType"
												children={(typeField) =>
													typeField.state.value === "recurring" && (
														<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
															<form.Field
																name="startTime"
																children={(field) => (
																	<Field>
																		<FieldLabel htmlFor={field.name}>
																			Start Time
																		</FieldLabel>
																		<Input
																			id={field.name}
																			type="time"
																			value={field.state.value}
																			onChange={(e) =>
																				field.handleChange(e.target.value)
																			}
																			disabled={isLoading}
																		/>
																	</Field>
																)}
															/>
															<form.Field
																name="endTime"
																children={(field) => (
																	<Field>
																		<FieldLabel htmlFor={field.name}>
																			End Time
																		</FieldLabel>
																		<Input
																			id={field.name}
																			type="time"
																			value={field.state.value}
																			onChange={(e) =>
																				field.handleChange(e.target.value)
																			}
																			disabled={isLoading}
																		/>
																	</Field>
																)}
															/>
														</div>
													)
												}
											/>

											<div className="flex items-center gap-3">
												<form.Field
													name="scheduleForLater"
													children={(field) => (
														<>
															<Checkbox
																id="scheduleForLater"
																checked={field.state.value}
																onCheckedChange={(checked) =>
																	field.handleChange(!!checked)
																}
																disabled={isLoading}
															/>
															<Label
																htmlFor="scheduleForLater"
																className="text-sm text-gray-900 dark:text-white"
															>
																Scheduled for later
															</Label>
														</>
													)}
												/>
											</div>
										</div>

										{/* Large Calendar Component */}
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
						</div>
					</form>
				</div>
			</div>
			<StickyFormFooter
				buttons={[
					{
						label: isLoading ? "Creating..." : "Create Project",
						onClick: () => form.handleSubmit(),
						intent: "primary",
						isLoading,
						position: "left",
					},
				]}
			/>
		</>
	);
}

ProjectOnboardingForm.displayName = "ProjectOnboardingForm";
