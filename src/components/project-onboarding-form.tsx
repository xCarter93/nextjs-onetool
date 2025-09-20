"use client";

import { useState } from "react";
import {
	CalendarIcon,
	UserIcon,
	MagnifyingGlassIcon,
} from "@heroicons/react/16/solid";
import { MapPinIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { StickyFormFooter } from "@/components/sticky-form-footer";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToastOperations } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import type { Key } from "react-aria-components";
import type { Id } from "../../convex/_generated/dataModel";

interface Client {
	_id: Id<"clients">;
	companyName: string;
	industry?: string;
}

interface ProjectOnboardingFormProps {
	title?: string;
	subtitle?: string;
}

export function ProjectOnboardingForm({
	title = "Create New Project",
	subtitle = "Set up your project with all the essential details for successful execution.",
}: ProjectOnboardingFormProps) {
	const router = useRouter();
	const toast = useToastOperations();

	// Form state
	const [projectType, setProjectType] = useState(new Set<Key>(["one-off"]));
	const [reminderEnabled, setReminderEnabled] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedClient, setSelectedClient] = useState<Client | null>(null);
	const [showClientDropdown, setShowClientDropdown] = useState(false);
	const [calendarDate, setCalendarDate] = useState(new Date());

	// Form fields
	const [projectTitle, setProjectTitle] = useState("");
	const [projectInstructions, setProjectInstructions] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [scheduleForLater, setScheduleForLater] = useState(false);

	// Fetch clients from Convex
	const clients = useQuery(api.clients.list, {}) || [];

	// Mutations
	const createProject = useMutation(api.projects.create);

	const handleProjectTypeChange = (keys: Set<Key>) => {
		setProjectType(keys);
	};

	const handleClientSelect = (client: Client) => {
		setSelectedClient(client);
		setShowClientDropdown(false);
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

	const handleCalendarNavigation = (direction: 'prev' | 'next') => {
		setCalendarDate(prevDate => {
			const newDate = new Date(prevDate);
			if (direction === 'prev') {
				newDate.setMonth(newDate.getMonth() - 1);
			} else {
				newDate.setMonth(newDate.getMonth() + 1);
			}
			return newDate;
		});
	};

	const handleDateClick = (day: number | null) => {
		if (!day) return;
		
		const clickedDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day);
		const dateString = clickedDate.toISOString().slice(0, 10);
		
		// Set as start date if none exists, otherwise set as end date
		if (!startDate) {
			setStartDate(dateString);
		} else if (!endDate) {
			setEndDate(dateString);
		} else {
			// Reset and set as start date
			setStartDate(dateString);
			setEndDate("");
		}
	};

	const handleSaveAsDraft = async () => {
		if (!selectedClient) {
			toast.error("Missing Client", "Please select a client before saving.");
			return;
		}

		if (!projectTitle.trim()) {
			toast.error(
				"Missing Title",
				"Please enter a project title before saving."
			);
			return;
		}

		setIsLoading(true);
		try {
			const projectData = {
				clientId: selectedClient._id,
				title: projectTitle,
				description: projectInstructions || undefined,
				instructions: projectInstructions || undefined,
				status: "planned" as const,
				projectType:
					Array.from(projectType)[0] === "recurring"
						? ("recurring" as const)
						: ("one-off" as const),
				startDate: startDate ? new Date(startDate).getTime() : undefined,
				endDate: endDate ? new Date(endDate).getTime() : undefined,
				invoiceReminderEnabled: reminderEnabled,
				scheduleForLater: scheduleForLater,
			};

			const projectId = await createProject(projectData);
			toast.success("Draft Saved", "Project has been saved as a draft.");
			router.push(`/projects/${projectId}`);
		} catch (error) {
			console.error("Failed to save project:", error);
			toast.error("Error", "Failed to save project. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleCreateProject = async () => {
		if (!selectedClient) {
			toast.error(
				"Missing Client",
				"Please select a client before creating the project."
			);
			return;
		}

		if (!projectTitle.trim()) {
			toast.error(
				"Missing Title",
				"Please enter a project title before creating the project."
			);
			return;
		}

		setIsLoading(true);
		try {
			const projectData = {
				clientId: selectedClient._id,
				title: projectTitle,
				description: projectInstructions || undefined,
				instructions: projectInstructions || undefined,
				status: "planned" as const,
				projectType:
					Array.from(projectType)[0] === "recurring"
						? ("recurring" as const)
						: ("one-off" as const),
				startDate: startDate ? new Date(startDate).getTime() : undefined,
				endDate: endDate ? new Date(endDate).getTime() : undefined,
				invoiceReminderEnabled: reminderEnabled,
				scheduleForLater: scheduleForLater,
			};

			const projectId = await createProject(projectData);
			toast.success(
				"Project Created",
				"Project has been successfully created!"
			);
			router.push(`/projects/${projectId}`);
		} catch (error) {
			console.error("Failed to create project:", error);
			toast.error("Error", "Failed to create project. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<div className="w-full px-6">
				<div className="w-full pt-8 pb-24">
					{/* Header */}
					<div className="mb-8">
						<h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
							{title}
						</h1>
						<p className="mt-3 text-base text-gray-600 dark:text-gray-400 max-w-2xl">
							{subtitle}
						</p>
					</div>

					<form className="space-y-8">
						{/* Client Lookup */}
						<Card className="shadow-sm border-gray-200/60 dark:border-white/10">
							<CardHeader className="pb-4">
								<CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
									<MagnifyingGlassIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
									Select Client
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="relative">
									<Button
										intent="outline"
										onClick={() => setShowClientDropdown(!showClientDropdown)}
										className="w-full justify-between text-left h-12"
									>
										{selectedClient ? (
											<span className="flex items-center gap-3">
												<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm text-white font-medium">
													{selectedClient.companyName
														.split(" ")
														.map((n) => n[0])
														.join("")}
												</div>
												<div>
													<div className="font-medium text-gray-900 dark:text-white">
														{selectedClient.companyName}
													</div>
													<div className="text-sm text-gray-500 dark:text-gray-400">
														{selectedClient.industry || "No industry specified"}
													</div>
												</div>
											</span>
										) : (
											<span className="text-gray-500 dark:text-gray-400">
												Choose an existing client or create new...
											</span>
										)}
										<ChevronDownIcon className="h-4 w-4" />
									</Button>

									{showClientDropdown && (
										<div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-lg shadow-lg z-10">
											<div className="p-2 space-y-1 max-h-48 overflow-y-auto">
												{clients.map((client) => (
													<button
														key={client._id}
														type="button"
														onClick={() => handleClientSelect(client)}
														className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-white/5 rounded-md transition-colors"
													>
														<div className="flex items-center gap-3">
															<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm text-white font-medium">
																{client.companyName
																	.split(" ")
																	.map((n) => n[0])
																	.join("")}
															</div>
															<div>
																<div className="font-medium text-gray-900 dark:text-white">
																	{client.companyName}
																</div>
																<div className="text-sm text-gray-500 dark:text-gray-400">
																	{client.industry || "No industry specified"}
																</div>
															</div>
														</div>
													</button>
												))}
												<div className="border-t border-gray-200 dark:border-white/10 pt-2 mt-2">
													<button
														type="button"
														className="w-full p-3 text-left text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors font-medium"
													>
														+ Create New Client
													</button>
												</div>
											</div>
										</div>
									)}
								</div>
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
											<label
												htmlFor="project-title"
												className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
											>
												Project Title
											</label>
											<Input
												id="project-title"
												name="project-title"
												type="text"
												placeholder="e.g., Workshop & Festival"
												value={projectTitle}
												onChange={(e) => setProjectTitle(e.target.value)}
												className="w-full h-11"
											/>
										</div>

										<div>
											<label
												htmlFor="project-instructions"
												className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
											>
												Instructions
											</label>
											<textarea
												id="project-instructions"
												name="project-instructions"
												rows={4}
												value={projectInstructions}
												onChange={(e) => setProjectInstructions(e.target.value)}
												className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-2.5 text-base text-gray-900 dark:text-white border border-gray-300 dark:border-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
												placeholder="Plan and execute a creative festival. Coordinate across logistics, event programming, marketing, and partner collaboration."
											/>
										</div>

										<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
											<div>
												<label
													htmlFor="project-number"
													className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
												>
													Project Number
												</label>
												<div className="flex items-center justify-between">
													<span className="text-sm text-gray-900 dark:text-white font-mono">
														#1
													</span>
													<Button intent="outline" size="sm">
														Change
													</Button>
												</div>
											</div>

											<div>
												<label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
													Salesperson
												</label>
												<div className="flex items-center gap-2">
													<div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg">
														<div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white font-medium">
															SL
														</div>
														<span className="text-sm text-gray-900 dark:text-white font-medium">
															Sam Lee
														</span>
														<button
															type="button"
															className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-1"
														>
															<svg
																className="w-4 h-4"
																fill="currentColor"
																viewBox="0 0 20 20"
															>
																<path
																	fillRule="evenodd"
																	d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
																	clipRule="evenodd"
																/>
															</svg>
														</button>
													</div>
												</div>
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
									<div className="space-y-3">
										<div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg">
											<div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white font-medium">
												SL
											</div>
											<span className="text-sm text-gray-900 dark:text-white font-medium flex-1">
												Sam Lee
											</span>
											<button
												type="button"
												className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
											>
												<svg
													className="w-4 h-4"
													fill="currentColor"
													viewBox="0 0 20 20"
												>
													<path
														fillRule="evenodd"
														d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
														clipRule="evenodd"
													/>
												</svg>
											</button>
										</div>
										<Button intent="outline" size="sm" className="w-full">
											+ Assign Team Member
										</Button>
									</div>

									<div className="flex items-center gap-3">
										<input
											id="email-team"
											type="checkbox"
											className="h-4 w-4 rounded border-gray-300 dark:border-white/10 text-blue-600 dark:text-indigo-500 focus:ring-blue-500 dark:focus:ring-indigo-500"
										/>
										<label
											htmlFor="email-team"
											className="text-sm text-gray-900 dark:text-white"
										>
											Email team about assignment
										</label>
									</div>
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
									{selectedClient ? (
										<div className="space-y-3">
											<div className="p-4 bg-gray-50 dark:bg-white/5 rounded-lg">
												<p className="text-base text-gray-900 dark:text-white font-medium">
													Address information will be available after client
													selection
												</p>
												<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
													Property details will be populated from client data
												</p>
											</div>
											<Button intent="outline" size="sm">
												View Client Details
											</Button>
										</div>
									) : (
										<div className="p-4 border-2 border-dashed border-gray-300 dark:border-white/20 rounded-lg text-center">
											<p className="text-sm text-gray-500 dark:text-gray-400">
												Select a client to populate address information
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
									{selectedClient ? (
										<div className="space-y-3">
											<div className="p-4 bg-gray-50 dark:bg-white/5 rounded-lg space-y-2">
												<div className="flex items-center gap-2">
													<span className="text-sm text-gray-500 dark:text-gray-400">
														Company:
													</span>
													<span className="text-base text-gray-900 dark:text-white font-medium">
														{selectedClient.companyName}
													</span>
												</div>
												<div className="flex items-center gap-2">
													<span className="text-sm text-gray-500 dark:text-gray-400">
														Industry:
													</span>
													<span className="text-base text-gray-900 dark:text-white">
														{selectedClient.industry || "Not specified"}
													</span>
												</div>
											</div>
											<Button intent="outline" size="sm">
												View Client Details
											</Button>
										</div>
									) : (
										<div className="p-4 border-2 border-dashed border-gray-300 dark:border-white/20 rounded-lg text-center">
											<p className="text-sm text-gray-500 dark:text-gray-400">
												Select a client to populate contact information
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
								{/* Project Type */}
								<div>
									<label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
										Project Type
									</label>
									<ToggleGroup
										selectedKeys={projectType}
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
									{/* Schedule Form */}
									<div className="space-y-6">
										<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
											<div>
												<label
													htmlFor="start-date"
													className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
												>
													Start Date
												</label>
												<Input
													id="start-date"
													type="date"
													value={startDate}
													onChange={(e) => setStartDate(e.target.value)}
													className="w-full h-11"
												/>
											</div>

											<div>
												<label
													htmlFor="end-date"
													className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
												>
													End Date
												</label>
												<Input
													id="end-date"
													type="date"
													value={endDate}
													onChange={(e) => setEndDate(e.target.value)}
													className="w-full h-11"
												/>
											</div>
										</div>

										<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
											<div>
												<label
													htmlFor="start-time"
													className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
												>
													Start Time
												</label>
												<Input
													id="start-time"
													type="time"
													className="w-full h-11"
												/>
											</div>

											<div>
												<label
													htmlFor="end-time"
													className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
												>
													End Time
												</label>
												<Input
													id="end-time"
													type="time"
													className="w-full h-11"
												/>
											</div>
										</div>

										<div className="flex items-center gap-3">
											<input
												id="schedule-later"
												type="checkbox"
												checked={scheduleForLater}
												onChange={(e) => setScheduleForLater(e.target.checked)}
												className="h-4 w-4 rounded border-gray-300 dark:border-white/10 text-blue-600 dark:text-indigo-500 focus:ring-blue-500 dark:focus:ring-indigo-500"
											/>
											<label
												htmlFor="schedule-later"
												className="text-sm text-gray-900 dark:text-white"
											>
												Schedule later
											</label>
										</div>

										{/* Invoicing */}
										<div className="pt-4 border-t border-gray-200 dark:border-white/10">
											<h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
												Invoicing
											</h4>
											<div className="flex items-center gap-3">
												<input
													id="invoice-reminder"
													type="checkbox"
													checked={reminderEnabled}
													onChange={(e) => setReminderEnabled(e.target.checked)}
													className="h-4 w-4 rounded border-gray-300 dark:border-white/10 text-blue-600 dark:text-indigo-500 focus:ring-blue-500 dark:focus:ring-indigo-500"
												/>
												<label
													htmlFor="invoice-reminder"
													className="text-sm text-gray-900 dark:text-white"
												>
													Remind me to invoice when I close the project
												</label>
											</div>
										</div>
									</div>

									{/* Calendar Preview */}
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
													onClick={() => handleCalendarNavigation('prev')}
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
													onClick={() => handleCalendarNavigation('next')}
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
												const isToday = isCurrentMonth && 
													day === today.getDate() &&
													calendarDate.getMonth() === today.getMonth() &&
													calendarDate.getFullYear() === today.getFullYear();

												// Check if this day has selected dates
												let isStartDate = false;
												let isEndDate = false;
												
												if (day && startDate) {
													const startDateObj = new Date(startDate);
													isStartDate = day === startDateObj.getDate() &&
														calendarDate.getMonth() === startDateObj.getMonth() &&
														calendarDate.getFullYear() === startDateObj.getFullYear();
												}
												
												if (day && endDate) {
													const endDateObj = new Date(endDate);
													isEndDate = day === endDateObj.getDate() &&
														calendarDate.getMonth() === endDateObj.getMonth() &&
														calendarDate.getFullYear() === endDateObj.getFullYear();
												}

												const hasSelectedDate = isStartDate || isEndDate;

												return (
													<div
														key={i}
														onClick={() => handleDateClick(day)}
														className={`
															relative h-10 flex items-center justify-center text-sm cursor-pointer transition-all duration-200
															${
																isCurrentMonth
																	? "text-gray-900 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/30"
																	: "text-gray-300 dark:text-gray-600"
															}
															${hasSelectedDate ? "bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 font-medium" : ""}
															${
																isToday && !hasSelectedDate
																	? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg font-medium"
																	: ""
															}
														`}
														title={
															isStartDate
																? "Start Date"
																: isEndDate
																	? "End Date"
																	: isCurrentMonth
																		? "Click to set date"
																		: ""
														}
													>
														{day || ""}
														{hasSelectedDate && (
															<div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
														)}
													</div>
												);
											})}
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						<div className="pt-4">
							<Button intent="outline" size="sm">
								Add Custom Field
							</Button>
						</div>
					</form>
				</div>
			</div>
			<StickyFormFooter
				onCancel={handleSaveAsDraft}
				onSave={handleCreateProject}
				cancelText="Save as Draft"
				saveText="Create Project"
				isLoading={isLoading}
			/>
		</>
	);
}
