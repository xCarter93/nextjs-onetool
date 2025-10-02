"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, Trash2, Download, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef } from "react";

export default function OrganizationDocumentsPage() {
	const toast = useToast();
	const [isUploading, setIsUploading] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const documents = useQuery(api.organizationDocuments.list);
	const generateUploadUrl = useMutation(
		api.organizationDocuments.generateUploadUrl
	);
	const createDocument = useMutation(api.organizationDocuments.create);
	const removeDocument = useMutation(api.organizationDocuments.remove);

	const handleFileUpload = async (file: File) => {
		// Validate PDF
		if (file.type !== "application/pdf") {
			toast.error("Invalid file type", "Please upload a PDF file");
			return;
		}

		// Validate file size (max 10MB)
		const maxSize = 10 * 1024 * 1024; // 10MB
		if (file.size > maxSize) {
			toast.error("File too large", "Maximum file size is 10MB");
			return;
		}

		setIsUploading(true);
		try {
			// Get upload URL
			const uploadUrl = await generateUploadUrl({});

			// Upload file
			const res = await fetch(uploadUrl, {
				method: "POST",
				headers: { "Content-Type": "application/pdf" },
				body: file,
			});

			if (!res.ok) throw new Error("Failed to upload");

			const { storageId } = await res.json();

			// Create document record
			await createDocument({
				name: file.name.replace(".pdf", ""),
				storageId,
				fileSize: file.size,
			});

			toast.success("Document uploaded", "Your document is ready");

			// Reset input
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		} catch (error) {
			console.error(error);
			const message = error instanceof Error ? error.message : "Unknown error";
			toast.error("Upload failed", message);
		} finally {
			setIsUploading(false);
		}
	};

	const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		await handleFileUpload(file);
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(false);
	};

	const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(false);

		const file = e.dataTransfer.files?.[0];
		if (!file) return;
		await handleFileUpload(file);
	};

	const handleClick = () => {
		fileInputRef.current?.click();
	};

	const handleDelete = async (id: Id<"organizationDocuments">) => {
		if (!confirm("Are you sure you want to delete this document?")) return;

		try {
			await removeDocument({ id });
			toast.success("Document deleted", "The document has been removed");
		} catch (error) {
			console.error(error);
			const message = error instanceof Error ? error.message : "Unknown error";
			toast.error("Delete failed", message);
		}
	};

	return (
		<div className="min-h-[100vh] flex-1 md:min-h-min">
			<div className="relative bg-gradient-to-br from-background via-muted/30 to-muted/60 dark:from-background dark:via-muted/20 dark:to-muted/40 min-h-[100vh] rounded-xl">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(120,119,198,0.08),transparent_50%)] rounded-xl" />

				<div className="relative px-6 pt-8 pb-20">
					<div className="mx-auto">
						{/* Header */}
						<div className="mb-8">
							<div className="flex items-center gap-4 mb-2">
								<div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30">
									<FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
								</div>
								<div>
									<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
										Organization Documents
									</h1>
									<p className="text-muted-foreground">
										Upload custom documents that can be appended to quotes and
										invoices
									</p>
								</div>
							</div>
						</div>

						{/* Upload Section */}
						<Card className="mb-6 bg-card dark:bg-card backdrop-blur-md border border-border dark:border-border shadow-lg dark:shadow-black/50 ring-1 ring-border/30 dark:ring-border/50">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Upload className="h-5 w-5" />
									Upload Document
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div
									onClick={handleClick}
									onDragOver={handleDragOver}
									onDragLeave={handleDragLeave}
									onDrop={handleDrop}
									className={`
										relative flex flex-col items-center justify-center
										w-full py-16 px-6
										border-2 border-dashed rounded-lg
										cursor-pointer
										transition-all duration-200 ease-in-out
										${
											isDragging
												? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 scale-[1.02]"
												: "border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-100/50 dark:hover:bg-gray-800/70 hover:border-gray-400 dark:hover:border-gray-500"
										}
										${isUploading ? "opacity-50 cursor-not-allowed" : ""}
									`}
								>
									<input
										ref={fileInputRef}
										type="file"
										accept="application/pdf"
										onChange={handleUpload}
										disabled={isUploading}
										className="hidden"
									/>

									{/* Upload Icon */}
									<div
										className={`
										flex items-center justify-center w-16 h-16 mb-4 rounded-full
										transition-colors duration-200
										${
											isDragging
												? "bg-blue-100 dark:bg-blue-900/40"
												: "bg-gray-200 dark:bg-gray-700"
										}
									`}
									>
										<Upload
											className={`
											w-8 h-8 transition-colors duration-200
											${
												isDragging
													? "text-blue-600 dark:text-blue-400"
													: "text-gray-500 dark:text-gray-400"
											}
										`}
										/>
									</div>

									{/* Text Content */}
									<div className="text-center space-y-2">
										<p className="text-base font-medium text-gray-900 dark:text-white">
											{isUploading ? (
												<span className="flex items-center gap-2">
													<span className="inline-block w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
													Uploading...
												</span>
											) : (
												<>
													<span className="text-blue-600 dark:text-blue-400 hover:underline">
														Click to upload
													</span>{" "}
													or drag and drop
												</>
											)}
										</p>
										<p className="text-sm text-gray-500 dark:text-gray-400">
											PDF files only (max 10MB)
										</p>
									</div>

									{/* Decorative Elements */}
									{isDragging && (
										<div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-400/5 rounded-lg pointer-events-none" />
									)}
								</div>
							</CardContent>
						</Card>

						{/* Documents List */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{documents === undefined ? (
								// Loading state
								<div className="col-span-full text-center py-12">
									<div className="animate-pulse space-y-4">
										<div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto"></div>
										<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
									</div>
								</div>
							) : documents.length === 0 ? (
								// Empty state
								<div className="col-span-full">
									<Card className="bg-card dark:bg-card backdrop-blur-md border border-border dark:border-border shadow-lg dark:shadow-black/50 ring-1 ring-border/30 dark:ring-border/50">
										<CardContent className="text-center py-12">
											<FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
											<p className="text-muted-foreground mb-2">
												No documents uploaded yet
											</p>
											<p className="text-sm text-gray-500 dark:text-gray-400">
												Upload your first document to get started
											</p>
										</CardContent>
									</Card>
								</div>
							) : (
								// Document cards
								documents.map((doc) => (
									<DocumentCard
										key={doc._id}
										document={doc}
										onDelete={() => handleDelete(doc._id)}
									/>
								))
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

// Document Card Component
interface DocumentCardProps {
	document: {
		_id: Id<"organizationDocuments">;
		name: string;
		description?: string;
		uploadedAt: number;
		fileSize?: number;
	};
	onDelete: () => void;
}

function DocumentCard({ document, onDelete }: DocumentCardProps) {
	const documentUrl = useQuery(api.organizationDocuments.getDocumentUrl, {
		id: document._id,
	});

	const formatFileSize = (bytes?: number) => {
		if (!bytes) return "";
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	};

	return (
		<Card className="bg-card dark:bg-card backdrop-blur-md border border-border dark:border-border shadow-lg dark:shadow-black/50 ring-1 ring-border/30 dark:ring-border/50 hover:shadow-xl transition-shadow">
			<CardContent className="p-4">
				<div className="flex items-start gap-3 mb-4">
					<div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex-shrink-0">
						<FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
					</div>
					<div className="flex-1 min-w-0">
						<h3 className="font-medium truncate text-gray-900 dark:text-white">
							{document.name}
						</h3>
						<p className="text-sm text-muted-foreground">
							{new Date(document.uploadedAt).toLocaleDateString()}
						</p>
						{document.fileSize && (
							<p className="text-xs text-muted-foreground">
								{formatFileSize(document.fileSize)}
							</p>
						)}
					</div>
				</div>

				{document.description && (
					<p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
						{document.description}
					</p>
				)}

				<div className="flex gap-2">
					{documentUrl && (
						<>
							<a
								href={documentUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="flex-1"
							>
								<Button intent="outline" size="sm" className="w-full">
									<Eye className="h-3 w-3 mr-1" />
									View
								</Button>
							</a>
							<a href={documentUrl} download={`${document.name}.pdf`}>
								<Button intent="outline" size="sm">
									<Download className="h-3 w-3" />
								</Button>
							</a>
						</>
					)}
					<Button intent="outline" size="sm" onClick={onDelete}>
						<Trash2 className="h-3 w-3 text-red-600 dark:text-red-400" />
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
