import React from "react";
import {
	Document,
	Page,
	Text,
	View,
	StyleSheet,
	Image,
} from "@react-pdf/renderer";
import type { Id } from "../../convex/_generated/dataModel";

type QuoteLineItem = {
	_id: Id<"quoteLineItems">;
	description: string;
	quantity: number;
	unit: string;
	rate: number;
	amount: number;
};

type Quote = {
	_id: Id<"quotes">;
	quoteNumber?: string;
	_creationTime: number;
	validUntil?: number;
	title?: string;
	subtotal: number;
	discountEnabled?: boolean;
	discountAmount?: number;
	taxEnabled?: boolean;
	taxAmount?: number;
	total: number;
	terms?: string;
	clientMessage?: string;
};

type Client = {
	companyName: string;
	industry?: string;
};

type Organization = {
	name: string;
	logoUrl?: string;
	address?: string;
	phone?: string;
	email?: string;
};

export interface QuotePDFProps {
	quote: Quote;
	client?: Client | null;
	items: QuoteLineItem[];
	organization?: Organization | null;
}

const styles = StyleSheet.create({
	page: {
		flexDirection: "column",
		backgroundColor: "#FFFFFF",
		padding: 36,
		fontSize: 12,
		lineHeight: 1.5,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 36,
		paddingBottom: 16,
		borderBottomWidth: 1.5,
		borderBottomColor: "#E5E7EB",
	},
	headerLeft: {
		flexDirection: "column",
		maxWidth: 360,
	},
	headerRight: {
		flexDirection: "column",
		alignItems: "flex-end",
	},
	logoContainer: {
		width: 160,
		height: 56,
		marginBottom: 10,
	},
	logo: { width: "100%", height: "100%", objectFit: "contain" },
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#1F2937",
		marginBottom: 5,
	},
	subtitle: {
		fontSize: 12,
		color: "#6B7280",
	},
	quoteNumber: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#1F2937",
		marginBottom: 5,
	},
	date: {
		fontSize: 12,
		color: "#6B7280",
	},
	quoteMeta: {
		backgroundColor: "#F9FAFB",
		borderWidth: 1,
		borderColor: "#E5E7EB",
		borderRadius: 6,
		padding: 10,
		minWidth: 200,
		alignItems: "flex-end",
	},
	metaRow: { flexDirection: "row", gap: 6, marginTop: 2 },
	metaLabel: { fontSize: 10, color: "#6B7280" },
	metaValue: { fontSize: 10, color: "#374151" },
	billToSection: { marginTop: 18, marginBottom: 26 },
	sectionTitle: {
		fontSize: 14,
		fontWeight: "bold",
		color: "#1F2937",
		marginBottom: 10,
	},
	billToContent: { fontSize: 12, color: "#374151", lineHeight: 1.6 },
	itemsTable: { marginTop: 8, marginBottom: 28 },
	tableHeader: {
		flexDirection: "row",
		backgroundColor: "#F9FAFB",
		borderBottomWidth: 1,
		borderBottomColor: "#E5E7EB",
		paddingVertical: 8,
		paddingHorizontal: 10,
	},
	tableRow: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: "#E5E7EB",
		paddingVertical: 8,
		paddingHorizontal: 10,
	},
	tableCell: { fontSize: 11, color: "#374151" },
	tableCellDescription: { flex: 3 },
	tableCellQuantity: { flex: 1, textAlign: "center" },
	tableCellUnit: { flex: 1, textAlign: "center" },
	tableCellPrice: { flex: 1.5, textAlign: "right" },
	tableCellTotal: { flex: 1.5, textAlign: "right", fontWeight: "bold" },
	tableHeaderCell: {
		fontSize: 10,
		fontWeight: "bold",
		color: "#6B7280",
		textTransform: "uppercase",
		letterSpacing: 0.5,
	},
	totalsSection: {
		flexDirection: "row",
		justifyContent: "flex-end",
		marginTop: 16,
	},
	totalsContainer: { width: 220 },
	totalRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 4,
	},
	totalLabel: { fontSize: 12, color: "#6B7280" },
	totalValue: { fontSize: 12, color: "#374151", fontWeight: "bold" },
	grandTotalRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 8,
		borderTopWidth: 1,
		borderTopColor: "#E5E7EB",
		marginTop: 8,
	},
	grandTotalLabel: { fontSize: 14, fontWeight: "bold", color: "#1F2937" },
	grandTotalValue: { fontSize: 14, fontWeight: "bold", color: "#1F2937" },
	termsSection: { marginTop: 28, marginBottom: 24 },
	termsContent: { fontSize: 11, color: "#6B7280", lineHeight: 1.6 },
	signatureSection: {
		marginTop: 48,
		flexDirection: "row",
		justifyContent: "space-between",
	},
	signatureBox: {
		width: 200,
		borderBottomWidth: 1,
		borderBottomColor: "#E5E7EB",
		paddingBottom: 5,
	},
	signatureLabel: { fontSize: 10, color: "#6B7280", marginBottom: 20 },
});

const formatCurrency = (amount: number) =>
	new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
		amount
	);

const formatDate = (timestamp: number) =>
	new Date(timestamp).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

export const QuotePDF: React.FC<QuotePDFProps> = ({
	quote,
	client,
	items,
	organization,
}) => {
	return (
		<Document>
			<Page size="A4" style={styles.page}>
				{/* Header */}
				<View style={styles.header}>
					<View style={styles.headerLeft}>
						{organization?.logoUrl ? (
							<View style={styles.logoContainer}>
								{/* eslint-disable-next-line jsx-a11y/alt-text */}
								<Image style={styles.logo} src={organization.logoUrl} />
							</View>
						) : null}
						<Text style={styles.title}>QUOTE</Text>
						{organization?.name ? (
							<Text style={styles.subtitle}>{organization.name}</Text>
						) : null}
						{organization?.address ? (
							<Text style={styles.subtitle}>{organization.address}</Text>
						) : null}
						{organization?.phone ? (
							<Text style={styles.subtitle}>Phone: {organization.phone}</Text>
						) : null}
						{organization?.email ? (
							<Text style={styles.subtitle}>Email: {organization.email}</Text>
						) : null}
					</View>
					<View style={styles.headerRight}>
						<Text style={styles.quoteNumber}>
							Quote {quote.quoteNumber || `#${quote._id.slice(-6)}`}
						</Text>
						<View style={styles.quoteMeta}>
							<View style={styles.metaRow}>
								<Text style={styles.metaLabel}>Date:</Text>
								<Text style={styles.metaValue}>
									{formatDate(quote._creationTime)}
								</Text>
							</View>
							{quote.validUntil ? (
								<View style={styles.metaRow}>
									<Text style={styles.metaLabel}>Valid Until:</Text>
									<Text style={styles.metaValue}>
										{formatDate(quote.validUntil)}
									</Text>
								</View>
							) : null}
						</View>
					</View>
				</View>

				{/* Bill To Section */}
				<View style={styles.billToSection}>
					<Text style={styles.sectionTitle}>Bill To:</Text>
					<View style={styles.billToContent}>
						{client ? (
							<>
								<Text>{client.companyName}</Text>
								{client.industry ? <Text>{client.industry}</Text> : null}
							</>
						) : (
							<Text>Client details unavailable</Text>
						)}
					</View>
				</View>

				{/* Items Table */}
				<View style={styles.itemsTable}>
					<View style={styles.tableHeader}>
						<Text style={[styles.tableHeaderCell, styles.tableCellDescription]}>
							Description
						</Text>
						<Text style={[styles.tableHeaderCell, styles.tableCellQuantity]}>
							Qty
						</Text>
						<Text style={[styles.tableHeaderCell, styles.tableCellUnit]}>
							Unit
						</Text>
						<Text style={[styles.tableHeaderCell, styles.tableCellPrice]}>
							Rate
						</Text>
						<Text style={[styles.tableHeaderCell, styles.tableCellTotal]}>
							Amount
						</Text>
					</View>
					{items.map((item) => (
						<View key={String(item._id)} style={styles.tableRow}>
							<Text style={[styles.tableCell, styles.tableCellDescription]}>
								{item.description}
							</Text>
							<Text style={[styles.tableCell, styles.tableCellQuantity]}>
								{item.quantity}
							</Text>
							<Text style={[styles.tableCell, styles.tableCellUnit]}>
								{item.unit}
							</Text>
							<Text style={[styles.tableCell, styles.tableCellPrice]}>
								{formatCurrency(item.rate)}
							</Text>
							<Text style={[styles.tableCell, styles.tableCellTotal]}>
								{formatCurrency(item.amount)}
							</Text>
						</View>
					))}
				</View>

				{/* Totals */}
				<View style={styles.totalsSection}>
					<View style={styles.totalsContainer}>
						<View style={styles.totalRow}>
							<Text style={styles.totalLabel}>Subtotal:</Text>
							<Text style={styles.totalValue}>
								{formatCurrency(quote.subtotal)}
							</Text>
						</View>
						{quote.discountEnabled && quote.discountAmount ? (
							<View style={styles.totalRow}>
								<Text style={styles.totalLabel}>Discount:</Text>
								<Text style={styles.totalValue}>
									- {formatCurrency(quote.discountAmount)}
								</Text>
							</View>
						) : null}
						{quote.taxEnabled && quote.taxAmount ? (
							<View style={styles.totalRow}>
								<Text style={styles.totalLabel}>Tax:</Text>
								<Text style={styles.totalValue}>
									{formatCurrency(quote.taxAmount)}
								</Text>
							</View>
						) : null}
						<View style={styles.grandTotalRow}>
							<Text style={styles.grandTotalLabel}>Total:</Text>
							<Text style={styles.grandTotalValue}>
								{formatCurrency(quote.total)}
							</Text>
						</View>
					</View>
				</View>

				{/* Terms & Client Message */}
				{quote.terms ? (
					<View style={styles.termsSection}>
						<Text style={styles.sectionTitle}>Terms & Conditions:</Text>
						<Text style={styles.termsContent}>{quote.terms}</Text>
					</View>
				) : null}
				{quote.clientMessage ? (
					<View style={styles.termsSection}>
						<Text style={styles.sectionTitle}>Message to Client:</Text>
						<Text style={styles.termsContent}>{quote.clientMessage}</Text>
					</View>
				) : null}

				{/* Signature */}
				<View style={styles.signatureSection}>
					<View style={styles.signatureBox}>
						<Text style={styles.signatureLabel}>Client Signature</Text>
					</View>
					<View style={styles.signatureBox}>
						<Text style={styles.signatureLabel}>Date</Text>
					</View>
				</View>
			</Page>
		</Document>
	);
};

export default QuotePDF;
