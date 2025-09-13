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
import type { Key } from "react-aria-components";

interface Client {
	id: string;
	name: string;
	email: string;
	phone: string;
	address: string;
	city: string;
	state: string;
	zip: string;
}

interface ProjectOnboardingFormProps {
	title?: string;
	subtitle?: string;
}

export function ProjectOnboardingForm({
	title = "Create New Project",
	subtitle = "Set up your project with all the essential details for successful execution.",
}: ProjectOnboardingFormProps) {
	const [projectType, setProjectType] = useState(new Set<Key>(["one-off"]));
	const [selectedDate, setSelectedDate] = useState("2025-07-28");
	const [reminderEnabled, setReminderEnabled] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedClient, setSelectedClient] = useState<Client | null>(null);
	const [showClientDropdown, setShowClientDropdown] = useState(false);

	// Mock client data - in real app this would come from an API
	const clients: Client[] = [
		{
			id: "1",
			name: "ASMobbin Inc.",
			email: "jasmith.mobbin@gmail.com",
			phone: "+1 650 213 7390",
			address: "1226 University Dr",
			city: "Menlo Park",
			state: "CA",
			zip: "94025",
		},
		{
			id: "2",
			name: "Tech Solutions LLC",
			email: "contact@techsolutions.com",
			phone: "+1 555 123 4567",
			address: "500 Main Street",
			city: "San Francisco",
			state: "CA",
			zip: "94102",
		},
	];

	const handleProjectTypeChange = (keys: Set<Key>) => {
		setProjectType(keys);
	};

	const handleClientSelect = (client: Client) => {
		setSelectedClient(client);
		setShowClientDropdown(false);
	};

	const handleSaveAsDraft = () => {
		setIsLoading(true);
		// TODO: Implement save as draft functionality
		console.log("Saving as draft...");
		setTimeout(() => setIsLoading(false), 1000); // Simulate API call
	};

	const handleCreateProject = () => {
		setIsLoading(true);
		// TODO: Implement create project functionality
		console.log("Creating project...");
		setTimeout(() => setIsLoading(false), 1000); // Simulate API call
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

					<form className="space-y-8 max-w-7xl">
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
													{selectedClient.name
														.split(" ")
														.map((n) => n[0])
														.join("")}
												</div>
												<div>
													<div className="font-medium text-gray-900 dark:text-white">
														{selectedClient.name}
													</div>
													<div className="text-sm text-gray-500 dark:text-gray-400">
														{selectedClient.email}
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
														key={client.id}
														type="button"
														onClick={() => handleClientSelect(client)}
														className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-white/5 rounded-md transition-colors"
													>
														<div className="flex items-center gap-3">
															<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm text-white font-medium">
																{client.name
																	.split(" ")
																	.map((n) => n[0])
																	.join("")}
															</div>
															<div>
																<div className="font-medium text-gray-900 dark:text-white">
																	{client.name}
																</div>
																<div className="text-sm text-gray-500 dark:text-gray-400">
																	{client.email}
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
													{selectedClient.address}
												</p>
												<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
													{selectedClient.city}, {selectedClient.state}{" "}
													{selectedClient.zip}
												</p>
											</div>
											<Button intent="outline" size="sm">
												Change Address
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
														Phone:
													</span>
													<a
														href={`tel:${selectedClient.phone}`}
														className="text-base text-gray-900 dark:text-white font-medium hover:text-blue-600 dark:hover:text-blue-400"
													>
														{selectedClient.phone}
													</a>
												</div>
												<div className="flex items-center gap-2">
													<span className="text-sm text-gray-500 dark:text-gray-400">
														Email:
													</span>
													<a
														href={`mailto:${selectedClient.email}`}
														className="text-base text-blue-600 dark:text-blue-400 hover:underline"
													>
														{selectedClient.email}
													</a>
												</div>
											</div>
											<Button intent="outline" size="sm">
												Edit Contact Info
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
													value={selectedDate}
													onChange={(e) => setSelectedDate(e.target.value)}
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
												July 2025
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
												const isSelected = day === 28;
												const isToday = day === 29;

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
															${isSelected ? "bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 font-medium" : ""}
															${
																isToday && !isSelected
																	? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg font-medium"
																	: ""
															}
														`}
													>
														{isCurrentMonth ? day : ""}
														{isSelected && (
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
