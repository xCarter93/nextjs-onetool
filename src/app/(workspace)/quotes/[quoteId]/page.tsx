"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
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
} from "lucide-react";
import { StickyFormFooter } from "@/components/sticky-form-footer";
import { pdf } from "@react-pdf/renderer";
import QuotePDF from "@/components/QuotePDF";
import type { Id } from "../../../../../convex/_generated/dataModel";
import type { Id as StorageId } from "../../../../../convex/_generated/dataModel";

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
	const documentUrl = useQuery(
		api.documents.getDocumentUrl,
		latestDocument ? { id: latestDocument._id } : "skip"
	);

	// Mutations
	// const updateQuote = useMutation(api.quotes.update);
	const generateUploadUrl = useMutation(api.documents.generateUploadUrl);
	const createDocument = useMutation(api.documents.create);

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

	const handleGeneratePdf = async () => {
		try {
			if (!quote || !lineItems) return;
			const loadingId = toast.loading(
				"Generating PDF",
				"Rendering and uploading…"
			);
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
			const blob = await pdf(element).toBlob();
			const uploadUrl = await generateUploadUrl({});
			const res = await fetch(uploadUrl, {
				method: "POST",
				headers: { "Content-Type": "application/pdf" },
				body: blob,
			});
			if (!res.ok) throw new Error("Failed to upload PDF");
			const { storageId } = await res.json();
			await createDocument({
				documentType: "quote",
				documentId: quote._id,
				storageId: storageId as unknown as StorageId<"_storage">,
			});
			toast.removeToast(loadingId);
			toast.success("PDF generated", "Your quote PDF is ready.");
		} catch (error) {
			console.error(error);
			const message = error instanceof Error ? error.message : "Unknown error";
			toast.error("PDF generation failed", message);
		}
	};

	return (
		<div className="min-h-[100vh] flex-1 md:min-h-min">
			<div className="relative bg-gradient-to-br from-background via-muted/30 to-muted/60 dark:from-background dark:via-muted/20 dark:to-muted/40 min-h-[100vh] rounded-xl">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(120,119,198,0.08),transparent_50%)] rounded-xl" />

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
												<Button intent="outline" size="sm">
													<Edit className="h-4 w-4" />
												</Button>
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
												{/* Client Information */}
												<div className="lg:col-span-2 space-y-4">
													{client ? (
														<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
															<div className="space-y-4">
																<div>
																	<p className="text-sm font-medium text-gray-900 dark:text-white">
																		{client.companyName}
																	</p>
																	<p className="text-sm text-gray-600 dark:text-gray-400">
																		{client.industry || "No industry specified"}
																	</p>
																</div>
																{/* Client contact info would come from clientContacts table */}
																<div className="text-sm text-gray-500 dark:text-gray-400">
																	Contact details available in client profile
																</div>
															</div>
															<div>
																{/* Address would come from clientProperties table */}
																<div className="text-sm text-gray-500 dark:text-gray-400">
																	Address details available in client profile
																</div>
															</div>
														</div>
													) : (
														<div className="p-4 border-2 border-dashed border-gray-300 dark:border-white/20 rounded-lg text-center">
															<p className="text-sm text-gray-500 dark:text-gray-400">
																Client information not available
															</p>
														</div>
													)}
												</div>
												{/* Associated Project */}
												<div className="lg:col-span-1">
													<div className="border-l border-gray-200 dark:border-gray-700 pl-6 lg:border-l-0 lg:pl-0 lg:border-t lg:pt-6">
														<div className="flex items-center gap-2 mb-3">
															<FolderOpen className="h-4 w-4 text-gray-400" />
															<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
																Associated Project:
															</span>
														</div>
														{project ? (
															<div>
																<p className="text-sm font-medium text-gray-900 dark:text-white">
																	{project.title}
																</p>
																<p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
																	{project.description ||
																		"No description available"}
																</p>
															</div>
														) : (
															<div>
																<p className="text-sm text-gray-500 dark:text-gray-400">
																	No project linked
																</p>
															</div>
														)}
													</div>
												</div>
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
																	-{formatCurrency(quote.discountAmount)}
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
												<Button intent="outline" size="sm">
													<Edit className="h-4 w-4" />
												</Button>
											</CardTitle>
										</CardHeader>
										<CardContent>
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
												{quote.validUntil && (
													<div className="flex justify-between">
														<span className="text-sm text-gray-600 dark:text-gray-400">
															Valid Until:
														</span>
														<span className="text-sm text-gray-900 dark:text-white">
															{new Date(quote.validUntil).toLocaleDateString()}
														</span>
													</div>
												)}
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
												<CardTitle className="text-lg">Generated PDF</CardTitle>
												<FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
											</CardHeader>
											<CardContent>
												<div className="text-center py-6">
													{documentUrl ? (
														<div className="space-y-4">
															<div className="h-48 bg-gray-50 dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
																<iframe
																	src={documentUrl}
																	className="w-full h-full"
																	title="PDF Preview"
																	style={{ border: "none" }}
																/>
															</div>
															<div className="flex gap-2">
																<a
																	href={documentUrl}
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
																		View PDF
																	</Button>
																</a>
																<a
																	href={documentUrl}
																	download
																	className="flex-1"
																>
																	<Button
																		intent="outline"
																		size="sm"
																		className="w-full"
																	>
																		<Download className="h-4 w-4 mr-2" />
																		Download
																	</Button>
																</a>
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
																onPress={handleGeneratePdf}
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
					{
						label: "Send to Client",
						intent: "outline",
						icon: <Mail className="h-4 w-4" />,
						onClick: () => {
							// Handle send to client
							console.log("Send to client");
						},
					},
					{
						label: "Generate PDF",
						intent: "outline",
						icon: <FileText className="h-4 w-4" />,
						onClick: handleGeneratePdf,
					},
					{
						label: "Convert to Invoice",
						intent: "primary",
						onClick: () => {
							// Handle conversion to invoice
							console.log("Convert to invoice");
						},
					},
					{
						label: "More",
						intent: "outline",
						icon: <MoreHorizontal className="h-4 w-4" />,
						onClick: () => {
							// Handle more options
							console.log("More options");
						},
					},
				]}
			/>
		</div>
	);
}
