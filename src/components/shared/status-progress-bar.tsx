"use client";

import { Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

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

export interface StatusOption {
	value: string;
	label: string;
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
	/** Show status change button */
	showStatusButton?: boolean;
	/** Status options for the select dropdown */
	statusOptions?: StatusOption[];
	/** Handler for status change */
	onStatusChange?: (status: string) => void;
	/** Label for the status button */
	statusButtonLabel?: string;
}

type StepStatus = "complete" | "current" | "upcoming";

export function StatusProgressBar({
	status,
	steps: baseSteps,
	events = [],
	failureStatuses = [],
	successStatuses = [],
	variantOverride,
	showStatusButton = false,
	statusOptions = [],
	onStatusChange,
	statusButtonLabel = "Change Status",
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
	const getClipPath = (
		index: number,
		total: number,
		isLastWithButton: boolean
	): string | undefined => {
		if (total === 1) return undefined;

		const notch = 20; // Size of the chevron notch

		if (index === total - 1) {
			// Last segment: no clip path (straight edge on right)
			return undefined;
		}

		// All other segments: straight left, chevron right only
		return `polygon(0 0, calc(100% - ${notch}px) 0, 100% 50%, calc(100% - ${notch}px) 100%, 0 100%)`;
	};

	return (
		<nav aria-label="Progress" className="w-full max-w-5xl mx-auto">
			<div
				className={cn(
					"flex items-stretch",
					showStatusButton ? "shadow-sm rounded-full overflow-hidden" : ""
				)}
			>
				<ol
					role="list"
					className={cn(
						"flex items-stretch flex-1",
						showStatusButton ? "" : "rounded-full shadow-sm overflow-hidden"
					)}
					style={{ backgroundColor: "#f1f5f9" }} // Light gray background for upcoming segments
				>
					{steps.map((step, stepIdx) => {
						const stepStatus = getStepStatus(step);
						const timestamp = getEventTimestamp(step.id);
						const backgroundColor = getBackgroundColor(stepStatus);
						const isFirst = stepIdx === 0;
						const isLast = stepIdx === steps.length - 1;
						const isLastWithButton = isLast && showStatusButton;
						const clipPath = getClipPath(
							stepIdx,
							steps.length,
							isLastWithButton
						);

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
								{/* White outline for chevron */}
								{clipPath && !isLast ? (
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
								) : null}
								<div
									className={cn(
										"relative flex w-full items-center justify-between",
										"px-3 py-1.5",
										!isFirst && "pl-[24px]" // Adjust padding for 20px overlap
									)}
								>
									<span className="flex items-center gap-1.5">
										{/* Icon/Badge */}
										{stepStatus === "complete" ? (
											<span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/20 ring-2 ring-white/40">
												<Check
													aria-hidden="true"
													className="size-3 text-white stroke-[2.5]"
												/>
											</span>
										) : stepStatus === "current" ? (
											<span className="flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-white/50 bg-white/10">
												<Clock className="size-3 text-white" />
											</span>
										) : (
											<span className="flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
												<span className="text-gray-500 text-[10px] font-medium">
													{step.order}
												</span>
											</span>
										)}

										{/* Step name and label */}
										<span className="flex flex-col items-start">
											<span
												className={cn(
													"text-[10px] font-bold uppercase tracking-wide leading-tight",
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
													"text-sm font-bold leading-tight",
													getTextColor(stepStatus)
												)}
											>
												{step.name}
											</span>
										</span>
									</span>

									{/* Timestamp on the right */}
									{timestamp && (
										<span
											className={cn(
												"text-xs font-medium",
												getTextColor(stepStatus),
												"opacity-80 ml-1.5"
											)}
										>
											{formatTimestamp(timestamp)}
										</span>
									)}
								</div>
							</li>
						);
					})}
				</ol>
				{showStatusButton && statusOptions.length > 0 && onStatusChange && (
					<div
						className="-ml-[5px] relative"
						style={{
							zIndex: steps.length + 10,
							backgroundColor: "#f1f5f9", // Force slate-100 in all modes
						}}
					>
						{/* White separator line */}
						<div
							className="absolute left-[5px] top-0 h-full"
							style={{
								zIndex: steps.length + 11,
								backgroundColor: "#ffffff",
							}}
						/>
						<Select value={status} onValueChange={onStatusChange}>
							<SelectTrigger
								className="w-auto whitespace-nowrap border-0 transition-all duration-200 font-semibold rounded-none h-full pl-7 pr-6 shadow-none focus:ring-0"
								style={{
									clipPath:
										"polygon(20px 0, 100% 0, 100% 100%, 20px 100%, 15px 90%, 10px 75%, 7px 60%, 5px 50%, 7px 40%, 10px 25%, 15px 10%)",
									WebkitClipPath:
										"polygon(20px 0, 100% 0, 100% 100%, 20px 100%, 15px 90%, 10px 75%, 7px 60%, 5px 50%, 7px 40%, 10px 25%, 15px 10%)",
									backgroundColor: "#f1f5f9", // Force slate-100 in all modes
									color: "#334155", // Force slate-700 text color in all modes
								}}
							>
								{statusButtonLabel}
							</SelectTrigger>
							<SelectContent>
								{statusOptions.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				)}
			</div>
		</nav>
	);
}
