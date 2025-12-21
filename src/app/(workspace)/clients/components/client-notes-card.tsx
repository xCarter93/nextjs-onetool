"use client";

import {
	StyledCard,
	StyledCardHeader,
	StyledCardTitle,
	StyledCardContent,
} from "@/components/ui/styled";

interface ClientNotesCardProps {
	isEditing: boolean;
	notes: string;
	onNotesChange: (value: string) => void;
}

export function ClientNotesCard({
	isEditing,
	notes,
	onNotesChange,
}: ClientNotesCardProps) {
	return (
		<StyledCard>
			<StyledCardHeader>
				<StyledCardTitle className="text-lg">Client notes</StyledCardTitle>
				<p className="text-sm text-gray-600 dark:text-gray-400">
					Internal notes visible only to your team
				</p>
			</StyledCardHeader>
			<StyledCardContent>
				{isEditing ? (
					<textarea
						className="w-full min-h-[100px] px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-md text-gray-900 dark:text-white"
						value={notes}
						onChange={(e) => onNotesChange(e.target.value)}
					/>
				) : notes ? (
					<div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
						<p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
							{notes}
						</p>
					</div>
				) : (
					<div className="text-center py-6">
						<p className="text-sm text-gray-600 dark:text-gray-400 italic">
							No notes added for this client yet
						</p>
					</div>
				)}
			</StyledCardContent>
		</StyledCard>
	);
}

