"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { StickyFormFooter } from "@/components/sticky-form-footer";
import {
	MagnifyingGlassIcon,
	UserIcon,
	DocumentTextIcon,
} from "@heroicons/react/16/solid";
import { ChevronDownIcon, FolderOpenIcon } from "@heroicons/react/24/outline";
import type { Id } from "../../../../../convex/_generated/dataModel";

interface Client {
	_id: Id<"clients">;
	companyName: string;
	industry?: string;
}

interface Project {
	_id: Id<"projects">;
	title: string;
	status: string;
	clientId: Id<"clients">;
}

export default function NewQuotePage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const toast = useToast();

	// Get project ID from URL params if provided
	const projectIdParam = searchParams.get("projectId") as Id<"projects"> | null;

	// Form state
	const [selectedClient, setSelectedClient] = useState<Client | null>(null);
	const [selectedProject, setSelectedProject] = useState<Project | null>(null);
	const [showClientDropdown, setShowClientDropdown] = useState(false);
	const [showProjectDropdown, setShowProjectDropdown] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	// Form fields
	const [quoteTitle, setQuoteTitle] = useState("");
	const [quoteNumber, setQuoteNumber] = useState("");
	const [validUntil, setValidUntil] = useState("");
	const [clientMessage, setClientMessage] = useState("");
	const [terms, setTerms] = useState(
		"Payment due within 30 days of acceptance"
	);

	// Fetch data from Convex
	const clients = useQuery(api.clients.list, {}) || [];
	const projects =
		useQuery(
			api.projects.list,
			selectedClient ? { clientId: selectedClient._id } : "skip"
		) || [];

	// Get project from URL param
	const projectFromParam = useQuery(
		api.projects.get,
		projectIdParam ? { id: projectIdParam } : "skip"
	);

	// Mutations
	const createQuote = useMutation(api.quotes.create);

	// Set project and client from URL params
	useState(() => {
		if (projectFromParam && !selectedProject) {
			setSelectedProject(projectFromParam);
			// Find and set the client for this project
			const client = clients.find((c) => c._id === projectFromParam.clientId);
			if (client && !selectedClient) {
				setSelectedClient(client);
			}
		}
	});

	const handleClientSelect = (client: Client) => {
		setSelectedClient(client);
		setSelectedProject(null); // Reset project when client changes
		setShowClientDropdown(false);
	};

	const handleProjectSelect = (project: Project) => {
		setSelectedProject(project);
		setShowProjectDropdown(false);
	};

	const handleCreateQuote = async () => {
		if (!selectedClient) {
			toast.error(
				"Missing Client",
				"Please select a client before creating the quote."
			);
			return;
		}

		setIsLoading(true);
		try {
			const quoteData = {
				clientId: selectedClient._id,
				projectId: selectedProject?._id,
				title: quoteTitle || undefined,
				quoteNumber: quoteNumber || undefined,
				status: "draft" as const,
				subtotal: 0, // Will be calculated from line items
				total: 0, // Will be calculated from line items
				validUntil: validUntil ? new Date(validUntil).getTime() : undefined,
				clientMessage: clientMessage || undefined,
				terms: terms || undefined,
				pdfSettings: {
					showQuantities: true,
					showUnitPrices: true,
					showLineItemTotals: true,
					showTotals: true,
				},
			};

			const quoteId = await createQuote(quoteData);
			toast.success("Quote Created", "Quote has been successfully created!");
			router.push(`/quotes/${quoteId}/quoteLineEditor`);
		} catch (error) {
			console.error("Failed to create quote:", error);
			toast.error("Error", "Failed to create quote. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleSaveAsDraft = async () => {
		if (!selectedClient) {
			toast.error("Missing Client", "Please select a client before saving.");
			return;
		}

		setIsLoading(true);
		try {
			const quoteData = {
				clientId: selectedClient._id,
				projectId: selectedProject?._id,
				title: quoteTitle || undefined,
				quoteNumber: quoteNumber || undefined,
				status: "draft" as const,
				subtotal: 0,
				total: 0,
				validUntil: validUntil ? new Date(validUntil).getTime() : undefined,
				clientMessage: clientMessage || undefined,
				terms: terms || undefined,
				pdfSettings: {
					showQuantities: true,
					showUnitPrices: true,
					showLineItemTotals: true,
					showTotals: true,
				},
			};

			const quoteId = await createQuote(quoteData);
			toast.success("Draft Saved", "Quote has been saved as a draft.");
			router.push(`/quotes/${quoteId}`);
		} catch (error) {
			console.error("Failed to save quote:", error);
			toast.error("Error", "Failed to save quote. Please try again.");
		} finally {
			setIsLoading(false);
		}
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

	return (
		<div className="flex flex-col min-h-screen">
			<div className="flex-1 w-full px-6">
				<div className="w-full pt-8 pb-24">
					{/* Header */}
					<div className="mb-8">
						<h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
							Create New Quote
						</h1>
						<p className="mt-3 text-base text-gray-600 dark:text-gray-400 max-w-2xl">
							Create a professional quote for your client with detailed line
							items and terms.
						</p>
					</div>

					<form className="space-y-8">
						{/* Client Selection */}
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
												Choose an existing client...
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
											</div>
										</div>
									)}
								</div>
							</CardContent>
						</Card>

						{/* Project Selection (Optional) */}
						{selectedClient && (
							<Card className="shadow-sm border-gray-200/60 dark:border-white/10">
								<CardHeader className="pb-4">
									<CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
										<FolderOpenIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
										Link to Project (Optional)
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="relative">
										<Button
											intent="outline"
											onClick={() =>
												setShowProjectDropdown(!showProjectDropdown)
											}
											className="w-full justify-between text-left h-12"
										>
											{selectedProject ? (
												<span className="flex items-center gap-3">
													<div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-sm text-white font-medium">
														P
													</div>
													<div>
														<div className="font-medium text-gray-900 dark:text-white">
															{selectedProject.title}
														</div>
														<div className="flex items-center gap-2">
															<Badge
																className={getStatusColor(
																	selectedProject.status
																)}
															>
																{formatStatus(selectedProject.status)}
															</Badge>
														</div>
													</div>
												</span>
											) : (
												<span className="text-gray-500 dark:text-gray-400">
													Choose a project to link this quote...
												</span>
											)}
											<ChevronDownIcon className="h-4 w-4" />
										</Button>

										{showProjectDropdown && (
											<div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-lg shadow-lg z-10">
												<div className="p-2 space-y-1 max-h-48 overflow-y-auto">
													{projects.length > 0 ? (
														projects.map((project) => (
															<button
																key={project._id}
																type="button"
																onClick={() => handleProjectSelect(project)}
																className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-white/5 rounded-md transition-colors"
															>
																<div className="flex items-center gap-3">
																	<div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-sm text-white font-medium">
																		P
																	</div>
																	<div>
																		<div className="font-medium text-gray-900 dark:text-white">
																			{project.title}
																		</div>
																		<div className="flex items-center gap-2">
																			<Badge
																				className={getStatusColor(
																					project.status
																				)}
																			>
																				{formatStatus(project.status)}
																			</Badge>
																		</div>
																	</div>
																</div>
															</button>
														))
													) : (
														<div className="p-3 text-center text-gray-500 dark:text-gray-400">
															No projects found for this client
														</div>
													)}
													<div className="border-t border-gray-200 dark:border-white/10 pt-2 mt-2">
														<button
															type="button"
															onClick={() =>
																router.push(
																	`/projects/new?clientId=${selectedClient._id}`
																)
															}
															className="w-full p-3 text-left text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors font-medium"
														>
															+ Create New Project
														</button>
													</div>
												</div>
											</div>
										)}
									</div>
								</CardContent>
							</Card>
						)}

						{/* Quote Details */}
						<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
							{/* Basic Quote Information */}
							<Card className="shadow-sm border-gray-200/60 dark:border-white/10">
								<CardHeader className="pb-4">
									<CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
										<DocumentTextIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
										Quote Information
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-6">
									<div>
										<label
											htmlFor="quote-title"
											className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
										>
											Quote Title (Optional)
										</label>
										<Input
											id="quote-title"
											name="quote-title"
											type="text"
											placeholder="e.g., Website Redesign Quote"
											value={quoteTitle}
											onChange={(e) => setQuoteTitle(e.target.value)}
											className="w-full h-11"
										/>
									</div>

									<div>
										<label
											htmlFor="quote-number"
											className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
										>
											Quote Number (Optional)
										</label>
										<Input
											id="quote-number"
											name="quote-number"
											type="text"
											placeholder="e.g., Q-2025-001"
											value={quoteNumber}
											onChange={(e) => setQuoteNumber(e.target.value)}
											className="w-full h-11"
										/>
									</div>

									<div>
										<label
											htmlFor="valid-until"
											className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
										>
											Valid Until (Optional)
										</label>
										<Input
											id="valid-until"
											name="valid-until"
											type="date"
											value={validUntil}
											onChange={(e) => setValidUntil(e.target.value)}
											className="w-full h-11"
										/>
									</div>
								</CardContent>
							</Card>

							{/* Terms & Message */}
							<Card className="shadow-sm border-gray-200/60 dark:border-white/10">
								<CardHeader className="pb-4">
									<CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
										<UserIcon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
										Terms & Client Message
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-6">
									<div>
										<label
											htmlFor="client-message"
											className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
										>
											Message to Client (Optional)
										</label>
										<textarea
											id="client-message"
											name="client-message"
											rows={3}
											value={clientMessage}
											onChange={(e) => setClientMessage(e.target.value)}
											className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-2.5 text-base text-gray-900 dark:text-white border border-gray-300 dark:border-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
											placeholder="Thank you for considering our services. We look forward to working with you."
										/>
									</div>

									<div>
										<label
											htmlFor="terms"
											className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
										>
											Terms & Conditions
										</label>
										<textarea
											id="terms"
											name="terms"
											rows={4}
											value={terms}
											onChange={(e) => setTerms(e.target.value)}
											className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-2.5 text-base text-gray-900 dark:text-white border border-gray-300 dark:border-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
											placeholder="Payment due within 30 days of acceptance"
										/>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Next Steps Info */}
						<Card className="shadow-sm border-gray-200/60 dark:border-white/10 bg-blue-50/50 dark:bg-blue-900/10">
							<CardContent className="pt-6">
								<div className="flex items-start gap-3">
									<div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
									<div>
										<p className="text-sm font-medium text-blue-900 dark:text-blue-200">
											Next Steps
										</p>
										<p className="text-xs text-blue-800 dark:text-blue-300 mt-1">
											After creating the quote, you&apos;ll be taken to the line
											item editor to add services, products, and pricing
											details.
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</form>
				</div>
			</div>

			<StickyFormFooter
				onCancel={handleSaveAsDraft}
				onSave={handleCreateQuote}
				cancelText="Save as Draft"
				saveText="Create Quote"
				isLoading={isLoading}
			/>
		</div>
	);
}
