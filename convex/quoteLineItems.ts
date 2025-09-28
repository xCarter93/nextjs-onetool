import { query, mutation, QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { getCurrentUserOrgId } from "./lib/auth";

/**
 * Quote Line Item operations with embedded CRUD helpers
 * All quote line item-specific logic lives in this file for better organization
 */

// Quote Line Item-specific helper functions

/**
 * Get a quote line item by ID with organization validation
 */
async function getLineItemWithOrgValidation(
	ctx: QueryCtx | MutationCtx,
	id: Id<"quoteLineItems">
): Promise<Doc<"quoteLineItems"> | null> {
	const userOrgId = await getCurrentUserOrgId(ctx);
	const lineItem = await ctx.db.get(id);

	if (!lineItem) {
		return null;
	}

	if (lineItem.orgId !== userOrgId) {
		throw new Error("Quote line item does not belong to your organization");
	}

	return lineItem;
}

/**
 * Get a quote line item by ID, throwing if not found
 */
async function getLineItemOrThrow(
	ctx: QueryCtx | MutationCtx,
	id: Id<"quoteLineItems">
): Promise<Doc<"quoteLineItems">> {
	const lineItem = await getLineItemWithOrgValidation(ctx, id);
	if (!lineItem) {
		throw new Error("Quote line item not found");
	}
	return lineItem;
}

/**
 * Validate quote exists and belongs to user's org
 */
async function validateQuoteAccess(
	ctx: QueryCtx | MutationCtx,
	quoteId: Id<"quotes">
): Promise<void> {
	const userOrgId = await getCurrentUserOrgId(ctx);
	const quote = await ctx.db.get(quoteId);

	if (!quote) {
		throw new Error("Quote not found");
	}

	if (quote.orgId !== userOrgId) {
		throw new Error("Quote does not belong to your organization");
	}
}

/**
 * Create a quote line item with automatic orgId assignment
 */
async function createLineItemWithOrg(
	ctx: MutationCtx,
	data: Omit<Doc<"quoteLineItems">, "_id" | "_creationTime" | "orgId">
): Promise<Id<"quoteLineItems">> {
	const userOrgId = await getCurrentUserOrgId(ctx);

	// Validate quote access
	await validateQuoteAccess(ctx, data.quoteId);

	const lineItemData = {
		...data,
		orgId: userOrgId,
	};

	return await ctx.db.insert("quoteLineItems", lineItemData);
}

/**
 * Update a quote line item with validation
 */
async function updateLineItemWithValidation(
	ctx: MutationCtx,
	id: Id<"quoteLineItems">,
	updates: Partial<Doc<"quoteLineItems">>
): Promise<void> {
	// Validate line item exists and belongs to user's org
	await getLineItemOrThrow(ctx, id);

	// If quoteId is being updated, validate the new quote
	if (updates.quoteId) {
		await validateQuoteAccess(ctx, updates.quoteId);
	}

	// Update the line item
	await ctx.db.patch(id, updates);
}

// Define specific types for quote line item operations
type QuoteLineItemDocument = Doc<"quoteLineItems">;
type QuoteLineItemId = Id<"quoteLineItems">;

/**
 * Get all line items for a specific quote
 */
export const listByQuote = query({
	args: { quoteId: v.id("quotes") },
	handler: async (ctx, args): Promise<QuoteLineItemDocument[]> => {
		await validateQuoteAccess(ctx, args.quoteId);

		const lineItems = await ctx.db
			.query("quoteLineItems")
			.withIndex("by_quote", (q) => q.eq("quoteId", args.quoteId))
			.collect();

		// Sort by sortOrder
		return lineItems.sort((a, b) => a.sortOrder - b.sortOrder);
	},
});

/**
 * Get all line items for the current user's organization
 */
export const list = query({
	args: {},
	handler: async (ctx): Promise<QuoteLineItemDocument[]> => {
		const userOrgId = await getCurrentUserOrgId(ctx);

		return await ctx.db
			.query("quoteLineItems")
			.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
			.collect();
	},
});

/**
 * Get a specific quote line item by ID
 */
// TODO: Candidate for deletion if confirmed unused.
export const get = query({
	args: { id: v.id("quoteLineItems") },
	handler: async (ctx, args): Promise<QuoteLineItemDocument | null> => {
		return await getLineItemWithOrgValidation(ctx, args.id);
	},
});

/**
 * Create a new quote line item
 */
// TODO: Candidate for deletion if confirmed unused.
export const create = mutation({
	args: {
		quoteId: v.id("quotes"),
		description: v.string(),
		quantity: v.number(),
		unit: v.string(),
		rate: v.number(),
		cost: v.optional(v.number()),
		sortOrder: v.number(),
		optional: v.optional(v.boolean()),
	},
	handler: async (ctx, args): Promise<QuoteLineItemId> => {
		// Validate required fields
		if (!args.description.trim()) {
			throw new Error("Description is required");
		}

		if (!args.unit.trim()) {
			throw new Error("Unit is required");
		}

		// Validate numeric values
		if (args.quantity <= 0) {
			throw new Error("Quantity must be positive");
		}

		if (args.rate < 0) {
			throw new Error("Rate cannot be negative");
		}

		if (args.cost !== undefined && args.cost < 0) {
			throw new Error("Cost cannot be negative");
		}

		if (args.sortOrder < 0) {
			throw new Error("Sort order cannot be negative");
		}

		// Calculate amount
		const amount = args.quantity * args.rate;

		const lineItemId = await createLineItemWithOrg(ctx, {
			...args,
			amount,
		});

		return lineItemId;
	},
});

/**
 * Update a quote line item
 */
export const update = mutation({
	args: {
		id: v.id("quoteLineItems"),
		quoteId: v.optional(v.id("quotes")),
		description: v.optional(v.string()),
		quantity: v.optional(v.number()),
		unit: v.optional(v.string()),
		rate: v.optional(v.number()),
		cost: v.optional(v.number()),
		sortOrder: v.optional(v.number()),
		optional: v.optional(v.boolean()),
	},
	handler: async (ctx, args): Promise<QuoteLineItemId> => {
		const { id, ...updates } = args;

		// Validate fields if being updated
		if (updates.description !== undefined && !updates.description.trim()) {
			throw new Error("Description cannot be empty");
		}

		if (updates.unit !== undefined && !updates.unit.trim()) {
			throw new Error("Unit cannot be empty");
		}

		if (updates.quantity !== undefined && updates.quantity <= 0) {
			throw new Error("Quantity must be positive");
		}

		if (updates.rate !== undefined && updates.rate < 0) {
			throw new Error("Rate cannot be negative");
		}

		if (updates.cost !== undefined && updates.cost < 0) {
			throw new Error("Cost cannot be negative");
		}

		if (updates.sortOrder !== undefined && updates.sortOrder < 0) {
			throw new Error("Sort order cannot be negative");
		}

		// Filter out undefined values
		const filteredUpdates = Object.fromEntries(
			Object.entries(updates).filter(([, value]) => value !== undefined)
		) as Partial<QuoteLineItemDocument>;

		if (Object.keys(filteredUpdates).length === 0) {
			throw new Error("No valid updates provided");
		}

		// Get current line item to calculate new amount if needed
		const currentLineItem = await getLineItemOrThrow(ctx, id);

		// Recalculate amount if quantity or rate changed
		const quantity = filteredUpdates.quantity ?? currentLineItem.quantity;
		const rate = filteredUpdates.rate ?? currentLineItem.rate;

		if (
			filteredUpdates.quantity !== undefined ||
			filteredUpdates.rate !== undefined
		) {
			filteredUpdates.amount = quantity * rate;
		}

		await updateLineItemWithValidation(ctx, id, filteredUpdates);

		return id;
	},
});

/**
 * Delete a quote line item
 */
export const remove = mutation({
	args: { id: v.id("quoteLineItems") },
	handler: async (ctx, args): Promise<QuoteLineItemId> => {
		await getLineItemOrThrow(ctx, args.id); // Validate access
		await ctx.db.delete(args.id);
		return args.id;
	},
});

/**
 * Bulk create quote line items
 */
export const bulkCreate = mutation({
	args: {
		quoteId: v.id("quotes"),
		lineItems: v.array(
			v.object({
				description: v.string(),
				quantity: v.number(),
				unit: v.string(),
				rate: v.number(),
				cost: v.optional(v.number()),
				sortOrder: v.number(),
				optional: v.optional(v.boolean()),
			})
		),
	},
	handler: async (ctx, args): Promise<QuoteLineItemId[]> => {
		// Validate quote access once
		await validateQuoteAccess(ctx, args.quoteId);

		const userOrgId = await getCurrentUserOrgId(ctx);
		const createdIds: QuoteLineItemId[] = [];

		for (const itemData of args.lineItems) {
			// Validate each item
			if (!itemData.description.trim()) {
				throw new Error("All descriptions are required");
			}

			if (!itemData.unit.trim()) {
				throw new Error("All units are required");
			}

			if (itemData.quantity <= 0) {
				throw new Error("All quantities must be positive");
			}

			if (itemData.rate < 0) {
				throw new Error("Rate cannot be negative");
			}

			if (itemData.cost !== undefined && itemData.cost < 0) {
				throw new Error("Cost cannot be negative");
			}

			// Calculate amount and create item
			const amount = itemData.quantity * itemData.rate;

			const lineItemId = await ctx.db.insert("quoteLineItems", {
				...itemData,
				quoteId: args.quoteId,
				orgId: userOrgId,
				amount,
			});

			createdIds.push(lineItemId);
		}

		return createdIds;
	},
});

/**
 * Reorder quote line items
 */
// TODO: Candidate for deletion if confirmed unused.
export const reorder = mutation({
	args: {
		quoteId: v.id("quotes"),
		lineItemIds: v.array(v.id("quoteLineItems")),
	},
	handler: async (ctx, args): Promise<void> => {
		await validateQuoteAccess(ctx, args.quoteId);

		// Validate that all line items belong to the quote
		for (const lineItemId of args.lineItemIds) {
			const lineItem = await getLineItemOrThrow(ctx, lineItemId);
			if (lineItem.quoteId !== args.quoteId) {
				throw new Error("All line items must belong to the specified quote");
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
 * Duplicate a quote line item
 */
// TODO: Candidate for deletion if confirmed unused.
export const duplicate = mutation({
	args: { id: v.id("quoteLineItems") },
	handler: async (ctx, args): Promise<QuoteLineItemId> => {
		const originalItem = await getLineItemOrThrow(ctx, args.id);

		// Get the highest sort order for the quote to append the duplicate
		const allItems = await ctx.db
			.query("quoteLineItems")
			.withIndex("by_quote", (q) => q.eq("quoteId", originalItem.quoteId))
			.collect();

		const maxSortOrder = Math.max(
			...allItems.map((item) => item.sortOrder),
			-1
		);

		// Create duplicate with incremented sort order
		const duplicateId = await ctx.db.insert("quoteLineItems", {
			quoteId: originalItem.quoteId,
			orgId: originalItem.orgId,
			description: `${originalItem.description} (Copy)`,
			quantity: originalItem.quantity,
			unit: originalItem.unit,
			rate: originalItem.rate,
			amount: originalItem.amount,
			cost: originalItem.cost,
			sortOrder: maxSortOrder + 1,
			optional: originalItem.optional,
		});

		return duplicateId;
	},
});

/**
 * Get quote line item statistics
 */
// TODO: Candidate for deletion if confirmed unused.
export const getStats = query({
	args: { quoteId: v.id("quotes") },
	handler: async (ctx, args) => {
		await validateQuoteAccess(ctx, args.quoteId);

		const lineItems = await ctx.db
			.query("quoteLineItems")
			.withIndex("by_quote", (q) => q.eq("quoteId", args.quoteId))
			.collect();

		const stats = {
			totalItems: lineItems.length,
			totalAmount: 0,
			optionalItems: 0,
			optionalAmount: 0,
			averageRate: 0,
			totalQuantity: 0,
		};

		let totalRate = 0;

		lineItems.forEach((item: QuoteLineItemDocument) => {
			stats.totalAmount += item.amount;
			stats.totalQuantity += item.quantity;
			totalRate += item.rate;

			if (item.optional) {
				stats.optionalItems++;
				stats.optionalAmount += item.amount;
			}
		});

		if (lineItems.length > 0) {
			stats.averageRate = totalRate / lineItems.length;
		}

		return stats;
	},
});
