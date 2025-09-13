"use client";

import { useState } from "react";
import { CalendarIcon, UserIcon } from "@heroicons/react/16/solid";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { StickyFormFooter } from "@/components/sticky-form-footer";
import type { Key } from "react-aria-components";

interface ProjectOnboardingFormProps {
	title?: string;
	subtitle?: string;
}

export function ProjectOnboardingForm({
	title = "Create New Project",
	subtitle = "Set up your project with all the essential details for successful execution.",
}: ProjectOnboardingFormProps) {
	const [projectType, setProjectType] = useState(new Set<Key>(["one-off"]));
	const [selectedDate, setSelectedDate] = useState("Jul 28, 2025");
	const [reminderEnabled, setReminderEnabled] = useState(true);
	const [isLoading, setIsLoading] = useState(false);

	const handleProjectTypeChange = (keys: Set<Key>) => {
		setProjectType(keys);
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
						<h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
							{title}
						</h1>
						<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
							{subtitle}
						</p>
					</div>

					<form className="space-y-8">
						{/* Basic Project Information */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
									Project Information
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
									<div className="sm:col-span-2">
										<label
											htmlFor="project-title"
											className="block text-sm font-medium text-gray-900 dark:text-white"
										>
											Project Title
										</label>
										<div className="mt-2">
											<Input
												id="project-title"
												name="project-title"
												type="text"
												placeholder="e.g., Workshop & Festival"
												className="w-full"
											/>
										</div>
									</div>

									<div className="sm:col-span-2">
										<label
											htmlFor="project-instructions"
											className="block text-sm font-medium text-gray-900 dark:text-white"
										>
											Instructions
										</label>
										<div className="mt-2">
											<textarea
												id="project-instructions"
												name="project-instructions"
												rows={4}
												className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6"
												placeholder="Plan and execute a creative festival. Coordinate across logistics, event programming, marketing, and partner collaboration."
											/>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Property Address & Contact Details */}
						<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
							{/* Property Address */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
										<MapPinIcon className="h-5 w-5" />
										Property Address
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="space-y-2">
										<p className="text-sm text-gray-900 dark:text-white font-medium">
											1226 University Dr, Menlo Park, CA 94025, USA
										</p>
										<p className="text-sm text-gray-600 dark:text-gray-400">
											Menlo Park, California 94025
										</p>
									</div>
									<Button intent="outline" size="sm">
										Change
									</Button>
								</CardContent>
							</Card>

							{/* Contact Details */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
										<UserIcon className="h-5 w-5" />
										Contact Details
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="space-y-2">
										<p className="text-sm text-gray-900 dark:text-white font-medium">
											+1 650 213 7390
										</p>
										<p className="text-sm text-gray-600 dark:text-gray-400">
											jasmith.mobbin@gmail.com
										</p>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Project Details */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
									Project Details
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
									<div>
										<label
											htmlFor="project-number"
											className="block text-sm font-medium text-gray-900 dark:text-white"
										>
											Project Number
										</label>
										<div className="mt-2 flex items-center justify-between">
											<span className="text-sm text-gray-900 dark:text-white">
												#1
											</span>
											<Button intent="outline" size="sm">
												Change
											</Button>
										</div>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-900 dark:text-white">
											Salesperson
										</label>
										<div className="mt-2 flex items-center gap-2">
											<div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md">
												<div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white font-medium">
													SL
												</div>
												<span className="text-sm text-gray-900 dark:text-white">
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
										</div>
									</div>
								</div>

								<div>
									<Button intent="outline" size="sm">
										Add Custom Field
									</Button>
								</div>
							</CardContent>
						</Card>

						{/* Project Type */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
									Type
								</CardTitle>
							</CardHeader>
							<CardContent>
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
							</CardContent>
						</Card>

						{/* Schedule */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
									<CalendarIcon className="h-5 w-5" />
									Schedule
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
									<div>
										<label
											htmlFor="start-date"
											className="block text-sm font-medium text-gray-900 dark:text-white"
										>
											Start Date
										</label>
										<div className="mt-2">
											<Input
												id="start-date"
												type="text"
												value={selectedDate}
												onChange={(e) => setSelectedDate(e.target.value)}
												placeholder="Jul 28, 2025"
												className="w-full"
											/>
										</div>
									</div>

									<div>
										<label
											htmlFor="end-date"
											className="block text-sm font-medium text-gray-900 dark:text-white"
										>
											End Date
										</label>
										<div className="mt-2">
											<Input
												id="end-date"
												type="text"
												placeholder="Optional"
												className="w-full"
											/>
										</div>
									</div>
								</div>

								<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
									<div>
										<label
											htmlFor="start-time"
											className="block text-sm font-medium text-gray-900 dark:text-white"
										>
											Start Time
										</label>
										<div className="mt-2">
											<Input
												id="start-time"
												type="time"
												placeholder="Start time"
												className="w-full"
											/>
										</div>
									</div>

									<div>
										<label
											htmlFor="end-time"
											className="block text-sm font-medium text-gray-900 dark:text-white"
										>
											End Time
										</label>
										<div className="mt-2">
											<Input
												id="end-time"
												type="time"
												placeholder="End time"
												className="w-full"
											/>
										</div>
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

								{/* Calendar Preview */}
								<div className="border border-gray-200 dark:border-white/10 rounded-lg p-4">
									<div className="flex items-center justify-between mb-4">
										<h3 className="text-lg font-medium text-gray-900 dark:text-white">
											July 2025
										</h3>
										<div className="flex gap-2">
											<Button intent="outline" size="sm">
												Hide Calendar
											</Button>
										</div>
									</div>
									<div className="grid grid-cols-7 gap-1 text-center text-xs">
										<div className="font-medium text-gray-500 dark:text-gray-400 py-2">
											SUN
										</div>
										<div className="font-medium text-gray-500 dark:text-gray-400 py-2">
											MON
										</div>
										<div className="font-medium text-gray-500 dark:text-gray-400 py-2">
											TUE
										</div>
										<div className="font-medium text-gray-500 dark:text-gray-400 py-2">
											WED
										</div>
										<div className="font-medium text-gray-500 dark:text-gray-400 py-2">
											THU
										</div>
										<div className="font-medium text-gray-500 dark:text-gray-400 py-2">
											FRI
										</div>
										<div className="font-medium text-gray-500 dark:text-gray-400 py-2">
											SAT
										</div>

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
													py-2 px-1 cursor-pointer rounded-md
													${
														isCurrentMonth
															? "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
															: "text-gray-400 dark:text-gray-600"
													}
													${isSelected ? "bg-blue-600 text-white hover:bg-blue-700" : ""}
													${
														isToday && !isSelected
															? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200"
															: ""
													}
												`}
												>
													{isCurrentMonth ? day : ""}
												</div>
											);
										})}
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Team */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
									Team
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center gap-2">
									<div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md">
										<div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white font-medium">
											SL
										</div>
										<span className="text-sm text-gray-900 dark:text-white">
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
									<Button intent="outline" size="sm">
										+ Assign
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

						{/* Invoicing & Project Forms */}
						<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
							{/* Invoicing */}
							<Card>
								<CardHeader>
									<CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
										Invoicing
									</CardTitle>
								</CardHeader>
								<CardContent>
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
								</CardContent>
							</Card>

							{/* Project Forms */}
							<Card>
								<CardHeader>
									<CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
										Project Forms
									</CardTitle>
								</CardHeader>
								<CardContent>
									<Button intent="outline" size="sm" className="w-full">
										<svg
											className="w-4 h-4 mr-2"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M12 4v16m8-8H4"
											/>
										</svg>
										Add Form
									</Button>
								</CardContent>
							</Card>
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
