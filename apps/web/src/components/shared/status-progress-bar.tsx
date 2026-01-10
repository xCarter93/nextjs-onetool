"use client";

import { Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
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

	// Get styles for each step status - softer colors with 3D effect
	const getStepStyles = (stepStatus: StepStatus) => {
		if (stepStatus === "complete") {
			return {
				// Soft emerald with depth
				background:
					"linear-gradient(180deg, #6ee7b7 0%, #34d399 50%, #10b981 100%)",
				boxShadow:
					"inset 0 1px 1px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.1), 0 2px 4px rgba(16,185,129,0.2)",
				textColor: "text-emerald-950",
				labelColor: "text-emerald-900/70",
				iconBg: "bg-emerald-200/50",
				iconRing: "ring-emerald-300/60",
				iconColor: "text-emerald-800",
			};
		}
		if (stepStatus === "current") {
			if (variant === "success") {
				return {
					background:
						"linear-gradient(180deg, #6ee7b7 0%, #34d399 50%, #10b981 100%)",
					boxShadow:
						"inset 0 1px 1px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.1), 0 2px 4px rgba(16,185,129,0.2)",
					textColor: "text-emerald-950",
					labelColor: "text-emerald-900/70",
					iconBg: "bg-emerald-200/50",
					iconRing: "ring-emerald-300/60",
					iconColor: "text-emerald-800",
				};
			}
			if (variant === "destructive") {
				return {
					// Soft rose/coral with depth
					background:
						"linear-gradient(180deg, #fda4af 0%, #fb7185 50%, #f43f5e 100%)",
					boxShadow:
						"inset 0 1px 1px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.1), 0 2px 4px rgba(244,63,94,0.2)",
					textColor: "text-rose-950",
					labelColor: "text-rose-900/70",
					iconBg: "bg-rose-200/50",
					iconRing: "ring-rose-300/60",
					iconColor: "text-rose-800",
				};
			}
			// In-progress: soft sky blue with depth
			return {
				background:
					"linear-gradient(180deg, #7dd3fc 0%, #38bdf8 50%, #0ea5e9 100%)",
				boxShadow:
					"inset 0 1px 1px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.1), 0 2px 4px rgba(14,165,233,0.2)",
				textColor: "text-sky-950",
				labelColor: "text-sky-900/70",
				iconBg: "bg-sky-200/50",
				iconRing: "ring-sky-300/60",
				iconColor: "text-sky-800",
			};
		}
		// Upcoming: soft neutral with recessed look
		return {
			background: "linear-gradient(180deg, #f5f5f4 0%, #e7e5e4 100%)",
			boxShadow:
				"inset 0 2px 4px rgba(0,0,0,0.06), inset 0 -1px 0 rgba(255,255,255,0.8)",
			textColor: "text-stone-600 dark:text-zinc-300",
			labelColor: "text-stone-500 dark:text-zinc-400",
			iconBg: "bg-white dark:bg-zinc-700",
			iconRing: "ring-stone-300 dark:ring-zinc-500",
			iconColor: "text-stone-500 dark:text-zinc-400",
		};
	};

	// Get dark mode styles
	const getDarkStepStyles = (stepStatus: StepStatus) => {
		if (stepStatus === "complete") {
			return {
				background:
					"linear-gradient(180deg, #059669 0%, #047857 50%, #065f46 100%)",
				boxShadow:
					"inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -2px 4px rgba(0,0,0,0.3), 0 2px 8px rgba(16,185,129,0.3)",
			};
		}
		if (stepStatus === "current") {
			if (variant === "success") {
				return {
					background:
						"linear-gradient(180deg, #059669 0%, #047857 50%, #065f46 100%)",
					boxShadow:
						"inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -2px 4px rgba(0,0,0,0.3), 0 2px 8px rgba(16,185,129,0.3)",
				};
			}
			if (variant === "destructive") {
				return {
					background:
						"linear-gradient(180deg, #e11d48 0%, #be123c 50%, #9f1239 100%)",
					boxShadow:
						"inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -2px 4px rgba(0,0,0,0.3), 0 2px 8px rgba(244,63,94,0.3)",
				};
			}
			return {
				background:
					"linear-gradient(180deg, #0284c7 0%, #0369a1 50%, #075985 100%)",
				boxShadow:
					"inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -2px 4px rgba(0,0,0,0.3), 0 2px 8px rgba(14,165,233,0.3)",
			};
		}
		return {
			background: "linear-gradient(180deg, #3f3f46 0%, #27272a 100%)",
			boxShadow:
				"inset 0 2px 4px rgba(0,0,0,0.4), inset 0 -1px 0 rgba(255,255,255,0.05)",
		};
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
					"flex items-stretch rounded-[50px]",
					showStatusButton ? "rounded-full overflow-hidden" : ""
				)}
				style={{
					// Outer container shadow for depth
					boxShadow:
						"0 4px 12px -2px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.06)",
				}}
			>
				<ol
					role="list"
					className={cn(
						"flex items-stretch flex-1",
						showStatusButton ? "" : "rounded-full overflow-hidden"
					)}
				>
					{steps.map((step, stepIdx) => {
						const stepStatus = getStepStatus(step);
						const timestamp = getEventTimestamp(step.id);
						const styles = getStepStyles(stepStatus);
						const darkStyles = getDarkStepStyles(stepStatus);
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
									background: styles.background,
									boxShadow: styles.boxShadow,
									clipPath: clipPath,
									WebkitClipPath: clipPath,
									zIndex,
								}}
							>
								{/* Dark mode overlay - uses CSS to swap styles */}
								<div
									className="absolute inset-0 hidden dark:block pointer-events-none"
									style={{
										background: darkStyles.background,
										boxShadow: darkStyles.boxShadow,
									}}
								/>

								{/* Chevron separator highlight */}
								{clipPath && !isLast ? (
									<svg
										className="absolute right-0 top-0 w-[20px] h-full pointer-events-none"
										style={{ zIndex: zIndex + 1 }}
										preserveAspectRatio="none"
										viewBox="0 0 20 100"
									>
										{/* Shadow line */}
										<path
											d="M 2 0 L 22 50 L 2 100"
											fill="none"
											stroke="rgba(0,0,0,0.15)"
											strokeWidth="3"
											vectorEffect="non-scaling-stroke"
										/>
										{/* Highlight line */}
										<path
											d="M -1 0 L 19 50 L -1 100"
											fill="none"
											stroke="rgba(255,255,255,0.4)"
											strokeWidth="2"
											vectorEffect="non-scaling-stroke"
											className="dark:stroke-white/10"
										/>
										{/* Main separator */}
										<path
											d="M 0 0 L 20 50 L 0 100"
											fill="none"
											stroke="rgba(255,255,255,0.9)"
											strokeWidth="2"
											vectorEffect="non-scaling-stroke"
											className="dark:stroke-white/20"
										/>
									</svg>
								) : null}
								<div
									className={cn(
										"relative flex w-full items-center justify-between",
										"px-3 py-2",
										!isFirst && "pl-[24px]" // Adjust padding for 20px overlap
									)}
								>
									<span className="flex items-center gap-2">
										{/* Icon/Badge with 3D effect */}
										{stepStatus === "complete" ? (
											<span
												className={cn(
													"flex size-7 shrink-0 items-center justify-center rounded-full ring-2",
													styles.iconBg,
													styles.iconRing,
													"shadow-[inset_0_1px_2px_rgba(255,255,255,0.5),0_1px_2px_rgba(0,0,0,0.1)]"
												)}
											>
												<Check
													aria-hidden="true"
													className={cn(
														"size-3.5 stroke-[2.5]",
														styles.iconColor
													)}
												/>
											</span>
										) : stepStatus === "current" ? (
											<span
												className={cn(
													"flex size-7 shrink-0 items-center justify-center rounded-full ring-2",
													styles.iconBg,
													styles.iconRing,
													"shadow-[inset_0_1px_2px_rgba(255,255,255,0.5),0_1px_2px_rgba(0,0,0,0.1)]"
												)}
											>
												<Clock className={cn("size-3.5", styles.iconColor)} />
											</span>
										) : (
											<span
												className={cn(
													"flex size-7 shrink-0 items-center justify-center rounded-full ring-2",
													styles.iconBg,
													styles.iconRing,
													"shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]"
												)}
											>
												<span
													className={cn(
														"text-[10px] font-semibold",
														styles.iconColor
													)}
												>
													{step.order}
												</span>
											</span>
										)}

										{/* Step name and label */}
										<span className="flex flex-col items-start">
											<span
												className={cn(
													"text-[10px] font-bold uppercase tracking-wide leading-tight",
													styles.labelColor
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
													styles.textColor
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
												"text-xs font-medium ml-2",
												styles.labelColor
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
						className="-ml-[5px] relative flex items-center"
						style={{
							zIndex: steps.length + 10,
							background: "linear-gradient(180deg, #f5f5f4 0%, #e7e5e4 100%)",
							boxShadow:
								"inset 0 2px 4px rgba(0,0,0,0.06), inset 0 -1px 0 rgba(255,255,255,0.8)",
						}}
					>
						{/* Dark mode background */}
						<div
							className="absolute inset-0 hidden dark:block"
							style={{
								background: "linear-gradient(180deg, #3f3f46 0%, #27272a 100%)",
							}}
						/>
						{/* White separator line */}
						<div
							className="absolute left-[5px] top-0 h-full w-[2px]"
							style={{
								zIndex: steps.length + 11,
								background: "rgba(255,255,255,0.9)",
							}}
						/>
						<Select value={status} onValueChange={onStatusChange}>
							<SelectTrigger
								className={cn(
									"relative z-10 w-auto whitespace-nowrap border-0 transition-all duration-200 font-semibold rounded-none h-full pl-7 pr-6 shadow-none focus:ring-0",
									"bg-transparent text-stone-700 dark:text-zinc-200"
								)}
								style={{
									clipPath:
										"polygon(20px 0, 100% 0, 100% 100%, 20px 100%, 15px 90%, 10px 75%, 7px 60%, 5px 50%, 7px 40%, 10px 25%, 15px 10%)",
									WebkitClipPath:
										"polygon(20px 0, 100% 0, 100% 100%, 20px 100%, 15px 90%, 10px 75%, 7px 60%, 5px 50%, 7px 40%, 10px 25%, 15px 10%)",
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
