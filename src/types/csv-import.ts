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

// Schema field definitions for reference
export const CLIENT_SCHEMA_FIELDS = {
	// Required fields
	companyName: { type: "string", required: true },
	status: {
		type: "enum",
		required: true,
		values: ["lead", "prospect", "active", "inactive", "archived"],
	},
	emailOptIn: { type: "boolean", required: true },
	smsOptIn: { type: "boolean", required: true },

	// Optional fields
	industry: { type: "string", required: false },
	companyDescription: { type: "string", required: false },
	leadSource: {
		type: "enum",
		required: false,
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
	category: {
		type: "enum",
		required: false,
		values: [
			"design",
			"development",
			"consulting",
			"maintenance",
			"marketing",
			"other",
		],
	},
	clientSize: {
		type: "enum",
		required: false,
		values: ["small", "medium", "large", "enterprise"],
	},
	clientType: {
		type: "enum",
		required: false,
		values: [
			"new-client",
			"existing-client",
			"partner",
			"vendor",
			"contractor",
		],
	},
	isActive: { type: "boolean", required: false },
	priorityLevel: {
		type: "enum",
		required: false,
		values: ["low", "medium", "high", "urgent"],
	},
	projectDimensions: { type: "string", required: false },
	communicationPreference: {
		type: "enum",
		required: false,
		values: ["email", "phone", "both"],
	},
	servicesNeeded: { type: "array", required: false },
	tags: { type: "array", required: false },
	notes: { type: "string", required: false },
} as const;

export const PROJECT_SCHEMA_FIELDS = {
	// Required fields
	title: { type: "string", required: true },
	status: {
		type: "enum",
		required: true,
		values: ["planned", "in-progress", "completed", "cancelled"],
	},
	projectType: {
		type: "enum",
		required: true,
		values: ["one-off", "recurring"],
	},
	clientId: { type: "id", required: true }, // Can be resolved from client name

	// Optional fields
	description: { type: "string", required: false },
	instructions: { type: "string", required: false },
	projectNumber: { type: "string", required: false },
	startDate: { type: "number", required: false },
	endDate: { type: "number", required: false },
	salespersonId: { type: "id", required: false },
	assignedUserIds: { type: "array", required: false },
	invoiceReminderEnabled: { type: "boolean", required: false },
	scheduleForLater: { type: "boolean", required: false },
} as const;
