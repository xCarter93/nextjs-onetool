"use client";

import { Briefcase, CheckCheck, Database, Server } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { TimelineContent } from "@/components/timeline-animation";

// Utility function for conditional class names
function cn(...classes: (string | undefined | null | false)[]): string {
	return classes.filter(Boolean).join(" ");
}

// Card components
interface CardProps {
	className?: string;
	children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ className, children }) => (
	<div
		className={cn(
			"rounded-lg border bg-card text-card-foreground shadow-sm",
			className
		)}
	>
		{children}
	</div>
);

const CardHeader: React.FC<CardProps> = ({ className, children }) => (
	<div className={cn("flex flex-col space-y-1.5 p-6", className)}>
		{children}
	</div>
);

const CardContent: React.FC<CardProps> = ({ className, children }) => (
	<div className={cn("p-6 pt-0", className)}>{children}</div>
);

// Custom AnimatedNumber component to replace NumberFlow
interface AnimatedNumberProps {
	value: number;
	format: {
		style: "currency" | "decimal" | "percent";
		currency?: string;
		maximumFractionDigits: number;
	};
	className?: string;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
	value,
	format,
	className,
}) => {
	const [currentValue, setCurrentValue] = useState(0);
	const animationFrameRef = useRef<number | null>(null);
	const startTimeRef = useRef<number | null>(null);

	useEffect(() => {
		const duration = 500; // milliseconds for the animation

		const animate = (timestamp: DOMHighResTimeStamp) => {
			if (!startTimeRef.current) {
				startTimeRef.current = timestamp;
			}

			const progress = (timestamp - startTimeRef.current) / duration;
			const easedProgress = Math.min(1, progress); // Ensure progress doesn't exceed 1

			const newValue = easedProgress * value;
			setCurrentValue(newValue);

			if (progress < 1) {
				animationFrameRef.current = requestAnimationFrame(animate);
			} else {
				setCurrentValue(value); // Ensure final value is exact
				startTimeRef.current = null; // Reset for next animation
			}
		};

		// Clear any existing animation frame before starting a new one
		if (animationFrameRef.current) {
			cancelAnimationFrame(animationFrameRef.current);
		}
		startTimeRef.current = null; // Reset start time for new animation
		animationFrameRef.current = requestAnimationFrame(animate);

		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, [value]);

	const formatter = new Intl.NumberFormat("en-US", {
		style: format.style,
		currency: format.currency,
		maximumFractionDigits: format.maximumFractionDigits,
	});

	return <span className={className}>{formatter.format(currentValue)}</span>;
};

const plans = [
	{
		name: "Starter",
		description:
			"Great for small businesses and startups looking to get started with field service management",
		price: 12,
		yearlyPrice: 99,
		buttonText: "Get started",
		buttonVariant: "outline" as const,
		features: [
			{ text: "Up to 10 clients", icon: <Briefcase size={20} /> },
			{ text: "Up to 10GB storage", icon: <Database size={20} /> },
			{ text: "Limited analytics", icon: <Server size={20} /> },
		],
		includes: [
			"Free includes:",
			"Unlimited projects",
			"Custom templates & quotes",
			"2-factor authentication",
		],
	},
	{
		name: "Business",
		description:
			"Best value for growing businesses that need more advanced features",
		price: 48,
		yearlyPrice: 399,
		buttonText: "Get started",
		buttonVariant: "default" as const,
		popular: true,
		features: [
			{ text: "Unlimited clients", icon: <Briefcase size={20} /> },
			{ text: "Storage (250MB/file)", icon: <Database size={20} /> },
			{ text: "100 workspace command runs", icon: <Server size={20} /> },
		],
		includes: [
			"Everything in Starter, plus:",
			"Advanced scheduling",
			"Payment processing",
			"Priority support",
		],
	},
	{
		name: "Enterprise",
		description:
			"Advanced plan with enhanced security and unlimited access for large teams",
		price: 96,
		yearlyPrice: 899,
		buttonText: "Get started",
		buttonVariant: "outline" as const,
		features: [
			{ text: "Unlimited clients", icon: <Briefcase size={20} /> },
			{ text: "Unlimited storage", icon: <Database size={20} /> },
			{ text: "Unlimited workspaces", icon: <Server size={20} /> },
		],
		includes: [
			"Everything in Business, plus:",
			"Custom integrations",
			"Dedicated account manager",
			"24/7 priority support",
		],
	},
];

const PricingSwitch = ({ onSwitch }: { onSwitch: (value: string) => void }) => {
	const [selected, setSelected] = useState("0");

	const handleSwitch = (value: string) => {
		setSelected(value);
		onSwitch(value);
	};

	return (
		<div className="flex justify-center">
			<div className="relative z-50 mx-auto flex w-fit rounded-full bg-muted/30 border border-border p-1">
				<button
					onClick={() => handleSwitch("0")}
					className={cn(
						"relative z-10 w-fit sm:h-12 h-10 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors",
						selected === "0"
							? "text-white"
							: "text-muted-foreground hover:text-foreground"
					)}
				>
					{selected === "0" && (
						<motion.span
							layoutId={"switch"}
							className="absolute top-0 left-0 sm:h-12 h-10 w-full rounded-full border-4 shadow-sm shadow-blue-600 border-blue-600 bg-gradient-to-t from-blue-500 via-blue-400 to-blue-600"
							transition={{ type: "spring", stiffness: 500, damping: 30 }}
						/>
					)}
					<span className="relative">Monthly</span>
				</button>

				<button
					onClick={() => handleSwitch("1")}
					className={cn(
						"relative z-10 w-fit sm:h-12 h-10 flex-shrink-0 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors",
						selected === "1"
							? "text-white"
							: "text-muted-foreground hover:text-foreground"
					)}
				>
					{selected === "1" && (
						<motion.span
							layoutId={"switch"}
							className="absolute top-0 left-0 sm:h-12 h-10 w-full rounded-full border-4 shadow-sm shadow-blue-600 border-blue-600 bg-gradient-to-t from-blue-500 via-blue-400 to-blue-600"
							transition={{ type: "spring", stiffness: 500, damping: 30 }}
						/>
					)}
					<span className="relative flex items-center gap-2">
						Yearly
						<span className="rounded-full bg-blue-50 dark:bg-blue-950 px-2 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400">
							Save 20%
						</span>
					</span>
				</button>
			</div>
		</div>
	);
};

export default function PricingSection() {
	const [isYearly, setIsYearly] = useState(false);
	const [mounted, setMounted] = useState(false);
	const pricingRef = useRef<HTMLDivElement>(null);
	const { resolvedTheme } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	// Render nothing until the component is mounted and theme is resolved to prevent hydration mismatches
	if (!mounted || !resolvedTheme) {
		return null;
	}

	const revealVariants = {
		visible: (i: number) => ({
			y: 0,
			opacity: 1,
			filter: "blur(0px)",
			transition: {
				delay: i * 0.4,
				duration: 0.5,
			},
		}),
		hidden: {
			filter: "blur(10px)",
			y: -20,
			opacity: 0,
		},
	};

	const togglePricingPeriod = (value: string) =>
		setIsYearly(Number.parseInt(value) === 1);

	return (
		<div
			className="not-prose relative flex w-full flex-col gap-16 overflow-hidden px-4 py-24 text-center sm:px-8 min-h-screen mx-auto"
			ref={pricingRef}
		>
			{/* Background gradient effects for visual appeal */}
			<div className="absolute inset-0 -z-10 overflow-hidden">
				<div className="absolute -top-[10%] left-[50%] h-[40%] w-[60%] -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl" />
				<div className="absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-blue-600/5 blur-3xl" />
				<div className="absolute -bottom-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-blue-600/5 blur-3xl" />
			</div>

			<div className="text-center mb-6 max-w-3xl mx-auto">
				<TimelineContent
					as="h2"
					animationNum={0}
					timelineRef={pricingRef}
					customVariants={revealVariants}
					className="md:text-6xl sm:text-4xl text-3xl font-medium text-foreground mb-4"
				>
					Plans that work best for your{" "}
					<TimelineContent
						as="span"
						animationNum={1}
						timelineRef={pricingRef}
						customVariants={revealVariants}
						className="border border-dashed border-blue-500 px-2 py-1 rounded-xl bg-blue-100 dark:bg-blue-950 capitalize inline-block"
					>
						business
					</TimelineContent>
				</TimelineContent>

				<TimelineContent
					as="p"
					animationNum={2}
					timelineRef={pricingRef}
					customVariants={revealVariants}
					className="sm:text-base text-sm text-muted-foreground sm:w-[70%] w-[80%] mx-auto"
				>
					Trusted by millions, We help teams all around the world. Explore which
					option is right for you.
				</TimelineContent>
			</div>

			<TimelineContent
				as="div"
				animationNum={3}
				timelineRef={pricingRef}
				customVariants={revealVariants}
			>
				<PricingSwitch onSwitch={togglePricingPeriod} />
			</TimelineContent>

			<div className="grid md:grid-cols-3 max-w-7xl gap-4 py-6 mx-auto">
				{plans.map((plan, index) => (
					<TimelineContent
						key={plan.name}
						as="div"
						animationNum={4 + index}
						timelineRef={pricingRef}
						customVariants={revealVariants}
					>
						<Card
							className={cn(
								"relative border-border h-full",
								plan.popular
									? "ring-2 ring-blue-500 bg-blue-50/50 dark:bg-blue-950/30"
									: "bg-card"
							)}
						>
							<CardHeader className="text-left">
								<div className="flex justify-between">
									<h3 className="text-3xl font-semibold text-foreground mb-2">
										{plan.name}
									</h3>
									{plan.popular && (
										<div className="">
											<span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
												Popular
											</span>
										</div>
									)}
								</div>
								<p className="text-sm text-muted-foreground mb-4">
									{plan.description}
								</p>
								<div className="flex items-baseline">
									<span className="text-4xl font-semibold text-foreground">
										$
										<AnimatedNumber
											value={isYearly ? plan.yearlyPrice : plan.price}
											className="text-4xl font-semibold"
											format={{
												style: "decimal",
												maximumFractionDigits: 0,
											}}
										/>
									</span>
									<span className="text-muted-foreground ml-1">
										/{isYearly ? "year" : "month"}
									</span>
								</div>
							</CardHeader>

							<CardContent className="pt-0">
								<button
									className={cn(
										"w-full mb-6 p-4 text-xl rounded-xl transition-all duration-300",
										plan.popular
											? "bg-gradient-to-t from-blue-500 to-blue-600 shadow-lg shadow-blue-500 border border-blue-400 text-white hover:shadow-xl"
											: "bg-gradient-to-t from-gray-800 to-gray-900 shadow-lg shadow-gray-800/20 border border-gray-700 text-white hover:shadow-xl"
									)}
								>
									{plan.buttonText}
								</button>
								<ul className="space-y-2 font-semibold py-5">
									{plan.features.map((feature, featureIndex) => (
										<li key={featureIndex} className="flex items-center">
											<span className="text-foreground grid place-content-center mt-0.5 mr-3">
												{feature.icon}
											</span>
											<span className="text-sm text-muted-foreground">
												{feature.text}
											</span>
										</li>
									))}
								</ul>

								<div className="space-y-3 pt-4 border-t border-border">
									<h4 className="font-medium text-base text-foreground mb-3">
										{plan.includes[0]}
									</h4>
									<ul className="space-y-2 font-semibold">
										{plan.includes.slice(1).map((feature, featureIndex) => (
											<li key={featureIndex} className="flex items-center">
												<span className="h-6 w-6 bg-green-50 dark:bg-green-950 border border-blue-500 rounded-full grid place-content-center mt-0.5 mr-3">
													<CheckCheck className="h-4 w-4 text-blue-500" />
												</span>
												<span className="text-sm text-muted-foreground">
													{feature}
												</span>
											</li>
										))}
									</ul>
								</div>
							</CardContent>
						</Card>
					</TimelineContent>
				))}
			</div>
		</div>
	);
}
