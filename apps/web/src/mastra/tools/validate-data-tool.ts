import { createTool } from "@mastra/core/tools";
import { z } from 'zod/v3';
import {
	CLIENT_SCHEMA_FIELDS,
	PROJECT_SCHEMA_FIELDS,
} from "@/types/csv-import";

export const validateDataTool = createTool({
	id: "validate-data",
	description:
		"Validate mapped CSV data against schema requirements. Checks for required fields, data types, and enum values.",
	inputSchema: z.object({
		entityType: z
			.enum(["clients", "projects"])
			.describe("Type of entity being validated"),
		mappings: z
			.array(
				z.object({
					csvColumn: z.string(),
					schemaField: z.string(),
					confidence: z.number(),
					dataType: z.string(),
					isRequired: z.boolean(),
				})
			)
			.describe("Field mappings to validate"),
		sampleRows: z
			.array(z.record(z.string(), z.string()))
			.optional()
			.describe("Optional sample data rows for validation"),
	}),
	outputSchema: z.object({
		isValid: z.boolean().describe("Whether the data passes all validations"),
		errors: z
			.array(
				z.object({
					field: z.string(),
					message: z.string(),
					severity: z.enum(["error", "warning"]),
				})
			)
			.describe("Validation errors found"),
		warnings: z
			.array(
				z.object({
					field: z.string(),
					message: z.string(),
					severity: z.enum(["error", "warning"]),
				})
			)
			.describe("Validation warnings found"),
		missingRequiredFields: z
			.array(z.string())
			.describe("Required fields that are missing"),
		suggestedDefaults: z
			.record(z.string(), z.union([z.string(), z.boolean(), z.number()]))
			.describe("Suggested default values for missing fields"),
	}),
	execute: async (input) => {
		const { entityType, mappings, sampleRows } = input;

		// Select the appropriate schema
		const schema =
			entityType === "clients" ? CLIENT_SCHEMA_FIELDS : PROJECT_SCHEMA_FIELDS;

		const errors: Array<{
			field: string;
			message: string;
			severity: "error" | "warning";
		}> = [];
		const missingRequiredFields: string[] = [];
		const suggestedDefaults: Record<string, string | boolean | number> = {};

		// Check for missing required fields
		Object.entries(schema).forEach(([fieldName, fieldInfo]) => {
			if (fieldInfo.required) {
				const isMapped = mappings.some(
					(m) => m.schemaField === fieldName && m.confidence >= 0.7
				);
				if (!isMapped) {
					missingRequiredFields.push(fieldName);
					errors.push({
						field: fieldName,
						message: `Required field "${fieldName}" is not mapped`,
						severity: "error",
					});
				}
			}
		});

		// Validate enum values for mapped fields (only if sample data is provided)
		if (sampleRows && sampleRows.length > 0) {
			mappings.forEach((mapping) => {
				const fieldInfo = schema[mapping.schemaField as keyof typeof schema];
				if (
					fieldInfo &&
					"options" in fieldInfo &&
					Array.isArray(fieldInfo.options)
				) {
					// Check if sample data contains valid enum values
					const sampleValue = sampleRows[0]?.[mapping.csvColumn];
					const options = fieldInfo.options as string[];
					if (sampleValue && !options.includes(sampleValue)) {
						errors.push({
							field: mapping.schemaField,
							message: `Value "${sampleValue}" is not valid for ${mapping.schemaField}. Expected one of: ${options.join(", ")}`,
							severity: "warning",
						});
					}
				}
			});
		}

		// Suggest defaults for common fields with correct types
		if (entityType === "clients") {
			if (missingRequiredFields.includes("status")) {
				suggestedDefaults.status = "lead";
			}
			if (missingRequiredFields.includes("emailOptIn")) {
				suggestedDefaults.emailOptIn = false;
			}
			if (missingRequiredFields.includes("smsOptIn")) {
				suggestedDefaults.smsOptIn = false;
			}
		} else if (entityType === "projects") {
			if (missingRequiredFields.includes("status")) {
				suggestedDefaults.status = "planned";
			}
			if (missingRequiredFields.includes("projectType")) {
				suggestedDefaults.projectType = "one-off";
			}
		}

		// Check for low confidence mappings
		mappings.forEach((mapping) => {
			if (mapping.confidence < 0.8 && mapping.isRequired) {
				errors.push({
					field: mapping.schemaField,
					message: `Low confidence mapping (${Math.round(mapping.confidence * 100)}%) for required field "${mapping.schemaField}"`,
					severity: "warning",
				});
			}
		});

		// Separate errors and warnings
		const actualErrors = errors.filter((e) => e.severity === "error");
		const warnings = errors.filter((e) => e.severity === "warning");

		const isValid =
			missingRequiredFields.length === 0 && actualErrors.length === 0;

		return {
			isValid,
			errors: actualErrors,
			warnings,
			missingRequiredFields,
			suggestedDefaults,
		};
	},
});
