import {
	View,
	Text,
	StyleSheet,
	Pressable,
	Linking,
	ActivityIndicator,
} from "react-native";
import { useQuery } from "convex/react";
import { api } from "@onetool/backend/convex/_generated/api";
import { Card } from "@/components/Card";
import { colors, fontFamily, spacing, radius } from "@/lib/theme";
import { FileText, Download, FileCheck, FolderOpen } from "lucide-react-native";
import type { Id } from "@onetool/backend/convex/_generated/dataModel";

interface ProjectDocumentsProps {
	projectId: Id<"projects">;
}

// Helper utilities
const formatFileSize = (bytes: number): string => {
	if (bytes === 0) return "0 Bytes";
	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB"];
	let i = Math.floor(Math.log(bytes) / Math.log(k));
	i = Math.min(i, sizes.length - 1);
	return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

const formatDate = (timestamp: number): string => {
	return new Date(timestamp).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
};

const isImage = (mimeType: string) => mimeType.startsWith("image/");
const isPdf = (mimeType: string) => mimeType === "application/pdf";

// Unified document type for both attachments and signed quotes
type UnifiedDocument = {
	_id: string;
	fileName: string;
	fileSize: number;
	mimeType: string;
	uploadedAt: number;
	downloadUrl: string | null;
	type: "attachment" | "signed-quote";
	quoteNumber?: string | null;
};

export function ProjectDocuments({ projectId }: ProjectDocumentsProps) {
	// Fetch both attachments and signed documents
	const attachments = useQuery(api.messageAttachments.listByEntity, {
		entityType: "project",
		entityId: projectId,
	});
	const signedDocuments = useQuery(api.documents.listSignedByProject, {
		projectId,
	});

	// Combine and sort documents
	const allDocuments: UnifiedDocument[] | undefined =
		attachments && signedDocuments
			? [
					// Map attachments
					...attachments.map((att) => ({
						_id: att._id,
						fileName: att.fileName,
						fileSize: att.fileSize,
						mimeType: att.mimeType,
						uploadedAt: att.uploadedAt,
						downloadUrl: att.downloadUrl,
						type: "attachment" as const,
					})),
					// Map signed documents
					...signedDocuments.map((doc) => ({
						_id: doc._id,
						fileName: doc.fileName,
						fileSize: doc.fileSize,
						mimeType: doc.mimeType,
						uploadedAt: doc.uploadedAt,
						downloadUrl: doc.downloadUrl,
						type: "signed-quote" as const,
						quoteNumber: doc.quoteNumber,
					})),
				].sort((a, b) => b.uploadedAt - a.uploadedAt)
			: undefined;

	const handleDocumentPress = async (document: UnifiedDocument) => {
		if (!document.downloadUrl) return;

		try {
			const canOpen = await Linking.canOpenURL(document.downloadUrl);
			if (canOpen) {
				await Linking.openURL(document.downloadUrl);
			}
		} catch (error) {
			console.error("Failed to open document:", error);
		}
	};

	// Loading state
	if (allDocuments === undefined) {
		return (
			<Card title="Project Documents" style={{ marginTop: spacing.md }}>
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="small" color={colors.primary} />
					<Text style={styles.loadingText}>Loading documents...</Text>
				</View>
			</Card>
		);
	}

	// Empty state
	if (allDocuments.length === 0) {
		return (
			<Card title="Project Documents" style={{ marginTop: spacing.md }}>
				<View style={styles.emptyContainer}>
					<View style={styles.emptyIcon}>
						<FolderOpen size={32} color={colors.mutedForeground} />
					</View>
					<Text style={styles.emptyTitle}>No documents yet</Text>
					<Text style={styles.emptyText}>
						Documents and signed quotes will appear here
					</Text>
				</View>
			</Card>
		);
	}

	return (
		<Card
			title={`Project Documents (${allDocuments.length})`}
			style={{ marginTop: spacing.md }}
		>
			<View style={styles.documentsList}>
				{allDocuments.map((document) => (
					<Pressable
						key={document._id}
						style={({ pressed }) => [
							styles.documentItem,
							pressed && styles.documentItemPressed,
						]}
						onPress={() => handleDocumentPress(document)}
						disabled={!document.downloadUrl}
					>
						{/* File icon */}
						<View style={styles.documentIcon}>
							{document.type === "signed-quote" ? (
								<FileCheck size={20} color="#10b981" />
							) : isPdf(document.mimeType) ? (
								<FileText size={20} color="#ef4444" />
							) : isImage(document.mimeType) ? (
								<FileText size={20} color="#3b82f6" />
							) : (
								<FileText size={20} color={colors.mutedForeground} />
							)}
						</View>

						{/* File details */}
						<View style={styles.documentInfo}>
							<Text style={styles.documentName} numberOfLines={2}>
								{document.fileName}
							</Text>
							<View style={styles.documentMeta}>
								{document.fileSize > 0 && (
									<>
										<Text style={styles.documentMetaText}>
											{formatFileSize(document.fileSize)}
										</Text>
										<Text style={styles.documentMetaSeparator}>•</Text>
									</>
								)}
								<Text style={styles.documentMetaText}>
									{formatDate(document.uploadedAt)}
								</Text>
								{document.quoteNumber && (
									<>
										<Text style={styles.documentMetaSeparator}>•</Text>
										<Text style={styles.documentMetaText}>
											Quote #{document.quoteNumber}
										</Text>
									</>
								)}
							</View>
							{document.type === "signed-quote" && (
								<View style={styles.signedBadge}>
									<Text style={styles.signedBadgeText}>Signed Quote</Text>
								</View>
							)}
						</View>

						{/* Download indicator */}
						<View style={styles.downloadIndicator}>
							{document.downloadUrl ? (
								<Download size={16} color={colors.primary} />
							) : (
								<ActivityIndicator
									size="small"
									color={colors.mutedForeground}
								/>
							)}
						</View>
					</Pressable>
				))}
			</View>
		</Card>
	);
}

const styles = StyleSheet.create({
	loadingContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: spacing.sm,
		paddingVertical: spacing.lg,
	},
	loadingText: {
		fontSize: 13,
		fontFamily: fontFamily.regular,
		color: colors.mutedForeground,
	},
	emptyContainer: {
		alignItems: "center",
		paddingVertical: spacing.xl,
	},
	emptyIcon: {
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: colors.muted,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: spacing.md,
	},
	emptyTitle: {
		fontSize: 15,
		fontFamily: fontFamily.semibold,
		color: colors.foreground,
		marginBottom: spacing.xs,
	},
	emptyText: {
		fontSize: 13,
		fontFamily: fontFamily.regular,
		color: colors.mutedForeground,
		textAlign: "center",
		maxWidth: 250,
	},
	documentsList: {
		gap: spacing.sm,
		marginTop: spacing.sm,
	},
	documentItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
		padding: spacing.sm,
		backgroundColor: colors.muted,
		borderRadius: radius.md,
		borderWidth: 1,
		borderColor: colors.border,
	},
	documentItemPressed: {
		backgroundColor: colors.card,
		opacity: 0.7,
	},
	documentIcon: {
		width: 40,
		height: 40,
		borderRadius: radius.md,
		backgroundColor: colors.card,
		alignItems: "center",
		justifyContent: "center",
	},
	documentInfo: {
		flex: 1,
		minWidth: 0,
	},
	documentName: {
		fontSize: 13,
		fontFamily: fontFamily.medium,
		color: colors.foreground,
		marginBottom: 2,
	},
	documentMeta: {
		flexDirection: "row",
		alignItems: "center",
		flexWrap: "wrap",
	},
	documentMetaText: {
		fontSize: 11,
		fontFamily: fontFamily.regular,
		color: colors.mutedForeground,
	},
	documentMetaSeparator: {
		fontSize: 11,
		color: colors.mutedForeground,
		marginHorizontal: 4,
	},
	signedBadge: {
		alignSelf: "flex-start",
		backgroundColor: "#d1fae5",
		paddingHorizontal: spacing.xs,
		paddingVertical: 2,
		borderRadius: radius.sm,
		marginTop: 4,
	},
	signedBadgeText: {
		fontSize: 10,
		fontFamily: fontFamily.semibold,
		color: "#065f46",
	},
	downloadIndicator: {
		width: 24,
		height: 24,
		alignItems: "center",
		justifyContent: "center",
	},
});
