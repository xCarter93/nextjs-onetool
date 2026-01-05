"use client";

import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@onetool/backend/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	ArrowLeft,
	BarChart3,
	Save,
	Sparkles,
	Loader2,
	TrendingUp,
	PieChart,
	Table as TableIcon,
	Send,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ReportPreview } from "../components/report-preview";

const entityOptions = [
	{ value: "clients", label: "Clients", description: "Customer and prospect data" },
	{ value: "projects", label: "Projects", description: "Project information" },
	{ value: "tasks", label: "Tasks", description: "Task and schedule items" },
	{ value: "quotes", label: "Quotes", description: "Quotes and proposals" },
	{ value: "invoices", label: "Invoices", description: "Invoices and revenue" },
	{ value: "activities", label: "Activities", description: "Activity log" },
];

const groupByOptions: Record<string, { value: string; label: string }[]> = {
	clients: [
		{ value: "status", label: "Status" },
		{ value: "leadSource", label: "Lead Source" },
		{ value: "creationDate_month", label: "Created by Month" },
		{ value: "creationDate_week", label: "Created by Week" },
		{ value: "creationDate_day", label: "Created by Day" },
	],
	projects: [
		{ value: "status", label: "Status" },
		{ value: "projectType", label: "Project Type" },
		{ value: "creationDate_month", label: "Created by Month" },
		{ value: "creationDate_week", label: "Created by Week" },
		{ value: "creationDate_day", label: "Created by Day" },
	],
	tasks: [
		{ value: "status", label: "Status" },
		{ value: "completionRate", label: "Completion Rate" },
		{ value: "date_month", label: "By Month" },
		{ value: "date_week", label: "By Week" },
		{ value: "date_day", label: "By Day" },
	],
	quotes: [
		{ value: "status", label: "Status" },
		{ value: "conversionRate", label: "Conversion Rate" },
	],
	invoices: [
		{ value: "status", label: "Status" },
		{ value: "month", label: "Revenue by Month" },
		{ value: "client", label: "Revenue by Client" },
	],
	activities: [
		{ value: "activityType", label: "Activity Type" },
		{ value: "timestamp_month", label: "By Month" },
		{ value: "timestamp_week", label: "By Week" },
		{ value: "timestamp_day", label: "By Day" },
	],
};

const visualizationOptions = [
	{ value: "bar", label: "Bar Chart", icon: BarChart3 },
	{ value: "line", label: "Line Chart", icon: TrendingUp },
	{ value: "pie", label: "Pie Chart", icon: PieChart },
	{ value: "table", label: "Table", icon: TableIcon },
];

const dateRangeOptions = [
	{ value: "all_time", label: "All Time" },
	{ value: "today", label: "Today" },
	{ value: "this_week", label: "This Week" },
	{ value: "this_month", label: "This Month" },
	{ value: "this_quarter", label: "This Quarter" },
	{ value: "this_year", label: "This Year" },
	{ value: "last_7_days", label: "Last 7 Days" },
	{ value: "last_30_days", label: "Last 30 Days" },
	{ value: "last_90_days", label: "Last 90 Days" },
	{ value: "last_year", label: "Last Year" },
];

type ReportConfig = {
	entityType: "clients" | "projects" | "tasks" | "quotes" | "invoices" | "activities";
	groupBy?: string[];
	dateRange?: { start?: number; end?: number };
};

type Visualization = {
	type: "table" | "bar" | "line" | "pie";
	options?: Record<string, unknown>;
};

export default function NewReportPage() {
	const router = useRouter();
	const createReport = useMutation(api.reports.create);

	// Form state
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [entityType, setEntityType] = useState<ReportConfig["entityType"]>("clients");
	const [groupBy, setGroupBy] = useState<string>("status");
	const [vizType, setVizType] = useState<Visualization["type"]>("bar");
	const [dateRange, setDateRange] = useState<string>("all_time");
	const [isPublic, setIsPublic] = useState(false);

	// AI input state
	const [aiPrompt, setAiPrompt] = useState("");
	const [aiLoading, setAiLoading] = useState(false);
	const [aiResponse, setAiResponse] = useState("");

	const [isSaving, setIsSaving] = useState(false);

	// Build config for preview
	const config: ReportConfig = {
		entityType,
		groupBy: groupBy ? [groupBy] : undefined,
		dateRange: getDateRange(dateRange),
	};

	const visualization: Visualization = {
		type: vizType,
	};

	const handleAiGenerate = async () => {
		if (!aiPrompt.trim()) return;

		setAiLoading(true);
		setAiResponse("");

		try {
			// Call the Mastra agent API
			const response = await fetch("/api/mastra/report", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ prompt: aiPrompt }),
			});

			if (!response.ok) {
				throw new Error("Failed to generate report");
			}

			const data = await response.json();

			// Apply the generated configuration
			if (data.config) {
				if (data.config.entityType) setEntityType(data.config.entityType);
				if (data.config.groupBy?.[0]) setGroupBy(data.config.groupBy[0]);
				if (data.config.dateRange) {
					// Map date range to preset if possible
					const now = new Date();
					const start = data.config.dateRange.start;
					if (start) {
						const startDate = new Date(start);
						if (startDate.getMonth() === now.getMonth() && startDate.getFullYear() === now.getFullYear()) {
							setDateRange("this_month");
						} else if (startDate.getFullYear() === now.getFullYear()) {
							const quarter = Math.floor(now.getMonth() / 3);
							const startQuarter = Math.floor(startDate.getMonth() / 3);
							if (quarter === startQuarter) {
								setDateRange("this_quarter");
							} else {
								setDateRange("this_year");
							}
						}
					}
				}
			}

			if (data.visualization?.type) {
				setVizType(data.visualization.type);
			}

			if (data.suggestedName) {
				setName(data.suggestedName);
			}

			if (data.suggestedDescription) {
				setDescription(data.suggestedDescription);
			}

			setAiResponse("Report configuration generated! Review and save when ready.");
		} catch (error) {
			console.error("AI generation error:", error);
			setAiResponse("Failed to generate report. Please try again or configure manually.");
		} finally {
			setAiLoading(false);
		}
	};

	const handleSave = async () => {
		if (!name.trim()) return;

		setIsSaving(true);

		try {
			const reportId = await createReport({
				name: name.trim(),
				description: description.trim() || undefined,
				config: {
					entityType,
					groupBy: groupBy ? [groupBy] : undefined,
					dateRange: getDateRange(dateRange),
				},
				visualization: {
					type: vizType,
				},
				isPublic,
			});

			router.push(`/reports/${reportId}`);
		} catch (error) {
			console.error("Failed to save report:", error);
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className="relative p-6 space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<Button
						intent="outline"
						size="sq-sm"
						onPress={() => router.push("/reports")}
					>
						<ArrowLeft className="w-4 h-4" />
					</Button>
					<div className="w-1.5 h-6 bg-linear-to-b from-primary to-primary/60 rounded-full" />
					<div>
						<h1 className="text-2xl font-bold text-foreground">New Report</h1>
						<p className="text-muted-foreground text-sm">
							Create a new analytics report
						</p>
					</div>
				</div>
				<Button
					intent="primary"
					onPress={handleSave}
					isDisabled={!name.trim() || isSaving}
				>
					{isSaving ? (
						<Loader2 className="w-4 h-4 mr-2 animate-spin" />
					) : (
						<Save className="w-4 h-4 mr-2" />
					)}
					Save Report
				</Button>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Configuration Panel */}
				<div className="space-y-6">
					<Card className="group relative backdrop-blur-md overflow-hidden ring-1 ring-border/20 dark:ring-border/40">
						<div className="absolute inset-0 bg-linear-to-br from-white/10 via-white/5 to-transparent dark:from-white/5 dark:via-white/2 dark:to-transparent rounded-2xl" />
						<CardHeader className="relative z-10">
							<CardTitle className="text-base">Report Configuration</CardTitle>
							<CardDescription>
								Configure your report manually or use AI to generate it
							</CardDescription>
						</CardHeader>
						<CardContent className="relative z-10">
							<Tabs defaultValue="manual" className="w-full">
								<TabsList className="grid w-full grid-cols-2 mb-6">
									<TabsTrigger value="manual">Manual Setup</TabsTrigger>
									<TabsTrigger value="ai" className="flex items-center gap-2">
										<Sparkles className="w-4 h-4" />
										AI Assist
									</TabsTrigger>
								</TabsList>

								<TabsContent value="manual" className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="name">Report Name</Label>
										<Input
											id="name"
											placeholder="e.g., Monthly Client Acquisition"
											value={name}
											onChange={(e) => setName(e.target.value)}
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="description">Description (optional)</Label>
										<Textarea
											id="description"
											placeholder="Describe what this report shows..."
											value={description}
											onChange={(e) => setDescription(e.target.value)}
											rows={2}
										/>
									</div>

									<div className="space-y-2">
										<Label>Data Source</Label>
										<Select value={entityType} onValueChange={(v) => {
											setEntityType(v as ReportConfig["entityType"]);
											// Reset groupBy when entity changes
											const firstOption = groupByOptions[v]?.[0]?.value;
											if (firstOption) setGroupBy(firstOption);
										}}>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{entityOptions.map((opt) => (
													<SelectItem key={opt.value} value={opt.value}>
														<div className="flex flex-col">
															<span>{opt.label}</span>
														</div>
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									<div className="space-y-2">
										<Label>Group By</Label>
										<Select value={groupBy} onValueChange={setGroupBy}>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{groupByOptions[entityType]?.map((opt) => (
													<SelectItem key={opt.value} value={opt.value}>
														{opt.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									<div className="space-y-2">
										<Label>Date Range</Label>
										<Select value={dateRange} onValueChange={setDateRange}>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{dateRangeOptions.map((opt) => (
													<SelectItem key={opt.value} value={opt.value}>
														{opt.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									<div className="space-y-2">
										<Label>Visualization</Label>
										<div className="grid grid-cols-4 gap-2">
											{visualizationOptions.map((opt) => {
												const Icon = opt.icon;
												return (
													<button
														key={opt.value}
														onClick={() => setVizType(opt.value as Visualization["type"])}
														className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all ${
															vizType === opt.value
																? "border-primary bg-primary/10 text-primary"
																: "border-border hover:border-primary/50"
														}`}
													>
														<Icon className="w-5 h-5" />
														<span className="text-xs">{opt.label}</span>
													</button>
												);
											})}
										</div>
									</div>
								</TabsContent>

								<TabsContent value="ai" className="space-y-4">
									<div className="space-y-2">
										<Label>Describe your report</Label>
										<Textarea
											placeholder="e.g., Show me revenue by client for this quarter, or Client acquisition by lead source this year"
											value={aiPrompt}
											onChange={(e) => setAiPrompt(e.target.value)}
											rows={4}
										/>
									</div>

									<Button
										intent="primary"
										onPress={handleAiGenerate}
										isDisabled={!aiPrompt.trim() || aiLoading}
										className="w-full"
									>
										{aiLoading ? (
											<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										) : (
											<Send className="w-4 h-4 mr-2" />
										)}
										Generate Report Configuration
									</Button>

									{aiResponse && (
										<div className="p-3 rounded-lg bg-muted text-sm">
											{aiResponse}
										</div>
									)}

									{name && (
										<div className="p-3 rounded-lg border border-primary/30 bg-primary/5 space-y-2">
											<p className="text-sm font-medium text-foreground">
												Generated Configuration:
											</p>
											<ul className="text-sm text-muted-foreground space-y-1">
												<li>• Name: {name}</li>
												<li>• Data: {entityOptions.find(e => e.value === entityType)?.label}</li>
												<li>• Grouped by: {groupByOptions[entityType]?.find(g => g.value === groupBy)?.label || groupBy}</li>
												<li>• Chart: {visualizationOptions.find(v => v.value === vizType)?.label}</li>
											</ul>
										</div>
									)}
								</TabsContent>
							</Tabs>
						</CardContent>
					</Card>
				</div>

				{/* Preview Panel */}
				<div className="space-y-6">
					<Card className="group relative backdrop-blur-md overflow-hidden ring-1 ring-border/20 dark:ring-border/40">
						<div className="absolute inset-0 bg-linear-to-br from-white/10 via-white/5 to-transparent dark:from-white/5 dark:via-white/2 dark:to-transparent rounded-2xl" />
						<CardHeader className="relative z-10">
							<CardTitle className="text-base">Preview</CardTitle>
							<CardDescription>
								Live preview of your report data
							</CardDescription>
						</CardHeader>
						<CardContent className="relative z-10">
							<ReportPreview config={config} visualization={visualization} />
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}

function getDateRange(preset: string): { start?: number; end?: number } | undefined {
	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const endOfToday = new Date(today);
	endOfToday.setHours(23, 59, 59, 999);

	switch (preset) {
		case "today": {
			return { start: today.getTime(), end: endOfToday.getTime() };
		}
		case "this_week": {
			const dayOfWeek = today.getDay();
			const startOfWeek = new Date(today);
			startOfWeek.setDate(today.getDate() - dayOfWeek);
			const endOfWeek = new Date(startOfWeek);
			endOfWeek.setDate(startOfWeek.getDate() + 6);
			endOfWeek.setHours(23, 59, 59, 999);
			return { start: startOfWeek.getTime(), end: endOfWeek.getTime() };
		}
		case "this_month": {
			const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
			const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
			endOfMonth.setHours(23, 59, 59, 999);
			return { start: startOfMonth.getTime(), end: endOfMonth.getTime() };
		}
		case "this_quarter": {
			const quarter = Math.floor(today.getMonth() / 3);
			const startOfQuarter = new Date(today.getFullYear(), quarter * 3, 1);
			const endOfQuarter = new Date(today.getFullYear(), (quarter + 1) * 3, 0);
			endOfQuarter.setHours(23, 59, 59, 999);
			return { start: startOfQuarter.getTime(), end: endOfQuarter.getTime() };
		}
		case "this_year": {
			const startOfYear = new Date(today.getFullYear(), 0, 1);
			const endOfYear = new Date(today.getFullYear(), 11, 31);
			endOfYear.setHours(23, 59, 59, 999);
			return { start: startOfYear.getTime(), end: endOfYear.getTime() };
		}
		case "last_7_days": {
			const start = new Date(today);
			start.setDate(today.getDate() - 6);
			return { start: start.getTime(), end: endOfToday.getTime() };
		}
		case "last_30_days": {
			const start = new Date(today);
			start.setDate(today.getDate() - 29);
			return { start: start.getTime(), end: endOfToday.getTime() };
		}
		case "last_90_days": {
			const start = new Date(today);
			start.setDate(today.getDate() - 89);
			return { start: start.getTime(), end: endOfToday.getTime() };
		}
		case "last_year": {
			const startOfLastYear = new Date(today.getFullYear() - 1, 0, 1);
			const endOfLastYear = new Date(today.getFullYear() - 1, 11, 31);
			endOfLastYear.setHours(23, 59, 59, 999);
			return { start: startOfLastYear.getTime(), end: endOfLastYear.getTime() };
		}
		case "all_time":
		default:
			return undefined;
	}
}

