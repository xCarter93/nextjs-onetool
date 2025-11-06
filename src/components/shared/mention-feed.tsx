"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime, parseMessageParts } from "@/lib/notification-utils";
import { MessageSquare } from "lucide-react";

interface MentionFeedProps {
	entityType: "client" | "project" | "quote";
	entityId: string;
}

export function MentionFeed({ entityType, entityId }: MentionFeedProps) {
	const mentions = useQuery(api.notifications.listByEntity, {
		entityType,
		entityId,
	});

	// Get initials for avatar fallback
	const getInitials = (name: string) => {
		const names = name.split(" ");
		if (names.length >= 2) {
			return `${names[0][0]}${names[1][0]}`.toUpperCase();
		}
		return name.slice(0, 2).toUpperCase();
	};

	// Loading state
	if (mentions === undefined) {
		return (
			<div className="space-y-4 animate-pulse">
				{[1, 2, 3].map((i) => (
					<div key={i} className="flex gap-3">
						<div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
						<div className="flex-1 space-y-2">
							<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
							<div className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
						</div>
					</div>
				))}
			</div>
		);
	}

	// Empty state
	if (mentions.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
					<MessageSquare className="h-8 w-8 text-gray-400 dark:text-gray-600" />
				</div>
				<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
					No messages yet
				</h3>
				<p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm">
					Start a conversation by mentioning a team member with @ in the input above.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{mentions.map((mention) => (
				<div key={mention._id} className="flex gap-3">
					{/* Avatar - showing the author (person who sent the message) */}
					<Avatar className="h-10 w-10 flex-shrink-0">
						<AvatarImage
							src={mention.author?.image}
							alt={mention.author?.name || mention.author?.email || "User"}
						/>
						<AvatarFallback className="text-sm">
							{mention.author?.name ? getInitials(mention.author.name) : mention.author?.email ? mention.author.email.substring(0, 2).toUpperCase() : "??"}
						</AvatarFallback>
					</Avatar>

					{/* Message content */}
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-2 mb-1">
							<span className="text-sm font-semibold text-gray-900 dark:text-white">
								{mention.author?.name || mention.author?.email || "Unknown User"}
							</span>
							<span className="text-xs text-gray-500 dark:text-gray-400">
								{formatRelativeTime(mention._creationTime)}
							</span>
						</div>

						{/* Message text with styled mentions */}
						<div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-700">
							<div className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap break-words">
								{parseMessageParts(mention.message).map((part, index) => 
									part.isMention ? (
										<Badge 
											key={index} 
											variant="secondary"
											className="inline-flex mx-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 font-medium"
										>
											{part.text}
										</Badge>
									) : (
										<span key={index}>{part.text}</span>
									)
								)}
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

