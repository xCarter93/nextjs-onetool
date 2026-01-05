"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
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
import {
	ArrowLeft,
	BarChart3,
	Save,
	Loader2,
	TrendingUp,
	PieChart,
	Table as TableIcon,
	Pencil,
	Eye,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import type { Id } from "@onetool/backend/convex/_generated/dataModel";
import { ReportPreview } from "../components/report-preview";

const entityOptions = [
	{ value: "clients", label: "Clients" },
	{ value: "projects", label: "Projects" },
	{ value: "tasks", label: "Tasks" },
	{ value: "quotes", label: "Quotes" },
	{ value: "invoices", label: "Invoices" },
	{ value: "activities", label: "Activities" },
];

const groupByOptions: Record<string, { value: string; label: string }[]> = {
	clients: [
		{ value: "status", label: "Status" },
		{ value: "leadSource", label: "Lead Source" },
	],
	projects: [
		{ value: "status", label: "Status" },
		{ value: "projectType", label: "Project Type" },
	],
	tasks: [
		{ value: "status", label: "Status" },
		{ value: "completionRate", label: "Completion Rate" },
	],
	quotes: [
		{ value: "status", label: "Status" },
		{ value: "conversionRate", label: "Conversion Rate" },
	],
	invoices: [
		{ value: "status", label: "Status" },
		{ value: "month", label: "Month" },
		{ value: "client", label: "Client" },
	],
	activities: [{ value: "activityType", label: "Activity Type" }],
};

const visualizationOptions = [
	{ value: "bar", label: "Bar Chart", icon: BarChart3 },
	{ value: "line", label: "Line Chart", icon: TrendingUp },
	{ value: "pie", label: "Pie Chart", icon: PieChart },
	{ value: "table", label: "Table", icon: TableIcon },
];

const dateRangeOptions = [
	{ value: "this_month", label: "This Month" },
	{ value: "this_quarter", label: "This Quarter" },
	{ value: "this_year", label: "This Year" },
	{ value: "all_time", label: "All Time" },
];

type EntityType = "clients" | "projects" | "tasks" | "quotes" | "invoices" | "activities";
type VizType = "table" | "bar" | "line" | "pie";

export default function ReportViewPage() {
	const router = useRouter();
	const params = useParams();
	const reportId = params.reportId as string;

	const report = useQuery(api.reports.get, { id: reportId as Id<"reports"> });
	const updateReport = useMutation(api.reports.update);

	const [isEditing, setIsEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	// Form state
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [entityType, setEntityType] = useState<EntityType>("clients");
	const [groupBy, setGroupBy] = useState<string>("status");
	const [vizType, setVizType] = useState<VizType>("bar");
	const [dateRangePreset, setDateRangePreset] = useState<string>("this_month");

	// Initialize form state when report loads
	useEffect(() => {
		if (report) {
			setName(report.name);
			setDescription(report.description || "");
			setEntityType(report.config.entityType);
			setGroupBy(report.config.groupBy?.[0] || "status");
			setVizType(report.visualization.type);
			// Detect date range preset from report config
			if (report.config.dateRange) {
				setDateRangePreset(detectDateRangePreset(report.config.dateRange));
			} else {
				setDateRangePreset("all_time");
			}
		}
	}, [report]);

	const handleSave = async () => {
		if (!name.trim()) return;

		setIsSaving(true);

		try {
			await updateReport({
				id: reportId as Id<"reports">,
				name: name.trim(),
				description: description.trim() || undefined,
				config: {
					entityType,
					groupBy: groupBy ? [groupBy] : undefined,
					dateRange: getDateRange(dateRangePreset),
				},
				visualization: {
					type: vizType,
				},
			});

			setIsEditing(false);
		} catch (error) {
			console.error("Failed to save report:", error);
		} finally {
			setIsSaving(false);
		}
	};

	const handleCancel = () => {
		if (report) {
			setName(report.name);
			setDescription(report.description || "");
			setEntityType(report.config.entityType);
			setGroupBy(report.config.groupBy?.[0] || "status");
			setVizType(report.visualization.type);
		}
		setIsEditing(false);
	};

	if (report === undefined) {
		return (
			<div className="p-6 flex items-center justify-center min-h-[400px]">
				<Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (report === null) {
		return (
			<div className="p-6 text-center">
				<h1 className="text-xl font-semibold text-foreground mb-2">Report not found</h1>
				<p className="text-muted-foreground mb-4">
					This report may have been deleted or you don't have access to it.
				</p>
				<Button intent="primary" onPress={() => router.push("/reports")}>
					Back to Reports
				</Button>
			</div>
		);
	}

	// Current config for preview
	const config = {
		entityType,
		groupBy: groupBy ? [groupBy] : undefined,
		dateRange: getDateRange(dateRangePreset),
	};

	const visualization = {
		type: vizType,
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
						<h1 className="text-2xl font-bold text-foreground">
							{isEditing ? "Edit Report" : report.name}
						</h1>
						<p className="text-muted-foreground text-sm">
							{isEditing
								? "Modify your report configuration"
								: report.description || "View and analyze your report"}
						</p>
					</div>
				</div>
				<div className="flex items-center gap-2">
					{isEditing ? (
						<>
							<Button intent="outline" onPress={handleCancel}>
								Cancel
							</Button>
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
								Save Changes
							</Button>
						</>
					) : (
						<Button intent="outline" onPress={() => setIsEditing(true)}>
							<Pencil className="w-4 h-4 mr-2" />
							Edit
						</Button>
					)}
				</div>
			</div>

			<div className={`grid gap-6 ${isEditing ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>
				{/* Edit Form (shown when editing) */}
				{isEditing && (
					<Card className="group relative backdrop-blur-md overflow-hidden ring-1 ring-border/20 dark:ring-border/40">
						<div className="absolute inset-0 bg-linear-to-br from-white/10 via-white/5 to-transparent dark:from-white/5 dark:via-white/2 dark:to-transparent rounded-2xl" />
						<CardHeader className="relative z-10">
							<CardTitle className="text-base">Configuration</CardTitle>
							<CardDescription>
								Update your report settings
							</CardDescription>
						</CardHeader>
						<CardContent className="relative z-10 space-y-4">
							<div className="space-y-2">
								<Label htmlFor="name">Report Name</Label>
								<Input
									id="name"
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="description">Description</Label>
								<Textarea
									id="description"
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									rows={2}
								/>
							</div>

							<div className="space-y-2">
								<Label>Data Source</Label>
								<Select
									value={entityType}
									onValueChange={(v) => {
										setEntityType(v as EntityType);
										const firstOption = groupByOptions[v]?.[0]?.value;
										if (firstOption) setGroupBy(firstOption);
									}}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{entityOptions.map((opt) => (
											<SelectItem key={opt.value} value={opt.value}>
												{opt.label}
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
								<Select value={dateRangePreset} onValueChange={setDateRangePreset}>
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
												onClick={() => setVizType(opt.value as VizType)}
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
						</CardContent>
					</Card>
				)}

				{/* Report Visualization */}
				<Card className="group relative backdrop-blur-md overflow-hidden ring-1 ring-border/20 dark:ring-border/40">
					<div className="absolute inset-0 bg-linear-to-br from-white/10 via-white/5 to-transparent dark:from-white/5 dark:via-white/2 dark:to-transparent rounded-2xl" />
					<CardHeader className="relative z-10">
						<CardTitle className="text-base flex items-center gap-2">
							<Eye className="w-4 h-4" />
							{isEditing ? "Preview" : "Report Data"}
						</CardTitle>
						<CardDescription>
							{isEditing
								? "Live preview of your report changes"
								: `${entityOptions.find((e) => e.value === entityType)?.label || entityType} data ${groupBy ? `grouped by ${groupBy}` : ""}`}
						</CardDescription>
					</CardHeader>
					<CardContent className="relative z-10">
						<ReportPreview config={config} visualization={visualization} />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

function getDateRange(preset: string): { start?: number; end?: number } | undefined {
	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

	switch (preset) {
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
		case "all_time":
		default:
			return undefined;
	}
}

function detectDateRangePreset(
	dateRange: { start?: number; end?: number }
): string {
	if (!dateRange.start) return "all_time";

	const now = new Date();
	const startDate = new Date(dateRange.start);

	// Check if it's this month
	if (
		startDate.getMonth() === now.getMonth() &&
		startDate.getFullYear() === now.getFullYear() &&
		startDate.getDate() === 1
	) {
		return "this_month";
	}

	// Check if it's this quarter
	const currentQuarter = Math.floor(now.getMonth() / 3);
	const startQuarter = Math.floor(startDate.getMonth() / 3);
	if (
		startQuarter === currentQuarter &&
		startDate.getFullYear() === now.getFullYear()
	) {
		return "this_quarter";
	}

	// Check if it's this year
	if (
		startDate.getFullYear() === now.getFullYear() &&
		startDate.getMonth() === 0 &&
		startDate.getDate() === 1
	) {
		return "this_year";
	}

	return "all_time";
}

