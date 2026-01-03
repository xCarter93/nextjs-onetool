import {
	View,
	Text,
	ScrollView,
	RefreshControl,
	Pressable,
	StyleSheet,
} from "react-native";
import { useQuery, useMutation } from "convex/react";
import { api } from "@onetool/backend/convex/_generated/api";
import { useState, useCallback, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
	styles as themeStyles,
	colors,
	fontFamily,
	spacing,
	radius,
} from "@/lib/theme";
import {
	Users,
	FolderKanban,
	CheckSquare,
	Plus,
	ChevronRight,
	TrendingUp,
	AlertTriangle,
	Calendar,
	Target,
} from "lucide-react-native";
import { StatCard } from "@/components/StatCard";
import { ProgressRing } from "@/components/ProgressRing";
import { TaskItem } from "@/components/TaskItem";
import { SectionHeader } from "@/components/SectionHeader";
import { JourneyProgress } from "@/components/JourneyProgress";
import { Id } from "@onetool/backend/convex/_generated/dataModel";

export default function HomeScreen() {
	const router = useRouter();
	const [refreshing, setRefreshing] = useState(false);
	const [showQuickActions, setShowQuickActions] = useState(false);
	const [updatingTasks, setUpdatingTasks] = useState<Set<string>>(new Set());

	const user = useQuery(api.users.current);
	const homeStats = useQuery(api.homeStatsOptimized.getHomeStats, {});
	const taskStats = useQuery(api.tasks.getStats, {});
	const upcomingTasks = useQuery(api.tasks.getUpcoming, { daysAhead: 7 });
	const overdueTasks = useQuery(api.tasks.getOverdue, {});

	const completeTask = useMutation(api.tasks.complete);
	const updateTask = useMutation(api.tasks.update);

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		setTimeout(() => setRefreshing(false), 1000);
	}, []);

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(amount);
	};

	const getTimeBasedGreeting = () => {
		const hour = new Date().getHours();
		if (hour < 12) return "Good morning";
		if (hour < 17) return "Good afternoon";
		return "Good evening";
	};

	const formatDate = () => {
		const now = new Date();
		return now.toLocaleDateString("en-US", {
			weekday: "long",
			month: "long",
			day: "numeric",
		});
	};

	// Combine and dedupe tasks for display
	const allTasks = useMemo(() => {
		const combined = [...(overdueTasks || []), ...(upcomingTasks || [])];
		const uniqueTasks = combined.filter(
			(task, index, self) => self.findIndex((t) => t._id === task._id) === index
		);
		return uniqueTasks.slice(0, 5); // Show max 5 tasks
	}, [overdueTasks, upcomingTasks]);

	const handleToggleTask = async (taskId: string) => {
		setUpdatingTasks((prev) => new Set(prev).add(taskId));
		try {
			const task = allTasks.find((t) => t._id === taskId);
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

	const quickActions = [
		{ icon: CheckSquare, label: "Task", route: "/tasks/new", color: "#f59e0b" },
	];

	const overdueCount = overdueTasks?.length ?? 0;
	const todayTasksCount = taskStats?.todayTasks ?? 0;

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: colors.background }}
			edges={["bottom"]}
		>
			<ScrollView
				style={{ flex: 1 }}
				contentContainerStyle={{ padding: spacing.md }}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			>
				{/* Header Section */}
				<View style={styles.headerSection}>
					<Text style={styles.dateText}>{formatDate()}</Text>
					<Text style={styles.greeting}>
						{getTimeBasedGreeting()}
						{user?.name ? `, ${user.name.split(" ")[0]}` : ""}!
					</Text>
					<Text style={styles.subtitle}>
						Here's what's happening with your business today.
					</Text>
				</View>

				{/* Journey Progress */}
				<JourneyProgress />

				{/* Quick Stats Grid */}
				<View style={styles.statsGrid}>
					<View style={styles.statsRow}>
						<StatCard
							icon={<Users size={18} color={colors.primary} />}
							label="Total Clients"
							value={homeStats?.totalClients.current ?? 0}
							changeType={homeStats?.totalClients.changeType}
							changeValue={homeStats?.totalClients.change}
							subValue="this month"
							accentColor={colors.primary}
							onPress={() => router.push("/clients")}
						/>
						<StatCard
							icon={<FolderKanban size={18} color="#8b5cf6" />}
							label="Projects"
							value={homeStats?.completedProjects.current ?? 0}
							changeType={homeStats?.completedProjects.changeType}
							changeValue={homeStats?.completedProjects.change}
							subValue="completed"
							accentColor="#8b5cf6"
							onPress={() => router.push("/projects")}
						/>
					</View>
					<View style={styles.statsRow}>
						<StatCard
							icon={<CheckSquare size={18} color="#f59e0b" />}
							label="Tasks Due"
							value={todayTasksCount}
							subValue="today"
							accentColor="#f59e0b"
							onPress={() => router.push("/tasks")}
						/>
					</View>
				</View>

				{/* Revenue Goal Progress */}
				{homeStats && homeStats.revenueGoal.target > 0 && (
					<View style={styles.revenueCard}>
						<View style={styles.revenueHeader}>
							<View style={styles.revenueIconContainer}>
								<Target size={20} color="#10b981" />
							</View>
							<View style={styles.revenueInfo}>
								<Text style={styles.revenueTitle}>Monthly Revenue Goal</Text>
								<Text style={styles.revenueSubtitle}>
									{formatCurrency(homeStats.revenueGoal.current)} of{" "}
									{formatCurrency(homeStats.revenueGoal.target)}
								</Text>
							</View>
						</View>
						<View style={styles.revenueProgress}>
							<ProgressRing
								percentage={homeStats.revenueGoal.percentage}
								size={100}
								strokeWidth={8}
								color="#10b981"
							/>
							<View style={styles.revenueStats}>
								<View style={styles.revenueStat}>
									<Text style={styles.revenueStatValue}>
										{formatCurrency(homeStats.revenueGoal.current)}
									</Text>
									<Text style={styles.revenueStatLabel}>Earned</Text>
								</View>
								<View style={styles.revenueStat}>
									<Text style={styles.revenueStatValue}>
										{formatCurrency(
											homeStats.revenueGoal.target -
												homeStats.revenueGoal.current
										)}
									</Text>
									<Text style={styles.revenueStatLabel}>Remaining</Text>
								</View>
								{homeStats.revenueGoal.changePercentage !== 0 && (
									<View style={styles.revenueChange}>
										<TrendingUp
											size={14}
											color={
												homeStats.revenueGoal.changeType === "increase"
													? colors.success
													: colors.danger
											}
										/>
										<Text
											style={[
												styles.revenueChangeText,
												{
													color:
														homeStats.revenueGoal.changeType === "increase"
															? colors.success
															: colors.danger,
												},
											]}
										>
											{homeStats.revenueGoal.changePercentage}% vs last month
										</Text>
									</View>
								)}
							</View>
						</View>
					</View>
				)}

				{/* Overdue Warning */}
				{overdueCount > 0 && (
					<Pressable
						style={styles.overdueCard}
						onPress={() => router.push("/tasks")}
					>
						<View style={styles.overdueIcon}>
							<AlertTriangle size={20} color="#dc2626" />
						</View>
						<View style={styles.overdueContent}>
							<Text style={styles.overdueTitle}>Attention Needed</Text>
							<Text style={styles.overdueText}>
								{overdueCount} overdue task{overdueCount !== 1 ? "s" : ""}{" "}
								require{overdueCount === 1 ? "s" : ""} your attention
							</Text>
						</View>
						<ChevronRight size={20} color="#dc2626" />
					</Pressable>
				)}

				{/* Today's Tasks Section */}
				<View style={styles.tasksSection}>
					<SectionHeader
						title="Your Tasks"
						subtitle={
							todayTasksCount > 0
								? `${todayTasksCount} due today`
								: "Stay on schedule"
						}
						icon={<Calendar size={18} color={colors.primary} />}
						actionLabel="View All"
						onAction={() => router.push("/tasks")}
					/>

					{allTasks.length > 0 ? (
						<View style={styles.tasksList}>
							{allTasks.map((task) => (
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
								/>
							))}
						</View>
					) : (
						<View style={styles.emptyTasks}>
							<CheckSquare size={32} color={colors.mutedForeground} />
							<Text style={styles.emptyTasksTitle}>No upcoming tasks</Text>
							<Text style={styles.emptyTasksText}>
								Great job staying on top of things!
							</Text>
						</View>
					)}
				</View>

				{/* Week Overview */}
				{homeStats && homeStats.pendingTasks.dueThisWeek > 0 && (
					<View style={styles.weekCard}>
						<View style={styles.weekHeader}>
							<Calendar size={18} color={colors.primary} />
							<Text style={styles.weekTitle}>This Week</Text>
						</View>
						<Text style={styles.weekText}>
							{homeStats.pendingTasks.dueThisWeek} task
							{homeStats.pendingTasks.dueThisWeek !== 1 ? "s" : ""} scheduled
						</Text>
					</View>
				)}

				{/* Bottom spacing for FAB */}
				<View style={{ height: 80 }} />
			</ScrollView>

			{/* Quick Action FAB */}
			<View style={styles.fabContainer}>
				{showQuickActions && (
					<View style={styles.quickActionsMenu}>
						{quickActions.map((action, index) => (
							<Pressable
								key={action.label}
								style={[
									styles.quickActionItem,
									{ borderLeftColor: action.color },
								]}
								onPress={() => {
									setShowQuickActions(false);
									router.push(action.route as any);
								}}
							>
								<View
									style={[
										styles.quickActionIcon,
										{ backgroundColor: `${action.color}15` },
									]}
								>
									<action.icon size={18} color={action.color} />
								</View>
								<Text style={styles.quickActionLabel}>{action.label}</Text>
							</Pressable>
						))}
					</View>
				)}
				<Pressable
					style={({ pressed }) => [
						styles.fab,
						pressed && styles.fabPressed,
						showQuickActions && styles.fabActive,
					]}
					onPress={() => setShowQuickActions(!showQuickActions)}
				>
					<Plus
						size={24}
						color="#fff"
						style={{
							transform: [{ rotate: showQuickActions ? "45deg" : "0deg" }],
						}}
					/>
				</Pressable>
			</View>

			{/* Overlay when quick actions are shown */}
			{showQuickActions && (
				<Pressable
					style={styles.overlay}
					onPress={() => setShowQuickActions(false)}
				/>
			)}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	headerSection: {
		marginBottom: spacing.lg,
	},
	dateText: {
		fontSize: 13,
		fontFamily: fontFamily.medium,
		color: colors.mutedForeground,
		textTransform: "uppercase",
		letterSpacing: 0.5,
		marginBottom: spacing.sm,
	},
	greeting: {
		fontSize: 28,
		fontFamily: fontFamily.bold,
		color: colors.foreground,
		marginBottom: spacing.xs,
	},
	subtitle: {
		fontSize: 15,
		fontFamily: fontFamily.regular,
		color: colors.mutedForeground,
	},
	statsGrid: {
		gap: spacing.sm,
		marginBottom: spacing.lg,
	},
	statsRow: {
		flexDirection: "row",
		gap: spacing.sm,
	},
	revenueCard: {
		backgroundColor: colors.card,
		borderRadius: radius.lg,
		padding: spacing.md,
		borderWidth: 1,
		borderColor: colors.border,
		marginBottom: spacing.lg,
	},
	revenueHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: spacing.md,
	},
	revenueIconContainer: {
		width: 40,
		height: 40,
		borderRadius: radius.md,
		backgroundColor: "#dcfce7",
		alignItems: "center",
		justifyContent: "center",
		marginRight: spacing.sm,
	},
	revenueInfo: {
		flex: 1,
	},
	revenueTitle: {
		fontSize: 16,
		fontFamily: fontFamily.semibold,
		color: colors.foreground,
	},
	revenueSubtitle: {
		fontSize: 13,
		fontFamily: fontFamily.regular,
		color: colors.mutedForeground,
	},
	revenueProgress: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.lg,
	},
	revenueStats: {
		flex: 1,
		gap: spacing.sm,
	},
	revenueStat: {},
	revenueStatValue: {
		fontSize: 18,
		fontFamily: fontFamily.bold,
		color: colors.foreground,
	},
	revenueStatLabel: {
		fontSize: 12,
		fontFamily: fontFamily.regular,
		color: colors.mutedForeground,
	},
	revenueChange: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		marginTop: spacing.xs,
	},
	revenueChangeText: {
		fontSize: 12,
		fontFamily: fontFamily.medium,
	},
	overdueCard: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fef2f2",
		borderRadius: radius.lg,
		padding: spacing.md,
		borderWidth: 1,
		borderColor: "#fecaca",
		borderLeftWidth: 4,
		borderLeftColor: "#dc2626",
		marginBottom: spacing.lg,
	},
	overdueIcon: {
		marginRight: spacing.sm,
	},
	overdueContent: {
		flex: 1,
	},
	overdueTitle: {
		fontSize: 15,
		fontFamily: fontFamily.semibold,
		color: "#dc2626",
	},
	overdueText: {
		fontSize: 13,
		fontFamily: fontFamily.regular,
		color: "#7f1d1d",
	},
	tasksSection: {
		marginBottom: spacing.lg,
	},
	tasksList: {
		gap: spacing.sm,
	},
	emptyTasks: {
		alignItems: "center",
		paddingVertical: spacing.xl,
		backgroundColor: colors.card,
		borderRadius: radius.lg,
		borderWidth: 1,
		borderColor: colors.border,
	},
	emptyTasksTitle: {
		fontSize: 16,
		fontFamily: fontFamily.semibold,
		color: colors.foreground,
		marginTop: spacing.sm,
	},
	emptyTasksText: {
		fontSize: 13,
		fontFamily: fontFamily.regular,
		color: colors.mutedForeground,
		marginTop: spacing.xs,
	},
	weekCard: {
		backgroundColor: colors.card,
		borderRadius: radius.lg,
		padding: spacing.md,
		borderWidth: 1,
		borderColor: colors.border,
	},
	weekHeader: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
		marginBottom: spacing.xs,
	},
	weekTitle: {
		fontSize: 15,
		fontFamily: fontFamily.semibold,
		color: colors.foreground,
	},
	weekText: {
		fontSize: 14,
		fontFamily: fontFamily.regular,
		color: colors.mutedForeground,
		marginLeft: 26,
	},
	fabContainer: {
		position: "absolute",
		bottom: 24,
		right: 24,
		alignItems: "flex-end",
		zIndex: 100,
	},
	quickActionsMenu: {
		marginBottom: spacing.sm,
		gap: spacing.xs,
	},
	quickActionItem: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.card,
		paddingVertical: spacing.sm,
		paddingHorizontal: spacing.md,
		borderRadius: radius.lg,
		borderWidth: 1,
		borderColor: colors.border,
		borderLeftWidth: 3,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	quickActionIcon: {
		width: 32,
		height: 32,
		borderRadius: radius.md,
		alignItems: "center",
		justifyContent: "center",
		marginRight: spacing.sm,
	},
	quickActionLabel: {
		fontSize: 14,
		fontFamily: fontFamily.semibold,
		color: colors.foreground,
	},
	fab: {
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: colors.primary,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	fabPressed: {
		opacity: 0.8,
	},
	fabActive: {
		backgroundColor: colors.foreground,
	},
	overlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(0, 0, 0, 0.3)",
		zIndex: 50,
	},
});
