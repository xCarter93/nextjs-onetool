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
				"lg:border-t lg:border-b lg:border-border/60 dark:lg:border-border/40",
				className
			)}
		>
			<nav
				aria-label="Progress"
				className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
			>
				<ol
					role="list"
					className="overflow-hidden rounded-xl lg:flex lg:rounded-2xl lg:border-r lg:border-l lg:border-border/60 dark:lg:border-border/40 bg-card/50 backdrop-blur-sm shadow-sm ring-1 ring-border/10"
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
