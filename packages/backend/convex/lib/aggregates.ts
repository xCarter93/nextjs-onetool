import { MutationCtx } from "../_generated/server";
import {
	clientCountsAggregate,
	projectCountsAggregate,
	quoteCountsAggregate,
	invoiceRevenueAggregate,
	invoiceCountsAggregate,
} from "../aggregates";
import { Doc } from "../_generated/dataModel";
import { ConvexError } from "convex/values";

/**
 * Helper functions for updating aggregates
 * These should be called from mutations whenever data is created, updated, or deleted
 */

/**
 * Checks if an error is a DELETE_MISSING_KEY error from the aggregate library
 * This happens when trying to replace a document that was never inserted into the aggregate
 * (e.g., created before aggregates were deployed)
 */
function isDeleteMissingKeyError(error: unknown): boolean {
	if (error instanceof ConvexError) {
		const data = error.data;
		if (typeof data === "object" && data !== null && "code" in data) {
			return (data as { code: string }).code === "DELETE_MISSING_KEY";
		}
	}
	// Also check string message for non-ConvexError cases
	if (error instanceof Error) {
		return error.message.includes("DELETE_MISSING_KEY");
	}
	return false;
}
export const AggregateHelpers = {
	// ==================== Client Helpers ====================
	async addClient(ctx: MutationCtx, client: Doc<"clients">) {
		await clientCountsAggregate.insert(ctx, client);
	},

	async removeClient(ctx: MutationCtx, client: Doc<"clients">) {
		try {
			await clientCountsAggregate.delete(ctx, client);
		} catch (error) {
			// Silently ignore if client was never in aggregate
			if (!isDeleteMissingKeyError(error)) {
				throw error;
			}
			console.log(
				`Client ${client._id} not found in aggregate, skipping delete`
			);
		}
	},

	// ==================== Project Helpers ====================
	async addProject(ctx: MutationCtx, project: Doc<"projects">) {
		await projectCountsAggregate.insert(ctx, project);
	},

	async updateProject(
		ctx: MutationCtx,
		oldProject: Doc<"projects">,
		newProject: Doc<"projects">
	) {
		// Only replace if status or completedAt changed
		if (
			oldProject.status !== newProject.status ||
			oldProject.completedAt !== newProject.completedAt
		) {
			try {
				await projectCountsAggregate.replace(ctx, oldProject, newProject);
			} catch (error) {
				// If the old document was never in the aggregate (created before aggregates were deployed),
				// fall back to inserting the new document
				if (isDeleteMissingKeyError(error)) {
					console.log(
						`Project ${newProject._id} not found in aggregate, inserting instead of replacing`
					);
					await projectCountsAggregate.insert(ctx, newProject);
				} else {
					throw error;
				}
			}
		}
	},

	async removeProject(ctx: MutationCtx, project: Doc<"projects">) {
		try {
			await projectCountsAggregate.delete(ctx, project);
		} catch (error) {
			// Silently ignore if project was never in aggregate
			if (!isDeleteMissingKeyError(error)) {
				throw error;
			}
			console.log(
				`Project ${project._id} not found in aggregate, skipping delete`
			);
		}
	},

	// ==================== Quote Helpers ====================
	async addQuote(ctx: MutationCtx, quote: Doc<"quotes">) {
		await quoteCountsAggregate.insert(ctx, quote);
	},

	async updateQuote(
		ctx: MutationCtx,
		oldQuote: Doc<"quotes">,
		newQuote: Doc<"quotes">
	) {
		// Only replace if status, approvedAt, or total changed
		if (
			oldQuote.status !== newQuote.status ||
			oldQuote.approvedAt !== newQuote.approvedAt ||
			oldQuote.total !== newQuote.total
		) {
			try {
				await quoteCountsAggregate.replace(ctx, oldQuote, newQuote);
			} catch (error) {
				// If the old document was never in the aggregate (created before aggregates were deployed),
				// fall back to inserting the new document
				if (isDeleteMissingKeyError(error)) {
					console.log(
						`Quote ${newQuote._id} not found in aggregate, inserting instead of replacing`
					);
					await quoteCountsAggregate.insert(ctx, newQuote);
				} else {
					throw error;
				}
			}
		}
	},

	async removeQuote(ctx: MutationCtx, quote: Doc<"quotes">) {
		try {
			await quoteCountsAggregate.delete(ctx, quote);
		} catch (error) {
			// Silently ignore if quote was never in aggregate
			if (!isDeleteMissingKeyError(error)) {
				throw error;
			}
			console.log(
				`Quote ${quote._id} not found in aggregate, skipping delete`
			);
		}
	},

	// ==================== Invoice Helpers ====================
	async addInvoice(ctx: MutationCtx, invoice: Doc<"invoices">) {
		await invoiceRevenueAggregate.insert(ctx, invoice);
		await invoiceCountsAggregate.insert(ctx, invoice);
	},

	async updateInvoice(
		ctx: MutationCtx,
		oldInvoice: Doc<"invoices">,
		newInvoice: Doc<"invoices">
	) {
		// Only replace if status, paidAt, or total changed
		if (
			oldInvoice.status !== newInvoice.status ||
			oldInvoice.paidAt !== newInvoice.paidAt ||
			oldInvoice.total !== newInvoice.total
		) {
			try {
				await invoiceRevenueAggregate.replace(ctx, oldInvoice, newInvoice);
			} catch (error) {
				if (isDeleteMissingKeyError(error)) {
					console.log(
						`Invoice ${newInvoice._id} not found in revenue aggregate, inserting instead of replacing`
					);
					await invoiceRevenueAggregate.insert(ctx, newInvoice);
				} else {
					throw error;
				}
			}
			try {
				await invoiceCountsAggregate.replace(ctx, oldInvoice, newInvoice);
			} catch (error) {
				if (isDeleteMissingKeyError(error)) {
					console.log(
						`Invoice ${newInvoice._id} not found in counts aggregate, inserting instead of replacing`
					);
					await invoiceCountsAggregate.insert(ctx, newInvoice);
				} else {
					throw error;
				}
			}
		}
	},

	async removeInvoice(ctx: MutationCtx, invoice: Doc<"invoices">) {
		try {
			await invoiceRevenueAggregate.delete(ctx, invoice);
		} catch (error) {
			// Silently ignore if invoice was never in aggregate
			if (!isDeleteMissingKeyError(error)) {
				throw error;
			}
			console.log(
				`Invoice ${invoice._id} not found in revenue aggregate, skipping delete`
			);
		}
		try {
			await invoiceCountsAggregate.delete(ctx, invoice);
		} catch (error) {
			// Silently ignore if invoice was never in aggregate
			if (!isDeleteMissingKeyError(error)) {
				throw error;
			}
			console.log(
				`Invoice ${invoice._id} not found in counts aggregate, skipping delete`
			);
		}
	},
};
