import { NextRequest, NextResponse } from "next/server";
import { mastra } from "@/mastra";

/**
 * API Route for the Report Agent
 * Handles natural language requests to generate report configurations
 */
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { prompt } = body;

		if (!prompt || typeof prompt !== "string") {
			return NextResponse.json(
				{ error: "Missing or invalid prompt" },
				{ status: 400 }
			);
		}

		// Get the report agent from Mastra
		const reportAgent = mastra.getAgent("reportAgent");

		if (!reportAgent) {
			return NextResponse.json(
				{ error: "Report agent not found" },
				{ status: 500 }
			);
		}

		// Generate report configuration using the agent
		const response = await reportAgent.generate(
			`Generate a report configuration for the following request: "${prompt}"
			
Use the available tools to:
1. First, get schema info to understand available entities
2. Then, build the report configuration based on the user's intent
3. Return the complete configuration

Respond with a JSON object containing:
- config: The report configuration object
- visualization: The visualization settings
- suggestedName: A suggested name for the report
- suggestedDescription: A suggested description`
		);

		// Parse the response to extract configuration
		const textContent = response.text;
		
		// Try to extract JSON from the response
		let result;
		try {
			// Look for JSON in the response
			const jsonMatch = textContent.match(/\{[\s\S]*\}/);
			if (jsonMatch) {
				result = JSON.parse(jsonMatch[0]);
			} else {
				// If no JSON found, create a default configuration based on common patterns
				result = inferConfigFromPrompt(prompt);
			}
		} catch {
			// If parsing fails, infer configuration from the prompt
			result = inferConfigFromPrompt(prompt);
		}

		return NextResponse.json(result);
	} catch (error) {
		console.error("Report agent error:", error);
		return NextResponse.json(
			{ error: "Failed to generate report configuration" },
			{ status: 500 }
		);
	}
}

/**
 * Infer report configuration from natural language prompt
 * Fallback when agent parsing fails
 */
function inferConfigFromPrompt(prompt: string): {
	config: {
		entityType: string;
		groupBy?: string[];
		dateRange?: { start?: number; end?: number };
	};
	visualization: { type: string };
	suggestedName: string;
	suggestedDescription: string;
} {
	const promptLower = prompt.toLowerCase();

	// Detect entity type
	let entityType = "clients";
	if (promptLower.includes("client") || promptLower.includes("customer")) {
		entityType = "clients";
	} else if (promptLower.includes("project")) {
		entityType = "projects";
	} else if (promptLower.includes("task")) {
		entityType = "tasks";
	} else if (promptLower.includes("quote") || promptLower.includes("proposal")) {
		entityType = "quotes";
	} else if (
		promptLower.includes("invoice") ||
		promptLower.includes("revenue") ||
		promptLower.includes("payment")
	) {
		entityType = "invoices";
	} else if (promptLower.includes("activity") || promptLower.includes("log")) {
		entityType = "activities";
	}

	// Detect groupBy
	let groupBy: string | undefined;
	if (promptLower.includes("by status")) {
		groupBy = "status";
	} else if (
		promptLower.includes("by source") ||
		promptLower.includes("lead source")
	) {
		groupBy = "leadSource";
	} else if (promptLower.includes("by type")) {
		groupBy = entityType === "projects" ? "projectType" : "type";
	} else if (promptLower.includes("by month") || promptLower.includes("monthly")) {
		groupBy = "month";
	} else if (promptLower.includes("by client")) {
		groupBy = "client";
	} else if (
		promptLower.includes("conversion") ||
		promptLower.includes("approved")
	) {
		groupBy = entityType === "quotes" ? "conversionRate" : "status";
	} else if (promptLower.includes("completion")) {
		groupBy = "completionRate";
	} else {
		// Default groupBy based on entity
		groupBy = "status";
	}

	// Detect visualization type
	let vizType = "bar";
	if (
		promptLower.includes("trend") ||
		promptLower.includes("over time") ||
		promptLower.includes("monthly") ||
		groupBy === "month"
	) {
		vizType = "line";
	} else if (
		promptLower.includes("pie") ||
		promptLower.includes("distribution") ||
		promptLower.includes("breakdown")
	) {
		vizType = "pie";
	} else if (promptLower.includes("table") || promptLower.includes("list")) {
		vizType = "table";
	}

	// Detect date range
	let dateRange: { start?: number; end?: number } | undefined;
	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

	if (promptLower.includes("this month")) {
		const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
		const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
		endOfMonth.setHours(23, 59, 59, 999);
		dateRange = { start: startOfMonth.getTime(), end: endOfMonth.getTime() };
	} else if (
		promptLower.includes("this quarter") ||
		promptLower.includes("quarterly")
	) {
		const quarter = Math.floor(today.getMonth() / 3);
		const startOfQuarter = new Date(today.getFullYear(), quarter * 3, 1);
		const endOfQuarter = new Date(today.getFullYear(), (quarter + 1) * 3, 0);
		endOfQuarter.setHours(23, 59, 59, 999);
		dateRange = { start: startOfQuarter.getTime(), end: endOfQuarter.getTime() };
	} else if (promptLower.includes("this year") || promptLower.includes("yearly")) {
		const startOfYear = new Date(today.getFullYear(), 0, 1);
		const endOfYear = new Date(today.getFullYear(), 11, 31);
		endOfYear.setHours(23, 59, 59, 999);
		dateRange = { start: startOfYear.getTime(), end: endOfYear.getTime() };
	}

	// Generate name
	const entityLabel =
		entityType.charAt(0).toUpperCase() + entityType.slice(1);
	const groupByLabel = groupBy
		? groupBy.charAt(0).toUpperCase() + groupBy.slice(1)
		: "";
	const suggestedName = groupBy
		? `${entityLabel} by ${groupByLabel}`
		: `${entityLabel} Report`;

	return {
		config: {
			entityType,
			groupBy: groupBy ? [groupBy] : undefined,
			dateRange,
		},
		visualization: { type: vizType },
		suggestedName,
		suggestedDescription: prompt,
	};
}

