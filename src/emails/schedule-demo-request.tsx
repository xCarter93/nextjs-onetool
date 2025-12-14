import * as React from "react";
import {
	Html,
	Head,
	Body,
	Container,
	Section,
	Text,
	Link,
	Heading,
	Hr,
} from "@react-email/components";

interface ScheduleDemoRequestEmailProps {
	name: string;
	email: string;
	company?: string;
	phone?: string;
	message?: string;
	timestamp: string;
}

export const ScheduleDemoRequestEmail = ({
	name,
	email,
	company,
	phone,
	message,
	timestamp,
}: ScheduleDemoRequestEmailProps) => {
	return (
		<Html>
			<Head />
			<Body style={styles.body}>
				<Container style={styles.container}>
					{/* Header */}
					<Section style={styles.header}>
						<Heading style={styles.headerTitle}>🎯 New Demo Request</Heading>
					</Section>

					{/* Content */}
					<Section style={styles.content}>
						{/* Contact Name */}
						<Section style={styles.infoSection}>
							<Text style={styles.infoLabel}>Contact Name</Text>
							<Text style={styles.infoValue}>{name}</Text>
						</Section>

						{/* Email Address */}
						<Section style={styles.infoSection}>
							<Text style={styles.infoLabel}>Email Address</Text>
							<Text style={styles.infoValue}>
								<Link href={`mailto:${email}`} style={styles.link}>
									{email}
								</Link>
							</Text>
						</Section>

						{/* Company (optional) */}
						{company && (
							<Section style={styles.infoSection}>
								<Text style={styles.infoLabel}>Company</Text>
								<Text style={styles.infoValue}>{company}</Text>
							</Section>
						)}

						{/* Phone (optional) */}
						{phone && (
							<Section style={styles.infoSection}>
								<Text style={styles.infoLabel}>Phone Number</Text>
								<Text style={styles.infoValue}>
									<Link href={`tel:${phone}`} style={styles.link}>
										{phone}
									</Link>
								</Text>
							</Section>
						)}

						{/* Message (optional) */}
						{message && (
							<Section style={styles.infoSection}>
								<Text style={styles.infoLabel}>Message</Text>
								<Section style={styles.messageBox}>
									<Text style={styles.messageText}>{message}</Text>
								</Section>
							</Section>
						)}

						{/* CTA Note */}
						<Section style={styles.ctaNote}>
							<Text style={styles.ctaNoteText}>
								💡 Please reach out to this prospect within 24 hours to schedule
								their demo.
							</Text>
						</Section>
					</Section>

					{/* Footer */}
					<Section style={styles.footer}>
						<Text style={styles.timestamp}>
							Request received: <strong>{timestamp}</strong>
						</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	);
};

// Styles
const styles = {
	body: {
		fontFamily:
			"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
		lineHeight: "1.6",
		color: "#333",
		margin: "0",
		padding: "0",
		backgroundColor: "#f5f5f5",
	},
	container: {
		maxWidth: "600px",
		margin: "20px auto",
		backgroundColor: "#ffffff",
		borderRadius: "8px",
		overflow: "hidden",
		boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
	},
	header: {
		background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
		padding: "32px 24px",
		textAlign: "center" as const,
	},
	headerTitle: {
		margin: "0",
		fontSize: "24px",
		fontWeight: "700",
		color: "#ffffff",
	},
	content: {
		padding: "32px 24px",
	},
	infoSection: {
		marginBottom: "24px",
		paddingBottom: "24px",
		borderBottom: "1px solid #e5e7eb",
	},
	infoLabel: {
		fontSize: "12px",
		fontWeight: "600",
		textTransform: "uppercase" as const,
		color: "#6b7280",
		marginBottom: "6px",
		letterSpacing: "0.5px",
		margin: "0 0 6px 0",
	},
	infoValue: {
		fontSize: "16px",
		color: "#1f2937",
		fontWeight: "500",
		margin: "0",
	},
	messageBox: {
		backgroundColor: "#f9fafb",
		borderLeft: "4px solid #3b82f6",
		padding: "16px",
		borderRadius: "4px",
		marginTop: "8px",
	},
	messageText: {
		color: "#374151",
		fontSize: "15px",
		lineHeight: "1.7",
		margin: "0",
		whiteSpace: "pre-wrap" as const,
		wordWrap: "break-word" as const,
	},
	ctaNote: {
		marginTop: "24px",
		padding: "16px",
		backgroundColor: "#fef3c7",
		borderRadius: "6px",
		borderLeft: "4px solid #f59e0b",
	},
	ctaNoteText: {
		margin: "0",
		color: "#92400e",
		fontSize: "14px",
		fontWeight: "500",
	},
	footer: {
		backgroundColor: "#f9fafb",
		padding: "20px 24px",
		textAlign: "center" as const,
		borderTop: "1px solid #e5e7eb",
	},
	timestamp: {
		fontSize: "13px",
		color: "#6b7280",
		margin: "0",
	},
	link: {
		color: "#3b82f6",
		textDecoration: "none",
	},
};

export default ScheduleDemoRequestEmail;
