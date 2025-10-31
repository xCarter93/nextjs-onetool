"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useAction, useConvex } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
	FileText,
	Mail,
	MoreHorizontal,
	Download,
	Eye,
	DollarSign,
	Building2,
	Settings,
	Edit,
	FolderOpen,
	Check,
	History,
	Clock,
} from "lucide-react";
import { StickyFormFooter } from "@/components/shared/sticky-form-footer";
import { pdf } from "@react-pdf/renderer";
import QuotePDF from "@/app/(workspace)/quotes/components/QuotePDF";
import type { Id } from "../../../../../convex/_generated/dataModel";
import type { Id as StorageId } from "../../../../../convex/_generated/dataModel";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEffect, useState, useMemo } from "react";
import { DocumentSelectionModal } from "@/app/(workspace)/quotes/components/document-selection-modal";
import { SendEmailPopover } from "@/app/(workspace)/quotes/components/send-email-popover";
import { SignatureProgressBar } from "@/app/(workspace)/quotes/components/signature-progress-bar";
import Accordion from "@/components/ui/accordion";

type QuoteStatus = "draft" | "sent" | "approved" | "declined" | "expired";

const formatCurrency = (amount: number) => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
};

const getQuoteStatus = (
	status: QuoteStatus,
	validUntilDate?: number
): QuoteStatus => {
	if (status === "expired") return "expired";
	if (validUntilDate && validUntilDate < Date.now()) return "expired";
	return status;
};

const statusVariant = (status: QuoteStatus) => {
	switch (status) {
		case "approved":
			return "default" as const;
		case "sent":
			return "secondary" as const;
		case "declined":
		case "expired":
			return "destructive" as const;
		case "draft":
		default:
			return "outline" as const;
	}
};

const formatStatus = (status: QuoteStatus) => {
	switch (status) {
		case "draft":
			return "Draft";
		case "sent":
			return "Sent";
		case "approved":
			return "Approved";
		case "declined":
			return "Declined";
		case "expired":
			return "Expired";
		default:
			return status;
	}
};

export default function QuoteDetailPage() {
	const router = useRouter();
	const params = useParams();
	const toast = useToast();
	const convex = useConvex();
	const quoteId = params.quoteId as Id<"quotes">;

	// Fetch quote data from Convex
	const quote = useQuery(api.quotes.get, { id: quoteId });
	const client = useQuery(
		api.clients.get,
		quote?.clientId ? { id: quote.clientId } : "skip"
	);
	const project = useQuery(
		api.projects.get,
		quote?.projectId ? { id: quote.projectId } : "skip"
	);
	const lineItems = useQuery(api.quoteLineItems.listByQuote, { quoteId });
	const organization = useQuery(api.organizations.get, {});
	const latestDocument = useQuery(
		api.documents.getLatest,
		quote ? { documentType: "quote", documentId: quote._id } : "skip"
	);
	const allDocumentVersions = useQuery(
		api.documents.getAllVersions,
		quote ? { documentType: "quote", documentId: quote._id } : "skip"
	);
	const primaryContact = useQuery(
		api.clientContacts.getPrimaryContact,
		quote?.clientId ? { clientId: quote.clientId } : "skip"
	);
	const allContacts = useQuery(
		api.clientContacts.listByClient,
		quote?.clientId ? { clientId: quote.clientId } : "skip"
	);
	const primaryProperty = useQuery(
		api.clientProperties.getPrimaryProperty,
		quote?.clientId ? { clientId: quote.clientId } : "skip"
	);
	const documentsWithSignatures = useQuery(
		api.documents.getAllDocumentsWithSignatures,
		quote ? { documentType: "quote", documentId: quote._id } : "skip"
	);

	// Mutations
	const updateQuote = useMutation(api.quotes.update);
	const generateUploadUrl = useMutation(api.documents.generateUploadUrl);
	const createDocument = useMutation(api.documents.create);
	const createInvoiceFromQuote = useMutation(api.invoices.createFromQuote);

	// Actions
	const sendForSignature = useAction(
		api.boldsignActions.sendDocumentForSignature
	);

	// Inline edit state
	const [isEditing, setIsEditing] = useState(false);
	const [form, setForm] = useState({
		terms: "",
		clientMessage: "",
		validUntil: undefined as number | undefined,
	});

	// Version viewing state
	const [selectedVersionId, setSelectedVersionId] =
		useState<Id<"documents"> | null>(null);
	const [showVersionHistory, setShowVersionHistory] = useState(false);

	// Document selection modal state
	const [showDocumentModal, setShowDocumentModal] = useState(false);

	// Signature popover state
	const [sendEmailPopoverOpen, setSendEmailPopoverOpen] = useState(false);

	// Get the currently selected version's URL (or latest if none selected)
	const selectedDocument = useMemo(() => {
		if (selectedVersionId && allDocumentVersions) {
			return allDocumentVersions.find((v) => v._id === selectedVersionId);
		}
		return latestDocument;
	}, [selectedVersionId, allDocumentVersions, latestDocument]);

	const selectedDocumentUrl = useQuery(
		api.documents.getDocumentUrl,
		selectedDocument ? { id: selectedDocument._id } : "skip"
	);

	useEffect(() => {
		if (quote) {
			setForm({
				terms: quote.terms || "",
				clientMessage: quote.clientMessage || "",
				validUntil: quote.validUntil,
			});
		}
	}, [quote]);

	const isDirty = useMemo(() => {
		if (!quote) return false;
		return (
			(form.terms || "") !== (quote.terms || "") ||
			(form.clientMessage || "") !== (quote.clientMessage || "") ||
			(form.validUntil || undefined) !== (quote.validUntil || undefined)
		);
	}, [form, quote]);

	const resetForm = () => {
		if (!quote) return;
		setForm({
			terms: quote.terms || "",
			clientMessage: quote.clientMessage || "",
			validUntil: quote.validUntil,
		});
	};

	const handleSave = async () => {
		if (!quote) return;
		const updates: Partial<{
			terms?: string;
			clientMessage?: string;
			validUntil?: number;
		}> = {};
		if ((form.terms || "") !== (quote.terms || ""))
			updates.terms = form.terms || undefined;
		if ((form.clientMessage || "") !== (quote.clientMessage || ""))
			updates.clientMessage = form.clientMessage || undefined;
		if ((form.validUntil || undefined) !== (quote.validUntil || undefined))
			updates.validUntil = form.validUntil;

		if (Object.keys(updates).length === 0) {
			setIsEditing(false);
			return;
		}

		try {
			await updateQuote({ id: quoteId, ...updates });
			toast.success("Quote Updated", "Your changes have been saved.");
			setIsEditing(false);
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Failed to save changes";
			toast.error("Error", message);
		}
	};

	const handleStatusChange = async (status: QuoteStatus) => {
		try {
			await updateQuote({ id: quoteId, status });
			toast.success(
				"Quote Updated",
				`Status changed to ${formatStatus(status)}`
			);
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Failed to update status";
			toast.error("Error", message);
		}
	};

	const getStatusActions = () => {
		if (!quote) return null;
		switch (quote.status) {
			case "draft":
				return (
					<div className="flex items-center gap-2">
						<Button size="sm" onClick={() => handleStatusChange("sent")}>
							Send Quote
						</Button>
						<Button
							size="sm"
							className="bg-green-600 hover:bg-green-700"
							onClick={() => handleStatusChange("approved")}
						>
							<Check className="h-4 w-4 mr-1" /> Mark Approved
						</Button>
					</div>
				);
			case "sent":
				return (
					<div className="flex items-center gap-2">
						<Button
							size="sm"
							className="bg-green-600 hover:bg-green-700"
							onClick={() => handleStatusChange("approved")}
						>
							<Check className="h-4 w-4 mr-1" /> Approve
						</Button>
						<Button
							size="sm"
							intent="outline"
							onClick={() => handleStatusChange("declined")}
						>
							Decline
						</Button>
						<Button
							size="sm"
							intent="outline"
							onClick={() => handleStatusChange("draft")}
						>
							Revert to Draft
						</Button>
					</div>
				);
			case "approved":
			case "declined":
				return (
					<Button
						size="sm"
						intent="outline"
						onClick={() => handleStatusChange("sent")}
					>
						Reopen (Sent)
					</Button>
				);
			case "expired":
				return (
					<Button
						size="sm"
						intent="outline"
						onClick={() => handleStatusChange("draft")}
					>
						Reopen (Draft)
					</Button>
				);
			default:
				return null;
		}
	};

	// Loading state
	if (quote === undefined) {
		return (
			<div className="min-h-[100vh] flex-1 md:min-h-min">
				<div className="relative bg-gradient-to-br from-background via-muted/30 to-muted/60 dark:from-background dark:via-muted/20 dark:to-muted/40 min-h-[100vh] rounded-xl">
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(120,119,198,0.08),transparent_50%)] rounded-xl" />
					<div className="relative px-6 pt-8 pb-20">
						<div className="animate-pulse space-y-8">
							<div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
							<div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
								<div className="xl:col-span-3 space-y-8">
									<div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
									<div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
								</div>
								<div className="space-y-6">
									<div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
									<div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Quote not found
	if (quote === null) {
		return (
			<div className="min-h-[100vh] flex-1 md:min-h-min">
				<div className="relative bg-gradient-to-br from-background via-muted/30 to-muted/60 dark:from-background dark:via-muted/20 dark:to-muted/40 min-h-[100vh] rounded-xl">
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(120,119,198,0.08),transparent_50%)] rounded-xl" />
					<div className="relative px-6 pt-8 pb-20 flex flex-col items-center justify-center h-96 space-y-4">
						<div className="text-6xl">📄</div>
						<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
							Quote Not Found
						</h1>
						<p className="text-gray-600 dark:text-gray-400 text-center">
							The quote you&apos;re looking for doesn&apos;t exist or you
							don&apos;t have permission to view it.
						</p>
						<Button onClick={() => router.push("/quotes")}>
							Back to Quotes
						</Button>
					</div>
				</div>
			</div>
		);
	}

	const currentStatus = getQuoteStatus(quote.status, quote.validUntil);

	const handleGeneratePdf = async (
		appendDocumentIds: Id<"organizationDocuments">[] = []
	) => {
		try {
			if (!quote || !lineItems) return;
			const loadingId = toast.loading(
				"Generating PDF",
				appendDocumentIds.length > 0
					? `Merging with ${appendDocumentIds.length} document${appendDocumentIds.length !== 1 ? "s" : ""}…`
					: "Rendering and uploading…"
			);

			// Generate main quote PDF
			const element = (
				<QuotePDF
					quote={quote}
					client={
						client
							? { companyName: client.companyName, industry: client.industry }
							: undefined
					}
					items={lineItems}
					organization={
						organization
							? {
									name: organization.name,
									logoUrl: organization.logoUrl || undefined,
									address: organization.address || undefined,
									phone: organization.phone || undefined,
									email: organization.email || undefined,
								}
							: undefined
					}
				/>
			);
			const quoteBlob = await pdf(element).toBlob();

			// If documents selected, merge PDFs
			let finalBlob = quoteBlob;
			if (appendDocumentIds.length > 0) {
				try {
					const { PDFDocument } = await import("pdf-lib");

					// Fetch all document URLs using Convex client
					const documentUrls = await convex.query(
						api.organizationDocuments.getDocumentUrls,
						{ ids: appendDocumentIds }
					);

					console.log("Fetched document URLs:", documentUrls);

					const mergedPdf = await PDFDocument.create();

					// Add quote PDF pages
					const quotePdfDoc = await PDFDocument.load(
						await quoteBlob.arrayBuffer()
					);
					const quotePages = await mergedPdf.copyPages(
						quotePdfDoc,
						quotePdfDoc.getPageIndices()
					);
					quotePages.forEach((page) => mergedPdf.addPage(page));

					console.log(`Added ${quotePages.length} pages from quote PDF`);

					// Fetch and add organization documents
					for (const docInfo of documentUrls) {
						try {
							if (!docInfo.url) {
								console.warn(`No URL found for document ${docInfo.id}`);
								continue;
							}

							// Fetch the actual PDF
							const docResponse = await fetch(docInfo.url);
							if (!docResponse.ok) {
								console.warn(
									`Failed to fetch PDF for document ${docInfo.id}, status: ${docResponse.status}`
								);
								continue;
							}

							const docBytes = await docResponse.arrayBuffer();
							const docPdf = await PDFDocument.load(docBytes);
							const docPages = await mergedPdf.copyPages(
								docPdf,
								docPdf.getPageIndices()
							);
							docPages.forEach((page) => mergedPdf.addPage(page));

							console.log(
								`Successfully merged document ${docInfo.id} (${docPages.length} pages)`
							);
						} catch (docError) {
							console.error(
								`Error processing document ${docInfo.id}:`,
								docError
							);
							continue;
						}
					}

					const pdfBytes = await mergedPdf.save();
					finalBlob = new Blob([pdfBytes as BlobPart], {
						type: "application/pdf",
					});

					console.log(
						`Merged PDF created with ${mergedPdf.getPageCount()} total pages`
					);
				} catch (mergeError) {
					console.error("PDF merge error:", mergeError);
					toast.error(
						"Merge failed",
						"Failed to merge documents. Using quote only."
					);
					finalBlob = quoteBlob;
				}
			}

			// Upload final PDF
			const uploadUrl = await generateUploadUrl({});
			const res = await fetch(uploadUrl, {
				method: "POST",
				headers: { "Content-Type": "application/pdf" },
				body: finalBlob,
			});
			if (!res.ok) throw new Error("Failed to upload PDF");
			const { storageId } = await res.json();
			await createDocument({
				documentType: "quote",
				documentId: quote._id,
				storageId: storageId as unknown as StorageId<"_storage">,
			});
			toast.removeToast(loadingId);
			toast.success(
				"PDF generated",
				appendDocumentIds.length > 0
					? `Quote PDF with ${appendDocumentIds.length} appended document${appendDocumentIds.length !== 1 ? "s" : ""} is ready.`
					: "Your quote PDF is ready."
			);
		} catch (error) {
			console.error(error);
			const message = error instanceof Error ? error.message : "Unknown error";
			toast.error("PDF generation failed", message);
		}
	};

	const handleDownloadPdf = async () => {
		if (!selectedDocumentUrl) return;
		try {
			// Fetch the PDF as a blob
			const response = await fetch(selectedDocumentUrl);
			if (!response.ok) throw new Error("Failed to fetch PDF");
			const blob = await response.blob();

			// Create a blob URL and trigger download
			const blobUrl = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = blobUrl;
			const versionSuffix = selectedDocument?.version
				? `-v${selectedDocument.version}`
				: "";
			link.download = `Quote-${quote?.quoteNumber || quote?._id.slice(-6) || "document"}${versionSuffix}.pdf`;
			document.body.appendChild(link);
			link.click();

			// Clean up
			document.body.removeChild(link);
			URL.revokeObjectURL(blobUrl);
		} catch (error) {
			console.error(error);
			const message = error instanceof Error ? error.message : "Unknown error";
			toast.error("Download failed", message);
		}
	};

	const handleSendForSignature = async (
		recipients: Array<{
			name: string;
			email: string;
			signerType: "Signer" | "CC";
		}>,
		message?: string
	) => {
		if (!selectedDocumentUrl || !latestDocument) {
			toast.error("No PDF", "Generate a PDF first");
			return;
		}

		try {
			await sendForSignature({
				quoteId,
				documentId: latestDocument._id,
				recipients,
				documentUrl: selectedDocumentUrl,
				message,
			});
			toast.success("Sent!", "Quote sent for signature via BoldSign");
			setSendEmailPopoverOpen(false);
		} catch (error) {
			const message = error instanceof Error ? error.message : "Unknown error";
			toast.error("Send failed", message);
		}
	};

	return (
		<div className="min-h-[100vh] flex-1 md:min-h-min">
			<div className="relative min-h-[100vh] rounded-xl">
				<div className="rounded-xl" />

				<div className="relative px-6 pt-8 pb-20">
					<div className="mx-auto">
						{/* Quote Header */}
						<div className="flex items-center mb-8">
							<div className="flex items-center gap-4">
								<div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30">
									<FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
								</div>
								<div>
									<div className="flex items-center gap-3">
										<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
											Quote {quote.quoteNumber || `#${quote._id.slice(-6)}`}
										</h1>
										<Badge variant={statusVariant(currentStatus)}>
											{formatStatus(currentStatus)}
										</Badge>
									</div>
									<p className="text-muted-foreground text-sm mt-1">
										{quote.title || project?.title || "Untitled Quote"}
									</p>
								</div>
							</div>
						</div>

						{isEditing && isDirty && (
							<Alert className="mb-6">
								<AlertTitle>Unsaved changes</AlertTitle>
								<AlertDescription>
									You have modified this quote. Save or cancel your changes.
								</AlertDescription>
							</Alert>
						)}

						{/* Two Column Layout */}
						<div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
							{/* Main Content - Left Column */}
							<div className="xl:col-span-3 space-y-8">
								{/* Client and Project Details */}
								<div className="bg-card dark:bg-card backdrop-blur-md border border-border dark:border-border rounded-xl shadow-lg dark:shadow-black/50 ring-1 ring-border/30 dark:ring-border/50">
									<Card className="bg-transparent border-none shadow-none ring-0">
										<CardHeader>
											<CardTitle className="flex items-center justify-between text-xl">
												<div className="flex items-center gap-2">
													<Building2 className="h-5 w-5" />
													Client and Project Details
												</div>
												<div className="flex gap-2">
													{project && (
														<Button
															intent="outline"
															size="sm"
															onClick={() =>
																router.push(`/projects/${project._id}`)
															}
														>
															<FolderOpen className="h-4 w-4 mr-1" />
															View Project
														</Button>
													)}
													{client && (
														<Button
															intent="outline"
															size="sm"
															onClick={() =>
																router.push(`/clients/${client._id}`)
															}
														>
															<Edit className="h-4 w-4 mr-1" />
															View Client
														</Button>
													)}
												</div>
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="space-y-8">
												{/* Client Information */}
												{client ? (
													<div className="space-y-6">
														{/* Company Header */}
														<div className="border-b border-gray-200 dark:border-gray-700 pb-4">
															<div className="flex items-start justify-between">
																<div>
																	<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
																		{client.companyName}
																	</h3>
																	<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
																		{client.industry || "No industry specified"}
																	</p>
																	{client.companyDescription && (
																		<p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
																			{client.companyDescription}
																		</p>
																	)}
																</div>
																{client.status && (
																	<Badge
																		variant={
																			client.status === "active"
																				? "default"
																				: "outline"
																		}
																	>
																		{client.status}
																	</Badge>
																)}
															</div>
														</div>

														{/* Contact & Property Grid */}
														<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
															{/* Primary Contact */}
															<div>
																<h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
																	<Mail className="h-4 w-4" />
																	Primary Contact
																</h4>
																{primaryContact ? (
																	<div className="space-y-2">
																		<p className="text-sm font-medium text-gray-900 dark:text-white">
																			{primaryContact.firstName}{" "}
																			{primaryContact.lastName}
																		</p>
																		{primaryContact.jobTitle && (
																			<p className="text-xs text-gray-600 dark:text-gray-400">
																				{primaryContact.jobTitle}
																			</p>
																		)}
																		{primaryContact.email && (
																			<p className="text-sm text-gray-600 dark:text-gray-400">
																				<a
																					href={`mailto:${primaryContact.email}`}
																					className="hover:text-blue-600 dark:hover:text-blue-400"
																				>
																					{primaryContact.email}
																				</a>
																			</p>
																		)}
																		{primaryContact.phone && (
																			<p className="text-sm text-gray-600 dark:text-gray-400">
																				<a
																					href={`tel:${primaryContact.phone}`}
																					className="hover:text-blue-600 dark:hover:text-blue-400"
																				>
																					{primaryContact.phone}
																				</a>
																			</p>
																		)}
																		{primaryContact.department && (
																			<p className="text-xs text-gray-500 dark:text-gray-500">
																				{primaryContact.department}
																			</p>
																		)}
																	</div>
																) : (
																	<p className="text-sm text-gray-500 dark:text-gray-400">
																		No primary contact set
																	</p>
																)}
																{allContacts && allContacts.length > 1 && (
																	<p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
																		+{allContacts.length - 1} additional contact
																		{allContacts.length > 2 ? "s" : ""}
																	</p>
																)}
															</div>

															{/* Primary Property/Address */}
															<div>
																<h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
																	<Building2 className="h-4 w-4" />
																	Primary Location
																</h4>
																{primaryProperty ? (
																	<div className="space-y-2">
																		{primaryProperty.propertyName && (
																			<p className="text-sm font-medium text-gray-900 dark:text-white">
																				{primaryProperty.propertyName}
																			</p>
																		)}
																		<div className="text-sm text-gray-600 dark:text-gray-400">
																			<p>{primaryProperty.streetAddress}</p>
																			<p>
																				{primaryProperty.city},{" "}
																				{primaryProperty.state}{" "}
																				{primaryProperty.zipCode}
																			</p>
																			{primaryProperty.country && (
																				<p>{primaryProperty.country}</p>
																			)}
																		</div>
																		{primaryProperty.propertyType && (
																			<Badge
																				variant="outline"
																				className="text-xs"
																			>
																				{primaryProperty.propertyType}
																			</Badge>
																		)}
																		{primaryProperty.squareFootage && (
																			<p className="text-xs text-gray-500 dark:text-gray-500">
																				{primaryProperty.squareFootage.toLocaleString()}{" "}
																				sq ft
																			</p>
																		)}
																	</div>
																) : (
																	<p className="text-sm text-gray-500 dark:text-gray-400">
																		No property address set
																	</p>
																)}
															</div>
														</div>

														{/* Additional Client Details */}
														{(client.category ||
															client.clientSize ||
															client.priorityLevel) && (
															<div className="pt-4 border-t border-gray-200 dark:border-gray-700">
																<div className="flex flex-wrap gap-2">
																	{client.category && (
																		<Badge
																			variant="secondary"
																			className="text-xs"
																		>
																			{client.category}
																		</Badge>
																	)}
																	{client.clientSize && (
																		<Badge
																			variant="secondary"
																			className="text-xs"
																		>
																			{client.clientSize}
																		</Badge>
																	)}
																	{client.priorityLevel && (
																		<Badge
																			variant={
																				client.priorityLevel === "urgent" ||
																				client.priorityLevel === "high"
																					? "destructive"
																					: "secondary"
																			}
																			className="text-xs"
																		>
																			{client.priorityLevel} priority
																		</Badge>
																	)}
																</div>
															</div>
														)}
													</div>
												) : (
													<div className="p-6 border-2 border-dashed border-gray-300 dark:border-white/20 rounded-lg text-center">
														<Building2 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
														<p className="text-sm text-gray-500 dark:text-gray-400">
															Client information not available
														</p>
													</div>
												)}

												{/* Associated Project */}
												{project && (
													<div className="pt-6 border-t border-gray-200 dark:border-gray-700">
														<div className="flex items-start justify-between mb-4">
															<h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
																<FolderOpen className="h-4 w-4" />
																Associated Project
															</h4>
															{project.status && (
																<Badge
																	variant={
																		project.status === "in-progress"
																			? "default"
																			: project.status === "completed"
																				? "secondary"
																				: "outline"
																	}
																>
																	{project.status}
																</Badge>
															)}
														</div>
														<div className="space-y-3">
															<div>
																<p className="text-base font-medium text-gray-900 dark:text-white">
																	{project.title}
																</p>
																{project.projectNumber && (
																	<p className="text-xs text-gray-500 dark:text-gray-500">
																		Project #{project.projectNumber}
																	</p>
																)}
															</div>
															{project.description && (
																<p className="text-sm text-gray-600 dark:text-gray-400">
																	{project.description}
																</p>
															)}
															<div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-500">
																{project.startDate && (
																	<div className="flex items-center gap-1">
																		<Clock className="h-3 w-3" />
																		<span>
																			Start:{" "}
																			{new Date(
																				project.startDate
																			).toLocaleDateString()}
																		</span>
																	</div>
																)}
																{project.endDate && (
																	<div className="flex items-center gap-1">
																		<Clock className="h-3 w-3" />
																		<span>
																			End:{" "}
																			{new Date(
																				project.endDate
																			).toLocaleDateString()}
																		</span>
																	</div>
																)}
																{project.projectType && (
																	<Badge variant="outline" className="text-xs">
																		{project.projectType}
																	</Badge>
																)}
															</div>
														</div>
													</div>
												)}
											</div>
										</CardContent>
									</Card>
								</div>

								{/* Signature Status */}
								{documentsWithSignatures &&
									documentsWithSignatures.length > 0 && (
										<div className="bg-card dark:bg-card backdrop-blur-md border border-border dark:border-border rounded-xl shadow-lg dark:shadow-black/50 ring-1 ring-border/30 dark:ring-border/50">
											<Card className="bg-transparent border-none shadow-none ring-0">
												<CardHeader>
													<CardTitle className="flex items-center gap-2 text-xl">
														<FileText className="h-5 w-5" />
														Signature Status
													</CardTitle>
												</CardHeader>
												<CardContent>
													<Accordion
														items={documentsWithSignatures.map((doc) => {
															// Get the most recent timestamp for last update
															const lastUpdate =
																doc.boldsign.completedAt ||
																doc.boldsign.declinedAt ||
																doc.boldsign.revokedAt ||
																doc.boldsign.expiredAt ||
																doc.boldsign.signedAt ||
																doc.boldsign.viewedAt ||
																doc.boldsign.sentAt ||
																doc.generatedAt;

															// Status badge variant
															const statusVariant =
																doc.boldsign.status === "Completed"
																	? "default"
																	: doc.boldsign.status === "Declined" ||
																		  doc.boldsign.status === "Revoked" ||
																		  doc.boldsign.status === "Expired"
																		? "destructive"
																		: "secondary";

															const formattedDate = new Date(
																lastUpdate
															).toLocaleDateString("en-US", {
																month: "short",
																day: "numeric",
																hour: "2-digit",
																minute: "2-digit",
															});

															return {
																title: `Version ${doc.version} - ${doc.boldsign.status} - ${formattedDate}`,
																content: (
																	<div className="space-y-4">
																		{/* Status badges at top of content */}
																		<div className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
																			<Badge
																				variant="outline"
																				className="text-xs"
																			>
																				v{doc.version}
																			</Badge>
																			<Badge
																				variant={statusVariant}
																				className="text-xs"
																			>
																				{doc.boldsign.status}
																			</Badge>
																			<span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
																				Last updated: {formattedDate}
																			</span>
																		</div>

																		<SignatureProgressBar
																			status={doc.boldsign.status}
																			events={[
																				{
																					type: "Sent",
																					timestamp: doc.boldsign.sentAt,
																				},
																				{
																					type: "Viewed",
																					timestamp: doc.boldsign.viewedAt,
																				},
																				{
																					type: "Signed",
																					timestamp: doc.boldsign.signedAt,
																				},
																				{
																					type: doc.boldsign.status,
																					timestamp:
																						doc.boldsign.completedAt ||
																						doc.boldsign.declinedAt ||
																						doc.boldsign.revokedAt ||
																						doc.boldsign.expiredAt,
																				},
																			]}
																		/>

																		{/* Recipients info */}
																		<div className="pt-4 border-t border-gray-200 dark:border-gray-700">
																			<p className="font-medium mb-3 text-sm text-gray-900 dark:text-white">
																				Sent to:
																			</p>
																			<ul className="space-y-2">
																				{doc.boldsign.sentTo.map(
																					(recipient, i) => (
																						<li
																							key={i}
																							className="flex items-center justify-between text-sm"
																						>
																							<span className="text-gray-700 dark:text-gray-300">
																								<span className="font-medium">
																									{recipient.name}
																								</span>{" "}
																								<span className="text-gray-500 dark:text-gray-400">
																									({recipient.email})
																								</span>
																							</span>
																							<Badge
																								variant="outline"
																								className="text-xs"
																							>
																								{recipient.signerType}
																							</Badge>
																						</li>
																					)
																				)}
																			</ul>
																		</div>
																	</div>
																),
															};
														})}
													/>
												</CardContent>
											</Card>
										</div>
									)}

								{/* Line Items */}
								<div className="bg-card dark:bg-card backdrop-blur-md border border-border dark:border-border rounded-xl shadow-lg dark:shadow-black/50 ring-1 ring-border/30 dark:ring-border/50">
									<Card className="bg-transparent border-none shadow-none ring-0">
										<CardHeader className="flex flex-row items-center justify-between">
											<CardTitle className="flex items-center gap-2 text-xl">
												<DollarSign className="h-5 w-5" />
												Line Items
											</CardTitle>
											<Button
												intent="outline"
												size="sm"
												onPress={() =>
													router.push(`/quotes/${quoteId}/quoteLineEditor`)
												}
											>
												<Settings className="h-4 w-4 mr-2" />
												Edit Line Items
											</Button>
										</CardHeader>
										<CardContent>
											{lineItems && lineItems.length > 0 ? (
												<>
													<div className="overflow-hidden rounded-lg border">
														<Table>
															<TableHeader className="bg-muted">
																<TableRow>
																	<TableHead>Description</TableHead>
																	<TableHead className="text-center">
																		Qty
																	</TableHead>
																	<TableHead className="text-center">
																		Unit
																	</TableHead>
																	<TableHead className="text-right">
																		Rate
																	</TableHead>
																	<TableHead className="text-right">
																		Amount
																	</TableHead>
																</TableRow>
															</TableHeader>
															<TableBody>
																{lineItems.map((item) => (
																	<TableRow key={item._id}>
																		<TableCell className="font-medium">
																			{item.description}
																		</TableCell>
																		<TableCell className="text-center">
																			{item.quantity}
																		</TableCell>
																		<TableCell className="text-center">
																			{item.unit || "item"}
																		</TableCell>
																		<TableCell className="text-right">
																			{formatCurrency(item.rate)}
																		</TableCell>
																		<TableCell className="text-right font-medium">
																			{formatCurrency(item.amount)}
																		</TableCell>
																	</TableRow>
																))}
															</TableBody>
														</Table>
													</div>

													{/* Totals */}
													<div className="mt-6 space-y-2">
														<div className="flex justify-between text-sm">
															<span className="text-gray-600 dark:text-gray-400">
																Subtotal:
															</span>
															<span className="font-medium">
																{formatCurrency(quote.subtotal)}
															</span>
														</div>
														{quote.discountEnabled && quote.discountAmount && (
															<div className="flex justify-between text-sm">
																<span className="text-gray-600 dark:text-gray-400">
																	Discount:
																</span>
																<span className="font-medium text-red-600 dark:text-red-400">
																	-
																	{quote.discountType === "percentage"
																		? `${quote.discountAmount}%`
																		: formatCurrency(quote.discountAmount)}
																</span>
															</div>
														)}
														{quote.taxEnabled && quote.taxAmount && (
															<div className="flex justify-between text-sm">
																<span className="text-gray-600 dark:text-gray-400">
																	Tax:
																</span>
																<span className="font-medium">
																	{formatCurrency(quote.taxAmount)}
																</span>
															</div>
														)}
														<div className="border-t pt-2">
															<div className="flex justify-between text-lg font-bold">
																<span>Total:</span>
																<span>{formatCurrency(quote.total)}</span>
															</div>
														</div>
													</div>
												</>
											) : (
												<div className="p-8 border-2 border-dashed border-gray-300 dark:border-white/20 rounded-lg text-center">
													<div className="text-4xl mb-3">📋</div>
													<p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
														No line items added yet
													</p>
													<Button
														size="sm"
														onClick={() =>
															router.push(`/quotes/${quoteId}/quoteLineEditor`)
														}
													>
														Add Line Items
													</Button>
												</div>
											)}
										</CardContent>
									</Card>
								</div>

								{/* Terms & Conditions */}
								<div className="bg-card dark:bg-card backdrop-blur-md border border-border dark:border-border rounded-xl shadow-lg dark:shadow-black/50 ring-1 ring-border/30 dark:ring-border/50">
									<Card className="bg-transparent border-none shadow-none ring-0">
										<CardHeader>
											<CardTitle className="flex items-center justify-between text-xl">
												<span>Terms & Conditions</span>
												{!isEditing ? (
													<Button
														intent="outline"
														size="sm"
														onClick={() => setIsEditing(true)}
													>
														<Edit className="h-4 w-4" />
													</Button>
												) : (
													<div className="flex gap-2">
														<Button
															intent="outline"
															size="sm"
															onClick={resetForm}
														>
															Cancel
														</Button>
														<Button
															size="sm"
															onClick={handleSave}
															isDisabled={!isDirty}
														>
															Save
														</Button>
													</div>
												)}
											</CardTitle>
										</CardHeader>
										<CardContent>
											{isEditing ? (
												<div className="space-y-4">
													<textarea
														className="w-full min-h-[100px] px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-md text-gray-900 dark:text-white"
														placeholder="Enter terms"
														value={form.terms}
														onChange={(e) =>
															setForm((f) => ({ ...f, terms: e.target.value }))
														}
													/>
													<textarea
														className="w-full min-h-[80px] px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-md text-gray-900 dark:text-white"
														placeholder="Message to client (optional)"
														value={form.clientMessage}
														onChange={(e) =>
															setForm((f) => ({
																...f,
																clientMessage: e.target.value,
															}))
														}
													/>
												</div>
											) : (
												<>
													<p className="text-gray-600 dark:text-gray-400">
														{quote.terms || "No terms specified"}
													</p>
													{quote.clientMessage && (
														<div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
															<h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
																Message to Client:
															</h4>
															<p className="text-gray-600 dark:text-gray-400">
																{quote.clientMessage}
															</p>
														</div>
													)}
												</>
											)}
										</CardContent>
									</Card>
								</div>
							</div>

							{/* Quote Details Sidebar - Right Column */}
							<div className="xl:col-span-1">
								<div className="sticky top-24 space-y-6">
									{/* Quote Details */}
									<div className="bg-card dark:bg-card backdrop-blur-md border border-border dark:border-border rounded-xl shadow-lg dark:shadow-black/50 ring-1 ring-border/30 dark:ring-border/50">
										<Card className="bg-transparent border-none shadow-none ring-0">
											<CardHeader>
												<CardTitle className="text-lg">Quote Details</CardTitle>
											</CardHeader>
											<CardContent className="space-y-4">
												<div className="flex justify-between">
													<span className="text-sm text-gray-600 dark:text-gray-400">
														Created:
													</span>
													<span className="text-sm text-gray-900 dark:text-white">
														{new Date(quote._creationTime).toLocaleDateString()}
													</span>
												</div>
												<div className="flex justify-between">
													<span className="text-sm text-gray-600 dark:text-gray-400">
														Status:
													</span>
													<Badge variant={statusVariant(currentStatus)}>
														{formatStatus(currentStatus)}
													</Badge>
												</div>
												<div className="flex justify-between items-center">
													<span className="text-sm text-gray-600 dark:text-gray-400">
														Valid Until:
													</span>
													{isEditing ? (
														<input
															type="date"
															className="w-40 h-9 px-2 py-1 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-md text-gray-900 dark:text-white"
															value={
																form.validUntil
																	? new Date(form.validUntil)
																			.toISOString()
																			.slice(0, 10)
																	: ""
															}
															onChange={(e) =>
																setForm((f) => ({
																	...f,
																	validUntil: e.target.value
																		? new Date(e.target.value).getTime()
																		: undefined,
																}))
															}
														/>
													) : (
														<span className="text-sm text-gray-900 dark:text-white">
															{quote.validUntil
																? new Date(
																		quote.validUntil
																	).toLocaleDateString()
																: "—"}
														</span>
													)}
												</div>
												{quote.sentAt && (
													<div className="flex justify-between">
														<span className="text-sm text-gray-600 dark:text-gray-400">
															Sent:
														</span>
														<span className="text-sm text-gray-900 dark:text-white">
															{new Date(quote.sentAt).toLocaleDateString()}
														</span>
													</div>
												)}
												{quote.approvedAt && (
													<div className="flex justify-between">
														<span className="text-sm text-gray-600 dark:text-gray-400">
															Approved:
														</span>
														<span className="text-sm text-gray-900 dark:text-white">
															{new Date(quote.approvedAt).toLocaleDateString()}
														</span>
													</div>
												)}
											</CardContent>
										</Card>
									</div>

									{/* Generated PDF */}
									<div className="bg-card dark:bg-card backdrop-blur-md border border-border dark:border-border rounded-xl shadow-lg dark:shadow-black/50 ring-1 ring-border/30 dark:ring-border/50">
										<Card className="bg-transparent border-none shadow-none ring-0">
											<CardHeader className="flex flex-row items-center justify-between">
												<div className="flex items-center gap-2">
													<CardTitle className="text-lg">
														Generated PDF
													</CardTitle>
													{selectedDocument && (
														<Badge variant="outline" className="text-xs">
															v{selectedDocument.version}
														</Badge>
													)}
												</div>
												<FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
											</CardHeader>
											<CardContent>
												<div className="text-center py-6">
													{selectedDocumentUrl ? (
														<div className="space-y-4">
															<div className="h-48 bg-gray-50 dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
																<iframe
																	src={selectedDocumentUrl}
																	className="w-full h-full"
																	title="PDF Preview"
																	style={{ border: "none" }}
																/>
															</div>

															{/* Action buttons */}
															<div className="flex gap-2">
																<a
																	href={selectedDocumentUrl}
																	target="_blank"
																	rel="noopener noreferrer"
																	className="flex-1"
																>
																	<Button
																		intent="outline"
																		size="sm"
																		className="w-full"
																	>
																		<Eye className="h-4 w-4 mr-2" />
																		View
																	</Button>
																</a>
																<Button
																	intent="outline"
																	size="sm"
																	className="w-full flex-1"
																	onClick={handleDownloadPdf}
																>
																	<Download className="h-4 w-4 mr-2" />
																	Download
																</Button>
															</div>

															{/* Version History Toggle */}
															{allDocumentVersions &&
																allDocumentVersions.length > 1 && (
																	<div className="pt-2 border-t border-gray-200 dark:border-gray-700">
																		<Button
																			intent="outline"
																			size="sm"
																			className="w-full"
																			onClick={() =>
																				setShowVersionHistory(
																					!showVersionHistory
																				)
																			}
																		>
																			<History className="h-4 w-4 mr-2" />
																			{showVersionHistory
																				? "Hide"
																				: "Show"}{" "}
																			Version History (
																			{allDocumentVersions.length})
																		</Button>

																		{/* Version History List */}
																		{showVersionHistory && (
																			<div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
																				{allDocumentVersions.map((version) => (
																					<button
																						key={version._id}
																						onClick={() => {
																							setSelectedVersionId(
																								version._id ===
																									latestDocument?._id
																									? null
																									: version._id
																							);
																						}}
																						className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
																							selectedVersionId ===
																								version._id ||
																							(!selectedVersionId &&
																								version._id ===
																									latestDocument?._id)
																								? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
																								: "bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
																						}`}
																					>
																						<div className="flex items-center justify-between">
																							<div className="flex items-center gap-2">
																								<Clock className="h-3 w-3 text-gray-400" />
																								<span className="font-medium">
																									Version {version.version}
																								</span>
																								{version._id ===
																									latestDocument?._id && (
																									<Badge
																										variant="default"
																										className="text-xs"
																									>
																										Latest
																									</Badge>
																								)}
																							</div>
																							<span className="text-xs text-gray-500">
																								{new Date(
																									version.generatedAt
																								).toLocaleDateString()}{" "}
																								{new Date(
																									version.generatedAt
																								).toLocaleTimeString([], {
																									hour: "2-digit",
																									minute: "2-digit",
																								})}
																							</span>
																						</div>
																					</button>
																				))}
																			</div>
																		)}
																	</div>
																)}
														</div>
													) : (
														<div>
															<FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
															<p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
																No PDF generated yet
															</p>
															<Button
																intent="outline"
																size="sm"
																onClick={() => setShowDocumentModal(true)}
															>
																<FileText className="h-4 w-4 mr-2" />
																Generate PDF
															</Button>
														</div>
													)}
												</div>
											</CardContent>
										</Card>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Sticky Footer with Action Buttons */}
			<StickyFormFooter
				buttons={[
					// Left side buttons - Status actions
					...(getStatusActions()
						? [
								{
									label:
										quote?.status === "draft"
											? "Send Quote"
											: quote?.status === "sent"
												? "Approve"
												: quote?.status === "approved"
													? "Reopen (Sent)"
													: quote?.status === "expired"
														? "Reopen (Draft)"
														: "Update Status",
									intent:
										quote?.status === "draft"
											? ("primary" as const)
											: quote?.status === "sent"
												? ("success" as const)
												: ("outline" as const),
									icon:
										quote?.status === "draft" ? (
											<Mail className="h-4 w-4" />
										) : quote?.status === "sent" ? (
											<Check className="h-4 w-4" />
										) : (
											<Edit className="h-4 w-4" />
										),
									onClick: () => {
										if (quote?.status === "draft") {
											handleStatusChange("sent");
										} else if (quote?.status === "sent") {
											handleStatusChange("approved");
										} else if (quote?.status === "approved") {
											handleStatusChange("sent");
										} else if (quote?.status === "expired") {
											handleStatusChange("draft");
										}
									},
									position: "left" as const,
								},
							]
						: []),
					// Right side buttons - Actions
					{
						label: "Send to Client",
						intent: "outline",
						icon: <Mail className="h-4 w-4" />,
						onClick: () => setSendEmailPopoverOpen(true),
						position: "right" as const,
					},
					{
						label: "Generate PDF",
						intent: "outline",
						icon: <FileText className="h-4 w-4" />,
						onClick: () => setShowDocumentModal(true),
						position: "right" as const,
					},
					{
						label: "Convert to Invoice",
						intent: "primary",
						onClick: async () => {
							// Only allow conversion if quote is approved
							if (quote?.status !== "approved") {
								toast.error(
									"Cannot Convert",
									"Only approved quotes can be converted to invoices"
								);
								return;
							}

							try {
								const loadingId = toast.loading(
									"Creating Invoice",
									"Converting quote to invoice..."
								);
								const invoiceId = await createInvoiceFromQuote({
									quoteId,
									issuedDate: Date.now(),
									dueDate: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days default
								});
								toast.removeToast(loadingId);
								toast.success(
									"Invoice Created",
									"Quote converted to invoice successfully"
								);
								router.push(`/invoices/${invoiceId}`);
							} catch (error) {
								const message =
									error instanceof Error
										? error.message
										: "Failed to convert quote";
								toast.error("Conversion Failed", message);
							}
						},
						position: "right" as const,
						disabled: quote?.status !== "approved",
					},
					{
						label: "More",
						intent: "outline",
						icon: <MoreHorizontal className="h-4 w-4" />,
						onClick: () => {
							// Handle more options
							console.log("More options");
						},
						position: "right" as const,
					},
				]}
				fullWidth
			/>

			{/* Document Selection Modal */}
			<DocumentSelectionModal
				isOpen={showDocumentModal}
				onClose={() => setShowDocumentModal(false)}
				onConfirm={(selectedIds) => handleGeneratePdf(selectedIds)}
			/>

			{/* Send Email Popover - positioned at bottom right of screen to align with footer button */}
			<SendEmailPopover
				isOpen={sendEmailPopoverOpen}
				onOpenChange={setSendEmailPopoverOpen}
				onConfirm={handleSendForSignature}
				primaryContact={primaryContact}
				quoteNumber={quote?.quoteNumber || quote?._id.slice(-6)}
				documentVersion={latestDocument?.version}
			>
				<div className="fixed bottom-4 right-6 pointer-events-none" />
			</SendEmailPopover>
		</div>
	);
}
