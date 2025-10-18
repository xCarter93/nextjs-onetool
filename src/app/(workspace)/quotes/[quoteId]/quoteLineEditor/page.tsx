"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { useToast } from "@/hooks/use-toast";
import type { Id } from "../../../../../../convex/_generated/dataModel";
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
import { StyledButton } from "@/components/ui/styled-button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
	FileText,
	ArrowLeft,
	Plus,
	Save,
	Trash2,
	Calculator,
	Edit,
	Check,
	X,
	Eye,
} from "lucide-react";
import { SKUSelector } from "@/components/sku-selector";

type LineItem = {
	_id: Id<"quoteLineItems"> | string; // Allow temp IDs for new items
	description: string;
	quantity: number;
	unit: string;
	rate: number;
	amount: number;
	cost?: number;
	sortOrder: number;
	optional?: boolean;
	isNew?: boolean; // Track if this is a new item not yet saved
};

const TEMP_LINE_ITEM_ID_PREFIX = "temp-";
const isTempLineItemId = (id: Id<"quoteLineItems"> | string): id is string =>
	typeof id === "string" && id.startsWith(TEMP_LINE_ITEM_ID_PREFIX);

const isTempLineItem = (item: LineItem) =>
	item.isNew || isTempLineItemId(item._id);

// Status formatting functions
const formatStatus = (status: string) => {
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

const formatCurrency = (amount: number) => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
};

const statusVariant = (status: string) => {
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

export default function QuoteLineEditorPage() {
	const router = useRouter();
	const params = useParams();
	const toast = useToast();
	const quoteId = params.quoteId as Id<"quotes">;

	// Fetch data from Convex
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

	// Mutations
	const updateQuote = useMutation(api.quotes.update);
	const bulkCreateLineItems = useMutation(api.quoteLineItems.bulkCreate);
	const updateLineItem = useMutation(api.quoteLineItems.update);
	const deleteLineItem = useMutation(api.quoteLineItems.remove);

	// Local state
	const [editingId, setEditingId] = useState<
		Id<"quoteLineItems"> | string | null
	>(null);
	const [hasChanges, setHasChanges] = useState(false);
	const [localLineItems, setLocalLineItems] = useState<LineItem[]>([]);
	const [nextTempId, setNextTempId] = useState(1);

	// PDF visibility controls
	const [pdfSettings, setPdfSettings] = useState({
		showQuantities: true,
		showUnitPrices: true,
		showLineItemTotals: true,
		showTotals: true,
	});

	// Initialize PDF settings from quote data
	useEffect(() => {
		if (quote?.pdfSettings) {
			setPdfSettings({
				showQuantities: quote.pdfSettings.showQuantities ?? true,
				showUnitPrices: quote.pdfSettings.showUnitPrices ?? true,
				showLineItemTotals: quote.pdfSettings.showLineItemTotals ?? true,
				showTotals: quote.pdfSettings.showTotals ?? true,
			});
		}
	}, [quote]);

	// Tax and discount state
	const [discount, setDiscount] = useState<{
		enabled: boolean;
		amount: number;
		type: "percentage" | "fixed";
	}>({
		enabled: false,
		amount: 0,
		type: "percentage",
	});
	const [tax, setTax] = useState<{ enabled: boolean; rate: number }>({
		enabled: false,
		rate: 0,
	});

	// Initialize discount and tax state from quote data
	useEffect(() => {
		if (quote) {
			setDiscount({
				enabled: quote.discountEnabled || false,
				amount: quote.discountAmount || 0,
				type: quote.discountType || "percentage",
			});
			setTax({
				enabled: quote.taxEnabled || false,
				rate: quote.taxRate || 0,
			});
		}
	}, [quote]);

	// Combine saved line items with local ones
	const allLineItems = useMemo(() => {
		if (!lineItems) return localLineItems;

		// Convert saved items to our LineItem type
		const savedItems: LineItem[] = lineItems.map((item) => ({
			...item,
			isNew: false,
		}));

		// Combine and sort by sortOrder
		return [...savedItems, ...localLineItems].sort(
			(a, b) => a.sortOrder - b.sortOrder
		);
	}, [lineItems, localLineItems]);

	// Calculate totals (must be before early returns)
	const totals = useMemo(() => {
		if (allLineItems.length === 0)
			return {
				subtotal: 0,
				discountAmount: 0,
				afterDiscount: 0,
				taxAmount: 0,
				total: 0,
				totalCosts: 0,
				margin: 0,
				marginPercentage: 0,
			};

		const subtotal = allLineItems.reduce((sum, item) => sum + item.amount, 0);
		const totalCosts = allLineItems.reduce(
			(sum, item) => sum + (item.cost ? item.quantity * item.cost : 0),
			0
		);

		// Calculate discount
		const discountAmount = discount.enabled
			? discount.type === "percentage"
				? (subtotal * discount.amount) / 100
				: discount.amount
			: 0;

		const afterDiscount = subtotal - discountAmount;

		// Calculate tax
		const taxAmount = tax.enabled ? (afterDiscount * tax.rate) / 100 : 0;

		const total = afterDiscount + taxAmount;
		const margin = subtotal - totalCosts;
		const marginPercentage = subtotal > 0 ? (margin / subtotal) * 100 : 0;

		return {
			subtotal,
			discountAmount,
			afterDiscount,
			taxAmount,
			total,
			totalCosts,
			margin,
			marginPercentage,
		};
	}, [allLineItems, discount, tax]);

	// Loading state
	if (quote === undefined) {
		return (
			<div className="relative px-6 pt-8 pb-20">
				<div className="animate-pulse space-y-8">
					<div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
					<div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
				</div>
			</div>
		);
	}

	// Quote not found
	if (quote === null) {
		return (
			<div className="relative px-6 pt-8 pb-20 flex flex-col items-center justify-center h-96 space-y-4">
				<div className="text-6xl">📄</div>
				<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
					Quote Not Found
				</h1>
				<p className="text-gray-600 dark:text-gray-400 text-center">
					The quote you&apos;re looking for doesn&apos;t exist or you don&apos;t
					have permission to view it.
				</p>
				<Button onClick={() => router.push("/quotes")}>Back to Quotes</Button>
			</div>
		);
	}

	const handleAddLineItem = () => {
		const tempId = `${TEMP_LINE_ITEM_ID_PREFIX}${nextTempId}`;
		const newSortOrder = allLineItems.length;

		const newLineItem: LineItem = {
			_id: tempId,
			description: "",
			quantity: 1,
			unit: "hour",
			rate: 0,
			cost: 0,
			amount: 0,
			sortOrder: newSortOrder,
			isNew: true,
		};

		setLocalLineItems((prev) => [...prev, newLineItem]);
		setEditingId(tempId);
		setNextTempId((prev) => prev + 1);
		setHasChanges(true);
	};

	const handleEditLineItem = (id: Id<"quoteLineItems"> | string) => {
		setEditingId(id);
	};

	const handleSaveLineItem = async (item: LineItem) => {
		if (isTempLineItem(item)) {
			// Update local item
			setLocalLineItems((prev) =>
				prev.map((localItem) =>
					localItem._id === item._id
						? { ...item, amount: item.quantity * item.rate }
						: localItem
				)
			);
			setEditingId(null);
			setHasChanges(true);
		} else {
			// Update existing item in database
			try {
				await updateLineItem({
					id: item._id as Id<"quoteLineItems">,
					description: item.description,
					quantity: item.quantity,
					unit: item.unit,
					rate: item.rate,
					cost: item.cost,
				});
				setEditingId(null);
				setHasChanges(true);
			} catch (error) {
				console.error("Failed to save line item:", error);
				toast.error("Error", "Failed to save line item. Please try again.");
			}
		}
	};

	const handleDeleteLineItem = async (id: Id<"quoteLineItems"> | string) => {
		if (isTempLineItemId(id)) {
			// Remove local item
			setLocalLineItems((prev) => prev.filter((item) => item._id !== id));
			setHasChanges(true);
			if (editingId === id) {
				setEditingId(null);
			}
		} else {
			// Delete from database
			try {
				await deleteLineItem({ id });
				if (editingId === id) {
					setEditingId(null);
				}
				setHasChanges(true);
			} catch (error) {
				console.error("Failed to delete line item:", error);
				toast.error("Error", "Failed to delete line item. Please try again.");
			}
		}
	};

	const handleSaveQuote = async () => {
		try {
			// First, save any new line items to the database
			if (localLineItems.length > 0) {
				const newLineItemsData = localLineItems.map((item) => ({
					description: item.description || "New Item", // Ensure description is not empty
					quantity: item.quantity,
					unit: item.unit || "hour",
					rate: item.rate,
					cost: item.cost,
					sortOrder: item.sortOrder,
					optional: item.optional,
				}));

				await bulkCreateLineItems({
					quoteId,
					lineItems: newLineItemsData,
				});

				// Clear local items after successful save
				setLocalLineItems([]);
			}

			// Update quote totals and settings
			await updateQuote({
				id: quoteId,
				subtotal: totals.subtotal,
				total: totals.total,
				discountEnabled: discount.enabled,
				discountAmount: discount.enabled ? discount.amount : undefined,
				discountType: discount.enabled ? discount.type : undefined,
				taxEnabled: tax.enabled,
				taxRate: tax.enabled ? tax.rate : undefined,
				taxAmount: tax.enabled ? totals.taxAmount : undefined,
				pdfSettings: {
					showQuantities: pdfSettings.showQuantities,
					showUnitPrices: pdfSettings.showUnitPrices,
					showLineItemTotals: pdfSettings.showLineItemTotals,
					showTotals: pdfSettings.showTotals,
				},
			});

			setHasChanges(false);
			toast.success("Quote Saved", "Quote has been successfully updated!");
			router.push(`/quotes/${quoteId}`);
		} catch (error) {
			console.error("Failed to save quote:", error);
			toast.error("Error", "Failed to save quote. Please try again.");
		}
	};

	const handleCancel = () => {
		if (hasChanges) {
			if (
				confirm("You have unsaved changes. Are you sure you want to leave?")
			) {
				router.push(`/quotes/${quoteId}`);
			}
		} else {
			router.push(`/quotes/${quoteId}`);
		}
	};

	const handlePdfSettingChange = (
		setting: keyof typeof pdfSettings,
		checked: boolean
	) => {
		setPdfSettings((prev) => ({ ...prev, [setting]: checked }));
		setHasChanges(true);
	};

	const handleAddDiscount = () => {
		setDiscount({ enabled: true, amount: 0, type: "percentage" });
		setHasChanges(true);
	};

	const handleRemoveDiscount = () => {
		setDiscount({ enabled: false, amount: 0, type: "percentage" });
		setHasChanges(true);
	};

	const handleAddTax = () => {
		setTax({ enabled: true, rate: 0 });
		setHasChanges(true);
	};

	const handleRemoveTax = () => {
		setTax({ enabled: false, rate: 0 });
		setHasChanges(true);
	};

	return (
		<div className="relative px-6 pt-8 pb-20">
			<div className="mx-auto">
				{/* Header */}
				<div className="flex items-center justify-between mb-8">
					<div className="flex items-center gap-4">
						<Button
							intent="outline"
							size="sq-sm"
							onPress={handleCancel}
							aria-label="Go back"
						>
							<ArrowLeft className="h-4 w-4" />
						</Button>
						<div className="flex items-center gap-4">
							<div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30">
								<FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
							</div>
							<div>
								<div className="flex items-center gap-3">
									<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
										Quote Line Editor
									</h1>
									<Badge variant={statusVariant(quote.status)}>
										{formatStatus(quote.status)}
									</Badge>
								</div>
								<p className="text-muted-foreground text-sm mt-1">
									{quote.quoteNumber || `#${quote._id.slice(-6)}`} •{" "}
									{client?.companyName || "Unknown Client"} •{" "}
									{project?.title || "No Project"}
								</p>
							</div>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<StyledButton
							intent="primary"
							size="sm"
							onClick={handleSaveQuote}
							disabled={!hasChanges}
							icon={<Save className="h-4 w-4" />}
							label="Save Changes"
						/>
					</div>
				</div>

				{/* Main Content */}
				<div className="space-y-8">
					{/* Line Items Editor */}
					<div>
						<div className="bg-card dark:bg-card backdrop-blur-md border border-border dark:border-border rounded-xl shadow-lg dark:shadow-black/50 ring-1 ring-border/30 dark:ring-border/50">
							<Card className="bg-transparent border-none shadow-none ring-0">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-xl">
										<Edit className="h-5 w-5" />
										Line Items Configuration
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="overflow-hidden rounded-lg border">
										<Table>
											<TableHeader className="bg-muted sticky top-0 z-10">
												<TableRow>
													<TableHead className="w-[30%]">Description</TableHead>
													<TableHead className="w-[10%] text-center">
														Qty
													</TableHead>
													<TableHead className="w-[10%] text-center">
														Unit
													</TableHead>
													<TableHead className="w-[12%] text-right">
														Rate
													</TableHead>
													<TableHead className="w-[12%] text-right">
														<div className="flex flex-col items-end">
															<span>Cost</span>
															<span className="text-xs text-muted-foreground font-normal">
																per unit
															</span>
														</div>
													</TableHead>
													<TableHead className="w-[12%] text-right">
														Amount
													</TableHead>
													<TableHead className="w-[10%] text-center">
														Margin
													</TableHead>
													<TableHead className="w-[4%]">Actions</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{allLineItems.map((item) => (
													<LineItemRow
														key={item._id}
														item={item}
														isEditing={editingId === item._id}
														onEdit={() => handleEditLineItem(item._id)}
														onSave={handleSaveLineItem}
														onCancel={() => setEditingId(null)}
														onDelete={() => handleDeleteLineItem(item._id)}
													/>
												))}
											</TableBody>
										</Table>
									</div>

									{/* Add Line Item Button */}
									<div className="mt-6 pt-4 border-t border-border">
										<div className="flex items-center justify-between">
											<div className="text-sm text-muted-foreground">
												{allLineItems.length === 0
													? "No line items yet. Add your first item to get started."
													: `${allLineItems.length} line item${allLineItems.length !== 1 ? "s" : ""} configured`}
											</div>
											<Button
												intent="outline"
												size="sm"
												onPress={handleAddLineItem}
											>
												<Plus className="h-4 w-4 mr-2" />
												Add Line Item
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>

					{/* Quote Summary - New Layout */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						{/* Client View Settings */}
						<div className="bg-card dark:bg-card backdrop-blur-md border border-border dark:border-border rounded-xl shadow-lg dark:shadow-black/50 ring-1 ring-border/30 dark:ring-border/50">
							<Card className="bg-transparent border-none shadow-none ring-0">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-lg">
										<Eye className="h-5 w-5" />
										Client view
									</CardTitle>
									<p className="text-sm text-muted-foreground mt-1">
										Adjust what your client will see on this quote. To change
										the default for all future quotes, visit the PDF Style.
									</p>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid grid-cols-2 gap-4">
										<div className="flex items-center space-x-2">
											<Checkbox
												id="quantities"
												checked={pdfSettings.showQuantities}
												onCheckedChange={(checked) =>
													handlePdfSettingChange("showQuantities", !!checked)
												}
											/>
											<label
												htmlFor="quantities"
												className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
											>
												Quantities
											</label>
										</div>
										<div className="flex items-center space-x-2">
											<Checkbox
												id="unitPrices"
												checked={pdfSettings.showUnitPrices}
												onCheckedChange={(checked) =>
													handlePdfSettingChange("showUnitPrices", !!checked)
												}
											/>
											<label
												htmlFor="unitPrices"
												className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
											>
												Unit prices
											</label>
										</div>
										<div className="flex items-center space-x-2">
											<Checkbox
												id="lineItemTotals"
												checked={pdfSettings.showLineItemTotals}
												onCheckedChange={(checked) =>
													handlePdfSettingChange(
														"showLineItemTotals",
														!!checked
													)
												}
											/>
											<label
												htmlFor="lineItemTotals"
												className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
											>
												Line item totals
											</label>
										</div>
										<div className="flex items-center space-x-2">
											<Checkbox
												id="totals"
												checked={pdfSettings.showTotals}
												onCheckedChange={(checked) =>
													handlePdfSettingChange("showTotals", !!checked)
												}
											/>
											<label
												htmlFor="totals"
												className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
											>
												Totals
											</label>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Financial Summary */}
						<div className="bg-card dark:bg-card backdrop-blur-md border border-border dark:border-border rounded-xl shadow-lg dark:shadow-black/50 ring-1 ring-border/30 dark:ring-border/50">
							<Card className="bg-transparent border-none shadow-none ring-0">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-lg">
										<Calculator className="h-5 w-5" />
										Quote Summary
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="space-y-3">
										<div className="flex justify-between">
											<span className="text-sm text-gray-600 dark:text-gray-400">
												Subtotal:
											</span>
											<span className="text-sm font-medium">
												{formatCurrency(totals.subtotal)}
											</span>
										</div>

										{/* Discount */}
										{discount.enabled ? (
											<div className="flex justify-between items-center">
												<span className="text-sm text-gray-600 dark:text-gray-400">
													Discount:
												</span>
												<div className="flex items-center gap-2">
													<div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
														<Input
															type="number"
															value={discount.amount}
															onChange={(e) => {
																setDiscount((prev) => ({
																	...prev,
																	amount: parseFloat(e.target.value) || 0,
																}));
																setHasChanges(true);
															}}
															className="w-20 text-right h-8 text-sm border-0 rounded-none focus:ring-0 focus:border-0"
															min="0"
															step="0.01"
														/>
														<select
															value={discount.type}
															onChange={(e) => {
																setDiscount((prev) => ({
																	...prev,
																	type: e.target.value as
																		| "percentage"
																		| "fixed",
																}));
																setHasChanges(true);
															}}
															className="text-sm border-0 bg-background px-2 py-2 h-8 rounded-none focus:ring-0 focus:border-0 cursor-pointer"
														>
															<option value="percentage">%</option>
															<option value="fixed">$</option>
														</select>
													</div>
													<span className="text-sm font-medium text-red-600 dark:text-red-400 min-w-[60px] text-right">
														-{formatCurrency(totals.discountAmount)}
													</span>
													<Button
														intent="outline"
														size="sq-sm"
														onPress={handleRemoveDiscount}
														aria-label="Remove discount"
														className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
													>
														<X className="h-3 w-3" />
													</Button>
												</div>
											</div>
										) : (
											<div className="flex justify-between items-center">
												<span className="text-sm text-gray-600 dark:text-gray-400">
													Discount:
												</span>
												<Button
													intent="outline"
													size="sm"
													onPress={handleAddDiscount}
													className="text-green-600 dark:text-green-400 border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/20"
												>
													Add Discount
												</Button>
											</div>
										)}

										{/* Tax */}
										{tax.enabled ? (
											<div className="flex justify-between items-center">
												<span className="text-sm text-gray-600 dark:text-gray-400">
													Tax:
												</span>
												<div className="flex items-center gap-2">
													<div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
														<Input
															type="number"
															value={tax.rate}
															onChange={(e) => {
																setTax((prev) => ({
																	...prev,
																	rate: parseFloat(e.target.value) || 0,
																}));
																setHasChanges(true);
															}}
															className="w-20 text-right h-8 text-sm border-0 rounded-none focus:ring-0 focus:border-0"
															min="0"
															step="0.01"
															max="100"
														/>
														<span className="text-sm text-gray-600 dark:text-gray-400 px-2 py-2 h-8 flex items-center bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
															%
														</span>
													</div>
													<span className="text-sm font-medium min-w-[60px] text-right">
														{formatCurrency(totals.taxAmount)}
													</span>
													<Button
														intent="outline"
														size="sq-sm"
														onPress={handleRemoveTax}
														aria-label="Remove tax"
														className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
													>
														<X className="h-3 w-3" />
													</Button>
												</div>
											</div>
										) : (
											<div className="flex justify-between items-center">
												<span className="text-sm text-gray-600 dark:text-gray-400">
													Tax:
												</span>
												<Button
													intent="outline"
													size="sm"
													onPress={handleAddTax}
													className="text-green-600 dark:text-green-400 border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/20"
												>
													Add Tax
												</Button>
											</div>
										)}

										<div className="border-t pt-3">
											<div className="flex justify-between">
												<span className="text-lg font-bold">Total:</span>
												<span className="text-lg font-bold text-primary">
													{formatCurrency(totals.total)}
												</span>
											</div>
										</div>

										<div className="border-t pt-3 space-y-2">
											<div className="flex justify-between">
												<span className="text-sm text-gray-600 dark:text-gray-400">
													Costs:
												</span>
												<span className="text-sm font-medium text-red-600 dark:text-red-400">
													{formatCurrency(totals.totalCosts)}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-sm text-gray-600 dark:text-gray-400">
													Estimated margin:
												</span>
												<span
													className={`text-sm font-medium ${
														totals.margin >= 0
															? "text-green-600 dark:text-green-400"
															: "text-red-600 dark:text-red-400"
													}`}
												>
													{formatCurrency(totals.margin)} (
													{totals.marginPercentage.toFixed(1)}%)
												</span>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>

					{/* Change Indicator */}
					{hasChanges && (
						<div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
							<div className="flex items-start gap-3">
								<div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
								<div>
									<p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
										Unsaved Changes
									</p>
									<p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
										Remember to save your changes before leaving this page.
									</p>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

// LineItemRow Component for inline editing
function LineItemRow({
	item,
	isEditing,
	onEdit,
	onSave,
	onCancel,
	onDelete,
}: {
	item: LineItem;
	isEditing: boolean;
	onEdit: () => void;
	onSave: (item: LineItem) => void;
	onCancel: () => void;
	onDelete: () => void;
}) {
	const [editedItem, setEditedItem] = useState<LineItem>(item);

	React.useEffect(() => {
		if (isEditing) {
			setEditedItem(item);
		}
	}, [isEditing, item]);

	const handleFieldChange = (field: keyof LineItem, value: string | number) => {
		setEditedItem((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSave = () => {
		onSave(editedItem);
	};

	if (isEditing) {
		return (
			<TableRow
				className={`bg-blue-50/50 dark:bg-blue-900/10 border-l-4 border-l-blue-500 ${item.isNew ? "bg-yellow-50/50 dark:bg-yellow-900/10" : ""}`}
			>
				<TableCell>
					<div className="flex gap-2">
						<Input
							value={editedItem.description}
							onChange={(e) => handleFieldChange("description", e.target.value)}
							placeholder="Enter description..."
							className="flex-1"
						/>
						<SKUSelector
							onSelect={(sku) => {
								setEditedItem((prev) => ({
									...prev,
									description: sku.name,
									unit: sku.unit,
									rate: sku.rate,
									cost: sku.cost || 0,
								}));
							}}
							disabled={false}
						/>
					</div>
				</TableCell>
				<TableCell>
					<Input
						type="number"
						value={editedItem.quantity}
						onChange={(e) =>
							handleFieldChange("quantity", parseInt(e.target.value) || 0)
						}
						className="w-full text-center"
						min="0"
					/>
				</TableCell>
				<TableCell>
					<Input
						value={editedItem.unit}
						onChange={(e) => handleFieldChange("unit", e.target.value)}
						className="w-full text-center"
						placeholder="hour"
					/>
				</TableCell>
				<TableCell>
					<Input
						type="number"
						value={editedItem.rate}
						onChange={(e) =>
							handleFieldChange("rate", parseFloat(e.target.value) || 0)
						}
						className="w-full text-right"
						min="0"
						step="0.01"
					/>
				</TableCell>
				<TableCell>
					<Input
						type="number"
						value={editedItem.cost || 0}
						onChange={(e) =>
							handleFieldChange("cost", parseFloat(e.target.value) || 0)
						}
						className="w-full text-right"
						min="0"
						step="0.01"
						placeholder="0.00"
					/>
				</TableCell>
				<TableCell className="text-right font-medium">
					{formatCurrency(editedItem.quantity * editedItem.rate)}
				</TableCell>
				<TableCell className="text-center">
					{(() => {
						const itemAmount = editedItem.quantity * editedItem.rate;
						const itemCost = editedItem.quantity * (editedItem.cost || 0);
						const itemMargin = itemAmount - itemCost;
						const marginPercent =
							itemAmount > 0 ? (itemMargin / itemAmount) * 100 : 0;
						return (
							<span
								className={`text-xs font-medium ${
									marginPercent >= 0
										? "text-green-600 dark:text-green-400"
										: "text-red-600 dark:text-red-400"
								}`}
							>
								{marginPercent.toFixed(1)}%
							</span>
						);
					})()}
				</TableCell>
				<TableCell>
					<div className="flex gap-1">
						<Button
							intent="outline"
							size="sq-sm"
							onPress={handleSave}
							aria-label="Save"
						>
							<Check className="h-3 w-3" />
						</Button>
						<Button
							intent="outline"
							size="sq-sm"
							onPress={onCancel}
							aria-label="Cancel"
						>
							<X className="h-3 w-3" />
						</Button>
					</div>
				</TableCell>
			</TableRow>
		);
	}

	return (
		<TableRow
			className={`hover:bg-muted/50 ${item.isNew ? "bg-yellow-50/30 dark:bg-yellow-900/20 border-l-4 border-l-yellow-400" : ""}`}
		>
			<TableCell className="font-medium">
				{item.description}
				{item.isNew && (
					<span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
						Unsaved
					</span>
				)}
			</TableCell>
			<TableCell className="text-center">{item.quantity}</TableCell>
			<TableCell className="text-center">{item.unit}</TableCell>
			<TableCell className="text-right">{formatCurrency(item.rate)}</TableCell>
			<TableCell className="text-right text-muted-foreground">
				{item.cost ? formatCurrency(item.cost) : "-"}
			</TableCell>
			<TableCell className="text-right font-medium">
				{formatCurrency(item.amount)}
			</TableCell>
			<TableCell className="text-center">
				{(() => {
					const itemCost = item.quantity * (item.cost || 0);
					const itemMargin = item.amount - itemCost;
					const marginPercent =
						item.amount > 0 ? (itemMargin / item.amount) * 100 : 0;
					return (
						<span
							className={`text-xs font-medium ${
								marginPercent >= 0
									? "text-green-600 dark:text-green-400"
									: "text-red-600 dark:text-red-400"
							}`}
						>
							{marginPercent.toFixed(1)}%
						</span>
					);
				})()}
			</TableCell>
			<TableCell>
				<div className="flex gap-1">
					<Button
						intent="outline"
						size="sq-sm"
						onPress={onEdit}
						aria-label="Edit"
					>
						<Edit className="h-3 w-3" />
					</Button>
					<Button
						intent="outline"
						size="sq-sm"
						onPress={onDelete}
						aria-label="Delete"
					>
						<Trash2 className="h-3 w-3" />
					</Button>
				</div>
			</TableCell>
		</TableRow>
	);
}
