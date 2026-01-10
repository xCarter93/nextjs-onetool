"use client";

import { Info, Check, Circle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { EntityType } from "@/types/csv-import";
import { CLIENT_SCHEMA_FIELDS, PROJECT_SCHEMA_FIELDS } from "@/types/csv-import";

interface CsvSchemaGuideProps {
	entityType: EntityType;
}

/**
 * Displays the schema fields for CSV import, showing users
 * what columns they can include in their CSV file.
 *
 * Required fields are highlighted, optional fields are listed below.
 * Auto-generated fields (orgId, etc.) are not shown.
 */
export function CsvSchemaGuide({ entityType }: CsvSchemaGuideProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	const schemaFields = entityType === "clients"
		? CLIENT_SCHEMA_FIELDS
		: PROJECT_SCHEMA_FIELDS;

	const requiredFields = Object.entries(schemaFields)
		.filter(([, info]) => info.required)
		.map(([name, info]) => ({ name, ...info }));

	const optionalFields = Object.entries(schemaFields)
		.filter(([, info]) => !info.required)
		.map(([name, info]) => ({ name, ...info }));

	const getTypeLabel = (type: string) => {
		switch (type) {
			case "enum":
				return "Select one";
			case "array":
				return "List (comma-separated)";
			case "id":
				return "Reference ID";
			case "number":
				return "Number";
			default:
				return "Text";
		}
	};

	return (
		<div className="border border-border rounded-lg bg-muted/20 overflow-hidden">
			{/* Header - Always visible */}
			<button
				type="button"
				onClick={() => setIsExpanded(!isExpanded)}
				className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
			>
				<div className="flex items-center gap-2">
					<Info className="w-4 h-4 text-primary" />
					<span className="text-sm font-medium text-foreground">
						CSV Column Guide for {entityType === "clients" ? "Clients" : "Projects"}
					</span>
				</div>
				<div className="flex items-center gap-2">
					<span className="text-xs text-muted-foreground">
						{requiredFields.length} required, {optionalFields.length} optional
					</span>
					{isExpanded ? (
						<ChevronUp className="w-4 h-4 text-muted-foreground" />
					) : (
						<ChevronDown className="w-4 h-4 text-muted-foreground" />
					)}
				</div>
			</button>

			{/* Expandable content */}
			{isExpanded && (
				<div className="border-t border-border p-4 space-y-4">
					{/* Required Fields */}
					<div>
						<h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
							<Check className="w-3.5 h-3.5 text-green-600" />
							Required Columns
						</h4>
						<div className="grid gap-2">
							{requiredFields.map((field) => (
								<div
									key={field.name}
									className="flex items-start gap-3 p-2 rounded-md bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900"
								>
									<div className="flex-1">
										<div className="flex items-center gap-2">
											<code className="text-xs font-mono bg-green-100 dark:bg-green-900/50 px-1.5 py-0.5 rounded text-green-800 dark:text-green-200">
												{field.name}
											</code>
											<span className="text-xs text-muted-foreground">
												({getTypeLabel(field.type)})
											</span>
										</div>
										{"options" in field && field.options && (
											<div className="mt-1 text-xs text-muted-foreground">
												Options: {field.options.join(", ")}
											</div>
										)}
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Optional Fields */}
					<div>
						<h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
							<Circle className="w-3 h-3 text-muted-foreground" />
							Optional Columns
						</h4>
						<div className="grid gap-1.5">
							{optionalFields.map((field) => (
								<div
									key={field.name}
									className="flex items-start gap-3 p-2 rounded-md bg-muted/30 border border-border"
								>
									<div className="flex-1">
										<div className="flex items-center gap-2">
											<code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">
												{field.name}
											</code>
											<span className="text-xs text-muted-foreground">
												({getTypeLabel(field.type)})
											</span>
										</div>
										{"options" in field && field.options && (
											<div className="mt-1 text-xs text-muted-foreground">
												Options: {field.options.join(", ")}
											</div>
										)}
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Tips */}
					<div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-md">
						<h4 className="text-xs font-semibold text-blue-800 dark:text-blue-200 mb-1">
							Tips for your CSV file
						</h4>
						<ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
							<li>• Column headers should match the field names above (case-insensitive)</li>
							<li>• For list fields like tags, separate values with commas, semicolons, or pipes</li>
							<li>• Missing required fields will use sensible defaults when possible</li>
							<li>• Our AI will attempt to map similar column names automatically</li>
						</ul>
					</div>
				</div>
			)}
		</div>
	);
}
