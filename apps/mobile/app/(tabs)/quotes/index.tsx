import {
	View,
	Text,
	FlatList,
	Pressable,
	RefreshControl,
	TextInput,
	StyleSheet,
	SectionList,
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
	FileText,
	Building2,
	Calendar,
	AlertCircle,
} from "lucide-react-native";
import { colors, fontFamily, radius, spacing } from "@/lib/theme";
import { StatusBadge } from "@/components/StatusBadge";

type QuoteStatus = "draft" | "sent" | "approved" | "declined" | "expired";

interface QuoteItem {
	_id: string;
	title?: string;
	quoteNumber?: string;
	clientId: string;
	status: QuoteStatus;
	total: number;
	validUntil?: number;
}

interface Section {
	title: string;
	data: QuoteItem[];
	status: QuoteStatus;
}

const statusOrder: QuoteStatus[] = [
	"draft",
	"sent",
	"approved",
	"declined",
	"expired",
];

const statusConfig: Record<
	QuoteStatus,
	{ color: string; bgColor: string; label: string }
> = {
	draft: { color: "#6b7280", bgColor: "#f3f4f6", label: "Drafts" },
	sent: { color: "#3b82f6", bgColor: "#dbeafe", label: "Sent" },
	approved: { color: "#10b981", bgColor: "#dcfce7", label: "Approved" },
	declined: { color: "#ef4444", bgColor: "#fee2e2", label: "Declined" },
	expired: { color: "#6b7280", bgColor: "#f3f4f6", label: "Expired" },
};

export default function QuotesScreen() {
	const router = useRouter();
	const [refreshing, setRefreshing] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const quotes = useQuery(api.quotes.list, {}) ?? [];

	const filteredQuotes = useMemo(() => {
		if (!searchQuery.trim()) return quotes;
		const query = searchQuery.toLowerCase();
		return quotes.filter(
			(quote) =>
				quote.title?.toLowerCase().includes(query) ||
				quote.quoteNumber?.toString().includes(query)
		);
	}, [quotes, searchQuery]);

	// Group quotes by status
	const sections = useMemo((): Section[] => {
		const grouped: Record<QuoteStatus, QuoteItem[]> = {
			draft: [],
			sent: [],
			approved: [],
			declined: [],
			expired: [],
		};

		filteredQuotes.forEach((quote) => {
			const status = quote.status as QuoteStatus;
			if (grouped[status]) {
				grouped[status].push(quote as QuoteItem);
			}
		});

		return statusOrder
			.filter((status) => grouped[status].length > 0)
			.map((status) => ({
				title: statusConfig[status].label,
				status,
				data: grouped[status],
			}));
	}, [filteredQuotes]);

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

	const isExpiringSoon = (validUntil: number | undefined) => {
		if (!validUntil) return false;
		const daysUntilExpiry = Math.ceil(
			(validUntil - Date.now()) / (1000 * 60 * 60 * 24)
		);
		return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
	};

	const formatExpiryDate = (validUntil: number | undefined) => {
		if (!validUntil) return null;
		const daysUntilExpiry = Math.ceil(
			(validUntil - Date.now()) / (1000 * 60 * 60 * 24)
		);
		if (daysUntilExpiry < 0) return "Expired";
		if (daysUntilExpiry === 0) return "Expires today";
		if (daysUntilExpiry === 1) return "Expires tomorrow";
		if (daysUntilExpiry <= 7) return `Expires in ${daysUntilExpiry} days`;
		return new Date(validUntil).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
		});
	};

	const renderQuote = ({ item }: { item: QuoteItem }) => {
		const expiringSoon = isExpiringSoon(item.validUntil);
		const expiryText = formatExpiryDate(item.validUntil);

		return (
			<Pressable
				style={({ pressed }) => [
					styles.quoteCard,
					pressed && styles.quoteCardPressed,
				]}
				onPress={() => router.push(`/quotes/${item._id}`)}
			>
				<View style={styles.quoteContent}>
					{/* Header Row */}
					<View style={styles.headerRow}>
						<View
							style={[
								styles.iconContainer,
								{ backgroundColor: `${statusConfig[item.status].color}15` },
							]}
						>
							<FileText size={18} color={statusConfig[item.status].color} />
						</View>
						<View style={styles.headerInfo}>
							<Text style={styles.quoteTitle} numberOfLines={1}>
								{item.title || `Quote #${item.quoteNumber}`}
							</Text>
							{item.quoteNumber && item.title && (
								<Text style={styles.quoteNumber}>#{item.quoteNumber}</Text>
							)}
						</View>
					</View>

					{/* Client */}
					{item.clientId && (
						<View style={styles.clientRow}>
							<Building2 size={14} color={colors.mutedForeground} />
							<Text style={styles.clientName} numberOfLines={1}>
								Client
							</Text>
						</View>
					)}

					{/* Value & Status Row */}
					<View style={styles.valueRow}>
						<Text style={styles.quoteValue}>{formatCurrency(item.total)}</Text>
						<StatusBadge status={item.status} />
					</View>

					{/* Expiry Warning */}
					{item.status === "sent" && expiryText && (
						<View
							style={[styles.expiryRow, expiringSoon && styles.expiryWarning]}
						>
							{expiringSoon ? (
								<AlertCircle size={14} color="#f59e0b" />
							) : (
								<Calendar size={14} color={colors.mutedForeground} />
							)}
							<Text
								style={[
									styles.expiryText,
									expiringSoon && styles.expiryWarningText,
								]}
							>
								{expiryText}
							</Text>
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

	const renderSectionHeader = ({ section }: { section: Section }) => (
		<View
			style={[
				styles.sectionHeader,
				{ borderLeftColor: statusConfig[section.status].color },
			]}
		>
			<View
				style={[
					styles.sectionIcon,
					{ backgroundColor: statusConfig[section.status].bgColor },
				]}
			>
				<FileText size={14} color={statusConfig[section.status].color} />
			</View>
			<Text style={styles.sectionTitle}>{section.title}</Text>
			<View
				style={[
					styles.sectionCount,
					{ backgroundColor: statusConfig[section.status].bgColor },
				]}
			>
				<Text
					style={[
						styles.sectionCountText,
						{ color: statusConfig[section.status].color },
					]}
				>
					{section.data.length}
				</Text>
			</View>
		</View>
	);

	// Calculate totals
	const totalValue = quotes.reduce((sum, q) => sum + (q.total || 0), 0);
	const approvedValue = quotes
		.filter((q) => q.status === "approved")
		.reduce((sum, q) => sum + (q.total || 0), 0);

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: colors.background }}
			edges={["bottom"]}
		>
			{/* Search Bar & Summary */}
			<View style={styles.headerSection}>
				<View style={styles.searchBar}>
					<Search size={20} color={colors.mutedForeground} />
					<TextInput
						style={styles.searchInput}
						placeholder="Search quotes..."
						placeholderTextColor={colors.mutedForeground}
						value={searchQuery}
						onChangeText={setSearchQuery}
					/>
				</View>

				{/* Quick Stats */}
				{!searchQuery && quotes.length > 0 && (
					<View style={styles.quickStats}>
						<View style={styles.quickStat}>
							<Text style={styles.quickStatValue}>
								{formatCurrency(totalValue)}
							</Text>
							<Text style={styles.quickStatLabel}>Total</Text>
						</View>
						<View style={styles.quickStatDivider} />
						<View style={styles.quickStat}>
							<Text style={[styles.quickStatValue, { color: "#10b981" }]}>
								{formatCurrency(approvedValue)}
							</Text>
							<Text style={styles.quickStatLabel}>Approved</Text>
						</View>
					</View>
				)}

				{searchQuery && (
					<Text style={styles.resultsCount}>
						{filteredQuotes.length} result
						{filteredQuotes.length !== 1 ? "s" : ""}
					</Text>
				)}
			</View>

			<SectionList
				sections={sections}
				keyExtractor={(item) => item._id}
				renderItem={renderQuote}
				renderSectionHeader={renderSectionHeader}
				contentContainerStyle={styles.listContent}
				stickySectionHeadersEnabled={false}
				ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
				SectionSeparatorComponent={() => (
					<View style={{ height: spacing.md }} />
				)}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
				ListEmptyComponent={
					<View style={styles.emptyState}>
						<View style={styles.emptyIcon}>
							<FileText size={32} color={colors.mutedForeground} />
						</View>
						<Text style={styles.emptyTitle}>
							{searchQuery ? "No quotes found" : "No quotes yet"}
						</Text>
						<Text style={styles.emptyText}>
							{searchQuery
								? "Try adjusting your search terms"
								: "Create your first quote to get started"}
						</Text>
					</View>
				}
			/>

			{/* FAB */}
			<Pressable
				style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
				onPress={() => router.push("/quotes/new")}
			>
				<Plus size={24} color="#ffffff" />
			</Pressable>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	headerSection: {
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
	quickStats: {
		flexDirection: "row",
		backgroundColor: colors.card,
		borderRadius: radius.md,
		padding: spacing.sm,
		marginTop: spacing.sm,
		borderWidth: 1,
		borderColor: colors.border,
	},
	quickStat: {
		flex: 1,
		alignItems: "center",
	},
	quickStatValue: {
		fontSize: 16,
		fontFamily: fontFamily.bold,
		color: colors.foreground,
	},
	quickStatLabel: {
		fontSize: 11,
		fontFamily: fontFamily.regular,
		color: colors.mutedForeground,
		marginTop: 2,
	},
	quickStatDivider: {
		width: 1,
		backgroundColor: colors.border,
		marginHorizontal: spacing.sm,
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
	sectionHeader: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.muted,
		borderRadius: radius.md,
		padding: spacing.sm,
		borderLeftWidth: 3,
		marginBottom: spacing.sm,
	},
	sectionIcon: {
		width: 28,
		height: 28,
		borderRadius: radius.sm,
		alignItems: "center",
		justifyContent: "center",
		marginRight: spacing.sm,
	},
	sectionTitle: {
		flex: 1,
		fontSize: 14,
		fontFamily: fontFamily.semibold,
		color: colors.foreground,
	},
	sectionCount: {
		paddingHorizontal: spacing.sm,
		paddingVertical: 2,
		borderRadius: radius.full,
	},
	sectionCountText: {
		fontSize: 12,
		fontFamily: fontFamily.bold,
	},
	quoteCard: {
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
	quoteCardPressed: {
		opacity: 0.7,
		backgroundColor: colors.muted,
	},
	quoteContent: {
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
		alignItems: "center",
		justifyContent: "center",
		marginRight: spacing.sm,
	},
	headerInfo: {
		flex: 1,
	},
	quoteTitle: {
		fontSize: 16,
		fontFamily: fontFamily.semibold,
		color: colors.foreground,
	},
	quoteNumber: {
		fontSize: 12,
		fontFamily: fontFamily.regular,
		color: colors.mutedForeground,
		marginTop: 2,
	},
	clientRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
		marginBottom: spacing.xs,
	},
	clientName: {
		fontSize: 13,
		fontFamily: fontFamily.regular,
		color: colors.mutedForeground,
		flex: 1,
	},
	valueRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginTop: spacing.xs,
	},
	quoteValue: {
		fontSize: 18,
		fontFamily: fontFamily.bold,
		color: colors.primary,
	},
	expiryRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
		marginTop: spacing.sm,
		paddingTop: spacing.sm,
		borderTopWidth: 1,
		borderTopColor: colors.border,
	},
	expiryWarning: {
		backgroundColor: "#fef3c7",
		marginTop: spacing.sm,
		marginHorizontal: -spacing.md,
		marginBottom: -spacing.md,
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
		borderTopWidth: 0,
		borderBottomLeftRadius: radius.lg,
	},
	expiryText: {
		fontSize: 12,
		fontFamily: fontFamily.regular,
		color: colors.mutedForeground,
	},
	expiryWarningText: {
		color: "#92400e",
		fontFamily: fontFamily.medium,
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
