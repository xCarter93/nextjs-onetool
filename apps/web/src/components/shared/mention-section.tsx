"use client";

import { useState } from "react";
import { MentionInput } from "./mention-input";
import { MentionFeed } from "./mention-feed";
import {
	StyledCard,
	StyledCardHeader,
	StyledCardTitle,
	StyledCardContent,
} from "@/components/ui/styled";
import { MessageSquare } from "lucide-react";

interface MentionSectionProps {
	entityType: "client" | "project" | "quote";
	entityId: string;
	entityName: string;
}

export function MentionSection({
	entityType,
	entityId,
	entityName,
}: MentionSectionProps) {
	const [refreshKey, setRefreshKey] = useState(0);

	const handleMentionCreated = () => {
		// Trigger a refresh by updating the key
		setRefreshKey((prev) => prev + 1);
	};

	return (
		<StyledCard>
			<StyledCardHeader>
				<div className="flex items-center gap-2">
					<MessageSquare className="h-5 w-5 text-primary" />
					<StyledCardTitle className="text-lg">
						Team Communication
					</StyledCardTitle>
				</div>
				<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
					Mention team members to notify them about this {entityType}
				</p>
			</StyledCardHeader>
			<StyledCardContent className="space-y-6">
				{/* Message Input */}
				<div className="pb-6 border-b border-gray-200 dark:border-gray-700">
					<MentionInput
						entityType={entityType}
						entityId={entityId}
						entityName={entityName}
						onMentionCreated={handleMentionCreated}
					/>
				</div>

				{/* Message Feed */}
				<div key={refreshKey}>
					<MentionFeed entityType={entityType} entityId={entityId} />
				</div>
			</StyledCardContent>
		</StyledCard>
	);
}

