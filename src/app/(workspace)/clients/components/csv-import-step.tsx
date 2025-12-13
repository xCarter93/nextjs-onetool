"use client";

import { CsvUploadZone } from "@/app/(workspace)/clients/components/csv-upload-zone";
import { CsvMappingPreview } from "@/app/(workspace)/clients/components/csv-mapping-preview";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Users, Building2, Check } from "lucide-react";
import type {
	EntityType,
	CsvAnalysisResult,
	FieldMapping,
	ImportResult,
} from "@/types/csv-import";

interface CsvImportStepProps {
	entityType: EntityType;
	onEntityTypeChange: (type: EntityType) => void;
	isAnalyzing: boolean;
	onFileSelect: (file: File, content: string) => void;
	analysisResult: CsvAnalysisResult | null;
	mappings: FieldMapping[];
	onMappingChange: (csvColumn: string, newSchemaField: string) => void;
	importResult: ImportResult | null;
	error?: string | null;
	showTitle?: boolean;
	disabledEntityTypes?: EntityType[];
	disabled?: boolean;
}

export function CsvImportStep({
	entityType,
	onEntityTypeChange,
	isAnalyzing,
	onFileSelect,
	analysisResult,
	mappings,
	onMappingChange,
	importResult,
	error,
	showTitle = true,
	disabledEntityTypes = [],
	disabled = false,
}: CsvImportStepProps) {
	return (
		<div
			className={`space-y-8 ${
				disabled ? "opacity-50 pointer-events-none" : ""
			}`}
		>
			{showTitle && (
				<div>
					<div className="flex items-center gap-3 mb-3">
						<div className="w-1.5 h-6 bg-linear-to-b from-primary to-primary/60 rounded-full" />
						<h2 className="text-2xl font-semibold text-foreground tracking-tight">
							Import Existing Data
						</h2>
					</div>
					<p className="text-muted-foreground ml-5 leading-relaxed">
						Optionally import your existing clients or projects from a CSV file.
						Our AI will help map your data to the correct fields.
					</p>
				</div>
			)}

			{/* Entity Type Selection */}
			<div>
				<label className="block text-sm font-semibold text-foreground mb-4 tracking-wide">
					What type of data are you importing?
				</label>
				<RadioGroup
					value={entityType}
					onValueChange={(value) => onEntityTypeChange(value as EntityType)}
					className="grid grid-cols-2 gap-4"
				>
					<div>
						<RadioGroupItem
							value="clients"
							id="step-clients"
							className="peer sr-only"
						/>
						<Label
							htmlFor="step-clients"
							className="flex flex-col items-center justify-between rounded-lg border-2 border-border bg-background p-4 hover:bg-muted/30 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
						>
							<Users className="mb-3 h-6 w-6 text-muted-foreground peer-data-[state=checked]:text-primary" />
							<div className="text-center">
								<div className="font-semibold text-sm">Clients</div>
								<div className="text-xs text-muted-foreground mt-1">
									Import client/customer data
								</div>
							</div>
						</Label>
					</div>
					<div>
						<RadioGroupItem
							value="projects"
							id="step-projects"
							className="peer sr-only"
							disabled={disabledEntityTypes.includes("projects")}
						/>
						<Label
							htmlFor="step-projects"
							className={`flex flex-col items-center justify-between rounded-lg border-2 border-border bg-background p-4 hover:bg-muted/30 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all ${
								disabledEntityTypes.includes("projects")
									? "opacity-50 cursor-not-allowed bg-muted/20"
									: ""
							}`}
						>
							<Building2
								className={`mb-3 h-6 w-6 text-muted-foreground peer-data-[state=checked]:text-primary ${
									disabledEntityTypes.includes("projects") ? "opacity-50" : ""
								}`}
							/>
							<div className="text-center">
								<div className="font-semibold text-sm">Projects</div>
								<div className="text-xs text-muted-foreground mt-1">
									Import project data
								</div>
								{disabledEntityTypes.includes("projects") && (
									<div className="text-xs text-amber-600 dark:text-amber-400 mt-1 font-medium">
										Coming soon
									</div>
								)}
							</div>
						</Label>
					</div>
				</RadioGroup>
			</div>

			{/* CSV Upload */}
			<div>
				<label className="block text-sm font-semibold text-foreground mb-4 tracking-wide">
					Upload CSV File
				</label>
				<CsvUploadZone onFileSelect={onFileSelect} maxSizeMB={5} />
			</div>

			{/* AI Analysis Loading */}
			{isAnalyzing && (
				<div className="p-6 bg-muted/30 border border-border rounded-lg">
					<div className="flex items-center gap-3">
						<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
						<div>
							<p className="text-sm font-medium text-foreground">
								AI is analyzing your data...
							</p>
							<p className="text-xs text-muted-foreground mt-1">
								This may take a moment
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Mapping Preview */}
			{analysisResult && mappings.length > 0 && (
				<div>
					<label className="block text-sm font-semibold text-foreground mb-4 tracking-wide">
						Review & Adjust Field Mappings
					</label>
					<CsvMappingPreview
						entityType={entityType}
						mappings={mappings}
						validation={analysisResult.validation}
						onMappingChange={onMappingChange}
					/>
				</div>
			)}

			{/* Import Result */}
			{importResult && (
				<div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
					<div className="flex items-start gap-3">
						<Check className="w-5 h-5 text-green-600 mt-0.5" />
						<div>
							<p className="text-sm font-semibold text-green-800 dark:text-green-200">
								Import Complete
							</p>
							<p className="text-xs text-green-700 dark:text-green-300 mt-1">
								Successfully imported {importResult.successCount} {entityType}
								{importResult.failureCount > 0 &&
									` (${importResult.failureCount} failed)`}
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Error Display */}
			{error && (
				<div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
					<p className="text-sm text-red-800 dark:text-red-200">{error}</p>
				</div>
			)}
		</div>
	);
}
