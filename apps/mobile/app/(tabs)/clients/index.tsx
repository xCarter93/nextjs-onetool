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
import { Search, Plus, ChevronRight, Building2 } from "lucide-react-native";
import { colors, fontFamily, radius, spacing } from "@/lib/theme";
import { StatusBadge } from "@/components/StatusBadge";

export default function ClientsScreen() {
	const router = useRouter();
	const [refreshing, setRefreshing] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const clients = useQuery(api.clients.list, {}) ?? [];

	const filteredClients = useMemo(() => {
		if (!searchQuery.trim()) return clients;
		const query = searchQuery.toLowerCase();
		return clients.filter(
			(client) =>
				client.companyName.toLowerCase().includes(query) ||
				client.industry?.toLowerCase().includes(query)
		);
	}, [clients, searchQuery]);

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		setTimeout(() => setRefreshing(false), 1000);
	}, []);

	// Get initials for avatar
	const getInitials = (name: string) => {
		const words = name.split(" ");
		if (words.length >= 2) {
			return (words[0][0] + words[1][0]).toUpperCase();
		}
		return name.substring(0, 2).toUpperCase();
	};

	// Generate a consistent color based on the name
	const getAvatarColor = (name: string) => {
		const colors = [
			"#3b82f6", // blue
			"#8b5cf6", // purple
			"#10b981", // green
			"#f59e0b", // amber
			"#ec4899", // pink
			"#06b6d4", // cyan
			"#f97316", // orange
			"#6366f1", // indigo
		];
		const hash = name
			.split("")
			.reduce((acc, char) => acc + char.charCodeAt(0), 0);
		return colors[hash % colors.length];
	};

	const renderClient = ({ item }: { item: (typeof clients)[0] }) => {
		const avatarColor = getAvatarColor(item.companyName);

		return (
			<Pressable
				style={({ pressed }) => [
					styles.clientCard,
					pressed && styles.clientCardPressed,
				]}
				onPress={() => router.push(`/clients/${item._id}`)}
			>
				{/* Avatar */}
				<View style={[styles.avatar, { backgroundColor: `${avatarColor}20` }]}>
					<Text style={[styles.avatarText, { color: avatarColor }]}>
						{getInitials(item.companyName)}
					</Text>
				</View>

				{/* Client Info */}
				<View style={styles.clientInfo}>
					<View style={styles.clientHeader}>
						<Text style={styles.companyName} numberOfLines={1}>
							{item.companyName}
						</Text>
						<StatusBadge status={item.status} />
					</View>

					{item.industry && (
						<View style={styles.industryRow}>
							<Building2 size={12} color={colors.mutedForeground} />
							<Text style={styles.industryText}>{item.industry}</Text>
						</View>
					)}

					{/* Lead Source Badge */}
					{item.leadSource && (
						<View style={styles.contactPreview}>
							<View style={styles.leadSourceBadge}>
								<Text style={styles.leadSourceText}>
									{item.leadSource.replace(/-/g, " ")}
								</Text>
							</View>
						</View>
					)}
				</View>

				{/* Chevron */}
				<ChevronRight size={20} color={colors.mutedForeground} />
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
						placeholder="Search clients..."
						placeholderTextColor={colors.mutedForeground}
						value={searchQuery}
						onChangeText={setSearchQuery}
					/>
				</View>

				{/* Results count */}
				{searchQuery && (
					<Text style={styles.resultsCount}>
						{filteredClients.length} result
						{filteredClients.length !== 1 ? "s" : ""}
					</Text>
				)}
			</View>

			<FlatList
				data={filteredClients}
				keyExtractor={(item) => item._id}
				renderItem={renderClient}
				contentContainerStyle={styles.listContent}
				ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
				ListEmptyComponent={
					<View style={styles.emptyState}>
						<View style={styles.emptyIcon}>
							<Building2 size={32} color={colors.mutedForeground} />
						</View>
						<Text style={styles.emptyTitle}>
							{searchQuery ? "No clients found" : "No clients yet"}
						</Text>
						<Text style={styles.emptyText}>
							{searchQuery
								? "Try adjusting your search terms"
								: "Add your first client to get started"}
						</Text>
					</View>
				}
			/>

			{/* FAB */}
			<Pressable
				style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
				onPress={() => router.push("/clients/new")}
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
	clientCard: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.card,
		borderRadius: radius.lg,
		padding: spacing.md,
		borderWidth: 1,
		borderColor: colors.border,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 1,
	},
	clientCardPressed: {
		opacity: 0.7,
		backgroundColor: colors.muted,
	},
	avatar: {
		width: 48,
		height: 48,
		borderRadius: 24,
		alignItems: "center",
		justifyContent: "center",
		marginRight: spacing.sm,
	},
	avatarText: {
		fontSize: 16,
		fontFamily: fontFamily.bold,
	},
	clientInfo: {
		flex: 1,
	},
	clientHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: spacing.xs,
	},
	companyName: {
		fontSize: 16,
		fontFamily: fontFamily.semibold,
		color: colors.foreground,
		flex: 1,
		marginRight: spacing.sm,
	},
	industryRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		marginBottom: spacing.xs,
	},
	industryText: {
		fontSize: 13,
		fontFamily: fontFamily.regular,
		color: colors.mutedForeground,
	},
	contactPreview: {
		flexDirection: "row",
		gap: spacing.md,
		marginTop: spacing.xs,
	},
	leadSourceBadge: {
		backgroundColor: colors.muted,
		paddingHorizontal: spacing.sm,
		paddingVertical: 2,
		borderRadius: radius.full,
	},
	leadSourceText: {
		fontSize: 11,
		fontFamily: fontFamily.medium,
		color: colors.mutedForeground,
		textTransform: "capitalize",
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
