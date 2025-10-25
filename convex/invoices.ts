import { query, mutation, QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { getCurrentUserOrgId } from "./lib/auth";
import { ActivityHelpers } from "./lib/activities";
import { AggregateHelpers } from "./lib/aggregates";
import { generatePublicToken } from "./lib/shared";

/**
 * Invoice operations with embedded CRUD helpers
 * All invoice-specific logic lives in this file for better organization
 */

// Invoice-specific helper functions

/**
 * Get an invoice by ID with organization validation
 */
async function getInvoiceWithOrgValidation(
	ctx: QueryCtx | MutationCtx,
	id: Id<"invoices">
): Promise<Doc<"invoices"> | null> {
	const userOrgId = await getCurrentUserOrgId(ctx);
	const invoice = await ctx.db.get(id);

	if (!invoice) {
		return null;
	}

	if (invoice.orgId !== userOrgId) {
		throw new Error("Invoice does not belong to your organization");
	}

	return invoice;
}

/**
 * Get an invoice by ID, throwing if not found
 */
async function getInvoiceOrThrow(
	ctx: QueryCtx | MutationCtx,
	id: Id<"invoices">
): Promise<Doc<"invoices">> {
	const invoice = await getInvoiceWithOrgValidation(ctx, id);
	if (!invoice) {
		throw new Error("Invoice not found");
	}
	return invoice;
}

/**
 * Get an invoice by public token (for client access)
 */
async function getInvoiceByPublicToken(
	ctx: QueryCtx,
	publicToken: string
): Promise<Doc<"invoices"> | null> {
	return await ctx.db
		.query("invoices")
		.withIndex("by_public_token", (q) => q.eq("publicToken", publicToken))
		.unique();
}

/**
 * Validate client exists and belongs to user's org
 */
async function validateClientAccess(
	ctx: QueryCtx | MutationCtx,
	clientId: Id<"clients">,
	existingOrgId?: Id<"organizations">
): Promise<void> {
	const userOrgId = existingOrgId ?? (await getCurrentUserOrgId(ctx));
	const client = await ctx.db.get(clientId);

	if (!client) {
		throw new Error("Client not found");
	}

	if (client.orgId !== userOrgId) {
		throw new Error("Client does not belong to your organization");
	}
}

/**
 * Create an invoice with automatic orgId assignment
 */
async function createInvoiceWithOrg(
	ctx: MutationCtx,
	data: Omit<Doc<"invoices">, "_id" | "_creationTime" | "orgId" | "publicToken">
): Promise<Id<"invoices">> {
	const userOrgId = await getCurrentUserOrgId(ctx);

	// Validate client access
	await validateClientAccess(ctx, data.clientId);

	const invoiceData = {
		...data,
		orgId: userOrgId,
		publicToken: generatePublicToken(),
	};

	return await ctx.db.insert("invoices", invoiceData);
}

// Define specific types for invoice operations
type InvoiceDocument = Doc<"invoices">;
type InvoiceId = Id<"invoices">;

// Interface for invoice statistics
interface InvoiceStats {
	total: number;
	byStatus: {
		draft: number;
		sent: number;
		paid: number;
		overdue: number;
		cancelled: number;
	};
	totalValue: number;
	totalPaid: number;
	totalOutstanding: number;
	thisMonth: number;
}

function createEmptyInvoiceStats(): InvoiceStats {
	return {
		total: 0,
		byStatus: {
			draft: 0,
			sent: 0,
			paid: 0,
			overdue: 0,
			cancelled: 0,
		},
		totalValue: 0,
		totalPaid: 0,
		totalOutstanding: 0,
		thisMonth: 0,
	};
}

/**
 * Get all invoices for the current user's organization
 */
export const list = query({
	args: {
		status: v.optional(
			v.union(
				v.literal("draft"),
				v.literal("sent"),
				v.literal("paid"),
				v.literal("overdue"),
				v.literal("cancelled")
			)
		),
		clientId: v.optional(v.id("clients")),
		projectId: v.optional(v.id("projects")),
	},
	handler: async (ctx, args): Promise<InvoiceDocument[]> => {
		const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
		if (!userOrgId) {
			return [];
		}

		let invoices: InvoiceDocument[];

		if (args.status) {
			invoices = await ctx.db
				.query("invoices")
				.withIndex("by_status", (q) =>
					q.eq("orgId", userOrgId).eq("status", args.status!)
				)
				.collect();
		} else {
			invoices = await ctx.db
				.query("invoices")
				.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
				.collect();
		}

		// Apply additional filters
		if (args.clientId) {
			await validateClientAccess(ctx, args.clientId, userOrgId);
			invoices = invoices.filter(
				(invoice) => invoice.clientId === args.clientId
			);
		}

		if (args.projectId) {
			invoices = invoices.filter(
				(invoice) => invoice.projectId === args.projectId
			);
		}

		// Sort by creation time (newest first)
		return invoices.sort((a, b) => b._creationTime - a._creationTime);
	},
});

/**
 * Get a specific invoice by ID
 */
// TODO: Candidate for deletion if confirmed unused.
export const get = query({
	args: { id: v.id("invoices") },
	handler: async (ctx, args): Promise<InvoiceDocument | null> => {
		const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
		if (!userOrgId) {
			return null;
		}
		return await getInvoiceWithOrgValidation(ctx, args.id);
	},
});

/**
 * Get an invoice by public token (for client access)
 */
// TODO: Candidate for deletion if confirmed unused.
export const getByPublicToken = query({
	args: { publicToken: v.string() },
	handler: async (ctx, args): Promise<InvoiceDocument | null> => {
		return await getInvoiceByPublicToken(ctx, args.publicToken);
	},
});

/**
 * Create a new invoice
 */
// TODO: Candidate for deletion if confirmed unused.
export const create = mutation({
	args: {
		clientId: v.id("clients"),
		projectId: v.optional(v.id("projects")),
		quoteId: v.optional(v.id("quotes")),
		invoiceNumber: v.string(),
		status: v.union(
			v.literal("draft"),
			v.literal("sent"),
			v.literal("paid"),
			v.literal("overdue"),
			v.literal("cancelled")
		),
		subtotal: v.number(),
		discountAmount: v.optional(v.number()),
		taxAmount: v.optional(v.number()),
		total: v.number(),
		issuedDate: v.number(),
		dueDate: v.number(),
		paymentMethod: v.optional(v.string()),
	},
	handler: async (ctx, args): Promise<InvoiceId> => {
		// Validate required fields
		if (!args.invoiceNumber.trim()) {
			throw new Error("Invoice number is required");
		}

		// Validate financial values
		if (args.subtotal < 0) {
			throw new Error("Subtotal cannot be negative");
		}

		if (args.total < 0) {
			throw new Error("Total cannot be negative");
		}

		// Validate dates
		if (args.dueDate <= args.issuedDate) {
			throw new Error("Due date must be after issued date");
		}

		const invoiceId = await createInvoiceWithOrg(ctx, args);

		// Get the created invoice for activity logging and aggregates
		const invoice = await ctx.db.get(invoiceId);
		if (invoice) {
			const client = await ctx.db.get(invoice.clientId);
			await ActivityHelpers.invoiceCreated(
				ctx,
				invoice as InvoiceDocument,
				client?.companyName || "Unknown Client"
			);
			await AggregateHelpers.addInvoice(ctx, invoice as InvoiceDocument);
		}

		return invoiceId;
	},
});

/**
 * Update an invoice
 */
// TODO: Candidate for deletion if confirmed unused.
export const update = mutation({
	args: {
		id: v.id("invoices"),
		status: v.optional(
			v.union(
				v.literal("draft"),
				v.literal("sent"),
				v.literal("paid"),
				v.literal("overdue"),
				v.literal("cancelled")
			)
		),
		subtotal: v.optional(v.number()),
		discountAmount: v.optional(v.number()),
		taxAmount: v.optional(v.number()),
		total: v.optional(v.number()),
		dueDate: v.optional(v.number()),
		paymentMethod: v.optional(v.string()),
		stripeSessionId: v.optional(v.string()),
		stripePaymentIntentId: v.optional(v.string()),
	},
	handler: async (ctx, args): Promise<InvoiceId> => {
		const { id, ...updates } = args;

		// Filter out undefined values
		const filteredUpdates = Object.fromEntries(
			Object.entries(updates).filter(([, value]) => value !== undefined)
		) as Partial<InvoiceDocument>;

		if (Object.keys(filteredUpdates).length === 0) {
			throw new Error("No valid updates provided");
		}

		// Get current invoice to check for status changes
		const currentInvoice = await getInvoiceOrThrow(ctx, id);

		// Handle status-specific updates
		if (
			filteredUpdates.status &&
			filteredUpdates.status !== currentInvoice.status
		) {
			const now = Date.now();

			if (filteredUpdates.status === "paid") {
				filteredUpdates.paidAt = now;
			}
		}

		await ctx.db.patch(id, filteredUpdates);

		// Log appropriate activity based on status change and update aggregates
		const updatedInvoice = await ctx.db.get(id);
		if (updatedInvoice) {
			// Update aggregates if relevant fields changed
			if (
				filteredUpdates.status !== undefined ||
				filteredUpdates.paidAt !== undefined ||
				filteredUpdates.total !== undefined
			) {
				await AggregateHelpers.updateInvoice(
					ctx,
					currentInvoice as InvoiceDocument,
					updatedInvoice as InvoiceDocument
				);
			}

			const client = await ctx.db.get(updatedInvoice.clientId);
			const clientName = client?.companyName || "Unknown Client";
			if (
				filteredUpdates.status === "sent" &&
				currentInvoice.status === "draft"
			) {
				await ActivityHelpers.invoiceSent(
					ctx,
					updatedInvoice as InvoiceDocument,
					clientName
				);
			} else if (filteredUpdates.status === "paid") {
				await ActivityHelpers.invoicePaid(
					ctx,
					updatedInvoice as InvoiceDocument,
					clientName
				);
			}
		}

		return id;
	},
});

/**
 * Mark an invoice as paid
 */
// TODO: Candidate for deletion if confirmed unused.
export const markPaid = mutation({
	args: {
		id: v.id("invoices"),
		paymentMethod: v.optional(v.string()),
	},
	handler: async (ctx, args): Promise<InvoiceId> => {
		const invoice = await getInvoiceOrThrow(ctx, args.id);

		if (invoice.status === "paid") {
			throw new Error("Invoice is already paid");
		}

		if (invoice.status === "cancelled") {
			throw new Error("Cannot mark cancelled invoice as paid");
		}

		await ctx.db.patch(args.id, {
			status: "paid",
			paidAt: Date.now(),
			paymentMethod: args.paymentMethod,
		});

		// Log activity
		const updatedInvoice = await ctx.db.get(args.id);
		if (updatedInvoice) {
			const client = await ctx.db.get(updatedInvoice.clientId);
			await ActivityHelpers.invoicePaid(
				ctx,
				updatedInvoice as InvoiceDocument,
				client?.companyName || "Unknown Client"
			);
		}

		return args.id;
	},
});

/**
 * Delete an invoice
 */
// TODO: Candidate for deletion if confirmed unused.
export const remove = mutation({
	args: { id: v.id("invoices") },
	handler: async (ctx, args): Promise<InvoiceId> => {
		// Delete line items first
		const lineItems = await ctx.db
			.query("invoiceLineItems")
			.withIndex("by_invoice", (q) => q.eq("invoiceId", args.id))
			.collect();

		for (const lineItem of lineItems) {
			await ctx.db.delete(lineItem._id);
		}

		// Get invoice and remove from aggregates before deleting
		const invoice = await getInvoiceOrThrow(ctx, args.id); // Validate access
		await AggregateHelpers.removeInvoice(ctx, invoice as InvoiceDocument);
		await ctx.db.delete(args.id);

		return args.id;
	},
});

/**
 * Get invoice statistics for dashboard
 */
// TODO: Candidate for deletion if confirmed unused.
export const getStats = query({
	args: {},
	handler: async (ctx): Promise<InvoiceStats> => {
		const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
		if (!userOrgId) {
			return createEmptyInvoiceStats();
		}
		const invoices = await ctx.db
			.query("invoices")
			.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
			.collect();

		const stats: InvoiceStats = {
			total: invoices.length,
			byStatus: {
				draft: 0,
				sent: 0,
				paid: 0,
				overdue: 0,
				cancelled: 0,
			},
			totalValue: 0,
			totalPaid: 0,
			totalOutstanding: 0,
			thisMonth: 0,
		};

		const now = Date.now();
		const monthStart = new Date();
		monthStart.setDate(1);
		monthStart.setHours(0, 0, 0, 0);
		const monthStartTime = monthStart.getTime();

		invoices.forEach((invoice: InvoiceDocument) => {
			// Check if overdue
			const isOverdue = invoice.status === "sent" && invoice.dueDate < now;
			const status = isOverdue ? "overdue" : invoice.status;

			// Count by status
			stats.byStatus[status as keyof typeof stats.byStatus]++;

			// Calculate financial values
			stats.totalValue += invoice.total;

			if (invoice.status === "paid") {
				stats.totalPaid += invoice.total;
			} else if (invoice.status === "sent" || isOverdue) {
				stats.totalOutstanding += invoice.total;
			}

			// Count this month's invoices
			if (invoice._creationTime >= monthStartTime) {
				stats.thisMonth++;
			}
		});

		return stats;
	},
});

/**
 * Get overdue invoices
 */
// TODO: Candidate for deletion if confirmed unused.
export const getOverdue = query({
	args: {},
	handler: async (ctx): Promise<InvoiceDocument[]> => {
		const userOrgId = await getCurrentUserOrgId(ctx, { require: false });
		if (!userOrgId) {
			return [];
		}
		const now = Date.now();

		const invoices = await ctx.db
			.query("invoices")
			.withIndex("by_due_date", (q) =>
				q.eq("orgId", userOrgId).lt("dueDate", now)
			)
			.collect();

		// Only return sent invoices that are overdue
		return invoices.filter((invoice) => invoice.status === "sent");
	},
});

/**
 * Generate next invoice number for organization
 */
export const generateInvoiceNumber = mutation({
	args: {},
	handler: async (ctx): Promise<string> => {
		const userOrgId = await getCurrentUserOrgId(ctx);

		// Get all invoices for this organization
		const orgInvoices = await ctx.db
			.query("invoices")
			.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
			.collect();

		// Find the maximum invoice number
		const maxNumber = orgInvoices.reduce((max, inv) => {
			const match = inv.invoiceNumber.match(/INV-(\d{6})/);
			if (match) {
				const num = parseInt(match[1]);
				return num > max ? num : max;
			}
			return max;
		}, 0);

		// Return next number with proper padding
		return `INV-${String(maxNumber + 1).padStart(6, "0")}`;
	},
});

/**
 * Create invoice from quote
 */
export const createFromQuote = mutation({
	args: {
		quoteId: v.id("quotes"),
		issuedDate: v.optional(v.number()),
		dueDate: v.optional(v.number()),
	},
	handler: async (ctx, args): Promise<InvoiceId> => {
		// Get and validate quote
		const userOrgId = await getCurrentUserOrgId(ctx);
		const quote = await ctx.db.get(args.quoteId);

		if (!quote) {
			throw new Error("Quote not found");
		}

		if (quote.orgId !== userOrgId) {
			throw new Error("Quote does not belong to your organization");
		}

		if (quote.status !== "approved") {
			throw new Error("Only approved quotes can be converted to invoices");
		}

		// Generate invoice number automatically
		const orgInvoices = await ctx.db
			.query("invoices")
			.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
			.collect();

		const maxNumber = orgInvoices.reduce((max, inv) => {
			const match = inv.invoiceNumber.match(/INV-(\d{6})/);
			if (match) {
				const num = parseInt(match[1]);
				return num > max ? num : max;
			}
			return max;
		}, 0);

		const invoiceNumber = `INV-${String(maxNumber + 1).padStart(6, "0")}`;

		// Set default dates if not provided
		const issuedDate = args.issuedDate || Date.now();
		const dueDate = args.dueDate || Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days default

		// Create invoice from quote
		const invoiceId = await ctx.db.insert("invoices", {
			orgId: userOrgId,
			clientId: quote.clientId,
			projectId: quote.projectId,
			quoteId: args.quoteId,
			invoiceNumber,
			status: "draft",
			subtotal: quote.subtotal,
			discountAmount: quote.discountAmount,
			taxAmount: quote.taxAmount,
			total: quote.total,
			issuedDate,
			dueDate,
			publicToken: generatePublicToken(),
		});

		// Copy quote line items to invoice line items
		const quoteLineItems = await ctx.db
			.query("quoteLineItems")
			.withIndex("by_quote", (q) => q.eq("quoteId", args.quoteId))
			.collect();

		for (const quoteLineItem of quoteLineItems) {
			await ctx.db.insert("invoiceLineItems", {
				invoiceId,
				orgId: userOrgId,
				description: quoteLineItem.description,
				quantity: quoteLineItem.quantity,
				unitPrice: quoteLineItem.rate,
				total: quoteLineItem.amount,
				sortOrder: quoteLineItem.sortOrder,
			});
		}

		// Log activity and add to aggregates
		const invoice = await ctx.db.get(invoiceId);
		if (invoice) {
			const client = await ctx.db.get(invoice.clientId);
			await ActivityHelpers.invoiceCreated(
				ctx,
				invoice as InvoiceDocument,
				client?.companyName || "Unknown Client"
			);
			await AggregateHelpers.addInvoice(ctx, invoice as InvoiceDocument);
		}

		return invoiceId;
	},
});
