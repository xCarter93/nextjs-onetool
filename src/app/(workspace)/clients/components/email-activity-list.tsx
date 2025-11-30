"use client";

import { Badge } from "@/components/ui/badge";
import { Mail, Check, Eye, AlertCircle, Ban } from "lucide-react";
import { Doc } from "../../../../../convex/_generated/dataModel";

interface EmailActivityListProps {
	emails: Doc<"emailMessages">[];
}

function formatTimestamp(timestamp: number) {
	const date = new Date(timestamp);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / 60000);
	const diffHours = Math.floor(diffMs / 3600000);
	const diffDays = Math.floor(diffMs / 86400000);

	if (diffMins < 1) {
		return "Just now";
	} else if (diffMins < 60) {
		return `${diffMins}m ago`;
	} else if (diffHours < 24) {
		return `${diffHours}h ago`;
	} else if (diffDays < 7) {
		return `${diffDays}d ago`;
	} else {
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
		});
	}
}

function getStatusBadge(email: Doc<"emailMessages">) {
	switch (email.status) {
		case "sent":
			return (
				<Badge
					variant="outline"
					className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
				>
					<Mail className="h-3 w-3 mr-1" />
					Sent
				</Badge>
			);
		case "delivered":
			return (
				<Badge
					variant="outline"
					className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
				>
					<Check className="h-3 w-3 mr-1" />
					Delivered
				</Badge>
			);
		case "opened":
			return (
				<Badge
					variant="outline"
					className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800"
				>
					<Eye className="h-3 w-3 mr-1" />
					Opened
				</Badge>
			);
		case "bounced":
			return (
				<Badge
					variant="outline"
					className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
				>
					<Ban className="h-3 w-3 mr-1" />
					Bounced
				</Badge>
			);
		case "complained":
			return (
				<Badge
					variant="outline"
					className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800"
				>
					<AlertCircle className="h-3 w-3 mr-1" />
					Complaint
				</Badge>
			);
		default:
			return null;
	}
}

export function EmailActivityList({ emails }: EmailActivityListProps) {
	if (emails.length === 0) {
		return (
			<div className="text-center py-8">
				<div className="flex justify-center mb-3">
					<Mail className="h-12 w-12 text-gray-400 dark:text-gray-600" />
				</div>
				<p className="text-sm text-gray-600 dark:text-gray-400">
					No emails sent to this client yet
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-3">
			{emails.map((email) => (
				<div
					key={email._id}
					className="flex items-start justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
				>
					<div className="flex items-start gap-3 flex-1 min-w-0">
						<div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0 mt-0.5">
							<Mail className="h-5 w-5 text-primary" />
						</div>

						<div className="flex-1 min-w-0">
							<div className="flex items-start justify-between gap-2 mb-1">
								<h4 className="font-medium text-gray-900 dark:text-white truncate">
									{email.subject}
								</h4>
								{getStatusBadge(email)}
							</div>

							{email.messagePreview && (
								<p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
									{email.messagePreview}
								</p>
							)}

							<div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
								<span>Sent {formatTimestamp(email.sentAt)}</span>
								{email.deliveredAt && (
									<span>Delivered {formatTimestamp(email.deliveredAt)}</span>
								)}
								{email.openedAt && (
									<span>Opened {formatTimestamp(email.openedAt)}</span>
								)}
								{email.bouncedAt && (
									<span>Bounced {formatTimestamp(email.bouncedAt)}</span>
								)}
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

