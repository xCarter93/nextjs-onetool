import React from "react";
import {
	View,
	Text,
	Pressable,
	StyleSheet,
	ActivityIndicator,
} from "react-native";
import { colors, fontFamily, radius, spacing } from "@/lib/theme";
import {
	CheckCircle,
	Circle,
	AlertTriangle,
	Calendar,
	Clock,
	Flag,
	Building2,
} from "lucide-react-native";

type TaskPriority = "low" | "medium" | "high" | "urgent";
type TaskStatus = "pending" | "in-progress" | "completed" | "cancelled";

interface TaskItemProps {
	id: string;
	title: string;
	date: number;
	startTime?: string;
	endTime?: string;
	status: TaskStatus;
	priority?: TaskPriority;
	clientName?: string;
	projectName?: string;
	isUpdating?: boolean;
	onToggleComplete?: (id: string) => void;
	onPress?: (id: string) => void;
	compact?: boolean;
}

const priorityConfig: Record<TaskPriority, { color: string; bgColor: string }> =
	{
		low: { color: "#6b7280", bgColor: "#f3f4f6" },
		medium: { color: "#2563eb", bgColor: "#dbeafe" },
		high: { color: "#d97706", bgColor: "#fef3c7" },
		urgent: { color: "#dc2626", bgColor: "#fee2e2" },
	};

export function TaskItem({
	id,
	title,
	date,
	startTime,
	endTime,
	status,
	priority = "medium",
	clientName,
	projectName,
	isUpdating = false,
	onToggleComplete,
	onPress,
	compact = false,
}: TaskItemProps) {
	const isCompleted = status === "completed";

	// Calculate if overdue
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const taskDate = new Date(date);
	taskDate.setHours(0, 0, 0, 0);
	const isOverdue = taskDate < today && !isCompleted;
	const isToday = taskDate.getTime() === today.getTime();

	const formatDate = () => {
		if (isToday) return "Today";

		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);
		if (taskDate.getTime() === tomorrow.getTime()) return "Tomorrow";

		return taskDate.toLocaleDateString("en-US", {
			weekday: "short",
			month: "short",
			day: "numeric",
		});
	};

	const formatTime = (time: string) => {
		const [hours, minutes] = time.split(":");
		const hour = parseInt(hours);
		const ampm = hour >= 12 ? "PM" : "AM";
		const displayHour = hour % 12 || 12;
		return `${displayHour}:${minutes} ${ampm}`;
	};

	const handleToggle = () => {
		if (!isUpdating && onToggleComplete) {
			onToggleComplete(id);
		}
	};

	const handlePress = () => {
		if (onPress) {
			onPress(id);
		}
	};

	const priorityStyle = priorityConfig[priority];

	return (
		<Pressable
			onPress={handlePress}
			style={({ pressed }) => [
				styles.container,
				isOverdue && styles.overdueContainer,
				isCompleted && styles.completedContainer,
				pressed && styles.pressed,
			]}
		>
			{/* Checkbox */}
			<Pressable
				onPress={handleToggle}
				disabled={isUpdating}
				style={[styles.checkbox, isUpdating && styles.checkboxDisabled]}
			>
				{isUpdating ? (
					<ActivityIndicator size="small" color={colors.primary} />
				) : isCompleted ? (
					<CheckCircle size={24} color={colors.success} />
				) : (
					<Circle
						size={24}
						color={isOverdue ? colors.danger : colors.mutedForeground}
					/>
				)}
			</Pressable>

			{/* Content */}
			<View style={styles.content}>
				<View style={styles.titleRow}>
					<Text
						style={[styles.title, isCompleted && styles.completedTitle]}
						numberOfLines={1}
					>
						{title}
					</Text>
					{priority && priority !== "medium" && (
						<View
							style={[
								styles.priorityBadge,
								{ backgroundColor: priorityStyle.bgColor },
							]}
						>
							<Flag size={10} color={priorityStyle.color} />
							<Text
								style={[styles.priorityText, { color: priorityStyle.color }]}
							>
								{priority}
							</Text>
						</View>
					)}
				</View>

				{!compact && (
					<View style={styles.metaRow}>
						<View style={styles.metaItem}>
							<Calendar
								size={12}
								color={isOverdue ? colors.danger : colors.mutedForeground}
							/>
							<Text style={[styles.metaText, isOverdue && styles.overdueText]}>
								{formatDate()}
							</Text>
						</View>

						{(startTime || endTime) && (
							<View style={styles.metaItem}>
								<Clock size={12} color={colors.mutedForeground} />
								<Text style={styles.metaText}>
									{startTime && formatTime(startTime)}
									{startTime && endTime && " - "}
									{endTime && formatTime(endTime)}
								</Text>
							</View>
						)}
					</View>
				)}

				{!compact && clientName && (
					<View style={styles.clientRow}>
						<Building2 size={12} color={colors.mutedForeground} />
						<Text style={styles.clientText} numberOfLines={1}>
							{clientName}
							{projectName && ` • ${projectName}`}
						</Text>
					</View>
				)}

				{isOverdue && !isCompleted && (
					<View style={styles.overdueIndicator}>
						<AlertTriangle size={12} color={colors.danger} />
						<Text style={styles.overdueLabel}>Overdue</Text>
					</View>
				)}
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "flex-start",
		backgroundColor: colors.card,
		borderRadius: radius.lg,
		padding: spacing.md,
		borderWidth: 1,
		borderColor: colors.border,
	},
	overdueContainer: {
		backgroundColor: "#fef2f2",
		borderColor: "#fecaca",
	},
	completedContainer: {
		opacity: 0.7,
	},
	pressed: {
		opacity: 0.8,
	},
	checkbox: {
		marginRight: spacing.sm,
		padding: 2,
	},
	checkboxDisabled: {
		opacity: 0.5,
	},
	content: {
		flex: 1,
	},
	titleRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: spacing.xs,
	},
	title: {
		fontSize: 15,
		fontFamily: fontFamily.semibold,
		color: colors.foreground,
		flex: 1,
		marginRight: spacing.sm,
	},
	completedTitle: {
		textDecorationLine: "line-through",
		color: colors.mutedForeground,
	},
	priorityBadge: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: spacing.sm,
		paddingVertical: 2,
		borderRadius: radius.full,
		gap: 4,
	},
	priorityText: {
		fontSize: 10,
		fontFamily: fontFamily.medium,
		textTransform: "capitalize",
	},
	metaRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.md,
		marginBottom: spacing.xs,
	},
	metaItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	metaText: {
		fontSize: 12,
		fontFamily: fontFamily.regular,
		color: colors.mutedForeground,
	},
	overdueText: {
		color: colors.danger,
		fontFamily: fontFamily.medium,
	},
	clientRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		marginTop: spacing.xs,
	},
	clientText: {
		fontSize: 12,
		fontFamily: fontFamily.regular,
		color: colors.mutedForeground,
		flex: 1,
	},
	overdueIndicator: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		marginTop: spacing.xs,
	},
	overdueLabel: {
		fontSize: 11,
		fontFamily: fontFamily.medium,
		color: colors.danger,
	},
});
