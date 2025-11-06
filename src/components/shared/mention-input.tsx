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
import { Send } from "lucide-react";
import type { Id } from "../../../convex/_generated/dataModel";

interface MentionInputProps {
	entityType: "client" | "project" | "quote";
	entityId: string;
	entityName: string;
	onMentionCreated?: () => void;
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
	const contentEditableRef = useRef<HTMLDivElement>(null);
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

	// Handle form submission
	const handleSubmit = async () => {
		if (!message.trim()) {
			toast.error("Error", "Please enter a message");
			return;
		}

		if (mentionedUsers.length === 0) {
			toast.error("Error", "Please @mention a team member");
			return;
		}

		try {
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

				// Create the mention with the Convex user ID
				await createMention({
					taggedUserId: convexUserId,
					message: message, // Message is stored with @[username] format
					entityType,
					entityId,
					entityName,
				});
			}

			// Clear form
			if (contentEditableRef.current) {
				contentEditableRef.current.textContent = "";
			}
			setMessage("");
			setMentionedUsers([]);
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
				<StyledButton
					onClick={handleSubmit}
					disabled={!message.trim() || mentionedUsers.length === 0}
					size="sm"
					intent="primary"
					icon={<Send className="h-4 w-4" />}
					label="Send"
					showArrow={false}
				/>
			</div>
		</div>
	);
}
