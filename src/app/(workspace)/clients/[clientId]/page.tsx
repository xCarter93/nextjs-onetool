"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id, Doc } from "../../../../../convex/_generated/dataModel";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
	BuildingOffice2Icon,
	EnvelopeIcon,
	PlusIcon,
	ExclamationTriangleIcon,
	PencilIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import {
	Check,
	Plus,
	FolderOpen,
	Receipt,
	FileText,
	ClipboardList,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
	StyledInput,
	StyledSelect,
	StyledSelectTrigger,
	StyledSelectContent,
	SelectValue,
	SelectItem,
	StyledCard,
	StyledCardHeader,
	StyledCardTitle,
	StyledCardContent,
} from "@/components/ui/styled";
import { Label } from "@/components/ui/label";
import { StickyFormFooter } from "@/components/shared/sticky-form-footer";
import { PropertyTable } from "@/app/(workspace)/clients/components/property-table";
import { ContactTable } from "@/app/(workspace)/clients/components/contact-table";
import { TaskSheet } from "@/components/shared/task-sheet";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover";
import {
	Empty,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
	EmptyDescription,
} from "@/components/ui/empty";
import { useEffect, useMemo, useState } from "react";

// Helper function to format lead source for display
function formatLeadSource(leadSource?: string): string {
	if (!leadSource) return "Not specified";
	return leadSource
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

// Helper function to format status for display
function formatStatus(status: string): string {
	return status.charAt(0).toUpperCase() + status.slice(1);
}

// Helper function to format category for display
function formatCategory(category?: string): string {
	if (!category) return "Not specified";
	return category.charAt(0).toUpperCase() + category.slice(1);
}

// Helper function to format date
function formatDate(timestamp?: number) {
	if (!timestamp) return "Not set";
	return new Date(timestamp).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

// Helper function to get status color
function getStatusColor(status: string) {
	switch (status) {
		case "lead":
		case "prospect":
			return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
		case "active":
		case "paid":
		case "approved":
		case "completed":
			return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
		case "sent":
		case "pending":
		case "in-progress":
			return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
		case "inactive":
		case "cancelled":
		case "overdue":
			return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
		case "draft":
			return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
		default:
			return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
	}
}

const STATUS_OPTIONS = [
	"lead",
	"prospect",
	"active",
	"inactive",
	"archived",
] as const;

// Helper function to format communication preference
function formatCommunicationPreference(pref?: string): string {
	if (!pref) return "Not specified";
	switch (pref) {
		case "email":
			return "Email only";
		case "phone":
			return "Phone calls for urgent matters";
		case "both":
			return "Both email and phone";
		default:
			return pref;
	}
}

// Helper function to format phone number for display
function formatPhoneNumber(phone?: string): string {
	if (!phone) return "";
	// Basic phone formatting - you can enhance this
	return phone;
}

export default function ClientDetailPage() {
	const params = useParams();
	const router = useRouter();
	const clientId = params.clientId as string;
	const toast = useToast();
	const updateClient = useMutation(api.clients.update);
	const [isEditing, setIsEditing] = useState(false);
	const [isTaskSheetOpen, setIsTaskSheetOpen] = useState(false);
	const [form, setForm] = useState({
		industry: "",
		companyDescription: "",
		status: "lead",
		category: "",
		clientSize: "",
		clientType: "",
		emailOptIn: false,
		smsOptIn: false,
		priorityLevel: "",
		projectDimensions: "",
		communicationPreference: "" as "email" | "phone" | "both" | "",
		tags: "",
		notes: "",
	});

	// Fetch client data
	const client = useQuery(api.clients.get, { id: clientId as Id<"clients"> });
	const clientContacts = useQuery(api.clientContacts.listByClient, {
		clientId: clientId as Id<"clients">,
	});
	const clientProperties = useQuery(api.clientProperties.listByClient, {
		clientId: clientId as Id<"clients">,
	});
	const primaryContact = useQuery(api.clientContacts.getPrimaryContact, {
		clientId: clientId as Id<"clients">,
	});

	// Fetch related data for tabs
	const quotes = useQuery(api.quotes.list, {
		clientId: clientId as Id<"clients">,
	});
	const projects = useQuery(api.projects.list, {
		clientId: clientId as Id<"clients">,
	});
	const invoices = useQuery(api.invoices.list, {
		clientId: clientId as Id<"clients">,
	});
	const clientTasks = useQuery(api.tasks.list, {
		clientId: clientId as Id<"clients">,
	});

	useEffect(() => {
		if (client) {
			setForm({
				industry: client.industry || "",
				companyDescription: client.companyDescription || "",
				status: client.status,
				category: client.category || "",
				clientSize: client.clientSize || "",
				clientType: client.clientType || "",
				emailOptIn: client.emailOptIn,
				smsOptIn: client.smsOptIn,
				priorityLevel: client.priorityLevel || "",
				projectDimensions: client.projectDimensions || "",
				communicationPreference: client.communicationPreference || "",
				tags: (client.tags || []).join(", "),
				notes: client.notes || "",
			});
		}
	}, [client]);

	const isDirty = useMemo(() => {
		if (!client) return false;
		return (
			(form.industry || "") !== (client.industry || "") ||
			(form.companyDescription || "") !== (client.companyDescription || "") ||
			form.status !== client.status ||
			(form.category || "") !== (client.category || "") ||
			(form.clientSize || "") !== (client.clientSize || "") ||
			(form.clientType || "") !== (client.clientType || "") ||
			form.emailOptIn !== client.emailOptIn ||
			form.smsOptIn !== client.smsOptIn ||
			(form.priorityLevel || "") !== (client.priorityLevel || "") ||
			(form.projectDimensions || "") !== (client.projectDimensions || "") ||
			(form.communicationPreference || "") !==
				(client.communicationPreference || "") ||
			(form.tags || "") !== (client.tags || []).join(", ") ||
			(form.notes || "") !== (client.notes || "")
		);
	}, [form, client]);

	const handleSave = async () => {
		if (!client) return;
		const updates: Record<string, unknown> = {};
		if ((form.industry || "") !== (client.industry || ""))
			updates.industry = form.industry || undefined;
		if ((form.companyDescription || "") !== (client.companyDescription || ""))
			updates.companyDescription = form.companyDescription || undefined;
		if (form.status !== client.status)
			updates.status = form.status as typeof client.status;
		if ((form.category || "") !== (client.category || ""))
			updates.category = form.category || undefined;
		if ((form.clientSize || "") !== (client.clientSize || ""))
			updates.clientSize = form.clientSize || undefined;
		if ((form.clientType || "") !== (client.clientType || ""))
			updates.clientType = form.clientType || undefined;
		if (form.emailOptIn !== client.emailOptIn)
			updates.emailOptIn = form.emailOptIn;
		if (form.smsOptIn !== client.smsOptIn) updates.smsOptIn = form.smsOptIn;
		if ((form.priorityLevel || "") !== (client.priorityLevel || ""))
			updates.priorityLevel = form.priorityLevel || undefined;
		if ((form.projectDimensions || "") !== (client.projectDimensions || ""))
			updates.projectDimensions = form.projectDimensions || undefined;
		if (
			(form.communicationPreference || "") !==
			(client.communicationPreference || "")
		)
			updates.communicationPreference =
				form.communicationPreference || undefined;
		if ((form.tags || "") !== (client.tags || []).join(", "))
			updates.tags = form.tags
				? form.tags.split(/,\s*/).filter(Boolean)
				: undefined;
		if ((form.notes || "") !== (client.notes || ""))
			updates.notes = form.notes || undefined;

		if (Object.keys(updates).length === 0) {
			setIsEditing(false);
			return;
		}

		try {
			await updateClient({
				id: clientId as Id<"clients">,
				...updates,
			});
			toast.success("Client Updated", "Your changes have been saved.");
			setIsEditing(false);
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Failed to save changes";
			toast.error("Error", message);
		}
	};

	// Create sticky footer buttons based on current state
	const getFooterButtons = () => {
		const buttons = [];

		// Left side buttons - Primary actions
		// Always show save button, but disable when no changes
		buttons.push({
			label: "Save",
			onClick: handleSave,
			intent: "primary" as const,
			disabled: !isDirty,
			icon: <Check className="h-4 w-4" />,
		});

		if (isEditing) {
			buttons.push({
				label: "Cancel",
				onClick: () => {
					setIsEditing(false);
					setForm({
						industry: client?.industry || "",
						companyDescription: client?.companyDescription || "",
						status: client?.status || "lead",
						category: client?.category || "",
						clientSize: client?.clientSize || "",
						clientType: client?.clientType || "",
						emailOptIn: client?.emailOptIn || false,
						smsOptIn: client?.smsOptIn || false,
						priorityLevel: client?.priorityLevel || "",
						projectDimensions: client?.projectDimensions || "",
						communicationPreference: client?.communicationPreference || "",
						tags: (client?.tags || []).join(", "),
						notes: client?.notes || "",
					});
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

		return buttons;
	};

	// Loading state
	if (
		client === undefined ||
		clientContacts === undefined ||
		clientProperties === undefined ||
		primaryContact === undefined ||
		quotes === undefined ||
		projects === undefined ||
		invoices === undefined ||
		clientTasks === undefined
	) {
		return (
			<div className="relative px-6 pt-8 pb-20">
				<div className="mx-auto">
					<div className="space-y-6">
						<Skeleton className="h-12 w-64" />
						<Skeleton className="h-32 w-full" />
						<Skeleton className="h-64 w-full" />
						<Skeleton className="h-64 w-full" />
					</div>
				</div>
			</div>
		);
	}

	// Error state
	if (!client) {
		return (
			<div className="relative px-6 pt-8 pb-20">
				<div className="mx-auto">
					<div className="flex flex-col items-center justify-center py-12 text-center">
						<div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-4">
							<ExclamationTriangleIcon className="h-8 w-8 text-red-600 dark:text-red-400" />
						</div>
						<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
							Client not found
						</h3>
						<p className="text-gray-600 dark:text-gray-400">
							The client you&apos;re looking for doesn&apos;t exist or you
							don&apos;t have permission to view it.
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="relative min-h-screen px-6 pt-8 pb-20">
				<div className="mx-auto">
					{/* Client Header */}
					<div className="mb-8">
						<div className="flex items-start justify-between gap-6 mb-4">
							<div className="flex items-start gap-6">
								<div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex-shrink-0">
									<BuildingOffice2Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
								</div>
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-3 flex-wrap">
										<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
											{client.companyName}
										</h1>
										{isEditing ? (
											<StyledSelect
												value={form.status}
												onValueChange={(value) =>
													setForm((prev) => ({
														...prev,
														status: value as typeof form.status,
													}))
												}
											>
												<StyledSelectTrigger className="w-auto">
													<SelectValue />
												</StyledSelectTrigger>
												<StyledSelectContent>
													{STATUS_OPTIONS.map((status) => (
														<SelectItem key={status} value={status}>
															{formatStatus(status)}
														</SelectItem>
													))}
												</StyledSelectContent>
											</StyledSelect>
										) : (
											<Badge
												variant="secondary"
												className={`${
													client.status === "active"
														? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
														: client.status === "lead" ||
															  client.status === "prospect"
															? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
															: "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300"
												}`}
											>
												{formatStatus(client.status)}
											</Badge>
										)}
									</div>
								</div>
							</div>

							{/* Compact Indicators with Popovers - Aligned Right */}
							<div className="flex items-center gap-3 flex-wrap flex-shrink-0">
								{/* Projects Popover */}
								<Popover>
									<PopoverTrigger asChild>
										<button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-200/60 dark:border-white/10 hover:border-primary/30 dark:hover:border-primary/30 hover:bg-gray-50 dark:hover:bg-white/5 transition-all cursor-pointer group">
											<svg
												className="w-4 h-4 text-purple-600 dark:text-purple-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
												/>
											</svg>
											<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
												{projects?.length || 0}
											</span>
											<span className="text-xs text-gray-500 dark:text-gray-400">
												Projects
											</span>
										</button>
									</PopoverTrigger>
									<PopoverContent
										className="w-96 p-0 bg-white dark:bg-gray-900"
										align="end"
										side="bottom"
									>
										<div className="p-4 border-b border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900">
											<div className="flex items-center justify-between">
												<h3 className="font-semibold text-gray-900 dark:text-white">
													Client Projects
												</h3>
												<button
													onClick={() =>
														router.push(`/projects/new?clientId=${clientId}`)
													}
													className="group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-all duration-200 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/15 ring-1 ring-primary/30 hover:ring-primary/40 shadow-sm hover:shadow-md backdrop-blur-sm"
												>
													<Plus className="h-4 w-4" />
													New Project
													<span
														aria-hidden="true"
														className="group-hover:translate-x-1 transition-transform duration-200"
													>
														→
													</span>
												</button>
											</div>
										</div>
										<div className="max-h-96 overflow-y-auto bg-white dark:bg-gray-900">
											{projects && projects.length > 0 ? (
												<div className="p-2">
													{projects.map((project: Doc<"projects">) => (
														<div
															key={project._id}
															className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
															onClick={() =>
																router.push(`/projects/${project._id}`)
															}
														>
															<div className="flex items-center gap-3 flex-1 min-w-0">
																<div
																	className={`w-2 h-2 rounded-full flex-shrink-0 ${
																		project.status === "completed"
																			? "bg-green-500"
																			: project.status === "in-progress"
																				? "bg-yellow-500"
																				: "bg-blue-500"
																	}`}
																/>
																<div className="flex-1 min-w-0">
																	<p className="font-medium text-sm text-gray-900 dark:text-white truncate">
																		{project.title}
																	</p>
																	{project.description && (
																		<p className="text-xs text-gray-500 dark:text-gray-400 truncate">
																			{project.description}
																		</p>
																	)}
																</div>
															</div>
															<Badge
																className={getStatusColor(project.status)}
																variant="outline"
															>
																{formatStatus(project.status)}
															</Badge>
														</div>
													))}
												</div>
											) : (
												<div className="p-8 text-center">
													<div className="flex justify-center mb-3">
														<FolderOpen className="h-12 w-12 text-gray-400 dark:text-gray-600" />
													</div>
													<p className="text-sm text-gray-500 dark:text-gray-400">
														No projects yet
													</p>
												</div>
											)}
										</div>
									</PopoverContent>
								</Popover>

								{/* Quotes Popover */}
								<Popover>
									<PopoverTrigger asChild>
										<button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-200/60 dark:border-white/10 hover:border-primary/30 dark:hover:border-primary/30 hover:bg-gray-50 dark:hover:bg-white/5 transition-all cursor-pointer group">
											<svg
												className="w-4 h-4 text-green-600 dark:text-green-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
												/>
											</svg>
											<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
												{quotes?.length || 0}
											</span>
											<span className="text-xs text-gray-500 dark:text-gray-400">
												Quotes
											</span>
										</button>
									</PopoverTrigger>
									<PopoverContent
										className="w-96 p-0 bg-white dark:bg-gray-900"
										align="end"
										side="bottom"
									>
										<div className="p-4 border-b border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900">
											<div className="flex items-center justify-between">
												<h3 className="font-semibold text-gray-900 dark:text-white">
													Client Quotes
												</h3>
												<button
													onClick={() =>
														router.push(`/quotes/new?clientId=${clientId}`)
													}
													className="group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-all duration-200 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/15 ring-1 ring-primary/30 hover:ring-primary/40 shadow-sm hover:shadow-md backdrop-blur-sm"
												>
													<Plus className="h-4 w-4" />
													New Quote
													<span
														aria-hidden="true"
														className="group-hover:translate-x-1 transition-transform duration-200"
													>
														→
													</span>
												</button>
											</div>
										</div>
										<div className="max-h-96 overflow-y-auto bg-white dark:bg-gray-900">
											{quotes && quotes.length > 0 ? (
												<div className="p-2">
													{quotes.map((quote: Doc<"quotes">) => (
														<div
															key={quote._id}
															className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
															onClick={() =>
																router.push(`/quotes/${quote._id}`)
															}
														>
															<div className="flex items-center gap-3 flex-1 min-w-0">
																<div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
																<div className="flex-1 min-w-0">
																	<p className="font-medium text-sm text-gray-900 dark:text-white truncate">
																		Quote #{quote.quoteNumber}
																	</p>
																	{quote.title && (
																		<p className="text-xs text-gray-500 dark:text-gray-400 truncate">
																			{quote.title}
																		</p>
																	)}
																</div>
															</div>
															<div className="text-right flex-shrink-0">
																{quote.total && (
																	<p className="font-medium text-sm text-gray-900 dark:text-white">
																		${quote.total.toLocaleString()}
																	</p>
																)}
																<Badge
																	className={getStatusColor(
																		quote.status || "draft"
																	)}
																	variant="outline"
																>
																	{quote.status || "draft"}
																</Badge>
															</div>
														</div>
													))}
												</div>
											) : (
												<div className="p-8 text-center">
													<div className="flex justify-center mb-3">
														<Receipt className="h-12 w-12 text-gray-400 dark:text-gray-600" />
													</div>
													<p className="text-sm text-gray-500 dark:text-gray-400">
														No quotes yet
													</p>
												</div>
											)}
										</div>
									</PopoverContent>
								</Popover>

								{/* Invoices Popover */}
								<Popover>
									<PopoverTrigger asChild>
										<button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-200/60 dark:border-white/10 hover:border-primary/30 dark:hover:border-primary/30 hover:bg-gray-50 dark:hover:bg-white/5 transition-all cursor-pointer group">
											<svg
												className="w-4 h-4 text-orange-600 dark:text-orange-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
												/>
											</svg>
											<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
												{invoices?.length || 0}
											</span>
											<span className="text-xs text-gray-500 dark:text-gray-400">
												Invoices
											</span>
										</button>
									</PopoverTrigger>
									<PopoverContent
										className="w-96 p-0 bg-white dark:bg-gray-900"
										align="end"
										side="bottom"
									>
										<div className="p-4 border-b border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900">
											<div className="flex items-center justify-between">
												<h3 className="font-semibold text-gray-900 dark:text-white">
													Client Invoices
												</h3>
												<button
													onClick={() =>
														toast.info(
															"Create Invoice",
															"Invoice creation functionality coming soon!"
														)
													}
													className="group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-all duration-200 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/15 ring-1 ring-primary/30 hover:ring-primary/40 shadow-sm hover:shadow-md backdrop-blur-sm"
												>
													<Plus className="h-4 w-4" />
													New Invoice
													<span
														aria-hidden="true"
														className="group-hover:translate-x-1 transition-transform duration-200"
													>
														→
													</span>
												</button>
											</div>
										</div>
										<div className="max-h-96 overflow-y-auto bg-white dark:bg-gray-900">
											{invoices && invoices.length > 0 ? (
												<div className="p-2">
													{invoices.map((invoice: Doc<"invoices">) => (
														<div
															key={invoice._id}
															className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
															onClick={() =>
																toast.info(
																	"View Invoice",
																	"Invoice detail page coming soon!"
																)
															}
														>
															<div className="flex items-center gap-3 flex-1 min-w-0">
																<div
																	className={`w-2 h-2 rounded-full flex-shrink-0 ${
																		invoice.status === "paid"
																			? "bg-green-500"
																			: invoice.status === "sent"
																				? "bg-yellow-500"
																				: "bg-red-500"
																	}`}
																/>
																<div className="flex-1 min-w-0">
																	<p className="font-medium text-sm text-gray-900 dark:text-white truncate">
																		Invoice #{invoice.invoiceNumber}
																	</p>
																	<p className="text-xs text-gray-500 dark:text-gray-400">
																		{formatDate(invoice._creationTime)}
																	</p>
																</div>
															</div>
															<div className="text-right flex-shrink-0">
																{invoice.total && (
																	<p className="font-medium text-sm text-gray-900 dark:text-white">
																		${invoice.total.toLocaleString()}
																	</p>
																)}
																<Badge
																	className={getStatusColor(invoice.status)}
																	variant="outline"
																>
																	{invoice.status}
																</Badge>
															</div>
														</div>
													))}
												</div>
											) : (
												<div className="p-8 text-center">
													<div className="flex justify-center mb-3">
														<FileText className="h-12 w-12 text-gray-400 dark:text-gray-600" />
													</div>
													<p className="text-sm text-gray-500 dark:text-gray-400">
														No invoices yet
													</p>
												</div>
											)}
										</div>
									</PopoverContent>
								</Popover>

								{/* Tasks Popover */}
								<Popover>
									<PopoverTrigger asChild>
										<button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-200/60 dark:border-white/10 hover:border-primary/30 dark:hover:border-primary/30 hover:bg-gray-50 dark:hover:bg-white/5 transition-all cursor-pointer group">
											<svg
												className="w-4 h-4 text-blue-600 dark:text-blue-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
												/>
											</svg>
											<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
												{clientTasks?.length || 0}
											</span>
											<span className="text-xs text-gray-500 dark:text-gray-400">
												Tasks
											</span>
										</button>
									</PopoverTrigger>
									<PopoverContent
										className="w-96 p-0 bg-white dark:bg-gray-900"
										align="end"
										side="bottom"
									>
										<div className="p-4 border-b border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900">
											<div className="flex items-center justify-between">
												<h3 className="font-semibold text-gray-900 dark:text-white">
													Client Tasks
												</h3>
												<button
													onClick={() => setIsTaskSheetOpen(true)}
													className="group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-all duration-200 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/15 ring-1 ring-primary/30 hover:ring-primary/40 shadow-sm hover:shadow-md backdrop-blur-sm"
												>
													<Plus className="h-4 w-4" />
													New Task
													<span
														aria-hidden="true"
														className="group-hover:translate-x-1 transition-transform duration-200"
													>
														→
													</span>
												</button>
											</div>
										</div>
										<div className="max-h-96 overflow-y-auto bg-white dark:bg-gray-900">
											{clientTasks && clientTasks.length > 0 ? (
												<div className="p-2">
													{clientTasks.map((task: Doc<"tasks">) => (
														<div
															key={task._id}
															className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors"
														>
															<div className="flex items-center gap-3 flex-1 min-w-0">
																<div
																	className={`w-2 h-2 rounded-full flex-shrink-0 ${
																		task.status === "completed"
																			? "bg-green-500"
																			: task.status === "cancelled"
																				? "bg-red-500"
																				: "bg-yellow-500"
																	}`}
																/>
																<div className="flex-1 min-w-0">
																	<p className="font-medium text-sm text-gray-900 dark:text-white truncate">
																		{task.title}
																	</p>
																	{task.date && (
																		<p className="text-xs text-gray-500 dark:text-gray-400">
																			{formatDate(task.date)}
																		</p>
																	)}
																</div>
															</div>
															<Badge
																className={getStatusColor(task.status)}
																variant="outline"
															>
																{task.status}
															</Badge>
														</div>
													))}
												</div>
											) : (
												<div className="p-8 text-center">
													<div className="flex justify-center mb-3">
														<ClipboardList className="h-12 w-12 text-gray-400 dark:text-gray-600" />
													</div>
													<p className="text-sm text-gray-500 dark:text-gray-400">
														No tasks yet
													</p>
												</div>
											)}
										</div>
									</PopoverContent>
								</Popover>
							</div>
						</div>
					</div>

					{/* Two Column Layout */}
					<div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
						{/* Main Content - Left Column */}
						<div className="xl:col-span-3 space-y-8">
							{/* Client Information Section */}
							<StyledCard>
								<StyledCardHeader>
									<StyledCardTitle className="text-xl">
										Client Information
									</StyledCardTitle>
								</StyledCardHeader>
								<StyledCardContent>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{/* Industry */}
										{(client.industry || isEditing) && (
											<div>
												<Label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 block">
													Industry
												</Label>
												{isEditing ? (
													<StyledInput
														value={form.industry}
														onChange={(e) =>
															setForm((prev) => ({
																...prev,
																industry: e.target.value,
															}))
														}
														placeholder="e.g., Technology, Healthcare"
													/>
												) : client.industry ? (
													<p className="text-sm text-gray-900 dark:text-white">
														{client.industry}
													</p>
												) : null}
											</div>
										)}

										{/* Lead Source */}
										<div>
											<Label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 block">
												Lead Source
											</Label>
											<p className="text-sm text-gray-900 dark:text-white">
												{formatLeadSource(client.leadSource)}
											</p>
										</div>

										{/* Category */}
										{client.category && !isEditing && (
											<div>
												<Label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 block">
													Category
												</Label>
												<p className="text-sm text-gray-900 dark:text-white">
													{formatCategory(client.category)}
												</p>
											</div>
										)}

										{/* Client Size */}
										{client.clientSize && !isEditing && (
											<div>
												<Label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 block">
													Size
												</Label>
												<p className="text-sm text-gray-900 dark:text-white">
													{formatCategory(client.clientSize)}
												</p>
											</div>
										)}

										{/* Priority Level */}
										{client.priorityLevel && !isEditing && (
											<div>
												<Label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 block">
													Priority
												</Label>
												<p className="text-sm text-gray-900 dark:text-white">
													{formatCategory(client.priorityLevel)}
												</p>
											</div>
										)}

										{/* Project Dimensions */}
										{client.projectDimensions && !isEditing && (
											<div>
												<Label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 block">
													Project Dimensions
												</Label>
												<p className="text-sm text-gray-900 dark:text-white">
													{client.projectDimensions}
												</p>
											</div>
										)}
									</div>

									{/* Company Description - Full Width */}
									{(client.companyDescription || isEditing) && (
										<div className="mt-6">
											<Label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 block">
												Company Description
											</Label>
											{isEditing ? (
												<Textarea
													value={form.companyDescription}
													onChange={(e) =>
														setForm((prev) => ({
															...prev,
															companyDescription: e.target.value,
														}))
													}
													placeholder="Brief description of the company and what they do..."
													className="w-full"
													rows={3}
												/>
											) : client.companyDescription ? (
												<p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
													{client.companyDescription}
												</p>
											) : null}
										</div>
									)}
								</StyledCardContent>
							</StyledCard>

							{/* Properties Section */}
							<PropertyTable
								clientId={clientId as Id<"clients">}
								properties={clientProperties || []}
								onChange={() => {
									// Data will automatically refresh via Convex reactivity
								}}
							/>

							{/* Contacts Section */}
							<ContactTable
								clientId={clientId as Id<"clients">}
								contacts={clientContacts || []}
								onChange={() => {
									// Data will automatically refresh via Convex reactivity
								}}
							/>

							{/* Overview Section with Tabs */}
							<StyledCard>
								<StyledCardHeader>
									<StyledCardTitle className="text-xl">
										Overview
									</StyledCardTitle>
								</StyledCardHeader>
								<StyledCardContent>
									<Tabs defaultValue="projects" className="w-full">
										<TabsList className="grid w-full grid-cols-4">
											<TabsTrigger value="projects">
												Projects ({projects?.length || 0})
											</TabsTrigger>
											<TabsTrigger value="quotes">
												Quotes ({quotes?.length || 0})
											</TabsTrigger>
											<TabsTrigger value="invoices">
												Invoices ({invoices?.length || 0})
											</TabsTrigger>
											<TabsTrigger value="tasks">
												Tasks ({clientTasks?.length || 0})
											</TabsTrigger>
										</TabsList>
										<TabsContent value="projects" className="mt-6">
											{projects && projects.length > 0 ? (
												<div className="space-y-4">
													{projects.map((project: Doc<"projects">) => (
														<div
															key={project._id}
															className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
														>
															<div className="flex items-start justify-between">
																<div>
																	<h4 className="font-medium text-gray-900 dark:text-white">
																		{project.title}
																	</h4>
																	{project.description && (
																		<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
																			{project.description}
																		</p>
																	)}
																</div>
																<Badge
																	variant="outline"
																	className={`${project.status === "completed" ? "bg-green-50 text-green-700 border-green-200" : project.status === "in-progress" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-gray-50 text-gray-700 border-gray-200"}`}
																>
																	{formatStatus(project.status)}
																</Badge>
															</div>
														</div>
													))}
												</div>
											) : (
												<Empty>
													<EmptyHeader>
														<EmptyMedia variant="icon">
															<FolderOpen />
														</EmptyMedia>
														<EmptyTitle>No projects</EmptyTitle>
														<EmptyDescription>
															No projects have been created for this client yet.
														</EmptyDescription>
													</EmptyHeader>
												</Empty>
											)}
										</TabsContent>
										<TabsContent value="quotes" className="mt-6">
											{quotes && quotes.length > 0 ? (
												<div className="space-y-4">
													{quotes.map((quote: Doc<"quotes">) => (
														<div
															key={quote._id}
															className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
														>
															<div className="flex items-start justify-between">
																<div>
																	<h4 className="font-medium text-gray-900 dark:text-white">
																		Quote #{quote.quoteNumber}
																	</h4>
																	{quote.title && (
																		<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
																			{quote.title}
																		</p>
																	)}
																</div>
																<div className="text-right">
																	<Badge
																		variant="outline"
																		className={`${
																			quote.status === "approved"
																				? "bg-green-50 text-green-700 border-green-200"
																				: quote.status === "sent"
																					? "bg-yellow-50 text-yellow-700 border-yellow-200"
																					: "bg-gray-50 text-gray-700 border-gray-200"
																		}`}
																	>
																		{formatStatus(quote.status)}
																	</Badge>
																	<p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
																		${quote.total.toLocaleString()}
																	</p>
																</div>
															</div>
														</div>
													))}
												</div>
											) : (
												<Empty>
													<EmptyHeader>
														<EmptyMedia variant="icon">
															<Receipt />
														</EmptyMedia>
														<EmptyTitle>No quotes</EmptyTitle>
														<EmptyDescription>
															No quotes have been created for this client yet.
														</EmptyDescription>
													</EmptyHeader>
												</Empty>
											)}
										</TabsContent>
										<TabsContent value="invoices" className="mt-6">
											{invoices && invoices.length > 0 ? (
												<div className="space-y-4">
													{invoices.map((invoice: Doc<"invoices">) => (
														<div
															key={invoice._id}
															className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
														>
															<div className="flex items-start justify-between">
																<div>
																	<h4 className="font-medium text-gray-900 dark:text-white">
																		Invoice #{invoice.invoiceNumber}
																	</h4>
																</div>
																<div className="text-right">
																	<Badge
																		variant="outline"
																		className={`${invoice.status === "paid" ? "bg-green-50 text-green-700 border-green-200" : invoice.status === "sent" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : "bg-red-50 text-red-700 border-red-200"}`}
																	>
																		{formatStatus(invoice.status)}
																	</Badge>
																	<p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
																		${invoice.total.toLocaleString()}
																	</p>
																</div>
															</div>
														</div>
													))}
												</div>
											) : (
												<Empty>
													<EmptyHeader>
														<EmptyMedia variant="icon">
															<FileText />
														</EmptyMedia>
														<EmptyTitle>No invoices</EmptyTitle>
														<EmptyDescription>
															This client hasn&apos;t been billed yet.
														</EmptyDescription>
													</EmptyHeader>
												</Empty>
											)}
										</TabsContent>
										<TabsContent value="tasks" className="mt-6">
											{clientTasks && clientTasks.length > 0 ? (
												<div className="space-y-4">
													{clientTasks.map((task: Doc<"tasks">) => (
														<div
															key={task._id}
															className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
														>
															<div className="flex items-start justify-between">
																<div className="flex-1">
																	<h4 className="font-medium text-gray-900 dark:text-white">
																		{task.title}
																	</h4>
																	{task.description && (
																		<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
																			{task.description}
																		</p>
																	)}
																	<p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
																		Date:{" "}
																		{new Date(task.date).toLocaleDateString()}
																		{task.startTime && ` ${task.startTime}`}
																	</p>
																</div>
																<Badge
																	variant="outline"
																	className={`${
																		task.status === "completed"
																			? "bg-green-50 text-green-700 border-green-200"
																			: task.status === "in-progress"
																				? "bg-blue-50 text-blue-700 border-blue-200"
																				: "bg-gray-50 text-gray-700 border-gray-200"
																	}`}
																>
																	{formatStatus(task.status)}
																</Badge>
															</div>
														</div>
													))}
												</div>
											) : (
												<Empty>
													<EmptyHeader>
														<EmptyMedia variant="icon">
															<ClipboardList />
														</EmptyMedia>
														<EmptyTitle>No tasks</EmptyTitle>
														<EmptyDescription>
															No tasks have been scheduled for this client yet.
														</EmptyDescription>
													</EmptyHeader>
												</Empty>
											)}
										</TabsContent>
									</Tabs>
								</StyledCardContent>
							</StyledCard>
							{/* Client Notes Card (moved under overview) */}
							<StyledCard>
								<StyledCardHeader>
									<StyledCardTitle className="text-lg">
										Client notes
									</StyledCardTitle>
									<p className="text-sm text-gray-600 dark:text-gray-400">
										Internal notes visible only to your team
									</p>
								</StyledCardHeader>
								<StyledCardContent>
									{isEditing ? (
										<textarea
											className="w-full min-h-[100px] px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-md text-gray-900 dark:text-white"
											value={form.notes}
											onChange={(e) =>
												setForm((f) => ({ ...f, notes: e.target.value }))
											}
										/>
									) : client.notes ? (
										<div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
											<p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
												{client.notes}
											</p>
										</div>
									) : (
										<div className="text-center py-6">
											<p className="text-sm text-gray-600 dark:text-gray-400 italic">
												No notes added for this client yet
											</p>
										</div>
									)}
								</StyledCardContent>
							</StyledCard>
						</div>

						{/* Contact Info Sidebar - Right Column */}
						<div className="xl:col-span-1">
							<div className="sticky top-24 space-y-6">
								{/* Contact Info Card */}
								<StyledCard>
									<StyledCardHeader>
										<StyledCardTitle className="text-lg">
											Contact Info
										</StyledCardTitle>
									</StyledCardHeader>
									<StyledCardContent className="space-y-4">
										{primaryContact ? (
											<>
												<div className="flex justify-between">
													<span className="text-sm text-gray-600 dark:text-gray-400">
														Primary contact
													</span>
													<div className="flex items-center gap-2">
														<span className="text-sm text-gray-900 dark:text-white">
															{primaryContact.firstName}{" "}
															{primaryContact.lastName}
														</span>
														<StarSolidIcon className="h-4 w-4 text-yellow-400" />
													</div>
												</div>
												{primaryContact.phone && (
													<div className="flex justify-between">
														<span className="text-sm text-gray-600 dark:text-gray-400">
															Phone
														</span>
														<span className="text-sm text-gray-900 dark:text-white">
															{formatPhoneNumber(primaryContact.phone)}
														</span>
													</div>
												)}
												{primaryContact.email && (
													<div className="flex justify-between">
														<span className="text-sm text-gray-600 dark:text-gray-400">
															Email
														</span>
														<span className="text-sm text-gray-900 dark:text-white">
															{primaryContact.email}
														</span>
													</div>
												)}
												{primaryContact.jobTitle && (
													<div className="flex justify-between">
														<span className="text-sm text-gray-600 dark:text-gray-400">
															Job Title
														</span>
														<span className="text-sm text-gray-900 dark:text-white">
															{primaryContact.jobTitle}
														</span>
													</div>
												)}
											</>
										) : (
											<div className="text-center py-4">
												<p className="text-sm text-gray-600 dark:text-gray-400">
													No primary contact set
												</p>
											</div>
										)}
										{/* Communication Preference */}
										<div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-white/10">
											<span className="text-sm text-gray-600 dark:text-gray-400">
												Communication Preference
											</span>
											{isEditing ? (
												<div className="flex-1 max-w-[200px] ml-4">
													<StyledSelect
														value={form.communicationPreference}
														onValueChange={(value) =>
															setForm((prev) => ({
																...prev,
																communicationPreference: value as
																	| "email"
																	| "phone"
																	| "both"
																	| "",
															}))
														}
													>
														<StyledSelectTrigger className="h-8">
															<SelectValue placeholder="Select" />
														</StyledSelectTrigger>
														<StyledSelectContent>
															<SelectItem value="email">Email only</SelectItem>
															<SelectItem value="phone">
																Phone calls for urgent matters
															</SelectItem>
															<SelectItem value="both">
																Both email and phone
															</SelectItem>
														</StyledSelectContent>
													</StyledSelect>
												</div>
											) : (
												<span className="text-sm text-gray-900 dark:text-white">
													{client.communicationPreference
														? formatCommunicationPreference(
																client.communicationPreference
															)
														: "Not specified"}
												</span>
											)}
										</div>
									</StyledCardContent>
								</StyledCard>

								{/* Tags Card */}
								<StyledCard>
									<StyledCardHeader className="flex flex-row items-center justify-between">
										<StyledCardTitle className="text-lg">Tags</StyledCardTitle>
										<Button
											intent="outline"
											size="sm"
											onClick={() => {
												toast.info(
													"Add Tag",
													"Tag management functionality coming soon!"
												);
											}}
										>
											<PlusIcon className="h-4 w-4 mr-2" />
											New Tag
										</Button>
									</StyledCardHeader>
									<StyledCardContent>
										{isEditing ? (
											<StyledInput
												value={form.tags}
												onChange={(e) =>
													setForm((f) => ({ ...f, tags: e.target.value }))
												}
												placeholder="tag1, tag2"
											/>
										) : client.tags && client.tags.length > 0 ? (
											<div className="flex flex-wrap gap-2">
												{client.tags.map((tag, index) => (
													<Badge
														key={index}
														variant="secondary"
														className="text-xs"
													>
														{tag}
													</Badge>
												))}
											</div>
										) : (
											<p className="text-sm text-gray-600 dark:text-gray-400 italic">
												This client has no tags
											</p>
										)}
									</StyledCardContent>
								</StyledCard>

								{/* Last Client Communication */}
								<StyledCard>
									<StyledCardHeader>
										<StyledCardTitle className="text-lg">
											Last client communication
										</StyledCardTitle>
									</StyledCardHeader>
									<StyledCardContent>
										<p className="text-sm text-gray-600 dark:text-gray-400 italic">
											You haven&apos;t sent any client communications yet
										</p>
									</StyledCardContent>
								</StyledCard>

								{/* Services Needed */}
								{client.servicesNeeded && client.servicesNeeded.length > 0 && (
									<StyledCard>
										<StyledCardHeader>
											<StyledCardTitle className="text-lg">
												Services needed
											</StyledCardTitle>
										</StyledCardHeader>
										<StyledCardContent>
											<div className="space-y-2">
												{client.servicesNeeded.map((service, index) => (
													<div key={index} className="flex items-center gap-2">
														<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
														<span className="text-sm text-gray-900 dark:text-white">
															{service}
														</span>
													</div>
												))}
											</div>
										</StyledCardContent>
									</StyledCard>
								)}

								{/* Billing History */}
								<StyledCard>
									<StyledCardHeader className="flex flex-row items-center justify-between">
										<StyledCardTitle className="text-lg">
											Billing summary
										</StyledCardTitle>
										<Button
											intent="outline"
											size="sm"
											className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
											onClick={() => {
												toast.info(
													"Create Invoice",
													"Invoice creation functionality coming soon!"
												);
											}}
										>
											New Invoice
										</Button>
									</StyledCardHeader>
									<StyledCardContent className="space-y-4">
										{invoices && invoices.length > 0 ? (
											<>
												<div className="space-y-3">
													<div className="flex justify-between">
														<span className="text-sm text-gray-600 dark:text-gray-400">
															Total invoices
														</span>
														<span className="text-sm font-medium text-gray-900 dark:text-white">
															{invoices.length}
														</span>
													</div>
													<div className="flex justify-between">
														<span className="text-sm text-gray-600 dark:text-gray-400">
															Total billed
														</span>
														<span className="text-sm font-medium text-gray-900 dark:text-white">
															$
															{invoices
																.reduce(
																	(sum: number, inv: Doc<"invoices">) =>
																		sum + inv.total,
																	0
																)
																.toLocaleString()}
														</span>
													</div>
													<div className="flex justify-between">
														<span className="text-sm text-gray-600 dark:text-gray-400">
															Outstanding
														</span>
														<span className="text-sm font-medium text-gray-900 dark:text-white">
															$
															{invoices
																.filter(
																	(inv: Doc<"invoices">) =>
																		inv.status !== "paid"
																)
																.reduce(
																	(sum: number, inv: Doc<"invoices">) =>
																		sum + inv.total,
																	0
																)
																.toLocaleString()}
														</span>
													</div>
												</div>
											</>
										) : (
											<div className="flex flex-col items-center text-center py-6">
												<div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-3">
													<EnvelopeIcon className="h-6 w-6 text-gray-400" />
												</div>
												<h4 className="font-medium text-gray-900 dark:text-white mb-1">
													No billing history
												</h4>
												<p className="text-sm text-gray-600 dark:text-gray-400">
													This client hasn&apos;t been billed yet
												</p>
											</div>
										)}
									</StyledCardContent>
								</StyledCard>
							</div>
						</div>
					</div>
				</div>
			</div>
			<StickyFormFooter
				buttons={getFooterButtons()}
				hasUnsavedChanges={isDirty}
				isEditing={isEditing}
			/>
			<TaskSheet
				isOpen={isTaskSheetOpen}
				onOpenChange={setIsTaskSheetOpen}
				initialValues={{
					clientId: clientId as Id<"clients">,
				}}
			/>
		</>
	);
}
