import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import Papa from "papaparse";

export const parseCsvTool = createTool({
	id: "parse-csv",
	description:
		"Parse CSV data and extract headers, sample rows, and basic statistics",
	inputSchema: z.object({
		csvContent: z.string().describe("Raw CSV file content as a string"),
		sampleSize: z
			.number()
			.optional()
			.default(5)
			.describe("Number of sample rows to extract (default: 5)"),
	}),
	outputSchema: z.object({
		headers: z.array(z.string()).describe("Column headers from the CSV"),
		sampleRows: z
			.array(z.record(z.string(), z.string()))
			.describe("Sample data rows from the CSV"),
		totalRows: z.number().describe("Total number of data rows in the CSV"),
		dataTypes: z
			.record(z.string(), z.string())
			.describe("Detected data types for each column"),
	}),
	execute: async (input) => {
		const { csvContent, sampleSize } = input;

		return new Promise((resolve, reject) => {
			Papa.parse(csvContent, {
				header: true,
				skipEmptyLines: true,
				dynamicTyping: true,
				complete: (results) => {
					const headers = results.meta.fields || [];
					const allRows = results.data as Record<string, unknown>[];
					const sampleRows = allRows.slice(0, sampleSize);

					// Convert sample rows to string records for schema compliance
					const stringifiedSampleRows = sampleRows.map((row) => {
						const stringRow: Record<string, string> = {};
						Object.entries(row).forEach(([key, value]) => {
							stringRow[key] = String(value ?? "");
						});
						return stringRow;
					});

					// Detect data types by examining sample rows
					const dataTypes: Record<string, string> = {};
					headers.forEach((header) => {
						const values = sampleRows
							.map((row) => row[header])
							.filter((v) => v !== null && v !== undefined && v !== "");

						if (values.length === 0) {
							dataTypes[header] = "unknown";
						} else {
							const firstValue = values[0];
							if (typeof firstValue === "number") {
								dataTypes[header] = "number";
							} else if (typeof firstValue === "boolean") {
								dataTypes[header] = "boolean";
							} else if (
								typeof firstValue === "string" &&
								!isNaN(Date.parse(firstValue))
							) {
								dataTypes[header] = "date";
							} else {
								dataTypes[header] = "string";
							}
						}
					});

					resolve({
						headers,
						sampleRows: stringifiedSampleRows,
						totalRows: allRows.length,
						dataTypes,
					});
				},
				error: (error: Error) => {
					reject(new Error(`Failed to parse CSV: ${error.message}`));
				},
			});
		});
	},
});
