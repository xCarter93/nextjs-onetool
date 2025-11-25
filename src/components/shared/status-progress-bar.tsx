"use client";

import { Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatusEvent = {
	type: string;
	timestamp?: number;
};

export type ProgressBarVariant = "success" | "destructive" | "in-progress";

export interface StatusStep {
	id: string;
	name: string;
	order: number;
}

export interface StatusProgressBarProps {
	/** Current status of the entity */
	status: string;
	/** Array of workflow steps in order */
	steps: StatusStep[];
	/** Optional events with timestamps */
	events?: StatusEvent[];
	/** Statuses that should be treated as failures/errors */
	failureStatuses?: string[];
	/** Statuses that should be treated as success */
	successStatuses?: string[];
	/** Optional override for color variant */
	variantOverride?: ProgressBarVariant;
}

type StepStatus = "complete" | "current" | "upcoming";

export function StatusProgressBar({
	status,
	steps: baseSteps,
	events = [],
	failureStatuses = [],
	successStatuses = [],
	variantOverride,
}: StatusProgressBarProps) {
	// Check if we have a terminal failure state
	const isFailure = failureStatuses.includes(status);
	const isSuccess = successStatuses.includes(status);

	// If there's a failure status not in the normal flow, replace the last step
	const hasFailureStep = baseSteps.some((step) => step.id === status);
	const steps =
		isFailure && !hasFailureStep
			? [
					...baseSteps.slice(0, -1),
					{ id: status, name: status, order: baseSteps.length },
				]
			: baseSteps;

	// Determine the variant based on final status
	const variant: ProgressBarVariant =
		variantOverride ||
		(isSuccess ? "success" : isFailure ? "destructive" : "in-progress");

	// Helper to get event timestamp
	const getEventTimestamp = (eventType: string): number | undefined => {
		const event = events.find((e) => e.type === eventType);
		return event?.timestamp;
	};

	// Helper to determine step status
	const getStepStatus = (step: StatusStep): StepStatus => {
		// Find current status step order
		const currentStatusStep = steps.find((s) => s.id === status);
		const currentOrder = currentStatusStep?.order || 1;

		// If this step's ID matches the current status, it's current
		if (step.id === status) {
			return "current";
		}

		// If step order is less than current status order, it's complete
		if (step.order < currentOrder) {
			return "complete";
		}

		// Otherwise it's upcoming
		return "upcoming";
	};

	// Format timestamp
	const formatTimestamp = (timestamp?: number): string => {
		if (!timestamp) return "";
		const date = new Date(timestamp);
		return date.toLocaleString("en-US", {
			month: "short",
			day: "numeric",
			hour: "numeric",
			minute: "2-digit",
		});
	};

	// Get background color for each step status
	const getBackgroundColor = (stepStatus: StepStatus): string => {
		if (stepStatus === "complete") {
			// Completed steps are always green
			return "#22c55e"; // emerald-500
		}
		if (stepStatus === "current") {
			// Current step color depends on variant
			if (variant === "success") {
				return "#22c55e"; // emerald-500
			}
			if (variant === "destructive") {
				return "#ef4444"; // red-500
			}
			return "#2563eb"; // blue-600 (dark blue like in image)
		}
		// Upcoming steps are light gray
		return "#f1f5f9"; // slate-100
	};

	// Get text color for each step status
	const getTextColor = (stepStatus: StepStatus): string => {
		if (stepStatus === "complete" || stepStatus === "current") {
			return "text-white";
		}
		return "text-gray-700";
	};

	// Get label text color
	const getLabelColor = (stepStatus: StepStatus): string => {
		if (stepStatus === "complete" || stepStatus === "current") {
			return "text-white/80";
		}
		return "text-gray-500";
	};

	// Get clip path for arrow/chevron shape
	const getClipPath = (index: number, total: number): string | undefined => {
		if (total === 1) return undefined;

		const notch = 20; // Size of the chevron notch

		if (index === total - 1) {
			// Last segment: no chevron
			return undefined;
		}

		// All other segments: straight left, chevron right only
		return `polygon(0 0, calc(100% - ${notch}px) 0, 100% 50%, calc(100% - ${notch}px) 100%, 0 100%)`;
	};

	return (
		<nav aria-label="Progress" className="w-full max-w-7xl">
			<ol
				role="list"
				className="flex items-stretch rounded-full shadow-sm overflow-hidden"
				style={{ backgroundColor: "#f1f5f9" }} // Light gray background for upcoming segments
			>
				{steps.map((step, stepIdx) => {
					const stepStatus = getStepStatus(step);
					const timestamp = getEventTimestamp(step.id);
					const backgroundColor = getBackgroundColor(stepStatus);
					const clipPath = getClipPath(stepIdx, steps.length);
					const isFirst = stepIdx === 0;
					const isLast = stepIdx === steps.length - 1;

					// Z-index: steps render left to right, each overlapping the previous
					// Earlier steps need higher z-index to overlap later ones
					const zIndex = steps.length - stepIdx;

					return (
						<li
							key={step.id}
							className={cn(
								"relative flex flex-1",
								!isLast && "-mr-[20px]" // Exact overlap to match chevron notch
							)}
							style={{
								backgroundColor: backgroundColor,
								background: backgroundColor, // Ensure background is set
								clipPath: clipPath,
								WebkitClipPath: clipPath,
								zIndex,
							}}
						>
							{/* Black outline for chevron */}
							{clipPath && !isLast && (
								<svg
									className="absolute right-0 top-0 w-[20px] h-full pointer-events-none"
									style={{ zIndex: zIndex + 1 }}
									preserveAspectRatio="none"
									viewBox="0 0 20 100"
								>
									<path
										d="M 0 0 L 20 50 L 0 100"
										fill="none"
										stroke="white"
										strokeWidth="3"
										vectorEffect="non-scaling-stroke"
									/>
								</svg>
							)}
							<div
								className={cn(
									"relative flex w-full items-center",
									"px-4 py-2",
									!isFirst && "pl-[24px]" // Adjust padding for 20px overlap
								)}
							>
								<span className="flex items-center gap-2">
									{/* Icon/Badge */}
									{stepStatus === "complete" ? (
										<span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/20 ring-2 ring-white/40">
											<Check
												aria-hidden="true"
												className="size-4 text-white stroke-[2.5]"
											/>
										</span>
									) : stepStatus === "current" ? (
										<span className="flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-white/50 bg-white/10">
											<Clock className="size-4 text-white" />
										</span>
									) : (
										<span className="flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
											<span className="text-gray-500 text-xs font-medium">
												{step.order}
											</span>
										</span>
									)}

									{/* Step name and timestamp */}
									<span className="flex flex-col items-start">
										<span
											className={cn(
												"text-[10px] font-semibold uppercase tracking-wide",
												getLabelColor(stepStatus)
											)}
										>
											{stepStatus === "complete"
												? "COMPLETED"
												: stepStatus === "current"
													? "CURRENT STAGE"
													: "UPCOMING"}
										</span>
										<span
											className={cn(
												"text-xs font-semibold",
												getTextColor(stepStatus)
											)}
										>
											{step.name}
										</span>
										{timestamp && (
											<span
												className={cn(
													"text-[10px] mt-0.5",
													getTextColor(stepStatus),
													"opacity-80"
												)}
											>
												{formatTimestamp(timestamp)}
											</span>
										)}
									</span>
								</span>
							</div>
						</li>
					);
				})}
			</ol>
		</nav>
	);
}
