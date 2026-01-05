import { createTool } from "@mastra/core/tools";
import { z } from "zod";

/**
 * Execute Query Tool
 * Executes report queries and returns formatted data for visualization
 * 
 * Note: This tool provides the schema for the LLM to understand what data
 * will be returned. The actual query execution happens on the frontend
 * using Convex hooks, as Mastra tools run server-side and can't directly
 * use Convex's real-time queries.
 */

// Define the query specification that will be used by the frontend
const querySpecSchema = z.object({
	queryName: z.string().describe("The Convex query function to call"),
	args: z.record(z.string(), z.unknown()).describe("Arguments to pass to the query"),
});

export const executeQueryTool = createTool({
	id: "execute-report-query",
	description:
		"Generate a query specification for fetching report data. The frontend will execute this query using Convex.",
	inputSchema: z.object({
		entityType: z.enum([
			"clients",
			"projects",
			"tasks",
			"quotes",
			"invoices",
			"activities",
		]),
		groupBy: z
			.string()
			.optional()
			.describe("Field to group results by"),
		dateRange: z
			.object({
				start: z.number().optional(),
				end: z.number().optional(),
			})
			.optional()
			.describe("Date range filter"),
		limit: z
			.number()
			.optional()
			.describe("Maximum number of results to return"),
	}),
	outputSchema: z.object({
		querySpec: querySpecSchema,
		description: z.string().describe("Human-readable description of what this query will return"),
		expectedFields: z
			.array(
				z.object({
					name: z.string(),
					type: z.string(),
					description: z.string(),
				})
			)
			.describe("Fields that will be returned in the data"),
	}),
	execute: async ({ context }) => {
		const { entityType, groupBy, dateRange, limit } = context;

		// Map entity type and groupBy to the appropriate Convex query
		const queryMapping: Record<string, Record<string, string>> = {
			clients: {
				status: "reportData.queryClientsByStatus",
				leadSource: "reportData.queryClientsByLeadSource",
				default: "reportData.queryClientsByStatus",
			},
			projects: {
				status: "reportData.queryProjectsByStatus",
				projectType: "reportData.queryProjectsByType",
				default: "reportData.queryProjectsByStatus",
			},
			tasks: {
				status: "reportData.queryTasksByStatus",
				completionRate: "reportData.queryTaskCompletionRate",
				default: "reportData.queryTasksByStatus",
			},
			quotes: {
				status: "reportData.queryQuotesByStatus",
				conversionRate: "reportData.queryQuoteConversionRate",
				default: "reportData.queryQuotesByStatus",
			},
			invoices: {
				status: "reportData.queryInvoicesByStatus",
				month: "reportData.queryRevenueByMonth",
				client: "reportData.queryRevenueByClient",
				default: "reportData.queryInvoicesByStatus",
			},
			activities: {
				activityType: "reportData.queryActivitiesByType",
				default: "reportData.queryActivitiesByType",
			},
		};

		const entityQueries = queryMapping[entityType] || { default: "reportData.executeReport" };
		const queryName = groupBy && entityQueries[groupBy]
			? entityQueries[groupBy]
			: entityQueries.default;

		// Build query arguments
		const args: Record<string, unknown> = {};
		if (dateRange) {
			args.dateRange = dateRange;
		}
		if (limit) {
			args.limit = limit;
		}

		// Generate description based on query
		const entityNames: Record<string, string> = {
			clients: "Clients",
			projects: "Projects",
			tasks: "Tasks",
			quotes: "Quotes",
			invoices: "Invoices",
			activities: "Activities",
		};

		const description = generateQueryDescription(entityType, groupBy, dateRange);

		// Define expected fields based on the query
		const expectedFields = [
			{ name: "label", type: "string", description: "Category or group label" },
			{ name: "value", type: "number", description: "Aggregated value (count, sum, etc.)" },
			{ name: "metadata", type: "object", description: "Additional metadata for the data point" },
		];

		return {
			querySpec: {
				queryName,
				args,
			},
			description,
			expectedFields,
		};
	},
});

function generateQueryDescription(
	entityType: string,
	groupBy?: string,
	dateRange?: { start?: number; end?: number }
): string {
	const entityName = entityType.charAt(0).toUpperCase() + entityType.slice(1);
	
	let description = `Fetching ${entityName.toLowerCase()} data`;
	
	if (groupBy) {
		const groupByName = groupBy
			.split(/(?=[A-Z])|_/)
			.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
			.join(" ");
		description += ` grouped by ${groupByName.toLowerCase()}`;
	}
	
	if (dateRange) {
		if (dateRange.start && dateRange.end) {
			const startDate = new Date(dateRange.start).toLocaleDateString();
			const endDate = new Date(dateRange.end).toLocaleDateString();
			description += ` from ${startDate} to ${endDate}`;
		} else if (dateRange.start) {
			const startDate = new Date(dateRange.start).toLocaleDateString();
			description += ` from ${startDate}`;
		} else if (dateRange.end) {
			const endDate = new Date(dateRange.end).toLocaleDateString();
			description += ` until ${endDate}`;
		}
	}
	
	return description + ".";
}

