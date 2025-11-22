"use client";

import { useState, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { useOrganization } from "@clerk/nextjs";
import { api } from "../../../convex/_generated/api";
import { StyledButton } from "@/components/ui/styled/styled-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { Send, Paperclip, X, FileIcon, Loader2 } from "lucide-react";
import type { Id } from "../../../convex/_generated/dataModel";

interface MentionInputProps {
	entityType: "client" | "project" | "quote";
	entityId: string;
	entityName: string;
	onMentionCreated?: () => void;
}

interface AttachmentFile {
	file: File;
	storageId?: Id<"_storage">;
	uploading: boolean;
	error?: string;
}

export function MentionInput({
	entityType,
	entityId,
	entityName,
	onMentionCreated,
}: MentionInputProps) {
	const [message, setMessage] = useState("");
	const [showUserList, setShowUserList] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [mentionedUsers, setMentionedUsers] = useState<
		Array<{ id: Id<"users">; name: string }>
	>([]);
	const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
	const contentEditableRef = useRef<HTMLDivElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const toast = useToast();

	// Fetch organization members from Clerk
	const { memberships } = useOrganization({
		memberships: {
			infinite: true,
		},
	});

	// Also fetch Convex users to map Clerk users to Convex user IDs
	const convexUsers = useQuery(api.users.listByOrg);
	const createMention = useMutation(api.notifications.createMention);
	const syncUserFromClerk = useMutation(api.users.syncUserFromClerk);
	const generateUploadUrl = useMutation(api.messageAttachments.generateUploadUrl);

	// Build a map of organization users with both Clerk and Convex data
	const organizationUsers =
		memberships?.data
			?.map((membership) => {
				const clerkUser = membership.publicUserData;
				if (!clerkUser || !clerkUser.userId) return null;

				// Find the corresponding Convex user by email or external ID
				const convexUser = convexUsers?.find(
					(u) =>
						u.email === clerkUser.identifier ||
						u.externalId === clerkUser.userId
				);

				return {
					id: convexUser?._id || clerkUser.userId,
					name:
						clerkUser.firstName && clerkUser.lastName
							? `${clerkUser.firstName} ${clerkUser.lastName}`.trim()
							: clerkUser.identifier || "Unknown User",
					email: clerkUser.identifier || "",
					image: clerkUser.imageUrl || "",
					convexUserId: convexUser?._id,
				};
			})
			.filter((user): user is NonNullable<typeof user> => user !== null) || [];

	// Filter users based on search query
	const filteredUsers = organizationUsers.filter((user) =>
		user.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// Get text content from contenteditable div
	const getTextContent = (): string => {
		if (!contentEditableRef.current) return "";
		return contentEditableRef.current.textContent || "";
	};

	// Get cursor position in contenteditable
	const getCursorPosition = (): number => {
		const selection = window.getSelection();
		if (!selection || selection.rangeCount === 0) return 0;

		const range = selection.getRangeAt(0);
		const preCaretRange = range.cloneRange();
		preCaretRange.selectNodeContents(contentEditableRef.current!);
		preCaretRange.setEnd(range.endContainer, range.endOffset);

		return preCaretRange.toString().length;
	};

	// Handle input change
	const handleInput = () => {
		const text = getTextContent();
		setMessage(text);

		const cursorPos = getCursorPosition();
		const textBeforeCursor = text.slice(0, cursorPos);
		const lastAtIndex = textBeforeCursor.lastIndexOf("@");

		// Check if we should show user list
		if (lastAtIndex !== -1) {
			const searchText = textBeforeCursor.slice(lastAtIndex + 1);
			// Check if this @ is not part of an existing mention (not inside @[...])
			const lastMentionStart = textBeforeCursor.lastIndexOf("@[");
			const lastMentionEnd = textBeforeCursor.lastIndexOf("]");

			// Only show if @ is not inside a completed mention and search text has no spaces/brackets
			if (
				(lastMentionStart === -1 || lastMentionEnd > lastMentionStart) &&
				!searchText.includes(" ") &&
				!searchText.includes("[") &&
				!searchText.includes("]")
			) {
				setSearchQuery(searchText);
				setShowUserList(true);
			} else {
				setShowUserList(false);
			}
		} else {
			setShowUserList(false);
		}
	};

	// Handle user selection from dropdown
	const handleUserSelect = (
		userId: string,
		userName: string,
		convexUserId?: Id<"users">
	) => {
		const text = getTextContent();
		const cursorPos = getCursorPosition();
		const textBeforeCursor = text.slice(0, cursorPos);
		const lastAtIndex = textBeforeCursor.lastIndexOf("@");

		if (lastAtIndex !== -1 && contentEditableRef.current) {
			// Replace @search with @[userName] (special format to track mentions)
			const beforeAt = text.slice(0, lastAtIndex);
			const afterCursor = text.slice(cursorPos);
			const newMessage = `${beforeAt}@[${userName}]${afterCursor}`;

			// Store the mentioned user
			const finalUserId = convexUserId || (userId as Id<"users">);
			setMentionedUsers((prev) => [
				...prev,
				{ id: finalUserId, name: userName },
			]);

			// Update the contenteditable
			contentEditableRef.current.textContent = newMessage;
			setMessage(newMessage);
			setShowUserList(false);

			// Set cursor after the mention
			const newCursorPos = lastAtIndex + userName.length + 3; // +3 for @[]
			const selection = window.getSelection();
			const range = document.createRange();

			// Find text node and set cursor position
			const textNode = contentEditableRef.current.firstChild;
			if (textNode && textNode.nodeType === Node.TEXT_NODE) {
				range.setStart(
					textNode,
					Math.min(newCursorPos, textNode.textContent?.length || 0)
				);
				range.collapse(true);
				selection?.removeAllRanges();
				selection?.addRange(range);
			}

			// Focus back
			contentEditableRef.current.focus();
		}
	};

	// Handle file selection
	const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (!files || files.length === 0) return;

		const newAttachments: AttachmentFile[] = Array.from(files).map((file) => ({
			file,
			uploading: false,
			error: undefined,
		}));

		setAttachments((prev) => [...prev, ...newAttachments]);

		// Start uploading files
		for (let i = 0; i < newAttachments.length; i++) {
			const attachment = newAttachments[i];
			const attachmentIndex = attachments.length + i;

			// Validate file
			if (attachment.file.size > 10 * 1024 * 1024) {
				// 10MB limit
				setAttachments((prev) =>
					prev.map((a, idx) =>
						idx === attachmentIndex
							? { ...a, error: "File size exceeds 10MB limit" }
							: a
					)
				);
				continue;
			}

			// Mark as uploading
			setAttachments((prev) =>
				prev.map((a, idx) =>
					idx === attachmentIndex ? { ...a, uploading: true } : a
				)
			);

			try {
				// Get upload URL
				const uploadUrl = await generateUploadUrl();

				// Upload file
				const result = await fetch(uploadUrl, {
					method: "POST",
					headers: { "Content-Type": attachment.file.type },
					body: attachment.file,
				});

				if (!result.ok) {
					throw new Error("Upload failed");
				}

				const { storageId } = await result.json();

				// Update attachment with storage ID
				setAttachments((prev) =>
					prev.map((a, idx) =>
						idx === attachmentIndex
							? { ...a, uploading: false, storageId: storageId as Id<"_storage"> }
							: a
					)
				);
			} catch (error) {
				console.error("File upload error:", error);
				setAttachments((prev) =>
					prev.map((a, idx) =>
						idx === attachmentIndex
							? { ...a, uploading: false, error: "Upload failed" }
							: a
					)
				);
			}
		}

		// Clear input
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	// Remove attachment
	const handleRemoveAttachment = (index: number) => {
		setAttachments((prev) => prev.filter((_, idx) => idx !== index));
	};

	// Format file size
	const formatFileSize = (bytes: number): string => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
	};

	// Handle form submission
	const handleSubmit = async () => {
		if (!message.trim()) {
			toast.error("Error", "Please enter a message");
			return;
		}

		// Check if any attachments are still uploading
		if (attachments.some((a) => a.uploading)) {
			toast.error("Error", "Please wait for files to finish uploading");
			return;
		}

		// Check if any attachments have errors
		if (attachments.some((a) => a.error)) {
			toast.error("Error", "Please remove files with errors");
			return;
		}

		try {
			// Prepare attachment data
			const attachmentData = attachments
				.filter((a) => a.storageId)
				.map((a) => ({
					storageId: a.storageId!,
					fileName: a.file.name,
					fileSize: a.file.size,
					mimeType: a.file.type,
				}));

			// Process mentioned users if there are any
			if (mentionedUsers.length === 0) {
				// No mentions - show helpful message
				toast.error(
					"No recipients",
					"Please @mention a team member to notify them about this message"
				);
				return;
			}

			// Process each mentioned user
			for (const mentionedUser of mentionedUsers) {
				// Find the user in our organization list
				const user = organizationUsers.find(
					(u) =>
						u.convexUserId === mentionedUser.id || u.id === mentionedUser.id
				);

				if (!user) {
					continue; // Skip if user not found
				}

				// If user doesn't have a Convex ID yet, sync them from Clerk first
				let convexUserId = user.convexUserId;

				if (!convexUserId) {
					// Sync the user from Clerk to Convex
					convexUserId = await syncUserFromClerk({
						clerkUserId: user.id,
						name: user.name,
						email: user.email,
						imageUrl: user.image,
					});
				}

				// Create the mention with the Convex user ID and attachments
				await createMention({
					taggedUserId: convexUserId,
					message: message, // Message is stored with @[username] format
					entityType,
					entityId,
					entityName,
					attachments: attachmentData.length > 0 ? attachmentData : undefined,
				});
			}

			// Clear form
			if (contentEditableRef.current) {
				contentEditableRef.current.textContent = "";
			}
			setMessage("");
			setMentionedUsers([]);
			setAttachments([]);
			toast.success("Success", "Message sent!");

			// Notify parent
			onMentionCreated?.();
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to send message";
			toast.error("Error", errorMessage);
		}
	};

	// Get initials for avatar fallback
	const getInitials = (name: string) => {
		const names = name.split(" ");
		if (names.length >= 2) {
			return `${names[0][0]}${names[1][0]}`.toUpperCase();
		}
		return name.slice(0, 2).toUpperCase();
	};

	return (
		<div className="space-y-3">
			<Popover
				open={showUserList && filteredUsers.length > 0}
				onOpenChange={(open) => {
					if (!open) setShowUserList(false);
				}}
			>
				<PopoverTrigger asChild>
					<div className="relative">
						{/* Plain contenteditable - shows @[username] format */}
						<div
							ref={contentEditableRef}
							contentEditable
							onInput={handleInput}
							className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 overflow-auto whitespace-pre-wrap break-words empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground"
							style={{ minHeight: "100px" }}
							suppressContentEditableWarning
							data-placeholder="Type @ to mention a team member..."
						/>
					</div>
				</PopoverTrigger>
				<PopoverContent
					align="start"
					side="bottom"
					className="w-80 p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
					onOpenAutoFocus={(e) => e.preventDefault()}
				>
					<div className="max-h-64 overflow-y-auto">
						{filteredUsers.map((user) => (
							<button
								key={user.id}
								onClick={() =>
									handleUserSelect(user.id, user.name, user.convexUserId)
								}
								className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors text-left"
							>
								<Avatar className="h-8 w-8">
									<AvatarImage src={user.image} alt={user.name} />
									<AvatarFallback className="text-xs">
										{getInitials(user.name)}
									</AvatarFallback>
								</Avatar>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium text-gray-900 dark:text-white truncate">
										{user.name}
									</p>
									<p className="text-xs text-gray-500 dark:text-gray-400 truncate">
										{user.email}
									</p>
								</div>
							</button>
						))}
					</div>
				</PopoverContent>
			</Popover>

			{/* File Attachments Preview */}
			{attachments.length > 0 && (
				<div className="flex flex-wrap gap-2">
					{attachments.map((attachment, index) => {
						const isImage = attachment.file.type.startsWith("image/");
						const isPdf = attachment.file.type === "application/pdf";

						return (
							<div key={index} className="relative inline-block group">
								{isImage ? (
									// Image preview thumbnail
									<div className="relative">
										<div className="h-20 w-20 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden flex items-center justify-center">
											{attachment.uploading ? (
												<Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
											) : (
												<img
													src={URL.createObjectURL(attachment.file)}
													alt={attachment.file.name}
													className="h-full w-full object-cover"
												/>
											)}
										</div>
										{!attachment.uploading && !attachment.error && (
											<button
												onClick={() => handleRemoveAttachment(index)}
												className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
												type="button"
												title="Remove"
											>
												<X className="h-3 w-3" />
											</button>
										)}
										{attachment.error && (
											<div className="absolute inset-0 bg-red-500/90 rounded-lg flex items-center justify-center">
												<span className="text-xs text-white font-medium px-2 text-center">
													Error
												</span>
											</div>
										)}
									</div>
								) : (
									// Document badge
									<div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 transition-colors max-w-[200px]">
										<FileIcon
											className={`h-3.5 w-3.5 flex-shrink-0 ${
												isPdf ? "text-red-500" : "text-gray-500"
											}`}
										/>
										<div className="flex-1 min-w-0">
											<span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate block">
												{attachment.file.name}
											</span>
											<span className="text-xs text-gray-500 dark:text-gray-400">
												{formatFileSize(attachment.file.size)}
												{attachment.uploading && " • Uploading..."}
											</span>
										</div>
										{attachment.uploading ? (
											<Loader2 className="h-3 w-3 text-gray-400 animate-spin flex-shrink-0" />
										) : attachment.error ? (
											<span className="text-xs text-red-500 flex-shrink-0">✕</span>
										) : (
											<button
												onClick={() => handleRemoveAttachment(index)}
												className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors flex-shrink-0"
												type="button"
												title="Remove"
											>
												<X className="h-3 w-3 text-gray-500" />
											</button>
										)}
									</div>
								)}
							</div>
						);
					})}
				</div>
			)}

			<div className="flex items-center justify-between">
				<div className="text-xs text-gray-500 dark:text-gray-400">
					{mentionedUsers.length > 0 ? (
						<span>
							Mentioning:{" "}
							<strong>{mentionedUsers.map((u) => u.name).join(", ")}</strong>
						</span>
					) : (
						<span>Type @ to mention someone</span>
					)}
				</div>
				
				<div className="flex items-center gap-2">
					{/* Hidden file input */}
					<input
						ref={fileInputRef}
						type="file"
						multiple
						className="hidden"
						onChange={handleFileSelect}
						accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip"
					/>
					
					{/* Attach file button */}
					<StyledButton
						onClick={() => fileInputRef.current?.click()}
						size="sm"
						intent="outline"
						icon={<Paperclip className="h-4 w-4" />}
						showArrow={false}
						type="button"
					/>
					
					<StyledButton
						onClick={handleSubmit}
						disabled={
							!message.trim() ||
							attachments.some((a) => a.uploading || a.error)
						}
						size="sm"
						intent="primary"
						icon={<Send className="h-4 w-4" />}
						label="Send"
						showArrow={false}
					/>
				</div>
			</div>
		</div>
	);
}
