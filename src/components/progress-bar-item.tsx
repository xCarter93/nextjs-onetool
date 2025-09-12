import { CheckIcon } from "@heroicons/react/24/solid";

export interface ProgressStep {
	id: string;
	name: string;
	description: string;
	href?: string;
	status: "complete" | "current" | "upcoming";
}

interface ProgressBarItemProps {
	step: ProgressStep;
	stepIdx: number;
	totalSteps: number;
}

function classNames(...classes: (string | boolean | undefined | null)[]) {
	return classes.filter(Boolean).join(" ");
}

export default function ProgressBarItem({
	step,
	stepIdx,
	totalSteps,
}: ProgressBarItemProps) {
	return (
		<li className="relative overflow-hidden lg:flex-1">
			<div
				className={classNames(
					stepIdx === 0 ? "rounded-t-md border-b-0" : "",
					stepIdx === totalSteps - 1 ? "rounded-b-md border-t-0" : "",
					"overflow-hidden border border-white/15 lg:border-0"
				)}
			>
				{step.status === "complete" ? (
					<a href={step.href || "#"} className="group">
						<span
							aria-hidden="true"
							className="absolute top-0 left-0 h-full w-1 bg-transparent group-hover:bg-white/20 lg:top-auto lg:bottom-0 lg:h-1 lg:w-full"
						/>
						<span
							className={classNames(
								stepIdx !== 0 ? "lg:pl-9" : "",
								"flex items-start px-6 py-5 text-sm font-medium"
							)}
						>
							<span className="shrink-0">
								<span className="flex size-10 items-center justify-center rounded-full bg-indigo-500">
									<CheckIcon aria-hidden="true" className="size-6 text-white" />
								</span>
							</span>
							<span className="mt-0.5 ml-4 flex min-w-0 flex-col">
								<span className="text-sm font-medium text-white">
									{step.name}
								</span>
								<span className="text-sm font-medium text-gray-400">
									{step.description}
								</span>
							</span>
						</span>
					</a>
				) : step.status === "current" ? (
					<a href={step.href || "#"} aria-current="step">
						<span
							aria-hidden="true"
							className="absolute top-0 left-0 h-full w-1 bg-indigo-500 lg:top-auto lg:bottom-0 lg:h-1 lg:w-full"
						/>
						<span
							className={classNames(
								stepIdx !== 0 ? "lg:pl-9" : "",
								"flex items-start px-6 py-5 text-sm font-medium"
							)}
						>
							<span className="shrink-0">
								<span className="flex size-10 items-center justify-center rounded-full border-2 border-indigo-500">
									<span className="text-indigo-400">{step.id}</span>
								</span>
							</span>
							<span className="mt-0.5 ml-4 flex min-w-0 flex-col">
								<span className="text-sm font-medium text-indigo-400">
									{step.name}
								</span>
								<span className="text-sm font-medium text-gray-400">
									{step.description}
								</span>
							</span>
						</span>
					</a>
				) : (
					<a href={step.href || "#"} className="group">
						<span
							aria-hidden="true"
							className="absolute top-0 left-0 h-full w-1 bg-transparent group-hover:bg-white/20 lg:top-auto lg:bottom-0 lg:h-1 lg:w-full"
						/>
						<span
							className={classNames(
								stepIdx !== 0 ? "lg:pl-9" : "",
								"flex items-start px-6 py-5 text-sm font-medium"
							)}
						>
							<span className="shrink-0">
								<span className="flex size-10 items-center justify-center rounded-full border-2 border-white/15">
									<span className="text-gray-400">{step.id}</span>
								</span>
							</span>
							<span className="mt-0.5 ml-4 flex min-w-0 flex-col">
								<span className="text-sm font-medium text-gray-400">
									{step.name}
								</span>
								<span className="text-sm font-medium text-gray-400">
									{step.description}
								</span>
							</span>
						</span>
					</a>
				)}

				{stepIdx !== 0 ? (
					<>
						{/* Separator */}
						<div
							aria-hidden="true"
							className="absolute inset-0 top-0 left-0 hidden w-3 lg:block"
						>
							<svg
								fill="none"
								viewBox="0 0 12 82"
								preserveAspectRatio="none"
								className="size-full text-white/15"
							>
								<path
									d="M0.5 0V31L10.5 41L0.5 51V82"
									stroke="currentcolor"
									vectorEffect="non-scaling-stroke"
								/>
							</svg>
						</div>
					</>
				) : null}
			</div>
		</li>
	);
}
