import { NextRequest, NextResponse } from "next/server";
import { mastra } from "@/mastra";
import type {
	CsvAnalysisResult,
	FieldMapping,
	ValidationError,
} from "@/types/csv-import";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { csvContent, entityType } = body;

		// Validate input
		if (!csvContent || typeof csvContent !== "string") {
			return NextResponse.json(
				{ error: "CSV content is required" },
				{ status: 400 }
			);
		}

		if (csvContent.length > MAX_FILE_SIZE) {
			return NextResponse.json(
				{ error: "File size exceeds 5MB limit" },
				{ status: 400 }
			);
		}

		if (entityType && !["clients", "projects"].includes(entityType)) {
			return NextResponse.json(
				{ error: 'Entity type must be "clients" or "projects"' },
				{ status: 400 }
			);
		}

		// Get the CSV import agent
		const agent = mastra.getAgent("csvImportAgent");

		if (!agent) {
			return NextResponse.json(
				{ error: "CSV import agent not found" },
				{ status: 500 }
			);
		}

		// Prepare the prompt for the agent
		const prompt = entityType
			? `Analyze this CSV file for ${entityType} data. Parse the CSV, map the columns to the schema fields, and validate the data. Here's the CSV content:\n\n${csvContent}`
			: `Analyze this CSV file and determine if it contains client or project data. Then parse, map, and validate accordingly. Here's the CSV content:\n\n${csvContent}`;

		// Call the agent to analyze the CSV
		const response = await agent.generate(prompt, { maxSteps: 10 });

		// Extract tool results from the agent's response
		type ToolResult = {
			payload?: {
				toolName?: string;
				result?: unknown;
			};
		};

		// In Mastra v1, toolName uses the property name from the tools object
		const parseResult = response.toolResults?.find(
			(tr: ToolResult) => tr.payload?.toolName === "parseCsv"
		)?.payload?.result as
			| {
					sampleRows: Record<string, string>[];
					headers: string[];
					totalRows: number;
			  }
			| undefined;

		const mapResult = response.toolResults?.find(
			(tr: ToolResult) => tr.payload?.toolName === "mapSchema"
		)?.payload?.result as
			| {
					mappings: FieldMapping[];
					unmappedColumns: string[];
					missingRequiredFields: string[];
			  }
			| undefined;

		const validateResult = response.toolResults?.find(
			(tr: ToolResult) => tr.payload?.toolName === "validateData"
		)?.payload?.result as
			| {
					isValid: boolean;
					errors: ValidationError[];
					warnings: ValidationError[];
					missingRequiredFields: string[];
					suggestedDefaults: Record<string, string>;
			  }
			| undefined;

		// Build the analysis result from tool outputs
		const analysisResult: CsvAnalysisResult = {
			entityType: entityType || "clients",
			detectedFields: mapResult?.mappings || [],
			validation: validateResult
				? {
						isValid: validateResult.isValid,
						errors: validateResult.errors,
						warnings: validateResult.warnings,
						missingRequiredFields: validateResult.missingRequiredFields,
					}
				: {
						isValid: false,
						errors: [],
						warnings: [],
						missingRequiredFields: mapResult?.missingRequiredFields || [],
					},
			suggestedDefaults: validateResult?.suggestedDefaults || {},
			confidence: 0.8,
			sampleData: parseResult?.sampleRows || [],
		};

		return NextResponse.json(analysisResult);
	} catch (error) {
		console.error("Error analyzing CSV:", error);
		return NextResponse.json(
			{
				error: "Failed to analyze CSV",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
