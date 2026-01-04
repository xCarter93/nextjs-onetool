"use client";

import { Doc } from "@onetool/backend/convex/_generated/dataModel";
import {
	StyledCard,
	StyledCardHeader,
	StyledCardTitle,
	StyledCardContent,
	StyledTagsInput,
} from "@/components/ui/styled";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

interface ClientTagsServicesCardProps {
	client: Doc<"clients">;
	isEditing: boolean;
	tags: string;
	onTagsChange: (value: string) => void;
}

export function ClientTagsServicesCard({
	client,
	isEditing,
	tags,
	onTagsChange,
}: ClientTagsServicesCardProps) {
	const toast = useToast();
	const [tagArray, setTagArray] = useState<string[]>([]);

	// Sync the tagArray with the tags prop
	useEffect(() => {
		const parsedTags = tags
			? tags.split(/,\s*/).filter(Boolean)
			: client.tags || [];
		setTagArray(parsedTags);
	}, [tags, client.tags]);

	// Update parent when tags change
	const handleTagsUpdate = (
		newTags: string[] | ((prev: string[]) => string[])
	) => {
		const resolvedTags =
			typeof newTags === "function" ? newTags(tagArray) : newTags;
		setTagArray(resolvedTags);
		onTagsChange(resolvedTags.join(", "));
	};

	const handleTagAdded = (tag: string) => {
		toast.success("Tag Added", `"${tag}" has been added to this client.`);
	};

	const handleTagRemoved = (tag: string) => {
		toast.success("Tag Removed", `"${tag}" has been removed from this client.`);
	};

	return (
		<StyledCard>
			<StyledCardHeader>
				<StyledCardTitle className="text-xl">Tags</StyledCardTitle>
			</StyledCardHeader>
			<StyledCardContent>
				<StyledTagsInput
					tags={tagArray}
					setTags={handleTagsUpdate}
					onTagAdded={handleTagAdded}
					onTagRemoved={handleTagRemoved}
					placeholder="Type a tag and press Enter or comma..."
					disabled={!isEditing}
				/>
				{!isEditing && tagArray.length === 0 && (
					<p className="text-sm text-gray-600 dark:text-gray-400 italic mt-3">
						This client has no tags. Click Edit to add tags.
					</p>
				)}
			</StyledCardContent>
		</StyledCard>
	);
}
