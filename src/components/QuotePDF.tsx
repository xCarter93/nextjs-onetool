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
		padding: 40,
		fontSize: 11,
		fontFamily: "Helvetica",
	},
	logoSection: {
		marginBottom: 24,
		alignItems: "flex-start",
	},
	logoContainer: {
		width: 160,
		height: 60,
	},
	logo: {
		width: "100%",
		height: "100%",
		objectFit: "contain",
		objectPosition: "left center",
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 40,
		paddingBottom: 20,
		borderBottomWidth: 2,
		borderBottomColor: "#000000",
	},
	headerLeft: {
		flexDirection: "column",
		maxWidth: 280,
	},
	headerRight: {
		flexDirection: "column",
		alignItems: "flex-end",
		justifyContent: "flex-start",
	},
	title: {
		fontSize: 32,
		fontWeight: "bold",
		color: "#000000",
		marginBottom: 8,
		letterSpacing: 1,
	},
	subtitle: {
		fontSize: 10,
		color: "#374151",
		marginBottom: 2,
		lineHeight: 1.5,
	},
	quoteNumber: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#000000",
		marginBottom: 12,
	},
	date: {
		fontSize: 10,
		color: "#6B7280",
	},
	quoteMeta: {
		backgroundColor: "#F9FAFB",
		borderWidth: 1,
		borderColor: "#E5E7EB",
		borderRadius: 4,
		padding: 14,
		minWidth: 200,
	},
	metaRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 6,
	},
	metaLabel: {
		fontSize: 10,
		color: "#6B7280",
		fontWeight: "bold",
	},
	metaValue: {
		fontSize: 10,
		color: "#1F2937",
		marginLeft: 16,
	},
	billToSection: {
		marginTop: 12,
		marginBottom: 32,
		padding: 16,
		backgroundColor: "#F9FAFB",
		borderRadius: 4,
	},
	sectionTitle: {
		fontSize: 11,
		fontWeight: "bold",
		color: "#1F2937",
		marginBottom: 10,
		textTransform: "uppercase",
		letterSpacing: 0.5,
	},
	billToContent: {
		fontSize: 11,
		color: "#374151",
		lineHeight: 1.6,
	},
	itemsTable: {
		marginTop: 16,
		marginBottom: 32,
		borderWidth: 1,
		borderColor: "#E5E7EB",
		borderRadius: 4,
	},
	tableHeader: {
		flexDirection: "row",
		backgroundColor: "#1F2937",
		paddingVertical: 12,
		paddingHorizontal: 14,
	},
	tableRow: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: "#E5E7EB",
		paddingVertical: 12,
		paddingHorizontal: 14,
		backgroundColor: "#FFFFFF",
	},
	tableCell: {
		fontSize: 10,
		color: "#374151",
		lineHeight: 1.4,
	},
	tableCellDescription: { flex: 3 },
	tableCellQuantity: { flex: 1, textAlign: "center" },
	tableCellUnit: { flex: 1, textAlign: "center" },
	tableCellPrice: { flex: 1.5, textAlign: "right" },
	tableCellTotal: {
		flex: 1.5,
		textAlign: "right",
		fontWeight: "bold",
		color: "#1F2937",
	},
	tableHeaderCell: {
		fontSize: 10,
		fontWeight: "bold",
		color: "#FFFFFF",
		textTransform: "uppercase",
		letterSpacing: 0.8,
	},
	totalsSection: {
		flexDirection: "row",
		justifyContent: "flex-end",
		marginTop: 20,
		marginBottom: 24,
	},
	totalsContainer: {
		width: 260,
		borderWidth: 1,
		borderColor: "#E5E7EB",
		borderRadius: 4,
		padding: 16,
		backgroundColor: "#F9FAFB",
	},
	totalRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 6,
	},
	totalLabel: {
		fontSize: 11,
		color: "#6B7280",
	},
	totalValue: {
		fontSize: 11,
		color: "#374151",
		fontWeight: "bold",
	},
	grandTotalRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 10,
		paddingTop: 12,
		borderTopWidth: 2,
		borderTopColor: "#1F2937",
		marginTop: 8,
	},
	grandTotalLabel: {
		fontSize: 14,
		fontWeight: "bold",
		color: "#000000",
	},
	grandTotalValue: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#000000",
	},
	termsSection: {
		marginTop: 8,
		marginBottom: 20,
		padding: 16,
		backgroundColor: "#F9FAFB",
		borderRadius: 4,
		borderLeftWidth: 3,
		borderLeftColor: "#1F2937",
	},
	termsContent: {
		fontSize: 10,
		color: "#4B5563",
		lineHeight: 1.6,
	},
	signatureSection: {
		marginTop: 60,
		flexDirection: "row",
		justifyContent: "space-between",
		gap: 40,
	},
	signatureBox: {
		flex: 1,
		borderBottomWidth: 1.5,
		borderBottomColor: "#1F2937",
		paddingBottom: 8,
	},
	signatureLabel: {
		fontSize: 10,
		color: "#6B7280",
		marginBottom: 32,
		fontWeight: "bold",
		textTransform: "uppercase",
		letterSpacing: 0.5,
	},
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
				{/* Logo Section */}
				{organization?.logoUrl ? (
					<View style={styles.logoSection}>
						<View style={styles.logoContainer}>
							{/* eslint-disable-next-line jsx-a11y/alt-text */}
							<Image style={styles.logo} src={organization.logoUrl} />
						</View>
					</View>
				) : null}

				{/* Header */}
				<View style={styles.header}>
					<View style={styles.headerLeft}>
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

				{/* Signature Section with BoldSign text tags */}
				<View style={styles.signatureSection}>
					<View style={{ width: "45%" }}>
						<Text style={{ fontSize: 10, color: "#1F2937", marginBottom: 5 }}>
							Signature:
						</Text>
						{/* BoldSign text tag - no placeholder for sign fields */}
						<Text style={{ fontSize: 8, color: "#FFFFFF" }}>
							{`{{sign|1|*||client_signature}}`}
						</Text>
						<View
							style={{
								borderBottomWidth: 1,
								borderBottomColor: "#1F2937",
								marginTop: 20,
								width: "100%",
							}}
						/>
					</View>
					<View style={{ width: "45%" }}>
						<Text style={{ fontSize: 10, color: "#1F2937", marginBottom: 5 }}>
							Date:
						</Text>
						{/* BoldSign text tag - no placeholder for date fields */}
						<Text style={{ fontSize: 8, color: "#FFFFFF" }}>
							{`{{date|1|*||date_signed}}`}
						</Text>
						<View
							style={{
								borderBottomWidth: 1,
								borderBottomColor: "#1F2937",
								marginTop: 20,
								width: "100%",
							}}
						/>
					</View>
				</View>
			</Page>
		</Document>
	);
};

export default QuotePDF;
