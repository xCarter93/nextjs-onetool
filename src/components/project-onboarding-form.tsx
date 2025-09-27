"use client";

import { useEffect, useMemo, useState } from "react";
import {
	CalendarIcon,
	UserIcon,
	MagnifyingGlassIcon,
} from "@heroicons/react/16/solid";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { StickyFormFooter } from "@/components/sticky-form-footer";
import { Badge } from "@/components/ui/badge";
import ComboBox from "@/components/ui/combo-box";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToastOperations } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import type { Key } from "react-aria-components";
import type { Id } from "../../convex/_generated/dataModel";

const PAGE_TITLE = "Create New Project";
const PAGE_SUBTITLE =
	"Set up your project with all the essential details for successful execution.";

const ONE_OFF_KEY: Key = "one-off";
const RECURRING_KEY: Key = "recurring";

type ProjectType = "one-off" | "recurring";

type ClientId = Id<"clients">;
type ClientContactId = Id<"clientContacts">;
type ClientPropertyId = Id<"clientProperties">;

const formatInputDate = (timestamp?: number) => {
	if (!timestamp) return "";
	const date = new Date(timestamp);
	const year = date.getFullYear();
	const month = `${date.getMonth() + 1}`.padStart(2, "0");
	const day = `${date.getDate()}`.padStart(2, "0");
	return `${year}-${month}-${day}`;
};

const parseDateInput = (value: string): number | undefined => {
	if (!value) return undefined;
	const [yearStr, monthStr, dayStr] = value.split("-");
	const year = Number(yearStr);
	const month = Number(monthStr);
	const day = Number(dayStr);
	if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
		return undefined;
	}
	return new Date(year, month - 1, day).getTime();
};

const getCalendarDays = (date: Date) => {
	const year = date.getFullYear();
	const month = date.getMonth();

	const firstDay = new Date(year, month, 1);
	const lastDay = new Date(year, month + 1, 0);
	const startingDayOfWeek = firstDay.getDay();
	const daysInMonth = lastDay.getDate();

	const calendarDays: Array<number | null> = [];

	for (let i = 0; i < startingDayOfWeek; i++) {
		calendarDays.push(null);
	}

	for (let day = 1; day <= daysInMonth; day++) {
		calendarDays.push(day);
	}

	while (calendarDays.length < 42) {
		calendarDays.push(null);
	}

	return calendarDays;
};

const formatDisplayDate = (timestamp?: number) => {
	if (!timestamp) return "Not set";
	return new Date(timestamp).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

const getStatusBadgeClass = (status?: string) => {
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

export function ProjectOnboardingForm() {
	const router = useRouter();
	const toast = useToastOperations();

	const [projectTypeKeys, setProjectTypeKeys] = useState<Set<Key>>(
		new Set([ONE_OFF_KEY])
	);
	const [reminderEnabled, setReminderEnabled] = useState(true);
	const [scheduleForLater, setScheduleForLater] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const [projectTitle, setProjectTitle] = useState("");
	const [projectInstructions, setProjectInstructions] = useState("");
	const [startDate, setStartDate] = useState<number | undefined>();
	const [endDate, setEndDate] = useState<number | undefined>();
	const [dueDate, setDueDate] = useState<number | undefined>();
	const [startTime, setStartTime] = useState("");
	const [endTime, setEndTime] = useState("");

	const [calendarDate, setCalendarDate] = useState(() => {
		const date = new Date();
		date.setHours(0, 0, 0, 0);
		return date;
	});

	const [selectedClientId, setSelectedClientId] = useState<ClientId | null>(
		null
	);
	const [selectedPropertyId, setSelectedPropertyId] =
		useState<ClientPropertyId | null>(null);
	const [selectedContactId, setSelectedContactId] =
		useState<ClientContactId | null>(null);

	const selectedProjectType: ProjectType = useMemo(
		() => (projectTypeKeys.has(RECURRING_KEY) ? "recurring" : "one-off"),
		[projectTypeKeys]
	);
	const showTimeInputs = selectedProjectType === "recurring";

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

	useEffect(() => {
		setSelectedPropertyId(null);
		setSelectedContactId(null);
	}, [selectedClientId]);

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

	const handleProjectTypeChange = (keys: Set<Key>) => {
		if (keys.size === 0) {
			setProjectTypeKeys(new Set([ONE_OFF_KEY]));
			return;
		}
		const nextKey = keys.has(RECURRING_KEY) ? RECURRING_KEY : ONE_OFF_KEY;
		setProjectTypeKeys(new Set([nextKey]));
	};

	const handleClientSelect = (selection: string | null) => {
		if (!selection) {
			setSelectedClientId(null);
			return;
		}
		const client = clients.find((item) => item.companyName === selection);
		if (client) {
			setSelectedClientId(client._id);
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

	const createProject = useMutation(api.projects.create);

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
		const timestamp = new Date(
			calendarDate.getFullYear(),
			calendarDate.getMonth(),
			day
		).getTime();

		if (!startDate) {
			setStartDate(timestamp);
			return;
		}
		if (!endDate) {
			setEndDate(timestamp);
			return;
		}
		if (!dueDate) {
			setDueDate(timestamp);
			return;
		}

		setStartDate(timestamp);
		setEndDate(undefined);
		setDueDate(undefined);
	};

	const validateBeforeSubmit = () => {
		if (!selectedClientId) {
			toast.error(
				"Missing Client",
				"Please select a client before continuing."
			);
			return false;
		}
		if (!projectTitle.trim()) {
			toast.error("Missing Title", "Please enter a project title.");
			return false;
		}
		return true;
	};

	const buildProjectPayload = () => ({
		clientId: selectedClientId as ClientId,
		title: projectTitle.trim(),
		description: projectInstructions || undefined,
		instructions: projectInstructions || undefined,
		status: "planned" as const,
		projectType: selectedProjectType,
		startDate: startDate ?? undefined,
		endDate: endDate ?? undefined,
		dueDate: dueDate ?? undefined,
		invoiceReminderEnabled: reminderEnabled,
		scheduleForLater,
	});

	const handleFinalSave = async (mode: "draft" | "create") => {
		if (!validateBeforeSubmit()) return;

		setIsLoading(true);
		try {
			const payload = buildProjectPayload();
			const projectId = await createProject(payload);
			toast.success(
				mode === "draft" ? "Draft Saved" : "Project Created",
				mode === "draft"
					? "Project has been saved as a draft."
					: "Project has been successfully created!"
			);
			router.push(`/projects/${projectId}`);
		} catch (error) {
			console.error(`Failed to ${mode} project`, error);
			toast.error("Error", `Failed to ${mode} project. Please try again.`);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<div className="w-full px-6">
				<div className="w-full pt-8 pb-24">
					<div className="mb-8">
						<h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
							{PAGE_TITLE}
						</h1>
						<p className="mt-3 text-base text-gray-600 dark:text-gray-400 max-w-2xl">
							{PAGE_SUBTITLE}
						</p>
					</div>

					<form className="space-y-8">
						<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
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
											Selected Client
										</label>
										<ComboBox
											options={clientOptions}
											placeholder={
												selectedClient?.companyName ?? "Select a client..."
											}
											onSelect={handleClientSelect}
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
										<Input
											value={projectTitle}
											onChange={(event) => setProjectTitle(event.target.value)}
											placeholder="e.g., Workshop & Festival"
										/>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
											Instructions
										</label>
										<textarea
											rows={4}
											value={projectInstructions}
											onChange={(event) =>
												setProjectInstructions(event.target.value)
											}
											className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-2.5 text-base text-gray-900 dark:text-white border border-gray-300 dark:border-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
											placeholder="Describe any special instructions or context for this project"
										/>
									</div>
								</div>

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
									<input
										type="checkbox"
										checked={reminderEnabled}
										onChange={(event) =>
											setReminderEnabled(event.target.checked)
										}
										className="h-4 w-4 rounded border-gray-300 dark:border-white/10 text-blue-600 dark:text-indigo-500"
									/>
									<label className="text-sm text-gray-900 dark:text-white">
										Remind me to invoice when I close the project
									</label>
								</div>
							</CardContent>
						</Card>

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
									<ToggleGroup
										selectedKeys={projectTypeKeys}
										onSelectionChange={handleProjectTypeChange}
										selectionMode="single"
										size="md"
										className="w-fit"
									>
										<ToggleGroupItem id="one-off">
											One-off Project
										</ToggleGroupItem>
										<ToggleGroupItem id="recurring">
											Recurring Project
										</ToggleGroupItem>
									</ToggleGroup>
								</div>

								<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
									<div className="space-y-6">
										<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
											<div>
												<label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
													Start Date
												</label>
												<Input
													type="date"
													value={formatInputDate(startDate)}
													onChange={(event) =>
														setStartDate(parseDateInput(event.target.value))
													}
												/>
											</div>
											<div>
												<label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
													End Date
												</label>
												<Input
													type="date"
													value={formatInputDate(endDate)}
													onChange={(event) =>
														setEndDate(parseDateInput(event.target.value))
													}
												/>
											</div>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
												Due Date
											</label>
											<Input
												type="date"
												value={formatInputDate(dueDate)}
												onChange={(event) =>
													setDueDate(parseDateInput(event.target.value))
												}
											/>
										</div>

										{showTimeInputs && (
											<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
												<div>
													<label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
														Start Time
													</label>
													<Input
														type="time"
														value={startTime}
														onChange={(event) =>
															setStartTime(event.target.value)
														}
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
														End Time
													</label>
													<Input
														type="time"
														value={endTime}
														onChange={(event) => setEndTime(event.target.value)}
													/>
												</div>
											</div>
										)}

										<div className="flex items-center gap-3">
											<input
												type="checkbox"
												checked={scheduleForLater}
												onChange={(event) =>
													setScheduleForLater(event.target.checked)
												}
												className="h-4 w-4 rounded border-gray-300 dark:border-white/10 text-blue-600 dark:text-indigo-500"
											/>
											<label className="text-sm text-gray-900 dark:text-white">
												Scheduled for later
											</label>
										</div>
									</div>

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

											{getCalendarDays(calendarDate).map((day, index) => {
												const isCurrentMonth = day !== null;
												const today = new Date();
												const isToday =
													isCurrentMonth &&
													day === today.getDate() &&
													calendarDate.getMonth() === today.getMonth() &&
													calendarDate.getFullYear() === today.getFullYear();

												let isStart = false;
												let isEnd = false;
												let isDue = false;

												if (day && startDate) {
													const start = new Date(startDate);
													isStart =
														day === start.getDate() &&
														calendarDate.getMonth() === start.getMonth() &&
														calendarDate.getFullYear() === start.getFullYear();
												}

												if (day && endDate) {
													const end = new Date(endDate);
													isEnd =
														day === end.getDate() &&
														calendarDate.getMonth() === end.getMonth() &&
														calendarDate.getFullYear() === end.getFullYear();
												}

												if (day && dueDate) {
													const due = new Date(dueDate);
													isDue =
														day === due.getDate() &&
														calendarDate.getMonth() === due.getMonth() &&
														calendarDate.getFullYear() === due.getFullYear();
												}

												const hasEvent = isStart || isEnd || isDue;

												return (
													<div
														key={index}
														onClick={() => handleDateClick(day)}
														className={`relative h-10 flex items-center justify-center text-sm transition-all duration-200 ${
															isCurrentMonth
																? "text-gray-900 dark:text-white " +
																	(hasEvent
																		? "bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 font-medium"
																		: "hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer")
																: "text-gray-300 dark:text-gray-600"
														}${
															isToday && !hasEvent
																? " bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg font-medium"
																: ""
														}`}
														title={
															isStart
																? "Project Start"
																: isEnd
																	? "Project End"
																	: isDue
																		? "Due Date"
																		: isCurrentMonth
																			? "Click to set date"
																			: ""
														}
													>
														{day ?? ""}
														{hasEvent && (
															<div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
														)}
													</div>
												);
											})}
										</div>

										<div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-200 dark:border-white/10 text-xs text-gray-500 dark:text-gray-400">
											{startDate && (
												<span>Start: {formatDisplayDate(startDate)}</span>
											)}
											{endDate && (
												<span>End: {formatDisplayDate(endDate)}</span>
											)}
											{dueDate && (
												<span>Due: {formatDisplayDate(dueDate)}</span>
											)}
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</form>
				</div>
			</div>
			<StickyFormFooter
				buttons={[
					{
						label: isLoading ? "Saving..." : "Save as Draft",
						onClick: () => handleFinalSave("draft"),
						intent: "outline",
						disabled: isLoading,
						position: "left",
					},
					{
						label: isLoading ? "Creating..." : "Create Project",
						onClick: () => handleFinalSave("create"),
						intent: "primary",
						isLoading,
						position: "right",
					},
				]}
			/>
		</>
	);
}
