import { createTool } from "@mastra/core/tools";
import { z } from "zod";

/**
 * Schema information for report building
 * Returns available entities and their fields that can be used in reports
 */

const ENTITY_SCHEMAS = {
	clients: {
		name: "Clients",
		description: "Customer and prospect information",
		fields: {
			companyName: { type: "string", description: "Company or client name" },
			status: {
				type: "enum",
				description: "Client status",
				values: ["lead", "active", "inactive", "archived"],
			},
			leadSource: {
				type: "enum",
				description: "How the client was acquired",
				values: [
					"word-of-mouth",
					"website",
					"social-media",
					"referral",
					"advertising",
					"trade-show",
					"cold-outreach",
					"other",
				],
			},
			communicationPreference: {
				type: "enum",
				description: "Preferred communication method",
				values: ["email", "phone", "both"],
			},
			tags: { type: "array", description: "Tags for categorization" },
			_creationTime: { type: "date", description: "When the client was created" },
		},
		groupByFields: ["status", "leadSource", "communicationPreference"],
		aggregations: ["count"],
	},
	projects: {
		name: "Projects",
		description: "Project information and status",
		fields: {
			title: { type: "string", description: "Project title" },
			status: {
				type: "enum",
				description: "Project status",
				values: ["planned", "in-progress", "completed", "cancelled"],
			},
			projectType: {
				type: "enum",
				description: "Type of project",
				values: ["one-off", "recurring"],
			},
			startDate: { type: "date", description: "Project start date" },
			endDate: { type: "date", description: "Project end date" },
			completedAt: { type: "date", description: "When project was completed" },
			_creationTime: { type: "date", description: "When the project was created" },
		},
		groupByFields: ["status", "projectType"],
		aggregations: ["count"],
	},
	tasks: {
		name: "Tasks",
		description: "Task and schedule items",
		fields: {
			title: { type: "string", description: "Task title" },
			status: {
				type: "enum",
				description: "Task status",
				values: ["pending", "in-progress", "completed", "cancelled"],
			},
			type: {
				type: "enum",
				description: "Task type",
				values: ["internal", "external"],
			},
			date: { type: "date", description: "Scheduled date" },
			completedAt: { type: "date", description: "When task was completed" },
		},
		groupByFields: ["status", "type", "completionRate"],
		aggregations: ["count"],
	},
	quotes: {
		name: "Quotes",
		description: "Price quotes and proposals",
		fields: {
			title: { type: "string", description: "Quote title" },
			quoteNumber: { type: "string", description: "Quote reference number" },
			status: {
				type: "enum",
				description: "Quote status",
				values: ["draft", "sent", "approved", "declined", "expired"],
			},
			subtotal: { type: "number", description: "Subtotal before tax/discount" },
			total: { type: "number", description: "Final quote total" },
			sentAt: { type: "date", description: "When quote was sent" },
			approvedAt: { type: "date", description: "When quote was approved" },
			_creationTime: { type: "date", description: "When the quote was created" },
		},
		groupByFields: ["status", "conversionRate"],
		aggregations: ["count", "sum", "avg"],
	},
	invoices: {
		name: "Invoices",
		description: "Invoices and payment tracking",
		fields: {
			invoiceNumber: { type: "string", description: "Invoice reference number" },
			status: {
				type: "enum",
				description: "Invoice status",
				values: ["draft", "sent", "paid", "overdue", "cancelled"],
			},
			subtotal: { type: "number", description: "Subtotal before tax/discount" },
			total: { type: "number", description: "Final invoice total" },
			issuedDate: { type: "date", description: "When invoice was issued" },
			dueDate: { type: "date", description: "Payment due date" },
			paidAt: { type: "date", description: "When invoice was paid" },
		},
		groupByFields: ["status", "month", "client"],
		aggregations: ["count", "sum", "avg"],
	},
	activities: {
		name: "Activities",
		description: "Activity log and audit trail",
		fields: {
			activityType: {
				type: "enum",
				description: "Type of activity",
				values: [
					"client_created",
					"client_updated",
					"project_created",
					"project_updated",
					"project_completed",
					"quote_created",
					"quote_sent",
					"quote_approved",
					"quote_declined",
					"invoice_created",
					"invoice_sent",
					"invoice_paid",
					"task_created",
					"task_completed",
				],
			},
			entityType: {
				type: "enum",
				description: "Type of affected entity",
				values: ["client", "project", "quote", "invoice", "task"],
			},
			timestamp: { type: "date", description: "When the activity occurred" },
		},
		groupByFields: ["activityType", "entityType"],
		aggregations: ["count"],
	},
} as const;

export const schemaInfoTool = createTool({
	id: "get-schema-info",
	description:
		"Get information about available entities and their fields for building reports. Use this to understand what data can be queried and how it can be grouped or aggregated.",
	inputSchema: z.object({
		entityType: z
			.enum([
				"clients",
				"projects",
				"tasks",
				"quotes",
				"invoices",
				"activities",
				"all",
			])
			.optional()
			.default("all")
			.describe("Specific entity type to get schema for, or 'all' for everything"),
	}),
	outputSchema: z.object({
		entities: z
			.array(
				z.object({
					id: z.string(),
					name: z.string(),
					description: z.string(),
					fields: z.record(
						z.string(),
						z.object({
							type: z.string(),
							description: z.string(),
							values: z.array(z.string()).optional(),
						})
					),
					groupByFields: z.array(z.string()),
					aggregations: z.array(z.string()),
				})
			)
			.describe("Available entities with their schemas"),
	}),
	execute: async ({ context }) => {
		const { entityType } = context;

		if (entityType === "all") {
			const entities = Object.entries(ENTITY_SCHEMAS).map(([id, schema]) => ({
				id,
				name: schema.name,
				description: schema.description,
				fields: schema.fields as Record<
					string,
					{ type: string; description: string; values?: string[] }
				>,
				groupByFields: [...schema.groupByFields],
				aggregations: [...schema.aggregations],
			}));
			return { entities };
		}

		const schema = ENTITY_SCHEMAS[entityType as keyof typeof ENTITY_SCHEMAS];
		if (!schema) {
			return { entities: [] };
		}

		return {
			entities: [
				{
					id: entityType,
					name: schema.name,
					description: schema.description,
					fields: schema.fields as Record<
						string,
						{ type: string; description: string; values?: string[] }
					>,
					groupByFields: [...schema.groupByFields],
					aggregations: [...schema.aggregations],
				},
			],
		};
	},
});

