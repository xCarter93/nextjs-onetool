import { MutationCtx } from "../_generated/server";
import {
	clientCountsAggregate,
	projectCountsAggregate,
	quoteCountsAggregate,
	invoiceRevenueAggregate,
	invoiceCountsAggregate,
} from "../aggregates";
import { Doc } from "../_generated/dataModel";

/**
 * Helper functions for updating aggregates
 * These should be called from mutations whenever data is created, updated, or deleted
 */
export const AggregateHelpers = {
	// ==================== Client Helpers ====================
	async addClient(ctx: MutationCtx, client: Doc<"clients">) {
		await clientCountsAggregate.insert(ctx, client);
	},

	async removeClient(ctx: MutationCtx, client: Doc<"clients">) {
		await clientCountsAggregate.delete(ctx, client);
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
			await projectCountsAggregate.replace(ctx, oldProject, newProject);
		}
	},

	async removeProject(ctx: MutationCtx, project: Doc<"projects">) {
		await projectCountsAggregate.delete(ctx, project);
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
			await quoteCountsAggregate.replace(ctx, oldQuote, newQuote);
		}
	},

	async removeQuote(ctx: MutationCtx, quote: Doc<"quotes">) {
		await quoteCountsAggregate.delete(ctx, quote);
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
			await invoiceRevenueAggregate.replace(ctx, oldInvoice, newInvoice);
			await invoiceCountsAggregate.replace(ctx, oldInvoice, newInvoice);
		}
	},

	async removeInvoice(ctx: MutationCtx, invoice: Doc<"invoices">) {
		await invoiceRevenueAggregate.delete(ctx, invoice);
		await invoiceCountsAggregate.delete(ctx, invoice);
	},
};
