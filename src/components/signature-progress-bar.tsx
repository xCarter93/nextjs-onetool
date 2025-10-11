"use client";

import { Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type SignatureEvent = {
	type: string;
	timestamp?: number;
};

type SignatureStatus =
	| "Sent"
	| "Viewed"
	| "Signed"
	| "Completed"
	| "Declined"
	| "Revoked"
	| "Expired";

interface SignatureProgressBarProps {
	status: SignatureStatus;
	events: SignatureEvent[];
}

type StepStatus = "complete" | "current" | "upcoming";

interface Step {
	id: string;
	name: string;
	order: number;
}

export function SignatureProgressBar({
	status,
	events,
}: SignatureProgressBarProps) {
	// Define the normal flow steps
	const normalSteps: Step[] = [
		{ id: "Sent", name: "Sent", order: 1 },
		{ id: "Viewed", name: "Viewed", order: 2 },
		{ id: "Signed", name: "Signed", order: 3 },
		{ id: "Completed", name: "Completed", order: 4 },
	];

	// Check if we have a terminal failure state
	const isDeclined = status === "Declined";
	const isRevoked = status === "Revoked";
	const isExpired = status === "Expired";
	const isFailure = isDeclined || isRevoked || isExpired;

	// If there's a failure, replace the last step
	const steps = isFailure
		? [...normalSteps.slice(0, 3), { id: status, name: status, order: 4 }]
		: normalSteps;

	// Determine the variant based on final status
	const variant: "success" | "destructive" | "in-progress" =
		status === "Completed"
			? "success"
			: isFailure
				? "destructive"
				: "in-progress";

	// Helper to get event timestamp
	const getEventTimestamp = (eventType: string): number | undefined => {
		const event = events.find((e) => e.type === eventType);
		return event?.timestamp;
	};

	// Helper to determine step status
	const getStepStatus = (step: Step): StepStatus => {
		const eventTimestamp = getEventTimestamp(step.id);

		// If we have a timestamp for this event, it's complete
		if (eventTimestamp) {
			return "complete";
		}

		// Find the latest completed step
		const completedSteps = steps.filter((s) =>
			events.some((e) => e.type === s.id && e.timestamp)
		);

		if (completedSteps.length === 0) {
			// No steps completed yet, first step is current
			return step.order === 1 ? "current" : "upcoming";
		}

		const latestCompletedOrder = Math.max(
			...completedSteps.map((s) => s.order)
		);

		if (step.order <= latestCompletedOrder) {
			return "complete";
		} else if (step.order === latestCompletedOrder + 1) {
			return "current";
		} else {
			return "upcoming";
		}
	};

	// Format timestamp
	const formatTimestamp = (timestamp?: number): string => {
		if (!timestamp) return "";
		const date = new Date(timestamp);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<nav aria-label="Progress" className="w-full">
			<ol
				role="list"
				className="divide-y divide-gray-200 dark:divide-gray-700 rounded-md border border-gray-200 dark:border-gray-700 md:flex md:divide-y-0"
			>
				{steps.map((step, stepIdx) => {
					const stepStatus = getStepStatus(step);
					const timestamp = getEventTimestamp(step.id);

					return (
						<li key={step.id} className="relative md:flex md:flex-1">
							<div className="group flex w-full items-center">
								<span className="flex items-center px-4 py-3 text-sm font-medium">
									{/* Icon/Badge */}
									{stepStatus === "complete" ? (
										<span
											className={cn(
												"flex size-10 shrink-0 items-center justify-center rounded-full",
												variant === "success" &&
													"bg-green-500 dark:bg-green-600",
												variant === "destructive" &&
													"bg-red-500 dark:bg-red-600",
												variant === "in-progress" &&
													"bg-indigo-500 dark:bg-indigo-600"
											)}
										>
											<Check aria-hidden="true" className="size-6 text-white" />
										</span>
									) : stepStatus === "current" ? (
										<span
											className={cn(
												"flex size-10 shrink-0 items-center justify-center rounded-full border-2",
												variant === "destructive"
													? "border-red-400 dark:border-red-500"
													: "border-indigo-400 dark:border-indigo-500"
											)}
										>
											<Clock
												className={cn(
													"size-5",
													variant === "destructive"
														? "text-red-400 dark:text-red-500"
														: "text-indigo-400 dark:text-indigo-500"
												)}
											/>
										</span>
									) : (
										<span className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 dark:border-gray-600">
											<span className="text-gray-400 dark:text-gray-500 text-xs">
												{step.order}
											</span>
										</span>
									)}

									{/* Step name and timestamp */}
									<span className="ml-3 flex flex-col items-start">
										<span
											className={cn(
												"text-sm font-medium",
												stepStatus === "complete" &&
													variant === "success" &&
													"text-green-600 dark:text-green-400",
												stepStatus === "complete" &&
													variant === "destructive" &&
													"text-red-600 dark:text-red-400",
												stepStatus === "complete" &&
													variant === "in-progress" &&
													"text-indigo-600 dark:text-indigo-400",
												stepStatus === "current" && variant === "destructive"
													? "text-red-600 dark:text-red-400"
													: stepStatus === "current" &&
															"text-indigo-600 dark:text-indigo-400",
												stepStatus === "upcoming" &&
													"text-gray-400 dark:text-gray-500"
											)}
										>
											{step.name}
										</span>
										{timestamp && (
											<span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
												{formatTimestamp(timestamp)}
											</span>
										)}
									</span>
								</span>
							</div>

							{/* Arrow separator */}
							{stepIdx !== steps.length - 1 && (
								<div
									aria-hidden="true"
									className="absolute top-0 right-0 hidden h-full w-5 md:block"
								>
									<svg
										fill="none"
										viewBox="0 0 22 80"
										preserveAspectRatio="none"
										className="size-full text-gray-200 dark:text-gray-700"
									>
										<path
											d="M0 -2L20 40L0 82"
											stroke="currentcolor"
											vectorEffect="non-scaling-stroke"
											strokeLinejoin="round"
										/>
									</svg>
								</div>
							)}
						</li>
					);
				})}
			</ol>
		</nav>
	);
}
