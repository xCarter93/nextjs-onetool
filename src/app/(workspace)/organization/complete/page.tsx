"use client";

import React, { useMemo, useState } from "react";
import { useUser, useOrganization } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import ProgressBar, { ProgressStep } from "@/components/shared/progress-bar";
import SelectService from "@/components/shared/choice-set";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAutoTimezone } from "@/hooks/use-auto-timezone";
import { Users, Building2, Globe, Upload } from "lucide-react";
import { api } from "../../../../../convex/_generated/api";
import { CsvImportStep } from "@/app/(workspace)/clients/components/csv-import-step";
import { StyledButton } from "@/components/ui/styled/styled-button";
import type {
	EntityType,
	CsvAnalysisResult,
	FieldMapping,
	ImportResult,
} from "@/types/csv-import";
import Image from "next/image";

interface FormData {
	email: string;
	website: string;
	phone: string;
	addressStreet: string;
	addressCity: string;
	addressState: string;
	addressZip: string;
	companySize: string;
	defaultTaxRate: number;
	defaultReminderTiming: number;
	smsEnabled: boolean;
	monthlyRevenueTarget: number;
	logoInvertInDarkMode: boolean;
}

interface CsvImportState {
	file: File | null;
	fileContent: string | null;
	entityType: EntityType;
	isAnalyzing: boolean;
	analysisResult: CsvAnalysisResult | null;
	mappings: FieldMapping[];
	isImporting: boolean;
	importResult: ImportResult | null;
	skipImport: boolean;
}

export default function CompleteOrganizationMetadata() {
	const { user } = useUser();
	const { organization: clerkOrganization } = useOrganization();
	const router = useRouter();
	const completeMetadata = useMutation(api.organizations.completeMetadata);
	const bulkCreateClients = useMutation(api.clients.bulkCreate);
	const bulkCreateProjects = useMutation(api.projects.bulkCreate);
	const organization = useQuery(api.organizations.get);
	const needsCompletion = useQuery(api.organizations.needsMetadataCompletion);
	const toast = useToast();

	// Automatically detect and save timezone if not set
	useAutoTimezone();

	const [currentStep, setCurrentStep] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [formData, setFormData] = useState<FormData>({
		email: user?.primaryEmailAddress?.emailAddress || "",
		website: "",
		phone: "",
		addressStreet: "",
		addressCity: "",
		addressState: "",
		addressZip: "",
		companySize: "",
		defaultTaxRate: 0,
		defaultReminderTiming: 24, // 24 hours default
		smsEnabled: false,
		monthlyRevenueTarget: 0,
		logoInvertInDarkMode: true,
	});

	const [csvImportState, setCsvImportState] = useState<CsvImportState>({
		file: null,
		fileContent: null,
		entityType: "clients",
		isAnalyzing: false,
		analysisResult: null,
		mappings: [],
		isImporting: false,
		importResult: null,
		skipImport: false,
	});

	// Redirect if metadata is already complete
	// Only redirect when we're sure the data has loaded (not undefined)
	React.useEffect(() => {
		if (needsCompletion === false && organization !== undefined) {
			// If needsCompletion is false and we have organization data,
			// it means the metadata is already complete
			router.push("/home");
		}
	}, [needsCompletion, organization, router]);

	const progressSteps: ProgressStep[] = [
		{
			id: "1",
			name: "Business Info",
			description: "Company details and contact information",
			status:
				currentStep === 1
					? "current"
					: currentStep > 1
						? "complete"
						: "upcoming",
		},
		{
			id: "2",
			name: "Company Size",
			description: "Help us understand your team",
			status:
				currentStep === 2
					? "current"
					: currentStep > 2
						? "complete"
						: "upcoming",
		},
		{
			id: "3",
			name: "Import Data",
			description: "Import existing clients or projects (optional)",
			status:
				currentStep === 3
					? "current"
					: currentStep > 3
						? "complete"
						: "upcoming",
		},
	];

	const companySizeOptions = [
		{
			icon: Users,
			text: "1-10",
			value: "1-10",
		},
		{
			icon: Building2,
			text: "10-100",
			value: "10-100",
		},
		{
			icon: Globe,
			text: "100+",
			value: "100+",
		},
	];

	const isStep1Complete = () => {
		const requiredFields = [
			formData.email.trim(),
			formData.phone.trim(),
			formData.addressStreet.trim(),
			formData.addressCity.trim(),
			formData.addressState.trim(),
			formData.addressZip.trim(),
		];
		return requiredFields.every(Boolean);
	};

	const handleNext = () => {
		setError(null);
		if (currentStep === 1 && !isStep1Complete()) {
			toast.warning(
				"Missing Required Information",
				"Please complete business email, phone number, and full address to continue."
			);
			return;
		}

		if (currentStep < 3) {
			setCurrentStep(currentStep + 1);
		}
	};

	const handlePrevious = () => {
		setError(null);
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};

	const normalizedWebsite = useMemo(() => {
		if (!formData.website.trim()) {
			return "";
		}
		const trimmed = formData.website.trim();
		return trimmed.replace(/^https?:\/\//i, "");
	}, [formData.website]);

	const invertPreviewStyles = formData.logoInvertInDarkMode
		? "invert brightness-0"
		: "";

	// CSV Import Handlers
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
			// Call API to analyze CSV
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
		} catch (error) {
			console.error("Error analyzing CSV:", error);
			toast.error(
				"Analysis Failed",
				error instanceof Error ? error.message : "Failed to analyze CSV file"
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
			mappings: prev.mappings.map((m) =>
				m.csvColumn === csvColumn ? { ...m, schemaField: newSchemaField } : m
			),
		}));
	};

	const handleImportData = async () => {
		if (!csvImportState.fileContent || !csvImportState.analysisResult) {
			return;
		}

		setCsvImportState((prev) => ({ ...prev, isImporting: true }));
		setError(null);

		try {
			// Parse CSV with papaparse
			const Papa = (await import("papaparse")).default;
			const parseResult = Papa.parse(csvImportState.fileContent, {
				header: true,
				skipEmptyLines: true,
				dynamicTyping: true,
			});

			const rows = parseResult.data as Record<string, unknown>[];

			// Helper function to transform values based on data type
			const transformValue = (value: unknown, dataType: string): unknown => {
				if (value === null || value === undefined || value === "") {
					return undefined;
				}

				const strValue = String(value).trim();

				switch (dataType) {
					case "boolean":
						// Handle various boolean representations
						return (
							strValue.toLowerCase() === "true" ||
							strValue === "1" ||
							strValue === "yes"
						);

					case "number":
						const num = Number(strValue);
						return isNaN(num) ? undefined : num;

					case "array":
						// Handle semicolon or comma-separated values
						if (typeof value === "string") {
							return strValue
								.split(/[;,]/)
								.map((v) => v.trim())
								.filter((v) => v.length > 0);
						}
						return Array.isArray(value) ? value : [value];

					default:
						return strValue;
				}
			};

			// Map CSV rows to schema format with type transformation
			const mappedData = rows.map((row) => {
				const mapped: Record<string, unknown> = {};

				csvImportState.mappings.forEach((mapping) => {
					const value = row[mapping.csvColumn];
					if (value !== null && value !== undefined && value !== "") {
						const transformedValue = transformValue(value, mapping.dataType);
						if (transformedValue !== undefined) {
							mapped[mapping.schemaField] = transformedValue;
						}
					}
				});

				// Apply defaults from analysis (these are already the correct type)
				Object.entries(
					csvImportState.analysisResult!.suggestedDefaults
				).forEach(([key, value]) => {
					if (!(key in mapped)) {
						// Transform default values too
						const mapping = csvImportState.mappings.find(
							(m) => m.schemaField === key
						);
						if (mapping && typeof value === "string") {
							mapped[key] = transformValue(value, mapping.dataType);
						} else {
							mapped[key] = value;
						}
					}
				});

				return mapped;
			});

			// Call appropriate bulk create mutation
			let result;
			if (csvImportState.entityType === "clients") {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				result = await bulkCreateClients({ clients: mappedData as any });
			} else {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				result = await bulkCreateProjects({ projects: mappedData as any });
			}

			const successCount = result.filter((r) => r.success).length;
			const failureCount = result.filter((r) => !r.success).length;

			setCsvImportState((prev) => ({
				...prev,
				isImporting: false,
				importResult: {
					successCount,
					failureCount,
					items: result.map((r, idx) => ({
						success: r.success,
						id: r.id,
						error: r.error,
						rowIndex: idx,
					})),
				},
			}));

			if (failureCount === 0) {
				toast.success(
					"Import Successful",
					`Successfully imported ${successCount} ${csvImportState.entityType}`
				);
			} else {
				toast.warning(
					"Import Partially Complete",
					`Imported ${successCount} ${csvImportState.entityType}, ${failureCount} failed`
				);
			}
		} catch (error) {
			console.error("Error importing data:", error);
			toast.error(
				"Import Failed",
				error instanceof Error ? error.message : "Failed to import data"
			);
			setCsvImportState((prev) => ({
				...prev,
				isImporting: false,
			}));
		}
	};

	const handleCompleteSetup = async () => {
		// First complete metadata
		await handleCompleteMetadata();

		// Then navigate to home
		router.push("/home");
	};

	const handleCompleteMetadata = async () => {
		setError(null);

		// Basic validation
		if (!isStep1Complete()) {
			toast.warning(
				"Missing Required Information",
				"Please complete business email, phone number, and full address to finish setup."
			);
			return;
		}

		if (!formData.companySize) {
			setError("Please select a company size before completing setup.");
			return;
		}

		setIsLoading(true);

		try {
			await completeMetadata({
				email: formData.email.trim() || undefined,
				website: normalizedWebsite ? `https://${normalizedWebsite}` : undefined,
				phone: formData.phone.trim() || undefined,
				address:
					[
						formData.addressStreet.trim(),
						formData.addressCity.trim(),
						formData.addressState.trim(),
						formData.addressZip.trim(),
					]
						.filter(Boolean)
						.join(", ") || undefined,
				companySize: formData.companySize as "1-10" | "10-100" | "100+",
				defaultTaxRate: formData.defaultTaxRate || undefined,
				defaultReminderTiming: formData.defaultReminderTiming,
				smsEnabled: formData.smsEnabled,
				monthlyRevenueTarget: formData.monthlyRevenueTarget || undefined,
				logoUrl: clerkOrganization?.imageUrl || undefined,
				logoInvertInDarkMode: formData.logoInvertInDarkMode,
			});

			// Don't redirect here - let handleCompleteSetup do it
		} catch (err) {
			console.error("Failed to complete organization metadata:", err);
			setError(
				err instanceof Error
					? err.message
					: "Failed to save organization settings. Please try again."
			);
		} finally {
			setIsLoading(false);
		}
	};

	const renderStep1 = () => (
		<div className="space-y-8">
			<div>
				<div className="flex items-center gap-3 mb-3">
					<div className="w-1.5 h-6 bg-gradient-to-b from-primary to-primary/60 rounded-full" />
					<h2 className="text-2xl font-semibold text-foreground tracking-tight">
						Business Information
					</h2>
				</div>
				<p className="text-muted-foreground ml-5 leading-relaxed">
					Tell us more about your business to customize your experience.
				</p>
			</div>

			<div className="space-y-6">
				<div>
					<label className="block text-sm font-semibold text-foreground mb-3 tracking-wide">
						Business Email
					</label>
					<Input
						value={formData.email}
						onChange={(e) =>
							setFormData({ ...formData, email: e.target.value })
						}
						className="w-full border-border dark:border-border bg-background dark:bg-background focus:bg-background dark:focus:bg-background transition-colors shadow-sm ring-1 ring-border/10"
						placeholder="your.business@company.com"
						type="email"
					/>
				</div>

				<div>
					<label className="block text-sm font-semibold text-foreground mb-3 tracking-wide">
						Company Website
					</label>
					<div className="mt-2 flex">
						<span className="flex shrink-0 items-center rounded-l-md border border-border bg-muted/40 px-3 text-sm font-medium text-muted-foreground">
							https://
						</span>
						<Input
							value={formData.website}
							onChange={(e) =>
								setFormData({
									...formData,
									website: e.target.value.replace(/^https?:\/\//i, ""),
								})
							}
							className="w-full rounded-l-none border border-l-0 border-border dark:border-border bg-background dark:bg-background focus:bg-background dark:focus:bg-background transition-colors shadow-sm ring-1 ring-border/10"
							placeholder="www.yourcompany.com"
							type="text"
						/>
					</div>
				</div>

				<div>
					<label className="block text-sm font-semibold text-foreground mb-3 tracking-wide">
						Phone Number
					</label>
					<Input
						value={formData.phone}
						onChange={(e) =>
							setFormData({ ...formData, phone: e.target.value })
						}
						className="w-full border-border dark:border-border bg-background dark:bg-background focus:bg-background dark:focus:bg-background transition-colors shadow-sm ring-1 ring-border/10"
						placeholder="+1 (555) 123-4567"
						type="tel"
					/>
				</div>

				<div>
					<label className="block text-sm font-semibold text-foreground mb-3 tracking-wide">
						Business Address
					</label>
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="sm:col-span-2">
							<Input
								value={formData.addressStreet}
								onChange={(e) =>
									setFormData({ ...formData, addressStreet: e.target.value })
								}
								className="w-full border-border dark:border-border bg-background dark:bg-background focus:bg-background dark:focus:bg-background transition-colors shadow-sm ring-1 ring-border/10"
								placeholder="123 Business St"
							/>
						</div>
						<div>
							<Input
								value={formData.addressCity}
								onChange={(e) =>
									setFormData({ ...formData, addressCity: e.target.value })
								}
								className="w-full border-border dark:border-border bg-background dark:bg-background focus:bg-background dark:focus:bg-background transition-colors shadow-sm ring-1 ring-border/10"
								placeholder="City"
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<Input
								value={formData.addressState}
								onChange={(e) =>
									setFormData({ ...formData, addressState: e.target.value })
								}
								className="w-full border-border dark:border-border bg-background dark:bg-background focus:bg-background dark:focus:bg-background transition-colors shadow-sm ring-1 ring-border/10"
								placeholder="State"
							/>
							<Input
								value={formData.addressZip}
								onChange={(e) =>
									setFormData({ ...formData, addressZip: e.target.value })
								}
								className="w-full border-border dark:border-border bg-background dark:bg-background focus:bg-background dark:focus:bg-background transition-colors shadow-sm ring-1 ring-border/10"
								placeholder="ZIP"
							/>
						</div>
					</div>
				</div>

				<div>
					<label className="block text-sm font-semibold text-foreground mb-3 tracking-wide">
						Logo Display Preferences
					</label>
					<div className="space-y-4 border border-border dark:border-border/80 rounded-xl p-5">
						<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							<div>
								<p className="text-sm font-medium text-foreground">
									Invert logo colors in dark mode
								</p>
								<p className="text-xs text-muted-foreground">
									Enable this if your logo is dark so it stays visible on dark
									backgrounds.
								</p>
							</div>
							<div className="flex items-center gap-3">
								<Checkbox
									checked={formData.logoInvertInDarkMode}
									onCheckedChange={(checked) =>
										setFormData({
											...formData,
											logoInvertInDarkMode: Boolean(checked),
										})
									}
									className="size-5"
								/>
								<span className="text-sm text-muted-foreground">
									{formData.logoInvertInDarkMode ? "Enabled" : "Disabled"}
								</span>
							</div>
						</div>

						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div className="border border-border/60 dark:border-border/40 rounded-lg p-4 flex flex-col items-center gap-3 bg-white">
								<span className="text-xs uppercase tracking-wide text-muted-foreground">
									Light Mode Preview
								</span>
								<div className="h-16 w-16 rounded-lg border border-border flex items-center justify-center bg-white">
									{clerkOrganization?.imageUrl ? (
										<Image
											src={clerkOrganization.imageUrl}
											alt="Logo preview light"
											width={64}
											height={64}
											className="max-h-12 max-w-full object-contain"
										/>
									) : (
										<span className="text-xs text-muted-foreground">
											No logo
										</span>
									)}
								</div>
							</div>
							<div className="border border-border/60 dark:border-border/40 rounded-lg p-4 flex flex-col items-center gap-3 bg-zinc-900">
								<span className="text-xs uppercase tracking-wide text-muted-foreground">
									Dark Mode Preview
								</span>
								<div className="h-16 w-16 rounded-lg border border-border/40 flex items-center justify-center bg-zinc-900">
									{clerkOrganization?.imageUrl ? (
										<Image
											src={clerkOrganization.imageUrl}
											alt="Logo preview dark"
											width={64}
											height={64}
											className={`max-h-12 max-w-full object-contain transition-all duration-200 ${invertPreviewStyles}`}
										/>
									) : (
										<span className="text-xs text-muted-foreground">
											No logo
										</span>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="flex justify-end pt-6">
				<StyledButton
					type="button"
					onClick={handleNext}
					intent="primary"
					size="md"
					showArrow={false}
				>
					Next Step
				</StyledButton>
			</div>
		</div>
	);

	const renderStep2 = () => (
		<div className="space-y-8">
			<div>
				<div className="flex items-center gap-3 mb-3">
					<div className="w-1.5 h-6 bg-gradient-to-b from-primary to-primary/60 rounded-full" />
					<h2 className="text-2xl font-semibold text-foreground tracking-tight">
						Company Size
					</h2>
				</div>
				<p className="text-muted-foreground ml-5 leading-relaxed">
					Help us understand your team size to provide the best experience.
				</p>
			</div>

			<div>
				<label className="block text-sm font-semibold text-foreground mb-6 tracking-wide">
					How many people work at your company? *
				</label>
				<SelectService
					options={companySizeOptions}
					selected={formData.companySize}
					onChange={(value) => setFormData({ ...formData, companySize: value })}
				/>
			</div>

			<div className="flex justify-between pt-6">
				<StyledButton
					type="button"
					onClick={handlePrevious}
					intent="secondary"
					size="md"
					showArrow={false}
				>
					Previous
				</StyledButton>
				<StyledButton
					type="button"
					onClick={handleNext}
					intent="primary"
					size="md"
					showArrow={false}
				>
					Next Step
				</StyledButton>
			</div>
		</div>
	);

	const renderStep3 = () => (
		<div className="space-y-8">
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
				mappings={csvImportState.mappings}
				onMappingChange={handleMappingChange}
				importResult={csvImportState.importResult}
				error={error}
				showTitle={true}
				disabledEntityTypes={["projects"]}
			/>

			{/* Action Buttons */}
			<div className="flex justify-between pt-6">
				<StyledButton
					type="button"
					onClick={handlePrevious}
					intent="secondary"
					size="md"
					disabled={
						isLoading ||
						csvImportState.isAnalyzing ||
						csvImportState.isImporting
					}
					showArrow={false}
				>
					Previous
				</StyledButton>

				<div className="flex gap-3">
					{/* Skip & Continue Button */}
					<button
						type="button"
						onClick={handleCompleteSetup}
						disabled={isLoading}
						className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-all duration-200 px-4 py-2"
					>
						Skip & Continue
					</button>

					{/* Import Data Button */}
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

					{/* Complete Setup Button (shown after import or if no file uploaded) */}
					{(csvImportState.importResult || !csvImportState.file) && (
						<StyledButton
							intent="primary"
							onClick={handleCompleteSetup}
							isLoading={isLoading}
						>
							{isLoading ? "Completing..." : "Complete Setup"}
						</StyledButton>
					)}
				</div>
			</div>
		</div>
	);

	const renderCurrentStep = () => {
		switch (currentStep) {
			case 1:
				return renderStep1();
			case 2:
				return renderStep2();
			case 3:
				return renderStep3();
			default:
				return renderStep1();
		}
	};

	// Show loading state while webhook is processing organization creation
	if (needsCompletion === undefined || organization === undefined) {
		return (
			<div className="min-h-screen flex-1 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<h2 className="text-xl font-semibold text-foreground mb-2">
						Setting up your organization...
					</h2>
					<p className="text-muted-foreground">
						Please wait while we prepare your workspace.
					</p>
				</div>
			</div>
		);
	}

	// If we reach here and needsCompletion is false, redirect to home
	if (needsCompletion === false) {
		return (
			<div className="min-h-screen flex-1 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<h2 className="text-xl font-semibold text-foreground mb-2">
						Redirecting...
					</h2>
					<p className="text-muted-foreground">
						Your organization is already set up!
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="relative p-4 sm:p-6 lg:p-8 min-h-screen flex flex-col">
			<div className="flex-1 flex flex-col py-8 mx-auto w-full">
				{/* Enhanced Header */}
				<div className="mb-10">
					<div className="flex items-center gap-3 mb-3">
						<div className="w-2 h-8 bg-gradient-to-b from-primary to-primary/60 rounded-full" />
						<h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent tracking-tight">
							Complete Your Organization Setup
						</h1>
					</div>
					<p className="text-muted-foreground ml-5 leading-relaxed">
						Welcome to {organization?.name}! Let&apos;s finish setting up your
						organization.
					</p>
				</div>

				{/* Enhanced Progress Bar */}
				<div className="mb-10">
					<ProgressBar steps={progressSteps} />
				</div>

				{/* Enhanced Form Content */}
				<div className="bg-card dark:bg-card backdrop-blur-md border border-border dark:border-border rounded-2xl p-10 shadow-lg dark:shadow-black/50 ring-1 ring-border/30 dark:ring-border/50 flex-shrink-0">
					{renderCurrentStep()}
				</div>
			</div>
		</div>
	);
}
