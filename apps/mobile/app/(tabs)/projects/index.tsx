import {
	View,
	Text,
	FlatList,
	Pressable,
	RefreshControl,
	TextInput,
	StyleSheet,
} from "react-native";
import { useQuery } from "convex/react";
import { api } from "@onetool/backend/convex/_generated/api";
import { useRouter } from "expo-router";
import { useState, useCallback, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	Search,
	Plus,
	ChevronRight,
	Calendar,
	Building2,
	FolderKanban,
} from "lucide-react-native";
import { colors, fontFamily, radius, spacing } from "@/lib/theme";
import { StatusBadge } from "@/components/StatusBadge";

export default function ProjectsScreen() {
	const router = useRouter();
	const [refreshing, setRefreshing] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const projects = useQuery(api.projects.list, {}) ?? [];

	const filteredProjects = useMemo(() => {
		if (!searchQuery.trim()) return projects;
		const query = searchQuery.toLowerCase();
		return projects.filter(
			(project) =>
				project.title.toLowerCase().includes(query) ||
				project.projectNumber?.toString().includes(query)
		);
	}, [projects, searchQuery]);

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		setTimeout(() => setRefreshing(false), 1000);
	}, []);

	const formatDate = (timestamp: number | undefined) => {
		if (!timestamp) return null;
		return new Date(timestamp).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

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

	const renderProject = ({ item }: { item: (typeof projects)[0] }) => {
		const statusColor = getStatusColor(item.status);

		return (
			<Pressable
				style={({ pressed }) => [
					styles.projectCard,
					pressed && styles.projectCardPressed,
				]}
				onPress={() => router.push(`/projects/${item._id}`)}
			>
				{/* Status accent bar */}
				<View style={[styles.statusBar, { backgroundColor: statusColor }]} />

				<View style={styles.projectContent}>
					{/* Header Row */}
					<View style={styles.headerRow}>
						<View style={styles.iconContainer}>
							<FolderKanban size={20} color={statusColor} />
						</View>
						<View style={styles.headerInfo}>
							<Text style={styles.projectTitle} numberOfLines={1}>
								{item.title}
							</Text>
							{item.projectNumber && (
								<Text style={styles.projectNumber}>#{item.projectNumber}</Text>
							)}
						</View>
						<StatusBadge status={item.status} />
					</View>

					{/* Client Info */}
					{item.clientId && (
						<View style={styles.clientRow}>
							<Building2 size={14} color={colors.mutedForeground} />
							<Text style={styles.clientName} numberOfLines={1}>
								Client
							</Text>
						</View>
					)}

					{/* Date Range */}
					{(item.startDate || item.endDate) && (
						<View style={styles.dateRow}>
							<Calendar size={14} color={colors.mutedForeground} />
							<Text style={styles.dateText}>
								{item.startDate && formatDate(item.startDate)}
								{item.startDate && item.endDate && " → "}
								{item.endDate && formatDate(item.endDate)}
							</Text>
						</View>
					)}

					{/* Progress indicator for in-progress projects */}
					{item.status === "in-progress" && (
						<View style={styles.progressContainer}>
							<View style={styles.progressBar}>
								<View
									style={[
										styles.progressFill,
										{ width: "50%", backgroundColor: statusColor },
									]}
								/>
							</View>
							<Text style={styles.progressText}>In Progress</Text>
						</View>
					)}
				</View>

				<ChevronRight
					size={20}
					color={colors.mutedForeground}
					style={styles.chevron}
				/>
			</Pressable>
		);
	};

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: colors.background }}
			edges={["bottom"]}
		>
			{/* Search Bar */}
			<View style={styles.searchContainer}>
				<View style={styles.searchBar}>
					<Search size={20} color={colors.mutedForeground} />
					<TextInput
						style={styles.searchInput}
						placeholder="Search projects..."
						placeholderTextColor={colors.mutedForeground}
						value={searchQuery}
						onChangeText={setSearchQuery}
					/>
				</View>

				{searchQuery && (
					<Text style={styles.resultsCount}>
						{filteredProjects.length} result
						{filteredProjects.length !== 1 ? "s" : ""}
					</Text>
				)}
			</View>

			<FlatList
				data={filteredProjects}
				keyExtractor={(item) => item._id}
				renderItem={renderProject}
				contentContainerStyle={styles.listContent}
				ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
				ListEmptyComponent={
					<View style={styles.emptyState}>
						<View style={styles.emptyIcon}>
							<FolderKanban size={32} color={colors.mutedForeground} />
						</View>
						<Text style={styles.emptyTitle}>
							{searchQuery ? "No projects found" : "No projects yet"}
						</Text>
						<Text style={styles.emptyText}>
							{searchQuery
								? "Try adjusting your search terms"
								: "Create your first project to get started"}
						</Text>
					</View>
				}
			/>

			{/* FAB */}
			<Pressable
				style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
				onPress={() => router.push("/projects/new")}
			>
				<Plus size={24} color="#ffffff" />
			</Pressable>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	searchContainer: {
		padding: spacing.md,
		paddingBottom: spacing.sm,
	},
	searchBar: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.muted,
		borderRadius: radius.lg,
		paddingHorizontal: spacing.sm,
	},
	searchInput: {
		flex: 1,
		paddingVertical: spacing.sm,
		paddingHorizontal: spacing.sm,
		fontSize: 16,
		fontFamily: fontFamily.regular,
		color: colors.foreground,
	},
	resultsCount: {
		fontSize: 12,
		fontFamily: fontFamily.medium,
		color: colors.mutedForeground,
		marginTop: spacing.xs,
		marginLeft: spacing.xs,
	},
	listContent: {
		padding: spacing.md,
		paddingTop: 0,
		paddingBottom: 100,
	},
	projectCard: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.card,
		borderRadius: radius.lg,
		borderWidth: 1,
		borderColor: colors.border,
		overflow: "hidden",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 1,
	},
	projectCardPressed: {
		opacity: 0.7,
		backgroundColor: colors.muted,
	},
	statusBar: {
		width: 4,
		alignSelf: "stretch",
	},
	projectContent: {
		flex: 1,
		padding: spacing.md,
	},
	headerRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: spacing.xs,
	},
	iconContainer: {
		width: 36,
		height: 36,
		borderRadius: radius.md,
		backgroundColor: colors.muted,
		alignItems: "center",
		justifyContent: "center",
		marginRight: spacing.sm,
	},
	headerInfo: {
		flex: 1,
		marginRight: spacing.sm,
	},
	projectTitle: {
		fontSize: 16,
		fontFamily: fontFamily.semibold,
		color: colors.foreground,
	},
	projectNumber: {
		fontSize: 12,
		fontFamily: fontFamily.regular,
		color: colors.mutedForeground,
		marginTop: 2,
	},
	clientRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
		marginTop: spacing.xs,
	},
	clientName: {
		fontSize: 13,
		fontFamily: fontFamily.regular,
		color: colors.mutedForeground,
		flex: 1,
	},
	dateRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
		marginTop: spacing.xs,
	},
	dateText: {
		fontSize: 12,
		fontFamily: fontFamily.regular,
		color: colors.mutedForeground,
	},
	progressContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: spacing.sm,
		gap: spacing.sm,
	},
	progressBar: {
		flex: 1,
		height: 4,
		backgroundColor: colors.muted,
		borderRadius: 2,
		overflow: "hidden",
	},
	progressFill: {
		height: "100%",
		borderRadius: 2,
	},
	progressText: {
		fontSize: 11,
		fontFamily: fontFamily.medium,
		color: colors.mutedForeground,
	},
	chevron: {
		marginRight: spacing.sm,
	},
	emptyState: {
		alignItems: "center",
		paddingVertical: spacing.xl * 2,
	},
	emptyIcon: {
		width: 64,
		height: 64,
		borderRadius: 32,
		backgroundColor: colors.muted,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: spacing.md,
	},
	emptyTitle: {
		fontSize: 18,
		fontFamily: fontFamily.semibold,
		color: colors.foreground,
		marginBottom: spacing.xs,
	},
	emptyText: {
		fontSize: 14,
		fontFamily: fontFamily.regular,
		color: colors.mutedForeground,
		textAlign: "center",
	},
	fab: {
		position: "absolute",
		bottom: 24,
		right: 24,
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
});
