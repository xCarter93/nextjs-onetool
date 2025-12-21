"use client";

import { Doc } from "../../../../../convex/_generated/dataModel";
import {
	StyledCard,
	StyledCardHeader,
	StyledCardTitle,
	StyledCardContent,
	StyledInput,
} from "@/components/ui/styled";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Helper function to format lead source for display
function formatLeadSource(leadSource?: string): string {
	if (!leadSource) return "Not specified";
	return leadSource
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

// Helper function to format category for display
function formatCategory(category?: string): string {
	if (!category) return "Not specified";
	return category.charAt(0).toUpperCase() + category.slice(1);
}

interface ClientDetailsCardProps {
	client: Doc<"clients">;
	isEditing: boolean;
	form: {
		industry: string;
		companyDescription: string;
		category: string;
		clientSize: string;
		priorityLevel: string;
		projectDimensions: string;
	};
	onFormChange: (field: string, value: string) => void;
}

export function ClientDetailsCard({
	client,
	isEditing,
	form,
	onFormChange,
}: ClientDetailsCardProps) {
	return (
		<StyledCard>
			<StyledCardHeader>
				<StyledCardTitle className="text-xl">About</StyledCardTitle>
			</StyledCardHeader>
			<StyledCardContent>
				<div className="space-y-6">
					{/* Two Column Grid for Fields */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
						{/* Industry */}
						{(client.industry || isEditing) && (
							<div>
								<Label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
									Industry
								</Label>
								{isEditing ? (
									<StyledInput
										value={form.industry}
										onChange={(e) => onFormChange("industry", e.target.value)}
										placeholder="e.g., Technology, Healthcare"
									/>
								) : (
									<p className="text-sm text-gray-900 dark:text-white">
										{client.industry}
									</p>
								)}
							</div>
						)}

						{/* Lead Source */}
						<div>
							<Label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
								Lead Source
							</Label>
							<p className="text-sm text-gray-900 dark:text-white">
								{formatLeadSource(client.leadSource)}
							</p>
						</div>

						{/* Category */}
						{(client.category || isEditing) && (
							<div>
								<Label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
									Category
								</Label>
								{isEditing ? (
									<StyledInput
										value={form.category}
										onChange={(e) => onFormChange("category", e.target.value)}
										placeholder="e.g., Enterprise, SMB"
									/>
								) : (
									<p className="text-sm text-gray-900 dark:text-white">
										{formatCategory(client.category)}
									</p>
								)}
							</div>
						)}

						{/* Client Size */}
						{(client.clientSize || isEditing) && (
							<div>
								<Label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
									Size
								</Label>
								{isEditing ? (
									<StyledInput
										value={form.clientSize}
										onChange={(e) => onFormChange("clientSize", e.target.value)}
										placeholder="e.g., 1-10, 50-200"
									/>
								) : (
									<p className="text-sm text-gray-900 dark:text-white">
										{formatCategory(client.clientSize)}
									</p>
								)}
							</div>
						)}

						{/* Priority Level */}
						{(client.priorityLevel || isEditing) && (
							<div>
								<Label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
									Priority
								</Label>
								{isEditing ? (
									<StyledInput
										value={form.priorityLevel}
										onChange={(e) =>
											onFormChange("priorityLevel", e.target.value)
										}
										placeholder="e.g., High, Medium, Low"
									/>
								) : (
									<p className="text-sm text-gray-900 dark:text-white">
										{formatCategory(client.priorityLevel)}
									</p>
								)}
							</div>
						)}

						{/* Project Dimensions */}
						{(client.projectDimensions || isEditing) && (
							<div>
								<Label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
									Project Dimensions
								</Label>
								{isEditing ? (
									<StyledInput
										value={form.projectDimensions}
										onChange={(e) =>
											onFormChange("projectDimensions", e.target.value)
										}
										placeholder="Enter dimensions"
									/>
								) : (
									<p className="text-sm text-gray-900 dark:text-white">
										{client.projectDimensions}
									</p>
								)}
							</div>
						)}
					</div>

					{/* Company Description - Full Width */}
					{(client.companyDescription || isEditing) && (
						<div className="pt-4 border-t border-gray-200 dark:border-white/10">
							<Label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
								Company Description
							</Label>
							{isEditing ? (
								<Textarea
									value={form.companyDescription}
									onChange={(e) =>
										onFormChange("companyDescription", e.target.value)
									}
									placeholder="Brief description of the company and what they do..."
									className="w-full"
									rows={3}
								/>
							) : (
								<p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
									{client.companyDescription}
								</p>
							)}
						</div>
					)}
				</div>
			</StyledCardContent>
		</StyledCard>
	);
}

