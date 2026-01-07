"use client";

import React, { useState } from "react";
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
import {
	BarChart3,
	Plus,
	FileText,
	Calendar,
	Trash2,
	ExternalLink,
	Copy,
	PieChart,
	TrendingUp,
	Table as TableIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { Doc, Id } from "@onetool/backend/convex/_generated/dataModel";
import DeleteConfirmationModal from "@/components/ui/delete-confirmation-modal";
import { Badge } from "@/components/ui/badge";
import { StyledButton } from "@/components/ui/styled/styled-button";

const formatDate = (timestamp: number) => {
	return new Date(timestamp).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
};

const formatRelativeTime = (timestamp: number) => {
	const now = Date.now();
	const diff = now - timestamp;
	const minutes = Math.floor(diff / 60000);
	const hours = Math.floor(diff / 3600000);
	const days = Math.floor(diff / 86400000);

	if (minutes < 1) return "Just now";
	if (minutes < 60) return `${minutes}m ago`;
	if (hours < 24) return `${hours}h ago`;
	if (days < 7) return `${days}d ago`;
	return formatDate(timestamp);
};

const visualizationIcons = {
	table: TableIcon,
	bar: BarChart3,
	line: TrendingUp,
	pie: PieChart,
};

const entityLabels: Record<string, string> = {
	clients: "Clients",
	projects: "Projects",
	tasks: "Tasks",
	quotes: "Quotes",
	invoices: "Invoices",
	activities: "Activities",
};

function ReportCard({
	report,
	onView,
	onDelete,
	onDuplicate,
}: {
	report: Doc<"reports">;
	onView: () => void;
	onDelete: () => void;
	onDuplicate: () => void;
}) {
	const VizIcon = visualizationIcons[report.visualization.type] || BarChart3;

	return (
		<Card className="group relative backdrop-blur-md overflow-hidden ring-1 ring-border/20 dark:ring-border/40 hover:ring-primary/30 transition-all duration-200">
			<div className="absolute inset-0 bg-linear-to-br from-white/10 via-white/5 to-transparent dark:from-white/5 dark:via-white/2 dark:to-transparent rounded-2xl" />
			<CardHeader className="relative z-10 pb-3">
				<div className="flex items-start justify-between gap-3">
					<div className="flex items-center gap-3 min-w-0">
						<div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
							<VizIcon className="w-5 h-5 text-primary" />
						</div>
						<div className="min-w-0">
							<CardTitle className="text-base font-semibold text-foreground truncate">
								{report.name}
							</CardTitle>
							<CardDescription className="text-xs mt-0.5">
								{entityLabels[report.config.entityType] || report.config.entityType}
								{report.config.groupBy?.[0] && ` by ${report.config.groupBy[0]}`}
							</CardDescription>
						</div>
					</div>
					<Badge
						variant="outline"
						className="flex-shrink-0 text-xs capitalize"
					>
						{report.visualization.type}
					</Badge>
				</div>
			</CardHeader>
			<CardContent className="relative z-10 pt-0">
				{report.description && (
					<p className="text-sm text-muted-foreground line-clamp-2 mb-3">
						{report.description}
					</p>
				)}
				<div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
					<div className="flex items-center gap-1">
						<Calendar className="w-3 h-3" />
						<span>Updated {formatRelativeTime(report.updatedAt)}</span>
					</div>
					{report.isPublic && (
						<Badge variant="secondary" className="text-xs">
							Shared
						</Badge>
					)}
				</div>
				<div className="flex items-center gap-2">
					<Button
						intent="outline"
						size="sm"
						onPress={onView}
						className="flex-1"
					>
						<ExternalLink className="w-4 h-4 mr-1.5" />
						View
					</Button>
					<Button
						intent="outline"
						size="sq-sm"
						onPress={onDuplicate}
						aria-label="Duplicate report"
					>
						<Copy className="w-4 h-4" />
					</Button>
					<Button
						intent="outline"
						size="sq-sm"
						onPress={onDelete}
						className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
						aria-label="Delete report"
					>
						<Trash2 className="w-4 h-4" />
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

export default function ReportsPage() {
	const router = useRouter();
	const reports = useQuery(api.reports.list);
	const deleteReport = useMutation(api.reports.remove);
	const duplicateReport = useMutation(api.reports.duplicate);

	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [reportToDelete, setReportToDelete] = useState<{
		id: string;
		name: string;
	} | null>(null);

	const handleDelete = (id: string, name: string) => {
		setReportToDelete({ id, name });
		setDeleteModalOpen(true);
	};

	const confirmDelete = async () => {
		if (reportToDelete) {
			try {
				await deleteReport({ id: reportToDelete.id as Id<"reports"> });
				setDeleteModalOpen(false);
				setReportToDelete(null);
			} catch (error) {
				console.error("Failed to delete report:", error);
			}
		}
	};

	const handleDuplicate = async (id: string) => {
		try {
			const newReportId = await duplicateReport({ id: id as Id<"reports"> });
			router.push(`/reports/${newReportId}`);
		} catch (error) {
			console.error("Failed to duplicate report:", error);
		}
	};

	const isLoading = reports === undefined;
	const isEmpty = !isLoading && (!reports || reports.length === 0);

	return (
		<div className="relative p-6 space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="w-1.5 h-6 bg-linear-to-b from-primary to-primary/60 rounded-full" />
					<div>
						<h1 className="text-2xl font-bold text-foreground">Reports</h1>
						<p className="text-muted-foreground text-sm">
							Build and view analytics reports for your organization
						</p>
					</div>
				</div>
				<StyledButton
					onClick={() => router.push("/reports/new")}
					intent="primary"
					size="md"
					icon={<Plus className="h-4 w-4" />}
				>
					New Report
				</StyledButton>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
				<Card className="group relative backdrop-blur-md overflow-hidden ring-1 ring-border/20 dark:ring-border/40">
					<div className="absolute inset-0 bg-linear-to-br from-white/10 via-white/5 to-transparent dark:from-white/5 dark:via-white/2 dark:to-transparent rounded-2xl" />
					<CardHeader className="relative z-10">
						<CardTitle className="flex items-center gap-2 text-base">
							<FileText className="size-4" /> Total Reports
						</CardTitle>
						<CardDescription>Reports in your workspace</CardDescription>
					</CardHeader>
					<CardContent className="relative z-10">
						<div className="text-3xl font-semibold">
							{isLoading ? (
								<div className="h-9 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
							) : (
								reports?.length || 0
							)}
						</div>
					</CardContent>
				</Card>
				<Card className="group relative backdrop-blur-md overflow-hidden ring-1 ring-border/20 dark:ring-border/40">
					<div className="absolute inset-0 bg-linear-to-br from-white/10 via-white/5 to-transparent dark:from-white/5 dark:via-white/2 dark:to-transparent rounded-2xl" />
					<CardHeader className="relative z-10">
						<CardTitle className="flex items-center gap-2 text-base">
							<BarChart3 className="size-4" /> Chart Reports
						</CardTitle>
						<CardDescription>Visual analytics reports</CardDescription>
					</CardHeader>
					<CardContent className="relative z-10">
						<div className="text-3xl font-semibold">
							{isLoading ? (
								<div className="h-9 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
							) : (
								reports?.filter((r) => r.visualization.type !== "table").length || 0
							)}
						</div>
					</CardContent>
				</Card>
				<Card className="group relative backdrop-blur-md overflow-hidden ring-1 ring-border/20 dark:ring-border/40">
					<div className="absolute inset-0 bg-linear-to-br from-white/10 via-white/5 to-transparent dark:from-white/5 dark:via-white/2 dark:to-transparent rounded-2xl" />
					<CardHeader className="relative z-10">
						<CardTitle className="flex items-center gap-2 text-base">
							<TableIcon className="size-4" /> Table Reports
						</CardTitle>
						<CardDescription>Tabular data reports</CardDescription>
					</CardHeader>
					<CardContent className="relative z-10">
						<div className="text-3xl font-semibold">
							{isLoading ? (
								<div className="h-9 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
							) : (
								reports?.filter((r) => r.visualization.type === "table").length || 0
							)}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Reports Grid */}
			{isEmpty ? (
				<Card className="group relative backdrop-blur-md overflow-hidden ring-1 ring-border/20 dark:ring-border/40">
					<div className="absolute inset-0 bg-linear-to-br from-white/10 via-white/5 to-transparent dark:from-white/5 dark:via-white/2 dark:to-transparent rounded-2xl" />
					<CardContent className="relative z-10 py-12 text-center">
						<div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
							<BarChart3 className="h-12 w-12 text-muted-foreground" />
						</div>
						<h3 className="text-lg font-semibold text-foreground mb-2">
							No reports yet
						</h3>
						<p className="text-muted-foreground mb-6 max-w-sm mx-auto">
							Create your first report to visualize your business data and gain insights.
						</p>
						<StyledButton
							onClick={() => router.push("/reports/new")}
							intent="primary"
							size="md"
							icon={<Plus className="h-4 w-4" />}
						>
							Create Your First Report
						</StyledButton>
					</CardContent>
				</Card>
			) : isLoading ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{Array.from({ length: 6 }).map((_, i) => (
						<Card
							key={i}
							className="group relative backdrop-blur-md overflow-hidden ring-1 ring-border/20 dark:ring-border/40"
						>
							<div className="absolute inset-0 bg-linear-to-br from-white/10 via-white/5 to-transparent dark:from-white/5 dark:via-white/2 dark:to-transparent rounded-2xl" />
							<CardHeader className="relative z-10">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
									<div className="space-y-2 flex-1">
										<div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
										<div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
									</div>
								</div>
							</CardHeader>
							<CardContent className="relative z-10">
								<div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />
								<div className="h-8 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
							</CardContent>
						</Card>
					))}
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{reports?.map((report) => (
						<ReportCard
							key={report._id}
							report={report}
							onView={() => router.push(`/reports/${report._id}`)}
							onDelete={() => handleDelete(report._id, report.name)}
							onDuplicate={() => handleDuplicate(report._id)}
						/>
					))}
				</div>
			)}

			{/* Delete Confirmation Modal */}
			{reportToDelete && (
				<DeleteConfirmationModal
					isOpen={deleteModalOpen}
					onClose={() => setDeleteModalOpen(false)}
					onConfirm={confirmDelete}
					title="Delete Report"
					itemName={reportToDelete.name}
					itemType="Report"
				/>
			)}
		</div>
	);
}

