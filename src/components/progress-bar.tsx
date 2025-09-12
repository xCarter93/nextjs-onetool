import ProgressBarItem, { ProgressStep } from "./progress-bar-item";

export type { ProgressStep };

interface ProgressBarProps {
	steps: ProgressStep[];
	className?: string;
}

function classNames(...classes: (string | boolean | undefined | null)[]) {
	return classes.filter(Boolean).join(" ");
}

export default function ProgressBar({ steps, className }: ProgressBarProps) {
	return (
		<div
			className={classNames(
				"lg:border-t lg:border-b lg:border-white/15",
				className
			)}
		>
			<nav
				aria-label="Progress"
				className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
			>
				<ol
					role="list"
					className="overflow-hidden rounded-md lg:flex lg:rounded-none lg:border-r lg:border-l lg:border-white/15"
				>
					{steps.map((step, stepIdx) => (
						<ProgressBarItem
							key={step.id}
							step={step}
							stepIdx={stepIdx}
							totalSteps={steps.length}
						/>
					))}
				</ol>
			</nav>
		</div>
	);
}
