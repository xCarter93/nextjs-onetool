import React from "react";
import {
	Document,
	Page,
	Text,
	View,
	StyleSheet,
	Image,
} from "@react-pdf/renderer";
import type { Id } from "@onetool/backend/convex/_generated/dataModel";

type InvoiceLineItem = {
	_id: Id<"invoiceLineItems">;
	description: string;
	quantity: number;
	unitPrice: number;
	total: number;
};

type Invoice = {
	_id: Id<"invoices">;
	invoiceNumber: string;
	issuedDate: number;
	dueDate: number;
	status: string;
	subtotal: number;
	discountAmount?: number;
	taxAmount?: number;
	total: number;
	paidAt?: number;
};

type Client = {
	companyName: string;
};

type Organization = {
	name: string;
	logoUrl?: string;
	address?: string;
	phone?: string;
	email?: string;
};

export interface InvoicePDFProps {
	invoice: Invoice;
	client?: Client | null;
	items: InvoiceLineItem[];
	organization?: Organization | null;
}

const styles = StyleSheet.create({
	page: {
		flexDirection: "column",
		backgroundColor: "#FFFFFF",
		padding: 28,
		fontSize: 11,
		fontFamily: "Helvetica",
	},
	logoSection: {
		marginBottom: 16,
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
		marginBottom: 24,
		paddingBottom: 12,
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
	invoiceNumber: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#000000",
		marginBottom: 8,
	},
	invoiceMeta: {
		backgroundColor: "#F9FAFB",
		borderWidth: 1,
		borderColor: "#E5E7EB",
		borderRadius: 4,
		padding: 10,
		minWidth: 200,
	},
	metaRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 4,
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
	statusBadge: {
		backgroundColor: "#10B981",
		paddingVertical: 4,
		paddingHorizontal: 8,
		borderRadius: 4,
		marginTop: 6,
	},
	statusText: {
		fontSize: 9,
		color: "#FFFFFF",
		fontWeight: "bold",
		textTransform: "uppercase",
	},
	billToSection: {
		marginTop: 8,
		marginBottom: 16,
		padding: 12,
		backgroundColor: "#F9FAFB",
		borderRadius: 4,
	},
	sectionTitle: {
		fontSize: 11,
		fontWeight: "bold",
		color: "#1F2937",
		marginBottom: 8,
		textTransform: "uppercase",
		letterSpacing: 0.5,
	},
	billToContent: {
		fontSize: 11,
		color: "#374151",
		lineHeight: 1.6,
	},
	itemsTable: {
		marginTop: 12,
		marginBottom: 16,
		borderWidth: 1,
		borderColor: "#E5E7EB",
		borderRadius: 4,
	},
	tableHeader: {
		flexDirection: "row",
		backgroundColor: "#1F2937",
		paddingVertical: 10,
		paddingHorizontal: 12,
	},
	tableRow: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: "#E5E7EB",
		paddingVertical: 10,
		paddingHorizontal: 12,
		backgroundColor: "#FFFFFF",
	},
	tableCell: {
		fontSize: 10,
		color: "#374151",
		lineHeight: 1.4,
	},
	tableCellDescription: { flex: 3 },
	tableCellQuantity: { flex: 1, textAlign: "center" },
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
		marginTop: 12,
		marginBottom: 16,
	},
	totalsContainer: {
		width: 260,
		borderWidth: 1,
		borderColor: "#E5E7EB",
		borderRadius: 4,
		padding: 12,
		backgroundColor: "#F9FAFB",
	},
	totalRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 4,
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
		paddingVertical: 8,
		paddingTop: 10,
		borderTopWidth: 2,
		borderTopColor: "#1F2937",
		marginTop: 6,
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
	amountDueSection: {
		marginTop: 12,
		padding: 12,
		backgroundColor: "#FEF3C7",
		borderRadius: 4,
		borderLeftWidth: 4,
		borderLeftColor: "#F59E0B",
	},
	amountDueText: {
		fontSize: 12,
		fontWeight: "bold",
		color: "#92400E",
		marginBottom: 4,
	},
	amountDueValue: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#92400E",
	},
	paymentNotice: {
		marginTop: 12,
		padding: 12,
		backgroundColor: "#D1FAE5",
		borderRadius: 4,
		borderLeftWidth: 4,
		borderLeftColor: "#10B981",
	},
	paymentNoticeText: {
		fontSize: 11,
		color: "#065F46",
		fontWeight: "bold",
	},
	footer: {
		marginTop: 24,
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: "#E5E7EB",
	},
	footerText: {
		fontSize: 9,
		color: "#6B7280",
		textAlign: "center",
		lineHeight: 1.4,
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

export const InvoicePDF: React.FC<InvoicePDFProps> = ({
	invoice,
	client,
	items,
	organization,
}) => {
	const isPaid = invoice.status === "paid";
	const isOverdue =
		!isPaid && invoice.status === "sent" && invoice.dueDate < Date.now();

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
						<Text style={styles.title}>INVOICE</Text>
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
						<Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
						<View style={styles.invoiceMeta}>
							<View style={styles.metaRow}>
								<Text style={styles.metaLabel}>Issued:</Text>
								<Text style={styles.metaValue}>
									{formatDate(invoice.issuedDate)}
								</Text>
							</View>
							<View style={styles.metaRow}>
								<Text style={styles.metaLabel}>Due Date:</Text>
								<Text style={styles.metaValue}>
									{formatDate(invoice.dueDate)}
								</Text>
							</View>
							{isPaid && invoice.paidAt && (
								<View style={styles.metaRow}>
									<Text style={styles.metaLabel}>Paid:</Text>
									<Text style={styles.metaValue}>
										{formatDate(invoice.paidAt)}
									</Text>
								</View>
							)}
						</View>
						{isPaid && (
							<View style={styles.statusBadge}>
								<Text style={styles.statusText}>PAID</Text>
							</View>
						)}
					</View>
				</View>

				{/* Bill To Section */}
				<View style={styles.billToSection} wrap={false}>
					<Text style={styles.sectionTitle}>Bill To:</Text>
					<View style={styles.billToContent}>
						{client ? (
							<Text>{client.companyName}</Text>
						) : (
							<Text>Client details unavailable</Text>
						)}
					</View>
				</View>

				{/* Items Table */}
				<View style={styles.itemsTable} wrap={false}>
					<View style={styles.tableHeader}>
						<Text style={[styles.tableHeaderCell, styles.tableCellDescription]}>
							Description
						</Text>
						<Text style={[styles.tableHeaderCell, styles.tableCellQuantity]}>
							Qty
						</Text>
						<Text style={[styles.tableHeaderCell, styles.tableCellPrice]}>
							Unit Price
						</Text>
						<Text style={[styles.tableHeaderCell, styles.tableCellTotal]}>
							Total
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
							<Text style={[styles.tableCell, styles.tableCellPrice]}>
								{formatCurrency(item.unitPrice)}
							</Text>
							<Text style={[styles.tableCell, styles.tableCellTotal]}>
								{formatCurrency(item.total)}
							</Text>
						</View>
					))}
				</View>

				{/* Totals */}
				<View style={styles.totalsSection} wrap={false}>
					<View style={styles.totalsContainer}>
						<View style={styles.totalRow}>
							<Text style={styles.totalLabel}>Subtotal:</Text>
							<Text style={styles.totalValue}>
								{formatCurrency(invoice.subtotal)}
							</Text>
						</View>
						{invoice.discountAmount ? (
							<View style={styles.totalRow}>
								<Text style={styles.totalLabel}>Discount:</Text>
								<Text style={styles.totalValue}>
									- {formatCurrency(invoice.discountAmount)}
								</Text>
							</View>
						) : null}
						{invoice.taxAmount ? (
							<View style={styles.totalRow}>
								<Text style={styles.totalLabel}>Tax:</Text>
								<Text style={styles.totalValue}>
									{formatCurrency(invoice.taxAmount)}
								</Text>
							</View>
						) : null}
						<View style={styles.grandTotalRow}>
							<Text style={styles.grandTotalLabel}>Total:</Text>
							<Text style={styles.grandTotalValue}>
								{formatCurrency(invoice.total)}
							</Text>
						</View>
					</View>
				</View>

				{/* Amount Due Notice (if not paid) */}
				{!isPaid && (
					<View style={styles.amountDueSection} wrap={false}>
						<Text style={styles.amountDueText}>
							{isOverdue ? "AMOUNT OVERDUE" : "AMOUNT DUE"}
						</Text>
						<Text style={styles.amountDueValue}>
							{formatCurrency(invoice.total)}
						</Text>
						<Text style={{ fontSize: 10, color: "#92400E", marginTop: 4 }}>
							Payment due by {formatDate(invoice.dueDate)}
						</Text>
					</View>
				)}

				{/* Payment Confirmation (if paid) */}
				{isPaid && (
					<View style={styles.paymentNotice} wrap={false}>
						<Text style={styles.paymentNoticeText}>
							✓ Payment received on{" "}
							{invoice.paidAt && formatDate(invoice.paidAt)}
						</Text>
						<Text style={{ fontSize: 10, color: "#065F46", marginTop: 4 }}>
							Thank you for your business!
						</Text>
					</View>
				)}

				{/* Footer */}
				<View style={styles.footer}>
					<Text style={styles.footerText}>
						This invoice was generated electronically and is valid without a
						signature.
					</Text>
					{organization?.name && (
						<Text style={styles.footerText}>
							{organization.name} • Invoice {invoice.invoiceNumber}
						</Text>
					)}
				</View>
			</Page>
		</Document>
	);
};

export default InvoicePDF;
