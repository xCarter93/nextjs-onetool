import { internalMutation } from "../_generated/server";
import { AggregateHelpers } from "../lib/aggregates";

/**
 * Migration scripts to populate aggregates with existing data
 * Run these once after deploying the aggregate component
 *
 * To run these migrations:
 * 1. Deploy your convex functions: `npx convex deploy`
 * 2. Go to the Convex dashboard
 * 3. Navigate to Functions tab
 * 4. Find and run each migration function manually
 *
 * Run in this order:
 * 1. populateClientAggregates
 * 2. populateProjectAggregates
 * 3. populateQuoteAggregates
 * 4. populateInvoiceAggregates
 */

/**
 * Populate client aggregates with all existing clients
 * This should be run first
 */
export const populateClientAggregates = internalMutation({
	handler: async (ctx): Promise<{ processed: number; errors: string[] }> => {
		const errors: string[] = [];
		let processed = 0;

		try {
			console.log("Starting client aggregates population...");
			const clients = await ctx.db.query("clients").collect();
			console.log(`Found ${clients.length} clients to process`);

			for (const client of clients) {
				try {
					await AggregateHelpers.addClient(ctx, client);
					processed++;
					if (processed % 100 === 0) {
						console.log(`Processed ${processed}/${clients.length} clients`);
					}
				} catch (error) {
					const errorMsg = `Failed to add client ${client._id}: ${error}`;
					console.error(errorMsg);
					errors.push(errorMsg);
				}
			}

			console.log(
				`Client aggregates population completed: ${processed} processed, ${errors.length} errors`
			);
		} catch (error) {
			const errorMsg = `Failed to populate client aggregates: ${error}`;
			console.error(errorMsg);
			errors.push(errorMsg);
		}

		return { processed, errors };
	},
});

/**
 * Populate project aggregates with all existing projects
 */
export const populateProjectAggregates = internalMutation({
	handler: async (ctx): Promise<{ processed: number; errors: string[] }> => {
		const errors: string[] = [];
		let processed = 0;

		try {
			console.log("Starting project aggregates population...");
			const projects = await ctx.db.query("projects").collect();
			console.log(`Found ${projects.length} projects to process`);

			for (const project of projects) {
				try {
					await AggregateHelpers.addProject(ctx, project);
					processed++;
					if (processed % 100 === 0) {
						console.log(`Processed ${processed}/${projects.length} projects`);
					}
				} catch (error) {
					const errorMsg = `Failed to add project ${project._id}: ${error}`;
					console.error(errorMsg);
					errors.push(errorMsg);
				}
			}

			console.log(
				`Project aggregates population completed: ${processed} processed, ${errors.length} errors`
			);
		} catch (error) {
			const errorMsg = `Failed to populate project aggregates: ${error}`;
			console.error(errorMsg);
			errors.push(errorMsg);
		}

		return { processed, errors };
	},
});

/**
 * Populate quote aggregates with all existing quotes
 */
export const populateQuoteAggregates = internalMutation({
	handler: async (ctx): Promise<{ processed: number; errors: string[] }> => {
		const errors: string[] = [];
		let processed = 0;

		try {
			console.log("Starting quote aggregates population...");
			const quotes = await ctx.db.query("quotes").collect();
			console.log(`Found ${quotes.length} quotes to process`);

			for (const quote of quotes) {
				try {
					await AggregateHelpers.addQuote(ctx, quote);
					processed++;
					if (processed % 100 === 0) {
						console.log(`Processed ${processed}/${quotes.length} quotes`);
					}
				} catch (error) {
					const errorMsg = `Failed to add quote ${quote._id}: ${error}`;
					console.error(errorMsg);
					errors.push(errorMsg);
				}
			}

			console.log(
				`Quote aggregates population completed: ${processed} processed, ${errors.length} errors`
			);
		} catch (error) {
			const errorMsg = `Failed to populate quote aggregates: ${error}`;
			console.error(errorMsg);
			errors.push(errorMsg);
		}

		return { processed, errors };
	},
});

/**
 * Populate invoice aggregates with all existing invoices
 */
export const populateInvoiceAggregates = internalMutation({
	handler: async (ctx): Promise<{ processed: number; errors: string[] }> => {
		const errors: string[] = [];
		let processed = 0;

		try {
			console.log("Starting invoice aggregates population...");
			const invoices = await ctx.db.query("invoices").collect();
			console.log(`Found ${invoices.length} invoices to process`);

			for (const invoice of invoices) {
				try {
					await AggregateHelpers.addInvoice(ctx, invoice);
					processed++;
					if (processed % 100 === 0) {
						console.log(`Processed ${processed}/${invoices.length} invoices`);
					}
				} catch (error) {
					const errorMsg = `Failed to add invoice ${invoice._id}: ${error}`;
					console.error(errorMsg);
					errors.push(errorMsg);
				}
			}

			console.log(
				`Invoice aggregates population completed: ${processed} processed, ${errors.length} errors`
			);
		} catch (error) {
			const errorMsg = `Failed to populate invoice aggregates: ${error}`;
			console.error(errorMsg);
			errors.push(errorMsg);
		}

		return { processed, errors };
	},
});

/**
 * Run all migrations in sequence
 * This is a convenience function to run all migrations at once
 */
export const populateAllAggregates = internalMutation({
	handler: async (
		ctx
	): Promise<{
		clients: { processed: number; errors: string[] };
		projects: { processed: number; errors: string[] };
		quotes: { processed: number; errors: string[] };
		invoices: { processed: number; errors: string[] };
	}> => {
		console.log("Starting full aggregates population...");

		const clientsResult = await populateClientAggregates(ctx, {});
		const projectsResult = await populateProjectAggregates(ctx, {});
		const quotesResult = await populateQuoteAggregates(ctx, {});
		const invoicesResult = await populateInvoiceAggregates(ctx, {});

		console.log("Full aggregates population completed!");
		console.log(
			`Total: ${clientsResult.processed + projectsResult.processed + quotesResult.processed + invoicesResult.processed} records processed`
		);

		return {
			clients: clientsResult,
			projects: projectsResult,
			quotes: quotesResult,
			invoices: invoicesResult,
		};
	},
});
