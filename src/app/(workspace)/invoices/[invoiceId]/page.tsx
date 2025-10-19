"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useConvex } from "convex/react";
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
	Download,
	Eye,
	DollarSign,
	Building2,
	Edit,
	FolderOpen,
	Check,
	Mail,
	MoreHorizontal,
	Clock,
	CheckCircle,
	XCircle,
} from "lucide-react";
import { StickyFormFooter } from "@/components/sticky-form-footer";
import { pdf } from "@react-pdf/renderer";
import InvoicePDF from "@/components/InvoicePDF";
import type { Id } from "../../../../../convex/_generated/dataModel";
import type { Id as StorageId } from "../../../../../convex/_generated/dataModel";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState, useMemo } from "react";

type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

const formatCurrency = (amount: number) => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
};

const getInvoiceStatus = (
	status: InvoiceStatus,
	dueDate?: number
): InvoiceStatus => {
	if (status === "sent" && dueDate && dueDate < Date.now()) return "overdue";
	return status;
};

const statusVariant = (status: InvoiceStatus) => {
	switch (status) {
		case "paid":
			return "default" as const;
		case "sent":
			return "secondary" as const;
		case "overdue":
		case "cancelled":
			return "destructive" as const;
		case "draft":
		default:
			return "outline" as const;
	}
};

const formatStatus = (status: InvoiceStatus) => {
	switch (status) {
		case "draft":
			return "Draft";
		case "sent":
			return "Sent";
		case "paid":
			return "Paid";
		case "overdue":
			return "Overdue";
		case "cancelled":
			return "Cancelled";
		default:
			return status;
	}
};

export default function InvoiceDetailPage() {
	const router = useRouter();
	const params = useParams();
	const toast = useToast();
	const convex = useConvex();
	const invoiceId = params.invoiceId as Id<"invoices">;

	// Fetch invoice data from Convex
	const invoice = useQuery(api.invoices.get, { id: invoiceId });
	const client = useQuery(
		api.clients.get,
		invoice?.clientId ? { id: invoice.clientId } : "skip"
	);
	const project = useQuery(
		api.projects.get,
		invoice?.projectId ? { id: invoice.projectId } : "skip"
	);
	const lineItems = useQuery(api.invoiceLineItems.listByInvoice, {
		invoiceId,
	});
	const organization = useQuery(api.organizations.get, {});
	const latestDocument = useQuery(
		api.documents.getLatest,
		invoice ? { documentType: "invoice", documentId: invoice._id } : "skip"
	);
	const primaryContact = useQuery(
		api.clientContacts.getPrimaryContact,
		invoice?.clientId ? { clientId: invoice.clientId } : "skip"
	);
	const primaryProperty = useQuery(
		api.clientProperties.getPrimaryProperty,
		invoice?.clientId ? { clientId: invoice.clientId } : "skip"
	);

	// Mutations
	const updateInvoice = useMutation(api.invoices.update);
	const generateUploadUrl = useMutation(api.documents.generateUploadUrl);
	const createDocument = useMutation(api.documents.create);

	const selectedDocumentUrl = useQuery(
		api.documents.getDocumentUrl,
		latestDocument ? { id: latestDocument._id } : "skip"
	);

	const handleStatusChange = async (status: InvoiceStatus) => {
		try {
			await updateInvoice({ id: invoiceId, status });
			toast.success(
				"Invoice Updated",
				`Status changed to ${formatStatus(status)}`
			);
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Failed to update status";
			toast.error("Error", message);
		}
	};

	const handleMarkPaid = async () => {
		try {
			await updateInvoice({ id: invoiceId, status: "paid" });
			toast.success("Invoice Paid", "Invoice marked as paid successfully");
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Failed to mark as paid";
			toast.error("Error", message);
		}
	};

	const getStatusActions = () => {
		if (!invoice) return null;
		const currentStatus = getInvoiceStatus(
			invoice.status as InvoiceStatus,
			invoice.dueDate
		);

		switch (currentStatus) {
			case "draft":
				return (
					<div className="flex items-center gap-2">
						<Button size="sm" onClick={() => handleStatusChange("sent")}>
							<Mail className="h-4 w-4 mr-1" /> Send Invoice
						</Button>
						<Button
							size="sm"
							className="bg-green-600 hover:bg-green-700"
							onClick={handleMarkPaid}
						>
							<CheckCircle className="h-4 w-4 mr-1" /> Mark as Paid
						</Button>
					</div>
				);
			case "sent":
			case "overdue":
				return (
					<div className="flex items-center gap-2">
						<Button
							size="sm"
							className="bg-green-600 hover:bg-green-700"
							onClick={handleMarkPaid}
						>
							<CheckCircle className="h-4 w-4 mr-1" /> Mark as Paid
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
			case "paid":
				return (
					<Button
						size="sm"
						intent="outline"
						onClick={() => handleStatusChange("sent")}
					>
						Reopen
					</Button>
				);
			case "cancelled":
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
	if (invoice === undefined) {
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

	// Invoice not found
	if (invoice === null) {
		return (
			<div className="min-h-[100vh] flex-1 md:min-h-min">
				<div className="relative bg-gradient-to-br from-background via-muted/30 to-muted/60 dark:from-background dark:via-muted/20 dark:to-muted/40 min-h-[100vh] rounded-xl">
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(120,119,198,0.08),transparent_50%)] rounded-xl" />
					<div className="relative px-6 pt-8 pb-20 flex flex-col items-center justify-center h-96 space-y-4">
						<div className="text-6xl">📄</div>
						<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
							Invoice Not Found
						</h1>
						<p className="text-gray-600 dark:text-gray-400 text-center">
							The invoice you&apos;re looking for doesn&apos;t exist or you
							don&apos;t have permission to view it.
						</p>
						<Button onClick={() => router.push("/invoices")}>
							Back to Invoices
						</Button>
					</div>
				</div>
			</div>
		);
	}

	const currentStatus = getInvoiceStatus(
		invoice.status as InvoiceStatus,
		invoice.dueDate
	);

	const handleGeneratePdf = async () => {
		try {
			if (!invoice || !lineItems) return;
			const loadingId = toast.loading(
				"Generating PDF",
				"Rendering and uploading…"
			);

			// Generate invoice PDF
			const element = (
				<InvoicePDF
					invoice={invoice}
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
			const invoiceBlob = await pdf(element).toBlob();

			// Upload PDF
			const uploadUrl = await generateUploadUrl({});
			const res = await fetch(uploadUrl, {
				method: "POST",
				headers: { "Content-Type": "application/pdf" },
				body: invoiceBlob,
			});
			if (!res.ok) throw new Error("Failed to upload PDF");
			const { storageId } = await res.json();
			await createDocument({
				documentType: "invoice",
				documentId: invoice._id,
				storageId: storageId as unknown as StorageId<"_storage">,
			});
			toast.removeToast(loadingId);
			toast.success("PDF generated", "Your invoice PDF is ready.");
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
			link.download = `Invoice-${invoice?.invoiceNumber || invoice?._id.slice(-6) || "document"}.pdf`;
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

	return (
		<div className="min-h-[100vh] flex-1 md:min-h-min">
			<div className="relative min-h-[100vh] rounded-xl">
				<div className="rounded-xl" />

				<div className="relative px-6 pt-8 pb-20">
					<div className="mx-auto">
						{/* Invoice Header */}
						<div className="flex items-center mb-8">
							<div className="flex items-center gap-4">
								<div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30">
									<FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
								</div>
								<div>
									<div className="flex items-center gap-3">
										<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
											{invoice.invoiceNumber}
										</h1>
										<Badge variant={statusVariant(currentStatus)}>
											{formatStatus(currentStatus)}
										</Badge>
									</div>
									<p className="text-muted-foreground text-sm mt-1">
										{project?.title || "Invoice"}
									</p>
								</div>
							</div>
						</div>

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
																	</div>
																) : (
																	<p className="text-sm text-gray-500 dark:text-gray-400">
																		No primary contact set
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
																		</div>
																	</div>
																) : (
																	<p className="text-sm text-gray-500 dark:text-gray-400">
																		No property address set
																	</p>
																)}
															</div>
														</div>
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
														</div>
													</div>
												)}
											</div>
										</CardContent>
									</Card>
								</div>

								{/* Line Items */}
								<div className="bg-card dark:bg-card backdrop-blur-md border border-border dark:border-border rounded-xl shadow-lg dark:shadow-black/50 ring-1 ring-border/30 dark:ring-border/50">
									<Card className="bg-transparent border-none shadow-none ring-0">
										<CardHeader className="flex flex-row items-center justify-between">
											<CardTitle className="flex items-center gap-2 text-xl">
												<DollarSign className="h-5 w-5" />
												Line Items
											</CardTitle>
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
																	<TableHead className="text-right">
																		Unit Price
																	</TableHead>
																	<TableHead className="text-right">
																		Total
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
																		<TableCell className="text-right">
																			{formatCurrency(item.unitPrice)}
																		</TableCell>
																		<TableCell className="text-right font-medium">
																			{formatCurrency(item.total)}
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
																{formatCurrency(invoice.subtotal)}
															</span>
														</div>
														{invoice.discountAmount && (
															<div className="flex justify-between text-sm">
																<span className="text-gray-600 dark:text-gray-400">
																	Discount:
																</span>
																<span className="font-medium text-red-600 dark:text-red-400">
																	-{formatCurrency(invoice.discountAmount)}
																</span>
															</div>
														)}
														{invoice.taxAmount && (
															<div className="flex justify-between text-sm">
																<span className="text-gray-600 dark:text-gray-400">
																	Tax:
																</span>
																<span className="font-medium">
																	{formatCurrency(invoice.taxAmount)}
																</span>
															</div>
														)}
														<div className="border-t pt-2">
															<div className="flex justify-between text-lg font-bold">
																<span>Total:</span>
																<span>{formatCurrency(invoice.total)}</span>
															</div>
														</div>
													</div>
												</>
											) : (
												<div className="p-8 border-2 border-dashed border-gray-300 dark:border-white/20 rounded-lg text-center">
													<div className="text-4xl mb-3">📋</div>
													<p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
														No line items found
													</p>
												</div>
											)}
										</CardContent>
									</Card>
								</div>
							</div>

							{/* Invoice Details Sidebar - Right Column */}
							<div className="xl:col-span-1">
								<div className="sticky top-24 space-y-6">
									{/* Invoice Details */}
									<div className="bg-card dark:bg-card backdrop-blur-md border border-border dark:border-border rounded-xl shadow-lg dark:shadow-black/50 ring-1 ring-border/30 dark:ring-border/50">
										<Card className="bg-transparent border-none shadow-none ring-0">
											<CardHeader>
												<CardTitle className="text-lg">
													Invoice Details
												</CardTitle>
											</CardHeader>
											<CardContent className="space-y-4">
												<div className="flex justify-between">
													<span className="text-sm text-gray-600 dark:text-gray-400">
														Status:
													</span>
													<Badge variant={statusVariant(currentStatus)}>
														{formatStatus(currentStatus)}
													</Badge>
												</div>
												<div className="flex justify-between">
													<span className="text-sm text-gray-600 dark:text-gray-400">
														Issued:
													</span>
													<span className="text-sm text-gray-900 dark:text-white">
														{new Date(invoice.issuedDate).toLocaleDateString()}
													</span>
												</div>
												<div className="flex justify-between">
													<span className="text-sm text-gray-600 dark:text-gray-400">
														Due Date:
													</span>
													<span
														className={`text-sm font-medium ${
															currentStatus === "overdue"
																? "text-red-600 dark:text-red-400"
																: "text-gray-900 dark:text-white"
														}`}
													>
														{new Date(invoice.dueDate).toLocaleDateString()}
													</span>
												</div>
												{invoice.paidAt && (
													<div className="flex justify-between">
														<span className="text-sm text-gray-600 dark:text-gray-400">
															Paid:
														</span>
														<span className="text-sm text-green-600 dark:text-green-400 font-medium">
															{new Date(invoice.paidAt).toLocaleDateString()}
														</span>
													</div>
												)}
												<div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
													<span className="text-sm font-medium text-gray-900 dark:text-white">
														Amount Due:
													</span>
													<span className="text-sm font-bold text-gray-900 dark:text-white">
														{currentStatus === "paid"
															? formatCurrency(0)
															: formatCurrency(invoice.total)}
													</span>
												</div>
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
																onClick={handleGeneratePdf}
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
										currentStatus === "draft"
											? "Send Invoice"
											: currentStatus === "sent" || currentStatus === "overdue"
												? "Mark as Paid"
												: currentStatus === "paid"
													? "Reopen"
													: "Update Status",
									intent:
										currentStatus === "draft"
											? ("primary" as const)
											: currentStatus === "sent" || currentStatus === "overdue"
												? ("success" as const)
												: ("outline" as const),
									icon:
										currentStatus === "draft" ? (
											<Mail className="h-4 w-4" />
										) : currentStatus === "sent" ||
										  currentStatus === "overdue" ? (
											<CheckCircle className="h-4 w-4" />
										) : (
											<Edit className="h-4 w-4" />
										),
									onClick: () => {
										if (currentStatus === "draft") {
											handleStatusChange("sent");
										} else if (
											currentStatus === "sent" ||
											currentStatus === "overdue"
										) {
											handleMarkPaid();
										} else if (currentStatus === "paid") {
											handleStatusChange("sent");
										}
									},
									position: "left" as const,
								},
							]
						: []),
					// Right side buttons - Actions
					{
						label: "Generate PDF",
						intent: "outline",
						icon: <FileText className="h-4 w-4" />,
						onClick: handleGeneratePdf,
						position: "right" as const,
					},
					{
						label: "Cancel Invoice",
						intent: "outline",
						icon: <XCircle className="h-4 w-4" />,
						onClick: () => handleStatusChange("cancelled"),
						position: "right" as const,
						className:
							currentStatus === "cancelled"
								? "hidden"
								: "text-red-600 hover:text-red-700",
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
		</div>
	);
}
