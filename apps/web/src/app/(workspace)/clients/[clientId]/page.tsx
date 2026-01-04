"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@onetool/backend/convex/_generated/api";
import { Id, Doc } from "@onetool/backend/convex/_generated/dataModel";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
	ExclamationTriangleIcon,
	EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { Check } from "lucide-react";
import { StickyFormFooter } from "@/components/shared/sticky-form-footer";
import { PropertyTable } from "@/app/(workspace)/clients/components/property-table";
import { ContactTable } from "@/app/(workspace)/clients/components/contact-table";
import { TaskSheet } from "@/components/shared/task-sheet";
import { MentionSection } from "@/components/shared/mention-section";
import { EmailThreadSheet } from "@/app/(workspace)/clients/components/email-thread-sheet";
import { ClientHeader } from "@/app/(workspace)/clients/components/client-header";
import { ClientDetailsCard } from "@/app/(workspace)/clients/components/client-details-card";
import { ClientSidebar } from "@/app/(workspace)/clients/components/client-sidebar";
import { ClientNotesCard } from "@/app/(workspace)/clients/components/client-notes-card";
import { ClientTagsServicesCard } from "@/app/(workspace)/clients/components/client-tags-services-card";
import {
	StyledTabs,
	StyledTabsList,
	StyledTabsTrigger,
	StyledTabsContent,
} from "@/components/ui/styled";
import { useEffect, useMemo, useState } from "react";

export default function ClientDetailPage() {
	const params = useParams();
	const router = useRouter();
	const clientId = params.clientId as string;
	const toast = useToast();
	const updateClient = useMutation(api.clients.update);
	const [isEditing, setIsEditing] = useState(false);
	const [isTaskSheetOpen, setIsTaskSheetOpen] = useState(false);
	const [isEmailSheetOpen, setIsEmailSheetOpen] = useState(false);
	const [emailSheetMode, setEmailSheetMode] = useState<"new" | "reply">("new");
	const [activeTab, setActiveTab] = useState("details");
	const [form, setForm] = useState({
		companyDescription: "",
		status: "lead",
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

	// Fetch email messages for this client
	const clientEmails = useQuery(api.emailMessages.listByClient, {
		clientId: clientId as Id<"clients">,
	});

	useEffect(() => {
		if (client) {
			setForm({
				companyDescription: client.companyDescription || "",
				status: client.status,
				communicationPreference: client.communicationPreference || "",
				tags: (client.tags || []).join(", "),
				notes: client.notes || "",
			});
		}
	}, [client]);

	const isDirty = useMemo(() => {
		if (!client) return false;
		return (
			(form.companyDescription || "") !== (client.companyDescription || "") ||
			form.status !== client.status ||
			(form.communicationPreference || "") !==
				(client.communicationPreference || "") ||
			(form.tags || "") !== (client.tags || []).join(", ") ||
			(form.notes || "") !== (client.notes || "")
		);
	}, [form, client]);

	const handleSave = async () => {
		if (!client) return;
		const updates: Record<string, unknown> = {};
		if ((form.companyDescription || "") !== (client.companyDescription || ""))
			updates.companyDescription = form.companyDescription || undefined;
		if (form.status !== client.status)
			updates.status = form.status as typeof client.status;
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
						companyDescription: client?.companyDescription || "",
						status: client?.status || "lead",
						communicationPreference: client?.communicationPreference || "",
						tags: (client?.tags || []).join(", "),
						notes: client?.notes || "",
					});
				},
				intent: "outline" as const,
			});
		}

		// Right side button - Email action
		if (primaryContact?.email && !isEditing) {
			buttons.push({
				label: "Send Email",
				onClick: () => {
					setEmailSheetMode("new");
					setIsEmailSheetOpen(true);
				},
				intent: "secondary" as const,
				icon: <EnvelopeIcon className="h-4 w-4" />,
				position: "right" as const,
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
		clientTasks === undefined ||
		clientEmails === undefined
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
			<div className="relative min-h-screen p-6 pb-20">
				<div>
					{/* Client Header - Salesforce inspired */}
					<ClientHeader
						client={client}
						clientId={clientId}
						isEditing={isEditing}
						onEditClick={() => setIsEditing(true)}
						statusValue={form.status}
						onStatusChange={(value) =>
							setForm((prev) => ({ ...prev, status: value }))
						}
						emailCount={clientEmails?.length || 0}
						projects={projects}
						quotes={quotes}
						invoices={invoices}
						tasks={clientTasks}
						onTaskSheetOpen={() => setIsTaskSheetOpen(true)}
					/>

					{/* Tabs spanning full width */}
					<StyledTabs value={activeTab} onValueChange={setActiveTab}>
						<StyledTabsList>
							<StyledTabsTrigger value="details">
								Client Details
							</StyledTabsTrigger>
							<StyledTabsTrigger value="properties">
								Properties & Contacts
							</StyledTabsTrigger>
							<StyledTabsTrigger value="communication">
								Internal Team Communication
							</StyledTabsTrigger>
						</StyledTabsList>

						{/* Two Column Layout - Tab Content & Sidebar */}
						<div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
							{/* Main Content - Left Column */}
							<div className="xl:col-span-3">
								{/* Client Details Tab */}
								<StyledTabsContent value="details" className="space-y-6 mt-0">
									{/* About / Client Details */}
									<ClientDetailsCard
										client={client}
										isEditing={isEditing}
										form={{
											companyDescription: form.companyDescription,
										}}
										onFormChange={(field, value) =>
											setForm((prev) => ({ ...prev, [field]: value }))
										}
									/>

									{/* Tags and Services Needed */}
									<ClientTagsServicesCard
										client={client}
										isEditing={isEditing}
										tags={form.tags}
										onTagsChange={(value) =>
											setForm((prev) => ({ ...prev, tags: value }))
										}
									/>

									{/* Client Notes */}
									<ClientNotesCard
										isEditing={isEditing}
										notes={form.notes}
										onNotesChange={(value) =>
											setForm((prev) => ({ ...prev, notes: value }))
										}
									/>
								</StyledTabsContent>

								{/* Properties & Contacts Tab */}
								<StyledTabsContent
									value="properties"
									className="space-y-6 mt-0"
								>
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
								</StyledTabsContent>

								{/* Internal Team Communication Tab */}
								<StyledTabsContent value="communication" className="mt-0">
									<MentionSection
										entityType="client"
										entityId={clientId}
										entityName={client.companyName}
									/>
								</StyledTabsContent>
							</div>

							{/* Sidebar - Right Column */}
							<div className="xl:col-span-1">
								<div className="sticky top-24">
									<ClientSidebar
										client={client}
										primaryContact={primaryContact}
										isEditing={isEditing}
										form={{
											communicationPreference: form.communicationPreference,
										}}
										onFormChange={(field, value) =>
											setForm((prev) => ({ ...prev, [field]: value }))
										}
										clientEmails={clientEmails}
										invoices={invoices}
									/>
								</div>
							</div>
						</div>
					</StyledTabs>
				</div>
			</div>

			{/* Email Thread Sheet - for both new emails and replies */}
			<EmailThreadSheet
				isOpen={isEmailSheetOpen}
				onOpenChange={setIsEmailSheetOpen}
				clientId={clientId as Id<"clients">}
				mode={emailSheetMode}
				onComplete={() => {
					setIsEmailSheetOpen(false);
				}}
			/>

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
