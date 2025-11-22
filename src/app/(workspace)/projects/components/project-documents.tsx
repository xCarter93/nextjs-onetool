"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import {
	StyledCard,
	StyledCardHeader,
	StyledCardTitle,
	StyledCardContent,
} from "@/components/ui/styled";
import { FileIcon, Download, Image as ImageIcon, FolderOpen } from "lucide-react";
import type { Id } from "../../../../../convex/_generated/dataModel";

interface ProjectDocumentsProps {
	projectId: Id<"projects">;
}

export function ProjectDocuments({ projectId }: ProjectDocumentsProps) {
	const attachments = useQuery(api.messageAttachments.listByEntity, {
		entityType: "project",
		entityId: projectId,
	});

	const formatFileSize = (bytes: number): string => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
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

	// Loading state
	if (attachments === undefined) {
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
	if (attachments.length === 0) {
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
						Files shared in team communications
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
							Documents shared in team communications will appear here
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
						({attachments.length})
					</span>
				</div>
				<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
					Files shared in team communications
				</p>
			</StyledCardHeader>
			<StyledCardContent>
				<div className="grid grid-cols-1 gap-3">
					{attachments.map((attachment) => {
						const AttachmentContent = () => (
							<>
								{/* File preview/icon */}
								<div className="flex-shrink-0">
									{isImage(attachment.mimeType) ? (
										<div className="h-16 w-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
											<ImageIcon className="h-6 w-6 text-blue-500" />
										</div>
									) : (
										<div className="h-16 w-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
											<FileIcon
												className={`h-6 w-6 ${
													isPdf(attachment.mimeType)
														? "text-red-500"
														: "text-gray-500"
												}`}
											/>
										</div>
									)}
								</div>

								{/* File details */}
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium text-gray-900 dark:text-white truncate">
										{attachment.fileName}
									</p>
									<div className="flex items-center gap-2 mt-1">
										<p className="text-xs text-gray-500 dark:text-gray-400">
											{formatFileSize(attachment.fileSize)}
										</p>
										<span className="text-xs text-gray-400">•</span>
										<p className="text-xs text-gray-500 dark:text-gray-400">
											{formatDate(attachment.uploadedAt)}
										</p>
									</div>
								</div>

								{/* Download button */}
								<div className="flex-shrink-0">
									<Download className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
								</div>
							</>
						);

						return (
							<DocumentDownloadLink
								key={attachment._id}
								attachmentId={attachment._id}
							>
								<AttachmentContent />
							</DocumentDownloadLink>
						);
					})}
				</div>
			</StyledCardContent>
		</StyledCard>
	);
}

// Separate component to handle URL fetching for each document
function DocumentDownloadLink({
	attachmentId,
	children,
}: {
	attachmentId: Id<"messageAttachments">;
	children: React.ReactNode;
}) {
	const downloadUrl = useQuery(api.messageAttachments.getDownloadUrl, {
		id: attachmentId,
	});

	if (!downloadUrl) {
		return (
			<div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg opacity-50">
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

