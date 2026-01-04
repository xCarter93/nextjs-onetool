// Type definitions for CSV import feature

export type EntityType = "clients" | "projects";

export interface CsvData {
	headers: string[];
	rows: Record<string, string | number | boolean>[];
	rowCount: number;
}

export interface FieldMapping {
	csvColumn: string;
	schemaField: string;
	confidence: number; // 0-1 score indicating mapping confidence
	dataType: string;
	isRequired: boolean;
	sampleValue?: string | number | boolean;
}

export interface ValidationError {
	field: string;
	message: string;
	severity: "error" | "warning";
}

export interface ValidationResult {
	isValid: boolean;
	errors: ValidationError[];
	warnings: ValidationError[];
	missingRequiredFields: string[];
}

export interface CsvAnalysisResult {
	entityType: EntityType;
	detectedFields: FieldMapping[];
	validation: ValidationResult;
	suggestedDefaults: Record<string, string | boolean | number>;
	confidence: number;
	sampleData?: Record<string, string>[];
}

export interface ImportResultItem {
	success: boolean;
	id?: string;
	error?: string;
	rowIndex: number;
}

export interface ImportResult {
	successCount: number;
	failureCount: number;
	items: ImportResultItem[];
}

/**
 * State for CSV import flow
 */
export interface CsvImportState {
	file: File | null;
	fileContent: string | null;
	entityType: EntityType;
	isAnalyzing: boolean;
	analysisResult: CsvAnalysisResult | null;
	mappings?: FieldMapping[];
	isImporting?: boolean;
	importResult?: ImportResult | null;
	skipImport?: boolean;
}

// Schema field definitions for reference - must match convex/schema.ts clients table
export const CLIENT_SCHEMA_FIELDS = {
	// Required fields (from schema)
	companyName: { type: "string", required: true },
	status: {
		type: "enum",
		required: true,
		options: ["lead", "active", "inactive", "archived"],
	},

	// Optional fields (from schema)
	companyDescription: { type: "string", required: false },
	leadSource: {
		type: "enum",
		required: false,
		options: [
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
		required: false,
		options: ["email", "phone", "both"],
	},
	tags: { type: "array", required: false },
	notes: { type: "string", required: false },
} as const;

// Schema field definitions for reference - must match convex/schema.ts projects table
export const PROJECT_SCHEMA_FIELDS = {
	// Required fields (from schema)
	title: { type: "string", required: true },
	status: {
		type: "enum",
		required: true,
		options: ["planned", "in-progress", "completed", "cancelled"],
	},
	projectType: {
		type: "enum",
		required: true,
		options: ["one-off", "recurring"],
	},
	clientId: { type: "id", required: true }, // Can be resolved from client name

	// Optional fields (from schema)
	description: { type: "string", required: false },
	projectNumber: { type: "string", required: false },
	startDate: { type: "number", required: false },
	endDate: { type: "number", required: false },
	assignedUserIds: { type: "array", required: false },
} as const;
