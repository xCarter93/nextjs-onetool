"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import Modal from "@/components/ui/modal";
import { StyledButton } from "@/components/ui/styled/styled-button";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import { CsvImportStep } from "@/app/(workspace)/clients/components/csv-import-step";
import type { CsvAnalysisResult, CsvImportState } from "@/types/csv-import";

interface CsvImportModalProps {
	isOpen: boolean;
	onClose: () => void;
	onComplete?: () => void;
}

export function CsvImportModal({
	isOpen,
	onClose,
	onComplete,
}: CsvImportModalProps) {
	const toast = useToast();
	const bulkCreateClients = useMutation(api.clients.bulkCreate);
	const bulkCreateProjects = useMutation(api.projects.bulkCreate);

	const [csvImportState, setCsvImportState] = useState<CsvImportState>({
		file: null,
		fileContent: null,
		entityType: "clients",
		isAnalyzing: false,
		analysisResult: null,
		mappings: [],
		isImporting: false,
		importResult: null,
	});

	const [error, setError] = useState<string | null>(null);

	const handleFileSelect = async (file: File, content: string) => {
		setCsvImportState((prev) => ({
			...prev,
			file,
			fileContent: content,
			isAnalyzing: true,
			analysisResult: null,
			mappings: [],
		}));

		try {
			const response = await fetch("/api/analyze-csv", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					csvContent: content,
					entityType: csvImportState.entityType,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to analyze CSV");
			}

			const analysisResult: CsvAnalysisResult = await response.json();

			setCsvImportState((prev) => ({
				...prev,
				isAnalyzing: false,
				analysisResult,
				mappings: analysisResult.detectedFields,
			}));
		} catch (err) {
			console.error("Error analyzing CSV:", err);
			toast.error(
				"Analysis Failed",
				err instanceof Error ? err.message : "Failed to analyze CSV file"
			);
			setCsvImportState((prev) => ({
				...prev,
				isAnalyzing: false,
			}));
		}
	};

	const handleMappingChange = (csvColumn: string, newSchemaField: string) => {
		setCsvImportState((prev) => ({
			...prev,
			mappings: (prev.mappings || []).map((m) =>
				m.csvColumn === csvColumn ? { ...m, schemaField: newSchemaField } : m
			),
		}));
	};

	const transformValue = (value: unknown, dataType: string): unknown => {
		if (value === null || value === undefined || value === "") {
			return undefined;
		}

		switch (dataType) {
			case "number":
				const num = parseFloat(String(value));
				return isNaN(num) ? undefined : num;
			case "boolean":
				if (typeof value === "boolean") return value;
				const str = String(value).toLowerCase().trim();
				return str === "true" || str === "yes" || str === "1";
			case "date":
				const date = new Date(String(value));
				return isNaN(date.getTime()) ? undefined : date.toISOString();
			case "array":
				// Handle array fields - split by common delimiters
				if (Array.isArray(value)) return value;
				const stringValue = String(value).trim();
				if (!stringValue) return undefined;

				// Split by semicolon, comma, or pipe - trim each item and filter empty strings
				const delimiter = stringValue.includes(";")
					? ";"
					: stringValue.includes(",")
						? ","
						: stringValue.includes("|")
							? "|"
							: ",";

				return stringValue
					.split(delimiter)
					.map((item) => item.trim())
					.filter((item) => item.length > 0);
			default:
				return value;
		}
	};

	const handleImportData = async () => {
		if (!csvImportState.fileContent || !csvImportState.analysisResult) {
			return;
		}

		setCsvImportState((prev) => ({ ...prev, isImporting: true }));
		setError(null);

		try {
			const Papa = (await import("papaparse")).default;
			const parseResult = Papa.parse(csvImportState.fileContent, {
				header: true,
				skipEmptyLines: true,
				dynamicTyping: true,
			});

			const rows = parseResult.data as Record<string, unknown>[];

			const records = rows.map((row) => {
				const record: Record<string, unknown> = {};

				(csvImportState.mappings || []).forEach((mapping) => {
					const csvValue = row[mapping.csvColumn];
					const transformedValue = transformValue(csvValue, mapping.dataType);

					if (transformedValue !== undefined) {
						record[mapping.schemaField] = transformedValue;
					}
				});

				return record;
			});

			let successCount = 0;
			let failureCount = 0;

			if (csvImportState.entityType === "clients") {
				try {
					await bulkCreateClients({
						clients: records as Parameters<
							typeof bulkCreateClients
						>[0]["clients"],
					});
					successCount = records.length;
				} catch (err) {
					failureCount = records.length;
					throw err;
				}
			} else if (csvImportState.entityType === "projects") {
				try {
					await bulkCreateProjects({
						projects: records as Parameters<
							typeof bulkCreateProjects
						>[0]["projects"],
					});
					successCount = records.length;
				} catch (err) {
					failureCount = records.length;
					throw err;
				}
			}

			setCsvImportState((prev) => ({
				...prev,
				isImporting: false,
				importResult: {
					successCount,
					failureCount,
					items: records.map((_, index) => ({
						success: index < successCount,
						rowIndex: index,
					})),
				},
			}));

			if (failureCount === 0) {
				toast.success(
					"Import Complete",
					`Successfully imported ${successCount} ${csvImportState.entityType}`
				);
			} else if (successCount > 0) {
				toast.warning(
					"Import Partially Complete",
					`Imported ${successCount} ${csvImportState.entityType}, ${failureCount} failed`
				);
			}
		} catch (err) {
			console.error("Error importing data:", err);
			toast.error(
				"Import Failed",
				err instanceof Error ? err.message : "Failed to import data"
			);
			setCsvImportState((prev) => ({
				...prev,
				isImporting: false,
			}));
		}
	};

	const handleClose = () => {
		setCsvImportState({
			file: null,
			fileContent: null,
			entityType: "clients",
			isAnalyzing: false,
			analysisResult: null,
			mappings: [],
			isImporting: false,
			importResult: null,
		});
		setError(null);
		onClose();
	};

	const handleComplete = () => {
		handleClose();
		onComplete?.();
	};

	return (
		<Modal isOpen={isOpen} onClose={handleClose} title="Import Data" size="lg">
			<div className="space-y-8">
				<p className="text-sm text-muted-foreground">
					Import your existing clients or projects from a CSV file. Our AI will
					help map your data to the correct fields.
				</p>

				{/* CSV Import Step Component */}
				<CsvImportStep
					entityType={csvImportState.entityType}
					onEntityTypeChange={(value) =>
						setCsvImportState((prev) => ({
							...prev,
							entityType: value,
							analysisResult: null,
							mappings: [],
						}))
					}
					isAnalyzing={csvImportState.isAnalyzing}
					onFileSelect={handleFileSelect}
					analysisResult={csvImportState.analysisResult}
					mappings={csvImportState.mappings || []}
					onMappingChange={handleMappingChange}
					importResult={csvImportState.importResult ?? null}
					error={error}
					showTitle={false}
					disabledEntityTypes={["projects"]}
				/>

				{/* Action Buttons */}
				<div className="flex justify-end gap-2 pt-4 border-t border-border">
					<StyledButton intent="outline" onClick={handleClose}>
						Close
					</StyledButton>

					{csvImportState.analysisResult && !csvImportState.importResult && (
						<StyledButton
							intent="primary"
							onClick={handleImportData}
							isLoading={csvImportState.isImporting}
							disabled={!csvImportState.analysisResult?.validation.isValid}
						>
							{csvImportState.isImporting ? (
								<>
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
									Importing...
								</>
							) : (
								<>
									<Upload className="w-4 h-4" />
									Import Data
								</>
							)}
						</StyledButton>
					)}

					{(csvImportState.importResult || !csvImportState.file) && (
						<StyledButton intent="primary" onClick={handleComplete}>
							Done
						</StyledButton>
					)}
				</div>
			</div>
		</Modal>
	);
}
