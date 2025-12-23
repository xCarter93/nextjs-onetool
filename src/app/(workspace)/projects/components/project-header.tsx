"use client";

import { Id, Doc } from "../../../../../convex/_generated/dataModel";
import { FolderOpen, PencilIcon } from "lucide-react";
import { ProminentStatusBadge } from "@/components/shared/prominent-status-badge";
import { StatusProgressBar } from "@/components/shared/status-progress-bar";
import {
	StyledSelect,
	StyledSelectTrigger,
	StyledSelectContent,
	SelectValue,
	SelectItem,
} from "@/components/ui/styled";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover";
import { Plus, ClipboardList, Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const STATUS_OPTIONS = [
	"planned",
	"in-progress",
	"completed",
	"cancelled",
] as const;

function formatStatus(status: string): string {
	if (status === "in-progress") return "In Progress";
	return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatDate(timestamp?: number) {
	if (!timestamp) return "Not set";
	return new Date(timestamp).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

function getStatusColor(status: string) {
	switch (status) {
		case "planned":
			return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
		case "in-progress":
			return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
		case "completed":
			return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
		case "cancelled":
			return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
		case "draft":
			return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
		case "sent":
		case "pending":
		case "approved":
			return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
		case "paid":
			return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
		default:
			return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
	}
}

interface ProjectHeaderProps {
	project: Doc<"projects">;
	projectId: string;
	isEditing: boolean;
	onEditClick: () => void;
	statusValue: string;
	onStatusChange: (value: string) => void;
	tasks: Doc<"tasks">[] | undefined;
	quotes: Doc<"quotes">[] | undefined;
	onTaskSheetOpen: () => void;
	onStatusUpdate: (
		status: "planned" | "in-progress" | "completed" | "cancelled"
	) => void;
}

export function ProjectHeader({
	project,
	projectId,
	isEditing,
	onEditClick,
	statusValue,
	onStatusChange,
	tasks,
	quotes,
	onTaskSheetOpen,
	onStatusUpdate,
}: ProjectHeaderProps) {
	const router = useRouter();

	return (
		<div className="mb-8">
			<div className="flex items-center gap-6 mb-6">
				<div className="flex items-center justify-center w-16 h-16 rounded-lg bg-linear-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 shrink-0 shadow-md">
					<FolderOpen className="h-8 w-8 text-white" />
				</div>
				<div className="min-w-0">
					<div className="flex items-center gap-3 flex-wrap mb-3">
						<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
							{project.title}
						</h1>
						{isEditing ? (
							<StyledSelect value={statusValue} onValueChange={onStatusChange}>
								<StyledSelectTrigger className="w-auto">
									<SelectValue />
								</StyledSelectTrigger>
								<StyledSelectContent>
									{STATUS_OPTIONS.map((status) => (
										<SelectItem key={status} value={status}>
											{formatStatus(status)}
										</SelectItem>
									))}
								</StyledSelectContent>
							</StyledSelect>
						) : (
							<ProminentStatusBadge
								status={project.status}
								size="large"
								showIcon={true}
								entityType="project"
							/>
						)}
					</div>
					{!isEditing && (
						<button
							onClick={onEditClick}
							className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
						>
							<PencilIcon className="h-4 w-4" />
							Edit Details
						</button>
					)}
				</div>
				{/* Inline Status Progress Bar with Button - Fill remaining space */}
				<div className="flex-1 min-w-0">
					<StatusProgressBar
						status={project.status}
						steps={[
							{ id: "planned", name: "Planned", order: 1 },
							{ id: "in-progress", name: "In Progress", order: 2 },
							{ id: "completed", name: "Completed", order: 3 },
						]}
						events={[
							...(project._creationTime
								? [{ type: "planned", timestamp: project._creationTime }]
								: []),
							...(project.startDate
								? [{ type: "in-progress", timestamp: project.startDate }]
								: []),
							...(project.completedAt
								? [{ type: "completed", timestamp: project.completedAt }]
								: []),
						]}
						failureStatuses={["cancelled"]}
						successStatuses={["completed"]}
						showStatusButton={true}
						statusOptions={STATUS_OPTIONS.map((status) => ({
							value: status,
							label: formatStatus(status),
						}))}
						onStatusChange={(value) =>
							onStatusUpdate(
								value as "planned" | "in-progress" | "completed" | "cancelled"
							)
						}
						statusButtonLabel="Change Status"
					/>
				</div>
			</div>

			{/* Related Items Quick Links - Salesforce inspired */}
			<div className="grid grid-cols-2 md:grid-cols-2 gap-3">
				{/* Tasks */}
				<Popover>
					<PopoverTrigger asChild>
						<button className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all">
							<div className="flex items-center gap-2 mb-1">
								<svg
									className="w-5 h-5 text-blue-600 dark:text-blue-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
									/>
								</svg>
								<span className="text-2xl font-bold text-gray-900 dark:text-white">
									{tasks?.length || 0}
								</span>
							</div>
							<span className="text-xs font-medium text-gray-600 dark:text-gray-400">
								Tasks
							</span>
						</button>
					</PopoverTrigger>
					<PopoverContent
						className="w-96 p-0 bg-white dark:bg-gray-900"
						align="start"
						side="bottom"
					>
						<div className="p-4 border-b border-gray-200 dark:border-white/10">
							<div className="flex items-center justify-between">
								<h3 className="font-semibold text-gray-900 dark:text-white">
									Tasks
								</h3>
								<Button intent="outline" size="sm" onPress={onTaskSheetOpen}>
									<Plus className="h-4 w-4 mr-2" />
									New
								</Button>
							</div>
						</div>
						<div className="max-h-96 overflow-y-auto">
							{tasks && tasks.length > 0 ? (
								<div className="p-2">
									{tasks.map((task: Doc<"tasks">) => (
										<div
											key={task._id}
											className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors"
										>
											<div className="flex items-center gap-3 flex-1 min-w-0">
												<div
													className={`w-2 h-2 rounded-full shrink-0 ${
														task.status === "completed"
															? "bg-green-500"
															: task.status === "cancelled"
															? "bg-red-500"
															: "bg-yellow-500"
													}`}
												/>
												<div className="flex-1 min-w-0">
													<p className="font-medium text-sm text-gray-900 dark:text-white truncate">
														{task.title}
													</p>
													{task.date && (
														<p className="text-xs text-gray-500 dark:text-gray-400">
															{formatDate(task.date)}
														</p>
													)}
												</div>
											</div>
											<Badge
												className={getStatusColor(task.status)}
												variant="outline"
											>
												{task.status}
											</Badge>
										</div>
									))}
								</div>
							) : (
								<div className="p-8 text-center">
									<ClipboardList className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
									<p className="text-sm text-gray-500 dark:text-gray-400">
										No tasks yet
									</p>
								</div>
							)}
						</div>
					</PopoverContent>
				</Popover>

				{/* Quotes */}
				<Popover>
					<PopoverTrigger asChild>
						<button className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all">
							<div className="flex items-center gap-2 mb-1">
								<svg
									className="w-5 h-5 text-green-600 dark:text-green-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
									/>
								</svg>
								<span className="text-2xl font-bold text-gray-900 dark:text-white">
									{quotes?.length || 0}
								</span>
							</div>
							<span className="text-xs font-medium text-gray-600 dark:text-gray-400">
								Quotes
							</span>
						</button>
					</PopoverTrigger>
					<PopoverContent
						className="w-96 p-0 bg-white dark:bg-gray-900"
						align="start"
						side="bottom"
					>
						<div className="p-4 border-b border-gray-200 dark:border-white/10">
							<div className="flex items-center justify-between">
								<h3 className="font-semibold text-gray-900 dark:text-white">
									Quotes
								</h3>
								<Button
									intent="outline"
									size="sm"
									onPress={() =>
										router.push(`/quotes/new?projectId=${projectId}`)
									}
								>
									<Plus className="h-4 w-4 mr-2" />
									New
								</Button>
							</div>
						</div>
						<div className="max-h-96 overflow-y-auto">
							{quotes && quotes.length > 0 ? (
								<div className="p-2">
									{quotes.map((quote: Doc<"quotes">) => (
										<div
											key={quote._id}
											className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
											onClick={() => router.push(`/quotes/${quote._id}`)}
										>
											<div className="flex items-center gap-3 flex-1 min-w-0">
												<div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
												<div className="flex-1 min-w-0">
													<p className="font-medium text-sm text-gray-900 dark:text-white truncate">
														Quote #{quote.quoteNumber || quote._id.slice(-6)}
													</p>
													<p className="text-xs text-gray-500 dark:text-gray-400">
														{formatDate(quote._creationTime)}
													</p>
												</div>
											</div>
											<div className="text-right shrink-0">
												{quote.total && (
													<p className="font-medium text-sm text-gray-900 dark:text-white">
														${quote.total.toLocaleString()}
													</p>
												)}
												<Badge
													className={getStatusColor(quote.status || "draft")}
													variant="outline"
												>
													{quote.status || "draft"}
												</Badge>
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="p-8 text-center">
									<Receipt className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
									<p className="text-sm text-gray-500 dark:text-gray-400">
										No quotes yet
									</p>
								</div>
							)}
						</div>
					</PopoverContent>
				</Popover>
			</div>
		</div>
	);
}
