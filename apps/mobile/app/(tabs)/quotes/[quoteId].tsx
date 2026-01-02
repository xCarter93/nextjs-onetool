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
import { useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Id } from "@onetool/backend/convex/_generated/dataModel";
import { colors, fontFamily, spacing, radius } from "@/lib/theme";
import { StatusBadge } from "@/components/StatusBadge";
import { Card } from "@/components/Card";
import { EditableField } from "@/components/EditableField";
import { StyledButton } from "@/components/styled/StyledButton";
import {
	Building2,
	FileEdit,
	Send,
	CheckCircle,
	XCircle,
	Calendar,
	DollarSign,
	ChevronRight,
	Package,
} from "lucide-react-native";

type QuoteStatus = "draft" | "sent" | "approved" | "declined" | "expired";

const statusOptions: { value: QuoteStatus; label: string }[] = [
	{ value: "draft", label: "Draft" },
	{ value: "sent", label: "Sent" },
	{ value: "approved", label: "Approved" },
	{ value: "declined", label: "Declined" },
	{ value: "expired", label: "Expired" },
];

export default function QuoteDetailScreen() {
	const { quoteId } = useLocalSearchParams<{ quoteId: string }>();
	const router = useRouter();
	const [refreshing, setRefreshing] = useState(false);
	const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

	const quote = useQuery(
		api.quotes.get,
		quoteId ? { id: quoteId as Id<"quotes"> } : "skip"
	);

	const lineItems = useQuery(
		api.quoteLineItems.listByQuote,
		quoteId ? { quoteId: quoteId as Id<"quotes"> } : "skip"
	);

	const updateQuote = useMutation(api.quotes.update);

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		setTimeout(() => setRefreshing(false), 1000);
	}, []);

	const handleUpdateField = async (field: string, value: string) => {
		if (!quoteId) return;
		await updateQuote({
			id: quoteId as Id<"quotes">,
			[field]: value,
		});
	};

	const handleUpdateStatus = (newStatus: QuoteStatus) => {
		Alert.alert(
			"Confirm Status Change",
			`Are you sure you want to mark this quote as "${statusOptions.find((s) => s.value === newStatus)?.label}"?`,
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Confirm",
					onPress: async () => {
						setIsUpdatingStatus(true);
						try {
							await updateQuote({
								id: quoteId as Id<"quotes">,
								status: newStatus,
							});
						} catch (error) {
							console.error("Failed to update status:", error);
							Alert.alert("Error", "Failed to update quote status");
						} finally {
							setIsUpdatingStatus(false);
						}
					},
				},
			]
		);
	};

	const handleStatusSelect = () => {
		if (!quote) return;

		Alert.alert(
			"Update Status",
			"Select a new status for this quote",
			statusOptions.map((option) => ({
				text: option.label,
				onPress: () => handleUpdateStatus(option.value),
			})),
			{ cancelable: true }
		);
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(amount);
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

	if (!quote) {
		return (
			<SafeAreaView
				style={{ flex: 1, backgroundColor: colors.background }}
				edges={["bottom"]}
			>
				<View style={styles.loadingContainer}>
					<Text style={styles.loadingText}>Loading quote...</Text>
				</View>
			</SafeAreaView>
		);
	}

	const getStatusColor = (status: string) => {
		switch (status) {
			case "approved":
				return "#10b981";
			case "sent":
				return "#3b82f6";
			case "draft":
				return "#6b7280";
			case "declined":
				return "#ef4444";
			case "expired":
				return "#6b7280";
			default:
				return colors.mutedForeground;
		}
	};

	const statusColor = getStatusColor(quote.status);

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
							label="Quote Title"
							value={quote.title}
							onSave={(value) => handleUpdateField("title", value)}
							placeholder="Enter quote title"
						/>

						{quote.quoteNumber != null && (
							<View style={styles.quoteNumberRow}>
								<Text style={styles.quoteNumberLabel}>Quote #</Text>
								<Text style={styles.quoteNumber}>{quote.quoteNumber}</Text>
							</View>
						)}

						<View style={styles.statusRow}>
							<Text style={styles.fieldLabel}>Status</Text>
							<Pressable
								onPress={handleStatusSelect}
								style={styles.statusButton}
							>
								<StatusBadge status={quote.status} />
								<FileEdit size={14} color={colors.mutedForeground} />
							</Pressable>
						</View>

						{/* Client Link */}
						{quote.clientId && (
							<Pressable
								style={styles.clientRow}
								onPress={() => router.push(`/clients/${quote.clientId}`)}
							>
								<Building2 size={16} color={colors.mutedForeground} />
								<Text style={styles.clientName}>View Client</Text>
								<ChevronRight size={16} color={colors.mutedForeground} />
							</Pressable>
						)}
					</View>
				</View>

				{/* Quick Actions */}
				{quote.status === "draft" && (
					<View style={styles.actionsRow}>
						<StyledButton
							label="Send Quote"
							intent="primary"
							icon={<Send size={16} color={colors.primary} />}
							onPress={() => handleUpdateStatus("sent")}
							isLoading={isUpdatingStatus}
							style={{ flex: 1 }}
						/>
					</View>
				)}

				{quote.status === "sent" && (
					<View style={styles.actionsRow}>
						<StyledButton
							label="Approve"
							intent="success"
							icon={<CheckCircle size={16} color="#16a34a" />}
							onPress={() => handleUpdateStatus("approved")}
							isLoading={isUpdatingStatus}
							style={{ flex: 1 }}
						/>
						<StyledButton
							label="Decline"
							intent="destructive"
							icon={<XCircle size={16} color="#dc2626" />}
							onPress={() => handleUpdateStatus("declined")}
							isLoading={isUpdatingStatus}
							style={{ flex: 1 }}
						/>
					</View>
				)}

				{/* Pricing Summary */}
				<View style={styles.pricingCard}>
					<View style={styles.pricingRow}>
						<Text style={styles.pricingLabel}>Subtotal</Text>
						<Text style={styles.pricingValue}>
							{formatCurrency(quote.subtotal)}
						</Text>
					</View>
					{quote.taxAmount && quote.taxAmount > 0 && (
						<View style={styles.pricingRow}>
							<Text style={styles.pricingLabel}>
								Tax {quote.taxRate ? `(${quote.taxRate}%)` : ""}
							</Text>
							<Text style={styles.pricingValue}>
								{formatCurrency(quote.taxAmount)}
							</Text>
						</View>
					)}
					{quote.discountAmount && quote.discountAmount > 0 && (
						<View style={styles.pricingRow}>
							<Text style={styles.pricingLabel}>Discount</Text>
							<Text style={[styles.pricingValue, { color: colors.success }]}>
								-{formatCurrency(quote.discountAmount)}
							</Text>
						</View>
					)}
					<View style={styles.pricingDivider} />
					<View style={styles.pricingRow}>
						<Text style={styles.totalLabel}>Total</Text>
						<Text style={styles.totalValue}>{formatCurrency(quote.total)}</Text>
					</View>
				</View>

				{/* Dates */}
				{(quote.sentAt || quote.validUntil) && (
					<Card title="Dates" style={{ marginTop: spacing.md }}>
						<View style={styles.datesContainer}>
							{quote.sentAt && (
								<View style={styles.dateItem}>
									<Calendar size={16} color={colors.primary} />
									<View>
										<Text style={styles.dateLabel}>Sent Date</Text>
										<Text style={styles.dateValue}>
											{formatDate(quote.sentAt)}
										</Text>
									</View>
								</View>
							)}
							{quote.validUntil && (
								<View style={styles.dateItem}>
									<Calendar
										size={16}
										color={
											quote.status === "expired"
												? colors.danger
												: colors.mutedForeground
										}
									/>
									<View>
										<Text style={styles.dateLabel}>Expires</Text>
										<Text
											style={[
												styles.dateValue,
												quote.status === "expired" && { color: colors.danger },
											]}
										>
											{formatDate(quote.validUntil)}
										</Text>
									</View>
								</View>
							)}
						</View>
					</Card>
				)}

				{/* Line Items */}
				{lineItems && lineItems.length > 0 && (
					<Card title="Line Items" style={{ marginTop: spacing.md }}>
						<View style={styles.lineItemsList}>
							{lineItems.map((item, index) => (
								<View
									key={item._id}
									style={[styles.lineItem, index > 0 && styles.lineItemBorder]}
								>
									<View style={styles.lineItemHeader}>
										<Package size={14} color={colors.mutedForeground} />
										<Text style={styles.lineItemDescription} numberOfLines={2}>
											{item.description}
										</Text>
									</View>
									<View style={styles.lineItemDetails}>
										<Text style={styles.lineItemQuantity}>
											{item.quantity ?? 0} {item.unit ?? ""} ×{" "}
											{formatCurrency(item.rate ?? 0)}
										</Text>
										<Text style={styles.lineItemAmount}>
											{formatCurrency(item.amount ?? 0)}
										</Text>
									</View>
								</View>
							))}
						</View>
					</Card>
				)}

				{/* Client Message */}
				<Card title="Message to Client" style={{ marginTop: spacing.md }}>
					<View style={{ marginTop: spacing.sm }}>
						<EditableField
							label=""
							value={quote.clientMessage}
							onSave={(value) => handleUpdateField("clientMessage", value)}
							placeholder="Add a message for your client..."
							multiline
							numberOfLines={3}
						/>
					</View>
				</Card>

				{/* Terms */}
				{quote.terms && (
					<Card title="Terms & Conditions" style={{ marginTop: spacing.md }}>
						<View style={{ marginTop: spacing.sm }}>
							<Text style={styles.dateValue}>{quote.terms}</Text>
						</View>
					</Card>
				)}

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
	quoteNumberRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
	},
	quoteNumberLabel: {
		fontSize: 13,
		fontFamily: fontFamily.regular,
		color: colors.mutedForeground,
	},
	quoteNumber: {
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
	actionsRow: {
		flexDirection: "row",
		gap: spacing.sm,
		marginTop: spacing.md,
	},
	pricingCard: {
		backgroundColor: colors.card,
		borderRadius: radius.lg,
		padding: spacing.md,
		marginTop: spacing.md,
		borderWidth: 1,
		borderColor: colors.border,
	},
	pricingRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: spacing.xs,
	},
	pricingLabel: {
		fontSize: 14,
		fontFamily: fontFamily.regular,
		color: colors.mutedForeground,
	},
	pricingValue: {
		fontSize: 14,
		fontFamily: fontFamily.medium,
		color: colors.foreground,
	},
	pricingDivider: {
		height: 1,
		backgroundColor: colors.border,
		marginVertical: spacing.sm,
	},
	totalLabel: {
		fontSize: 16,
		fontFamily: fontFamily.semibold,
		color: colors.foreground,
	},
	totalValue: {
		fontSize: 20,
		fontFamily: fontFamily.bold,
		color: colors.primary,
	},
	datesContainer: {
		marginTop: spacing.sm,
		gap: spacing.md,
	},
	dateItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
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
	lineItemsList: {
		marginTop: spacing.sm,
	},
	lineItem: {
		paddingVertical: spacing.sm,
	},
	lineItemBorder: {
		borderTopWidth: 1,
		borderTopColor: colors.border,
	},
	lineItemHeader: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: spacing.xs,
		marginBottom: spacing.xs,
	},
	lineItemDescription: {
		flex: 1,
		fontSize: 14,
		fontFamily: fontFamily.medium,
		color: colors.foreground,
	},
	lineItemDetails: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginLeft: 22,
	},
	lineItemQuantity: {
		fontSize: 13,
		fontFamily: fontFamily.regular,
		color: colors.mutedForeground,
	},
	lineItemAmount: {
		fontSize: 14,
		fontFamily: fontFamily.semibold,
		color: colors.foreground,
	},
});
