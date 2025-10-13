import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import {
	CLIENT_SCHEMA_FIELDS,
	PROJECT_SCHEMA_FIELDS,
} from "@/types/csv-import";

export const mapSchemaTool = createTool({
	id: "map-schema",
	description:
		"Map CSV column headers to Convex schema fields for clients or projects. Returns field mappings with confidence scores.",
	inputSchema: z.object({
		entityType: z
			.enum(["clients", "projects"])
			.describe("Type of entity to map (clients or projects)"),
		headers: z
			.array(z.string())
			.describe("CSV column headers to map to schema fields"),
		sampleRows: z
			.array(z.record(z.string(), z.string()))
			.optional()
			.describe("Optional sample data rows for context"),
	}),
	outputSchema: z.object({
		mappings: z
			.array(
				z.object({
					csvColumn: z.string(),
					schemaField: z.string(),
					confidence: z.number().min(0).max(1),
					dataType: z.string(),
					isRequired: z.boolean(),
					sampleValue: z.string().optional(),
				})
			)
			.describe("Proposed mappings from CSV columns to schema fields"),
		unmappedColumns: z
			.array(z.string())
			.describe("CSV columns that couldn't be mapped"),
		missingRequiredFields: z
			.array(z.string())
			.describe("Required schema fields not found in CSV"),
	}),
	execute: async ({ context }) => {
		const { entityType, headers, sampleRows } = context;

		// Select the appropriate schema
		const schema =
			entityType === "clients" ? CLIENT_SCHEMA_FIELDS : PROJECT_SCHEMA_FIELDS;

		const mappings: Array<{
			csvColumn: string;
			schemaField: string;
			confidence: number;
			dataType: string;
			isRequired: boolean;
			sampleValue?: string;
		}> = [];
		const unmappedColumns: string[] = [];
		const mappedSchemaFields = new Set<string>();

		type BestMatch = {
			field: string;
			confidence: number;
			dataType: string;
			isRequired: boolean;
		};

		// Mapping logic: try to match CSV headers to schema fields
		headers.forEach((header) => {
			const normalizedHeader = header
				.toLowerCase()
				.trim()
				.replace(/[_\s\-?]/g, "");
			let bestMatch: BestMatch | null = null;

			// Try to find a matching schema field
			Object.entries(schema).forEach(([fieldName, fieldInfo]) => {
				const normalizedField = fieldName.toLowerCase().replace(/[_\s]/g, "");
				let confidence = 0;

				// Exact match
				if (normalizedHeader === normalizedField) {
					confidence = 1.0;
				}
				// Partial match
				else if (
					normalizedHeader.includes(normalizedField) ||
					normalizedField.includes(normalizedHeader)
				) {
					confidence = 0.8;
				}
				// Special case mappings
				else if (
					(normalizedHeader === "name" || normalizedHeader === "company") &&
					fieldName === "companyName"
				) {
					confidence = 0.9;
				} else if (
					normalizedHeader === "client" &&
					(fieldName === "clientId" || fieldName === "companyName")
				) {
					confidence = 0.7;
				}

				// Update best match if this is better
				const fieldType =
					typeof fieldInfo === "object" && "type" in fieldInfo
						? fieldInfo.type
						: "string";
				const fieldRequired =
					typeof fieldInfo === "object" && "required" in fieldInfo
						? fieldInfo.required
						: false;

				if (
					confidence > 0 &&
					(!bestMatch || confidence > bestMatch.confidence)
				) {
					bestMatch = {
						field: fieldName,
						confidence,
						dataType: String(fieldType),
						isRequired: Boolean(fieldRequired),
					};
				}
			});

			if (bestMatch) {
				const match: BestMatch = bestMatch;
				if (match.confidence >= 0.7) {
					const sampleValue = sampleRows?.[0]?.[header];
					mappings.push({
						csvColumn: header,
						schemaField: match.field,
						confidence: match.confidence,
						dataType: match.dataType,
						isRequired: match.isRequired,
						sampleValue:
							sampleValue !== undefined && sampleValue !== null
								? String(sampleValue)
								: undefined,
					});
					mappedSchemaFields.add(match.field);
				} else {
					unmappedColumns.push(header);
				}
			} else {
				unmappedColumns.push(header);
			}
		});

		// Find required fields that weren't mapped
		const missingRequiredFields = Object.entries(schema)
			.filter(
				([fieldName, info]) =>
					info.required && !mappedSchemaFields.has(fieldName)
			)
			.map(([fieldName]) => fieldName);

		return {
			mappings,
			unmappedColumns,
			missingRequiredFields,
		};
	},
});
