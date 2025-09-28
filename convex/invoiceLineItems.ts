import { query, mutation, QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { getCurrentUserOrgId } from "./lib/auth";

/**
 * Invoice Line Item operations with embedded CRUD helpers
 * All invoice line item-specific logic lives in this file for better organization
 */

// Invoice Line Item-specific helper functions

/**
 * Get an invoice line item by ID with organization validation
 */
async function getLineItemWithOrgValidation(
	ctx: QueryCtx | MutationCtx,
	id: Id<"invoiceLineItems">
): Promise<Doc<"invoiceLineItems"> | null> {
	const userOrgId = await getCurrentUserOrgId(ctx);
	const lineItem = await ctx.db.get(id);

	if (!lineItem) {
		return null;
	}

	if (lineItem.orgId !== userOrgId) {
		throw new Error("Invoice line item does not belong to your organization");
	}

	return lineItem;
}

/**
 * Get an invoice line item by ID, throwing if not found
 */
async function getLineItemOrThrow(
	ctx: QueryCtx | MutationCtx,
	id: Id<"invoiceLineItems">
): Promise<Doc<"invoiceLineItems">> {
	const lineItem = await getLineItemWithOrgValidation(ctx, id);
	if (!lineItem) {
		throw new Error("Invoice line item not found");
	}
	return lineItem;
}

/**
 * Validate invoice exists and belongs to user's org
 */
async function validateInvoiceAccess(
	ctx: QueryCtx | MutationCtx,
	invoiceId: Id<"invoices">
): Promise<void> {
	const userOrgId = await getCurrentUserOrgId(ctx);
	const invoice = await ctx.db.get(invoiceId);

	if (!invoice) {
		throw new Error("Invoice not found");
	}

	if (invoice.orgId !== userOrgId) {
		throw new Error("Invoice does not belong to your organization");
	}
}

/**
 * Create an invoice line item with automatic orgId assignment
 */
async function createLineItemWithOrg(
	ctx: MutationCtx,
	data: Omit<Doc<"invoiceLineItems">, "_id" | "_creationTime" | "orgId">
): Promise<Id<"invoiceLineItems">> {
	const userOrgId = await getCurrentUserOrgId(ctx);

	// Validate invoice access
	await validateInvoiceAccess(ctx, data.invoiceId);

	const lineItemData = {
		...data,
		orgId: userOrgId,
	};

	return await ctx.db.insert("invoiceLineItems", lineItemData);
}

/**
 * Update an invoice line item with validation
 */
async function updateLineItemWithValidation(
	ctx: MutationCtx,
	id: Id<"invoiceLineItems">,
	updates: Partial<Doc<"invoiceLineItems">>
): Promise<void> {
	// Validate line item exists and belongs to user's org
	await getLineItemOrThrow(ctx, id);

	// If invoiceId is being updated, validate the new invoice
	if (updates.invoiceId) {
		await validateInvoiceAccess(ctx, updates.invoiceId);
	}

	// Update the line item
	await ctx.db.patch(id, updates);
}

// Define specific types for invoice line item operations
type InvoiceLineItemDocument = Doc<"invoiceLineItems">;
type InvoiceLineItemId = Id<"invoiceLineItems">;

/**
 * Get all line items for a specific invoice
 */
// TODO: Candidate for deletion if confirmed unused.
export const listByInvoice = query({
	args: { invoiceId: v.id("invoices") },
	handler: async (ctx, args): Promise<InvoiceLineItemDocument[]> => {
		await validateInvoiceAccess(ctx, args.invoiceId);

		const lineItems = await ctx.db
			.query("invoiceLineItems")
			.withIndex("by_invoice", (q) => q.eq("invoiceId", args.invoiceId))
			.collect();

		// Sort by sortOrder
		return lineItems.sort((a, b) => a.sortOrder - b.sortOrder);
	},
});

/**
 * Get all line items for the current user's organization
 */
// TODO: Candidate for deletion if confirmed unused.
export const list = query({
	args: {},
	handler: async (ctx): Promise<InvoiceLineItemDocument[]> => {
		const userOrgId = await getCurrentUserOrgId(ctx);

		return await ctx.db
			.query("invoiceLineItems")
			.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
			.collect();
	},
});

/**
 * Get a specific invoice line item by ID
 */
// TODO: Candidate for deletion if confirmed unused.
export const get = query({
	args: { id: v.id("invoiceLineItems") },
	handler: async (ctx, args): Promise<InvoiceLineItemDocument | null> => {
		return await getLineItemWithOrgValidation(ctx, args.id);
	},
});

/**
 * Create a new invoice line item
 */
// TODO: Candidate for deletion if confirmed unused.
export const create = mutation({
	args: {
		invoiceId: v.id("invoices"),
		description: v.string(),
		quantity: v.number(),
		unitPrice: v.number(),
		sortOrder: v.number(),
	},
	handler: async (ctx, args): Promise<InvoiceLineItemId> => {
		// Validate required fields
		if (!args.description.trim()) {
			throw new Error("Description is required");
		}

		// Validate numeric values
		if (args.quantity <= 0) {
			throw new Error("Quantity must be positive");
		}

		if (args.unitPrice < 0) {
			throw new Error("Unit price cannot be negative");
		}

		if (args.sortOrder < 0) {
			throw new Error("Sort order cannot be negative");
		}

		// Calculate total
		const total = args.quantity * args.unitPrice;

		const lineItemId = await createLineItemWithOrg(ctx, {
			...args,
			total,
		});

		return lineItemId;
	},
});

/**
 * Update an invoice line item
 */
// TODO: Candidate for deletion if confirmed unused.
export const update = mutation({
	args: {
		id: v.id("invoiceLineItems"),
		invoiceId: v.optional(v.id("invoices")),
		description: v.optional(v.string()),
		quantity: v.optional(v.number()),
		unitPrice: v.optional(v.number()),
		sortOrder: v.optional(v.number()),
	},
	handler: async (ctx, args): Promise<InvoiceLineItemId> => {
		const { id, ...updates } = args;

		// Validate fields if being updated
		if (updates.description !== undefined && !updates.description.trim()) {
			throw new Error("Description cannot be empty");
		}

		if (updates.quantity !== undefined && updates.quantity <= 0) {
			throw new Error("Quantity must be positive");
		}

		if (updates.unitPrice !== undefined && updates.unitPrice < 0) {
			throw new Error("Unit price cannot be negative");
		}

		if (updates.sortOrder !== undefined && updates.sortOrder < 0) {
			throw new Error("Sort order cannot be negative");
		}

		// Filter out undefined values
		const filteredUpdates = Object.fromEntries(
			Object.entries(updates).filter(([, value]) => value !== undefined)
		) as Partial<InvoiceLineItemDocument>;

		if (Object.keys(filteredUpdates).length === 0) {
			throw new Error("No valid updates provided");
		}

		// Get current line item to calculate new total if needed
		const currentLineItem = await getLineItemOrThrow(ctx, id);

		// Recalculate total if quantity or unit price changed
		const quantity = filteredUpdates.quantity ?? currentLineItem.quantity;
		const unitPrice = filteredUpdates.unitPrice ?? currentLineItem.unitPrice;

		if (
			filteredUpdates.quantity !== undefined ||
			filteredUpdates.unitPrice !== undefined
		) {
			filteredUpdates.total = quantity * unitPrice;
		}

		await updateLineItemWithValidation(ctx, id, filteredUpdates);

		return id;
	},
});

/**
 * Delete an invoice line item
 */
// TODO: Candidate for deletion if confirmed unused.
export const remove = mutation({
	args: { id: v.id("invoiceLineItems") },
	handler: async (ctx, args): Promise<InvoiceLineItemId> => {
		await getLineItemOrThrow(ctx, args.id); // Validate access
		await ctx.db.delete(args.id);
		return args.id;
	},
});

/**
 * Bulk create invoice line items
 */
// TODO: Candidate for deletion if confirmed unused.
export const bulkCreate = mutation({
	args: {
		invoiceId: v.id("invoices"),
		lineItems: v.array(
			v.object({
				description: v.string(),
				quantity: v.number(),
				unitPrice: v.number(),
				sortOrder: v.number(),
			})
		),
	},
	handler: async (ctx, args): Promise<InvoiceLineItemId[]> => {
		// Validate invoice access once
		await validateInvoiceAccess(ctx, args.invoiceId);

		const userOrgId = await getCurrentUserOrgId(ctx);
		const createdIds: InvoiceLineItemId[] = [];

		for (const itemData of args.lineItems) {
			// Validate each item
			if (!itemData.description.trim()) {
				throw new Error("All descriptions are required");
			}

			if (itemData.quantity <= 0) {
				throw new Error("All quantities must be positive");
			}

			if (itemData.unitPrice < 0) {
				throw new Error("Unit price cannot be negative");
			}

			// Calculate total and create item
			const total = itemData.quantity * itemData.unitPrice;

			const lineItemId = await ctx.db.insert("invoiceLineItems", {
				...itemData,
				invoiceId: args.invoiceId,
				orgId: userOrgId,
				total,
			});

			createdIds.push(lineItemId);
		}

		return createdIds;
	},
});

/**
 * Reorder invoice line items
 */
// TODO: Candidate for deletion if confirmed unused.
export const reorder = mutation({
	args: {
		invoiceId: v.id("invoices"),
		lineItemIds: v.array(v.id("invoiceLineItems")),
	},
	handler: async (ctx, args): Promise<void> => {
		await validateInvoiceAccess(ctx, args.invoiceId);

		// Validate that all line items belong to the invoice
		for (const lineItemId of args.lineItemIds) {
			const lineItem = await getLineItemOrThrow(ctx, lineItemId);
			if (lineItem.invoiceId !== args.invoiceId) {
				throw new Error("All line items must belong to the specified invoice");
			}
		}

		// Update sort order for each item
		for (let i = 0; i < args.lineItemIds.length; i++) {
			await ctx.db.patch(args.lineItemIds[i], {
				sortOrder: i,
			});
		}
	},
});

/**
 * Duplicate an invoice line item
 */
// TODO: Candidate for deletion if confirmed unused.
export const duplicate = mutation({
	args: { id: v.id("invoiceLineItems") },
	handler: async (ctx, args): Promise<InvoiceLineItemId> => {
		const originalItem = await getLineItemOrThrow(ctx, args.id);

		// Get the highest sort order for the invoice to append the duplicate
		const allItems = await ctx.db
			.query("invoiceLineItems")
			.withIndex("by_invoice", (q) => q.eq("invoiceId", originalItem.invoiceId))
			.collect();

		const maxSortOrder = Math.max(
			...allItems.map((item) => item.sortOrder),
			-1
		);

		// Create duplicate with incremented sort order
		const duplicateId = await ctx.db.insert("invoiceLineItems", {
			invoiceId: originalItem.invoiceId,
			orgId: originalItem.orgId,
			description: `${originalItem.description} (Copy)`,
			quantity: originalItem.quantity,
			unitPrice: originalItem.unitPrice,
			total: originalItem.total,
			sortOrder: maxSortOrder + 1,
		});

		return duplicateId;
	},
});

/**
 * Get invoice line item statistics
 */
// TODO: Candidate for deletion if confirmed unused.
export const getStats = query({
	args: { invoiceId: v.id("invoices") },
	handler: async (ctx, args) => {
		await validateInvoiceAccess(ctx, args.invoiceId);

		const lineItems = await ctx.db
			.query("invoiceLineItems")
			.withIndex("by_invoice", (q) => q.eq("invoiceId", args.invoiceId))
			.collect();

		const stats = {
			totalItems: lineItems.length,
			totalAmount: 0,
			averageUnitPrice: 0,
			totalQuantity: 0,
			highestAmount: 0,
			lowestAmount: Number.MAX_VALUE,
		};

		let totalUnitPrice = 0;

		lineItems.forEach((item: InvoiceLineItemDocument) => {
			stats.totalAmount += item.total;
			stats.totalQuantity += item.quantity;
			totalUnitPrice += item.unitPrice;

			if (item.total > stats.highestAmount) {
				stats.highestAmount = item.total;
			}

			if (item.total < stats.lowestAmount) {
				stats.lowestAmount = item.total;
			}
		});

		if (lineItems.length > 0) {
			stats.averageUnitPrice = totalUnitPrice / lineItems.length;
		} else {
			stats.lowestAmount = 0;
		}

		return stats;
	},
});
