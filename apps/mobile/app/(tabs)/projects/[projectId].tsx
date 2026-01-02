import {
	View,
	Text,
	ScrollView,
	RefreshControl,
	Pressable,
	StyleSheet,
	Alert,
} from "react-native";
import { useQuery, useMutation } from "convex/react";
import { api } from "@onetool/backend/convex/_generated/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useCallback, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Id } from "@onetool/backend/convex/_generated/dataModel";
import { colors, fontFamily, spacing, radius } from "@/lib/theme";
import { StatusBadge } from "@/components/StatusBadge";
import { Card } from "@/components/Card";
import { EditableField } from "@/components/EditableField";
import { SectionHeader } from "@/components/SectionHeader";
import { TaskItem } from "@/components/TaskItem";
import {
	Calendar,
	Building2,
	FileEdit,
	CheckSquare,
	FileText,
	DollarSign,
	ChevronRight,
} from "lucide-react-native";

type ProjectStatus = "planned" | "in-progress" | "completed" | "cancelled";

const statusOptions: { value: ProjectStatus; label: string }[] = [
	{ value: "planned", label: "Planned" },
	{ value: "in-progress", label: "In Progress" },
	{ value: "completed", label: "Completed" },
	{ value: "cancelled", label: "Cancelled" },
];

export default function ProjectDetailScreen() {
	const { projectId } = useLocalSearchParams<{ projectId: string }>();
	const router = useRouter();
	const [refreshing, setRefreshing] = useState(false);
	const [updatingTasks, setUpdatingTasks] = useState<Set<string>>(new Set());

	const project = useQuery(
		api.projects.get,
		projectId ? { id: projectId as Id<"projects"> } : "skip"
	);

	const tasks = useQuery(
		api.tasks.list,
		projectId ? { projectId: projectId as Id<"projects"> } : "skip"
	);

	const quotes = useQuery(
		api.quotes.list,
		projectId ? { projectId: projectId as Id<"projects"> } : "skip"
	);

	const updateProject = useMutation(api.projects.update);
	const completeTask = useMutation(api.tasks.complete);
	const updateTask = useMutation(api.tasks.update);

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		setTimeout(() => setRefreshing(false), 1000);
	}, []);

	const handleUpdateField = async (field: string, value: string) => {
		if (!projectId) return;
		await updateProject({
			id: projectId as Id<"projects">,
			[field]: value,
		});
	};

	const handleUpdateStatus = () => {
		if (!project) return;

		Alert.alert(
			"Update Status",
			"Select a new status for this project",
			statusOptions.map((option) => ({
				text: option.label,
				onPress: async () => {
					await updateProject({
						id: projectId as Id<"projects">,
						status: option.value,
					});
				},
			})),
			{ cancelable: true }
		);
	};

	const handleToggleTask = async (taskId: string) => {
		setUpdatingTasks((prev) => new Set(prev).add(taskId));
		try {
			const task = tasks?.find((t: { _id: string }) => t._id === taskId);
			if (task) {
				if (task.status === "completed") {
					await updateTask({ id: taskId as Id<"tasks">, status: "pending" });
				} else {
					await completeTask({ id: taskId as Id<"tasks"> });
				}
			}
		} catch (error) {
			console.error("Failed to update task:", error);
		} finally {
			setUpdatingTasks((prev) => {
				const newSet = new Set(prev);
				newSet.delete(taskId);
				return newSet;
			});
		}
	};

	const formatDate = (timestamp: number | undefined) => {
		if (!timestamp) return null;
		return new Date(timestamp).toLocaleDateString("en-US", {
			weekday: "short",
			month: "long",
			day: "numeric",
			year: "numeric",
		});
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(amount);
	};

	// Calculate task statistics
	const taskStats = useMemo(() => {
		if (!tasks) return { total: 0, completed: 0, percentage: 0 };
		const total = tasks.length;
		const completed = tasks.filter(
			(t: { status: string }) => t.status === "completed"
		).length;
		const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
		return { total, completed, percentage };
	}, [tasks]);

	// Calculate quote value
	const totalQuoteValue =
		quotes?.reduce((sum, q) => sum + (q.total || 0), 0) ?? 0;
	const approvedQuoteValue =
		quotes
			?.filter((q) => q.status === "approved")
			.reduce((sum, q) => sum + (q.total || 0), 0) ?? 0;

	if (!project) {
		return (
			<SafeAreaView
				style={{ flex: 1, backgroundColor: colors.background }}
				edges={["bottom"]}
			>
				<View style={styles.loadingContainer}>
					<Text style={styles.loadingText}>Loading project...</Text>
				</View>
			</SafeAreaView>
		);
	}

	const getStatusColor = (status: string) => {
		switch (status) {
			case "completed":
				return "#10b981";
			case "in-progress":
				return "#f59e0b";
			case "planned":
				return "#3b82f6";
			case "cancelled":
				return "#ef4444";
			default:
				return colors.mutedForeground;
		}
	};

	const statusColor = getStatusColor(project.status);
	const recentTasks = tasks?.slice(0, 5) ?? [];

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: colors.background }}
			edges={["bottom"]}
		>
			<ScrollView
				contentContainerStyle={{ padding: spacing.md }}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			>
				{/* Header Card */}
				<View style={[styles.headerCard, { borderLeftColor: statusColor }]}>
					<View style={styles.headerContent}>
						<EditableField
							label="Project Title"
							value={project.title}
							onSave={(value) => handleUpdateField("title", value)}
							placeholder="Enter project title"
						/>

						{project.projectNumber && (
							<View style={styles.projectNumberRow}>
								<Text style={styles.projectNumberLabel}>Project #</Text>
								<Text style={styles.projectNumber}>
									{project.projectNumber}
								</Text>
							</View>
						)}

						<View style={styles.statusRow}>
							<Text style={styles.fieldLabel}>Status</Text>
							<Pressable
								onPress={handleUpdateStatus}
								style={styles.statusButton}
							>
								<StatusBadge status={project.status} />
								<FileEdit size={14} color={colors.mutedForeground} />
							</Pressable>
						</View>

						{/* Client Info */}
						{project.clientId && (
							<Pressable
								style={styles.clientRow}
								onPress={() => router.push(`/clients/${project.clientId}`)}
							>
								<Building2 size={16} color={colors.mutedForeground} />
								<Text style={styles.clientName}>View Client</Text>
								<ChevronRight size={16} color={colors.mutedForeground} />
							</Pressable>
						)}
					</View>
				</View>

				{/* Quick Stats */}
				<View style={styles.statsRow}>
					<View style={styles.statBox}>
						<Text style={styles.statValue}>{taskStats.percentage}%</Text>
						<Text style={styles.statLabel}>Complete</Text>
					</View>
					<View style={styles.statBox}>
						<Text style={styles.statValue}>
							{taskStats.completed}/{taskStats.total}
						</Text>
						<Text style={styles.statLabel}>Tasks</Text>
					</View>
					<View style={styles.statBox}>
						<Text style={styles.statValue}>
							{formatCurrency(approvedQuoteValue)}
						</Text>
						<Text style={styles.statLabel}>Value</Text>
					</View>
				</View>

				{/* Progress Bar */}
				{taskStats.total > 0 && (
					<View style={styles.progressCard}>
						<View style={styles.progressHeader}>
							<Text style={styles.progressLabel}>Project Progress</Text>
							<Text style={styles.progressPercentage}>
								{taskStats.percentage}%
							</Text>
						</View>
						<View style={styles.progressBar}>
							<View
								style={[
									styles.progressFill,
									{
										width: `${taskStats.percentage}%`,
										backgroundColor: statusColor,
									},
								]}
							/>
						</View>
					</View>
				)}

				{/* Dates */}
				<Card title="Schedule" style={{ marginTop: spacing.md }}>
					<View style={styles.datesContainer}>
						<View style={styles.dateItem}>
							<View style={styles.dateIcon}>
								<Calendar size={16} color={colors.primary} />
							</View>
							<View>
								<Text style={styles.dateLabel}>Start Date</Text>
								<Text style={styles.dateValue}>
									{project.startDate
										? formatDate(project.startDate)
										: "Not set"}
								</Text>
							</View>
						</View>
						<View style={styles.dateDivider} />
						<View style={styles.dateItem}>
							<View style={[styles.dateIcon, { backgroundColor: "#fef2f2" }]}>
								<Calendar size={16} color="#dc2626" />
							</View>
							<View>
								<Text style={styles.dateLabel}>End Date</Text>
								<Text style={styles.dateValue}>
									{project.endDate ? formatDate(project.endDate) : "Not set"}
								</Text>
							</View>
						</View>
					</View>
				</Card>

				{/* Description */}
				<Card title="Description" style={{ marginTop: spacing.md }}>
					<View style={{ marginTop: spacing.sm }}>
						<EditableField
							label=""
							value={project.description}
							onSave={(value) => handleUpdateField("description", value)}
							placeholder="Add a description..."
							multiline
							numberOfLines={3}
						/>
					</View>
				</Card>

				{/* Instructions */}
				<Card title="Instructions" style={{ marginTop: spacing.md }}>
					<View style={{ marginTop: spacing.sm }}>
						<EditableField
							label=""
							value={project.instructions}
							onSave={(value) => handleUpdateField("instructions", value)}
							placeholder="Add instructions..."
							multiline
							numberOfLines={4}
						/>
					</View>
				</Card>

				{/* Tasks Section */}
				<View style={{ marginTop: spacing.lg }}>
					<SectionHeader
						title="Tasks"
						count={taskStats.total}
						subtitle={
							taskStats.completed > 0
								? `${taskStats.completed} completed`
								: undefined
						}
						icon={<CheckSquare size={18} color="#f59e0b" />}
						actionLabel={tasks && tasks.length > 0 ? "View All" : undefined}
						onAction={() => router.push("/tasks")}
					/>

					{recentTasks.length > 0 ? (
						<View style={styles.tasksList}>
							{recentTasks.map(
								(task: {
									_id: string;
									title: string;
									date: number;
									startTime?: string;
									endTime?: string;
									status: "pending" | "in-progress" | "completed" | "cancelled";
									priority?: "low" | "medium" | "high" | "urgent";
								}) => (
									<TaskItem
										key={task._id}
										id={task._id}
										title={task.title}
										date={task.date}
										startTime={task.startTime}
										endTime={task.endTime}
										status={task.status}
										priority={task.priority}
										isUpdating={updatingTasks.has(task._id)}
										onToggleComplete={handleToggleTask}
										compact
									/>
								)
							)}
						</View>
					) : (
						<View style={styles.emptySection}>
							<Text style={styles.emptySectionText}>No tasks yet</Text>
						</View>
					)}
				</View>

				{/* Quotes Section */}
				<View style={{ marginTop: spacing.lg }}>
					<SectionHeader
						title="Quotes"
						count={quotes?.length}
						icon={<FileText size={18} color="#10b981" />}
						actionLabel={quotes && quotes.length > 0 ? "View All" : undefined}
						onAction={() => router.push("/quotes")}
					/>

					{quotes && quotes.length > 0 ? (
						<View style={styles.quotesList}>
							{quotes.slice(0, 3).map((quote) => (
								<Pressable
									key={quote._id}
									style={styles.quoteItem}
									onPress={() => router.push(`/quotes/${quote._id}`)}
								>
									<View style={styles.quoteItemContent}>
										<View style={{ flex: 1 }}>
											<Text style={styles.quoteTitle} numberOfLines={1}>
												{quote.title || `Quote #${quote.quoteNumber}`}
											</Text>
											<View style={styles.quoteValueRow}>
												<DollarSign size={14} color={colors.primary} />
												<Text style={styles.quoteValue}>
													{formatCurrency(quote.total)}
												</Text>
											</View>
										</View>
										<StatusBadge status={quote.status} />
									</View>
									<ChevronRight size={16} color={colors.mutedForeground} />
								</Pressable>
							))}
						</View>
					) : (
						<View style={styles.emptySection}>
							<Text style={styles.emptySectionText}>No quotes yet</Text>
						</View>
					)}
				</View>

				{/* Bottom spacing */}
				<View style={{ height: spacing.xl }} />
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	loadingText: {
		fontSize: 16,
		fontFamily: fontFamily.regular,
		color: colors.mutedForeground,
	},
	headerCard: {
		backgroundColor: colors.card,
		borderRadius: radius.lg,
		padding: spacing.md,
		borderWidth: 1,
		borderColor: colors.border,
		borderLeftWidth: 4,
	},
	headerContent: {
		gap: spacing.sm,
	},
	projectNumberRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
	},
	projectNumberLabel: {
		fontSize: 13,
		fontFamily: fontFamily.regular,
		color: colors.mutedForeground,
	},
	projectNumber: {
		fontSize: 13,
		fontFamily: fontFamily.semibold,
		color: colors.foreground,
	},
	statusRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	fieldLabel: {
		fontSize: 13,
		fontFamily: fontFamily.medium,
		color: colors.mutedForeground,
	},
	statusButton: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
	},
	clientRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
		paddingVertical: spacing.xs,
		marginTop: spacing.xs,
		borderTopWidth: 1,
		borderTopColor: colors.border,
	},
	clientName: {
		flex: 1,
		fontSize: 14,
		fontFamily: fontFamily.medium,
		color: colors.primary,
	},
	statsRow: {
		flexDirection: "row",
		marginTop: spacing.md,
		gap: spacing.sm,
	},
	statBox: {
		flex: 1,
		backgroundColor: colors.card,
		borderRadius: radius.md,
		padding: spacing.sm,
		alignItems: "center",
		borderWidth: 1,
		borderColor: colors.border,
	},
	statValue: {
		fontSize: 18,
		fontFamily: fontFamily.bold,
		color: colors.foreground,
	},
	statLabel: {
		fontSize: 11,
		fontFamily: fontFamily.regular,
		color: colors.mutedForeground,
		marginTop: 2,
	},
	progressCard: {
		backgroundColor: colors.card,
		borderRadius: radius.md,
		padding: spacing.md,
		marginTop: spacing.md,
		borderWidth: 1,
		borderColor: colors.border,
	},
	progressHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: spacing.sm,
	},
	progressLabel: {
		fontSize: 14,
		fontFamily: fontFamily.medium,
		color: colors.foreground,
	},
	progressPercentage: {
		fontSize: 14,
		fontFamily: fontFamily.bold,
		color: colors.primary,
	},
	progressBar: {
		height: 8,
		backgroundColor: colors.muted,
		borderRadius: 4,
		overflow: "hidden",
	},
	progressFill: {
		height: "100%",
		borderRadius: 4,
	},
	datesContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: spacing.sm,
	},
	dateItem: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
	},
	dateIcon: {
		width: 36,
		height: 36,
		borderRadius: radius.md,
		backgroundColor: `${colors.primary}15`,
		alignItems: "center",
		justifyContent: "center",
	},
	dateLabel: {
		fontSize: 12,
		fontFamily: fontFamily.regular,
		color: colors.mutedForeground,
	},
	dateValue: {
		fontSize: 14,
		fontFamily: fontFamily.medium,
		color: colors.foreground,
	},
	dateDivider: {
		width: 1,
		height: 40,
		backgroundColor: colors.border,
		marginHorizontal: spacing.md,
	},
	tasksList: {
		gap: spacing.sm,
	},
	quotesList: {
		gap: spacing.xs,
	},
	quoteItem: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.card,
		borderRadius: radius.md,
		padding: spacing.sm,
		borderWidth: 1,
		borderColor: colors.border,
	},
	quoteItemContent: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginRight: spacing.sm,
	},
	quoteTitle: {
		fontSize: 14,
		fontFamily: fontFamily.medium,
		color: colors.foreground,
		marginBottom: 2,
	},
	quoteValueRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 2,
	},
	quoteValue: {
		fontSize: 13,
		fontFamily: fontFamily.semibold,
		color: colors.primary,
	},
	emptySection: {
		backgroundColor: colors.muted,
		borderRadius: radius.md,
		padding: spacing.md,
		alignItems: "center",
	},
	emptySectionText: {
		fontSize: 13,
		fontFamily: fontFamily.regular,
		color: colors.mutedForeground,
	},
});
