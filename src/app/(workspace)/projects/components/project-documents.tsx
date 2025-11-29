"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import {
	StyledCard,
	StyledCardHeader,
	StyledCardTitle,
	StyledCardContent,
} from "@/components/ui/styled";
import {
	FileIcon,
	Download,
	Image as ImageIcon,
	FolderOpen,
	Loader2,
	FileCheck,
} from "lucide-react";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { memo, useMemo } from "react";
import { Badge } from "@/components/ui/badge";

interface ProjectDocumentsProps {
	projectId: Id<"projects">;
}

// Helper utilities
const formatFileSize = (bytes: number): string => {
	if (bytes === 0) return "0 Bytes";
	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
	let i = Math.floor(Math.log(bytes) / Math.log(k));
	i = Math.min(i, sizes.length - 1);
	return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

const formatDate = (timestamp: number): string => {
	// Use runtime-detected locale from navigator, fallback to undefined (browser default)
	const userLocale =
		typeof navigator !== "undefined" ? navigator.language : undefined;
	return new Date(timestamp).toLocaleDateString(userLocale, {
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

// Attachment content component with memo optimization
interface DocumentContentProps {
	document: UnifiedDocument;
}

const DocumentContent = memo(({ document }: DocumentContentProps) => (
	<>
		{/* File preview/icon */}
		<div className="shrink-0">
			{document.type === "signed-quote" ? (
				<div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
					<FileCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
				</div>
			) : isImage(document.mimeType) ? (
				<div className="h-16 w-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
					<ImageIcon className="h-6 w-6 text-blue-500" />
				</div>
			) : (
				<div className="h-16 w-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
					<FileIcon
						className={`h-6 w-6 ${
							isPdf(document.mimeType) ? "text-red-500" : "text-gray-500"
						}`}
					/>
				</div>
			)}
		</div>

		{/* File details */}
		<div className="flex-1 min-w-0">
			<div className="flex items-center gap-2 mb-1">
				<p className="text-sm font-medium text-gray-900 dark:text-white truncate">
					{document.fileName}
				</p>
				{document.type === "signed-quote" && (
					<Badge
						variant="outline"
						className="shrink-0 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
					>
						Signed Quote
					</Badge>
				)}
			</div>
			<div className="flex items-center gap-2">
				{document.fileSize > 0 && (
					<>
						<p className="text-xs text-gray-500 dark:text-gray-400">
							{formatFileSize(document.fileSize)}
						</p>
						<span className="text-xs text-gray-400">•</span>
					</>
				)}
				<p className="text-xs text-gray-500 dark:text-gray-400">
					{formatDate(document.uploadedAt)}
				</p>
				{document.quoteNumber && (
					<>
						<span className="text-xs text-gray-400">•</span>
						<p className="text-xs text-gray-500 dark:text-gray-400">
							Quote #{document.quoteNumber}
						</p>
					</>
				)}
			</div>
		</div>

		{/* Download button */}
		<div className="shrink-0">
			<Download className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
		</div>
	</>
));

DocumentContent.displayName = "DocumentContent";

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
	const allDocuments = useMemo(() => {
		if (!attachments || !signedDocuments) return undefined;

		const unified: UnifiedDocument[] = [
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
		];

		// Sort by upload date (most recent first)
		return unified.sort((a, b) => b.uploadedAt - a.uploadedAt);
	}, [attachments, signedDocuments]);

	// Loading state
	if (allDocuments === undefined) {
		return (
			<StyledCard>
				<StyledCardHeader>
					<div className="flex items-center gap-2">
						<FolderOpen className="h-5 w-5 text-primary" />
						<StyledCardTitle className="text-lg">
							Project Documents
						</StyledCardTitle>
					</div>
				</StyledCardHeader>
				<StyledCardContent>
					<div className="animate-pulse space-y-3">
						{[1, 2, 3].map((i) => (
							<div key={i} className="flex items-center gap-3">
								<div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
								<div className="flex-1 space-y-2">
									<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
									<div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
								</div>
							</div>
						))}
					</div>
				</StyledCardContent>
			</StyledCard>
		);
	}

	// Empty state
	if (allDocuments.length === 0) {
		return (
			<StyledCard>
				<StyledCardHeader>
					<div className="flex items-center gap-2">
						<FolderOpen className="h-5 w-5 text-primary" />
						<StyledCardTitle className="text-lg">
							Project Documents
						</StyledCardTitle>
					</div>
					<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
						Files shared in team communications and signed quotes
					</p>
				</StyledCardHeader>
				<StyledCardContent>
					<div className="flex flex-col items-center justify-center py-12 text-center">
						<div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
							<FolderOpen className="h-8 w-8 text-gray-400 dark:text-gray-600" />
						</div>
						<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
							No documents yet
						</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm">
							Documents and signed quotes will appear here
						</p>
					</div>
				</StyledCardContent>
			</StyledCard>
		);
	}

	return (
		<StyledCard>
			<StyledCardHeader>
				<div className="flex items-center gap-2">
					<FolderOpen className="h-5 w-5 text-primary" />
					<StyledCardTitle className="text-lg">
						Project Documents
					</StyledCardTitle>
					<span className="text-sm text-gray-500 dark:text-gray-400">
						({allDocuments.length})
					</span>
				</div>
				<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
					Files shared in team communications and signed quotes
				</p>
			</StyledCardHeader>
			<StyledCardContent>
				<div className="grid grid-cols-1 gap-3">
					{allDocuments.map((document) => (
						<DocumentDownloadLink
							key={document._id}
							downloadUrl={document.downloadUrl}
						>
							<DocumentContent document={document} />
						</DocumentDownloadLink>
					))}
				</div>
			</StyledCardContent>
		</StyledCard>
	);
}

// Component to render download link with pre-fetched URL (no per-attachment query)
function DocumentDownloadLink({
	downloadUrl,
	children,
}: {
	downloadUrl: string | null;
	children: React.ReactNode;
}) {
	if (!downloadUrl) {
		return (
			<div
				className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg opacity-50"
				aria-busy="true"
				aria-label="Loading download link"
			>
				<Loader2 className="h-4 w-4 text-gray-400 animate-spin shrink-0" />
				{children}
			</div>
		);
	}

	return (
		<a
			href={downloadUrl}
			target="_blank"
			rel="noopener noreferrer"
			className="group flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all"
		>
			{children}
		</a>
	);
}
