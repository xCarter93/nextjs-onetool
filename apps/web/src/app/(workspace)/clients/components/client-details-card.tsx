"use client";

import { Doc } from "@onetool/backend/convex/_generated/dataModel";
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

interface ClientDetailsCardProps {
	client: Doc<"clients">;
	isEditing: boolean;
	form: {
		companyDescription: string;
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
						{/* Lead Source */}
						{client.leadSource && (
							<div>
								<Label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
									Lead Source
								</Label>
								<p className="text-sm text-gray-900 dark:text-white">
									{formatLeadSource(client.leadSource)}
								</p>
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

