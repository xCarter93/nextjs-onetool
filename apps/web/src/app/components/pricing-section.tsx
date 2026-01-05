"use client";

import {
	Briefcase,
	CheckCheck,
	Database,
	FileText,
	Server,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { TimelineContent } from "@/components/shared/timeline-animation";
import { StyledButton } from "@/components/ui/styled/styled-button";
import { usePlans } from "@clerk/nextjs/experimental";
import { useRouter } from "next/navigation";

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
		name: "Free",
		description:
			"Perfect for individuals and small teams getting started with project management",
		price: 0,
		yearlyPrice: 0,
		buttonText: "Get started",
		buttonVariant: "outline" as const,
		features: [
			{ text: "Limited Clients (10)", icon: <Briefcase size={20} /> },
			{
				text: "Limited Active Projects per client (3)",
				icon: <Database size={20} />,
			},
			{ text: "5 E-signature requests per month", icon: <Server size={20} /> },
			{
				text: "Custom Invoice & Quote PDF Generation",
				icon: <FileText size={20} />,
			},
		],
		includes: [],
	},
	{
		name: "Business",
		description:
			"Best value for growing businesses that need advanced features and unlimited access",
		price: 30,
		yearlyPrice: 300,
		buttonText: "Get started",
		buttonVariant: "default" as const,
		popular: true,
		features: [
			{ text: "Unlimited Clients", icon: <Briefcase size={20} /> },
			{
				text: "Unlimited Active Projects per Client",
				icon: <Database size={20} />,
			},
			{
				text: "Unlimited E-signature requests per month",
				icon: <Server size={20} />,
			},
		],
		includes: [
			"Everything in Free, plus:",
			"Custom SKU Creation",
			"Unlimited Saved Organization Documents",
			"AI Import for Existing Clients/Projects",
			"Stripe Connect Integration - Send & Receive Payments",
			"Priority Support - 24 hour SLAs",
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
							className="absolute top-0 left-0 sm:h-12 h-10 w-full rounded-full border-4 shadow-sm shadow-primary border-primary bg-linear-to-t from-primary via-primary/80 to-primary"
							transition={{ type: "spring", stiffness: 500, damping: 30 }}
						/>
					)}
					<span className="relative">Monthly</span>
				</button>

				<button
					onClick={() => handleSwitch("1")}
					className={cn(
						"relative z-10 w-fit sm:h-12 h-10 shrink-0 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors",
						selected === "1"
							? "text-white"
							: "text-muted-foreground hover:text-foreground"
					)}
				>
					{selected === "1" && (
						<motion.span
							layoutId={"switch"}
							className="absolute top-0 left-0 sm:h-12 h-10 w-full rounded-full border-4 shadow-sm shadow-primary border-primary bg-linear-to-t from-primary via-primary/80 to-primary"
							transition={{ type: "spring", stiffness: 500, damping: 30 }}
						/>
					)}
					<span className="relative flex items-center gap-2">
						Yearly
						<span className="rounded-full bg-white dark:bg-gray-900 px-2 py-0.5 text-xs font-medium text-primary border border-primary/20">
							Save 17%
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
	const router = useRouter();

	// Fetch plans from Clerk
	const { data: clerkPlans, isLoading: isLoadingPlans } = usePlans({
		for: "organization",
		enabled: true,
	});

	useEffect(() => {
		setMounted(true);
	}, []);

	// Merge Clerk plan data with our custom features
	const getDisplayPlans = () => {
		// Always start with the hardcoded free plan
		const freePlan = plans.find((p) => p.name === "Free");
		const displayPlans = freePlan ? [freePlan] : [];

		// If Clerk plans are available, add them
		if (!isLoadingPlans && clerkPlans && clerkPlans.length > 0) {
			// Add paid plans from Clerk
			const clerkDisplayPlans = clerkPlans
				.filter((clerkPlan) => clerkPlan.hasBaseFee) // Only paid plans
				.map((clerkPlan) => {
					// Find matching hardcoded plan for custom features
					const hardcodedPlan = plans.find(
						(p) =>
							p.name.toLowerCase() === clerkPlan.name.toLowerCase() ||
							p.name === "Business"
					);

					// Use Clerk pricing data
					const monthlyPrice = clerkPlan.fee?.amount
						? clerkPlan.fee.amount / 100
						: hardcodedPlan?.price ?? 0;
					const yearlyPrice = clerkPlan.annualFee?.amount
						? clerkPlan.annualFee.amount / 100
						: hardcodedPlan?.yearlyPrice ?? 0;

					return {
						name: clerkPlan.name,
						description:
							clerkPlan.description || hardcodedPlan?.description || "",
						price: monthlyPrice,
						yearlyPrice: yearlyPrice,
						buttonText: hardcodedPlan?.buttonText || "Get started",
						buttonVariant: (hardcodedPlan?.buttonVariant || "default") as
							| "default"
							| "outline",
						popular: hardcodedPlan?.popular,
						features: hardcodedPlan?.features || [],
						includes: hardcodedPlan?.includes || [],
						clerkPlanId: clerkPlan.id,
					} as const;
				});

			displayPlans.push(...(clerkDisplayPlans as typeof displayPlans));
		} else {
			// Fallback: if Clerk plans aren't loaded, show all hardcoded plans
			const businessPlan = plans.find((p) => p.name === "Business");
			if (businessPlan) {
				displayPlans.push(businessPlan);
			}
		}

		return displayPlans;
	};

	const displayPlans = getDisplayPlans();

	const handleGetStarted = () => {
		// Always redirect to sign-up page
		// Users can choose to sign in if they already have an account
		router.push("/sign-up");
	};

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
			className="not-prose relative flex w-full flex-col gap-8 sm:gap-12 bg-white px-4 py-12 sm:py-16 text-center sm:px-8 mx-auto dark:bg-gray-900"
			ref={pricingRef}
		>
			{/* Background gradient effects for visual appeal */}
			<div className="absolute inset-0 -z-10 overflow-hidden">
				<div className="absolute -top-[10%] left-[50%] h-[40%] w-[60%] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
				<div className="absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-3xl" />
				<div className="absolute -bottom-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-3xl" />
			</div>

			<div className="text-center mb-4 sm:mb-6 max-w-3xl mx-auto px-2">
				<TimelineContent
					as="h2"
					animationNum={0}
					timelineRef={pricingRef}
					customVariants={revealVariants}
					className="text-2xl sm:text-4xl md:text-6xl font-medium text-foreground mb-3 sm:mb-4"
				>
					Plans that work best for your{" "}
					<TimelineContent
						as="span"
						animationNum={1}
						timelineRef={pricingRef}
						customVariants={revealVariants}
						className="border border-dashed border-primary px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg sm:rounded-xl bg-primary/10 capitalize inline-block"
					>
						business
					</TimelineContent>
				</TimelineContent>

				<TimelineContent
					as="p"
					animationNum={2}
					timelineRef={pricingRef}
					customVariants={revealVariants}
					className="text-xs sm:text-sm md:text-base text-muted-foreground w-[90%] sm:w-[70%] mx-auto"
				>
					We help teams all around the world. Explore which option is right for
					you.
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

			<div className="grid grid-cols-1 md:grid-cols-2 max-w-5xl gap-4 sm:gap-6 py-4 sm:py-6 mx-auto px-2">
				{displayPlans.map((plan, index) => (
					<TimelineContent
						key={plan.name}
						as="div"
						animationNum={4 + index}
						timelineRef={pricingRef}
						customVariants={revealVariants}
					>
						<Card
							className={cn(
								"relative h-full transition-all duration-300",
								plan.popular
									? "ring-2 ring-primary bg-primary/5 border-primary/20"
									: "ring-1 ring-gray-300 dark:ring-gray-700 bg-gray-50/50 dark:bg-gray-800/30 border-gray-300 dark:border-gray-700 hover:ring-2 hover:ring-gray-400 dark:hover:ring-gray-600"
							)}
						>
							<CardHeader className="text-left p-4 sm:p-6">
								<div className="flex justify-between items-start">
									<h3 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
										{plan.name}
									</h3>
									{plan.popular && (
										<div>
											<span className="bg-primary text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap">
												Popular
											</span>
										</div>
									)}
								</div>
								<p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
									{plan.description}
								</p>
								<div className="flex items-baseline">
									<span className="text-3xl sm:text-4xl font-semibold text-foreground">
										$
										<AnimatedNumber
											value={isYearly ? plan.yearlyPrice : plan.price}
											className="text-3xl sm:text-4xl font-semibold"
											format={{
												style: "decimal",
												maximumFractionDigits: 0,
											}}
										/>
									</span>
									<span className="text-sm sm:text-base text-muted-foreground ml-1">
										/{isYearly ? "year" : "month"}
									</span>
								</div>
								{plan.price > 0 && (
									<p className="text-[10px] sm:text-xs text-muted-foreground mt-2">
										Per organization • Unlimited users included
									</p>
								)}
							</CardHeader>

							<CardContent className="pt-0 p-4 sm:p-6 sm:pt-0">
								<ul className="space-y-2 font-semibold py-4 sm:py-5 mt-4 sm:mt-6">
									{plan.features.map((feature, featureIndex) => (
										<li key={featureIndex} className="flex items-start">
											<span className="text-foreground grid place-content-center mt-0.5 mr-2 sm:mr-3 shrink-0 [&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-5 sm:[&>svg]:h-5">
												{feature.icon}
											</span>
											<span className="text-xs sm:text-sm text-muted-foreground text-left">
												{feature.text}
											</span>
										</li>
									))}
								</ul>

								{plan.includes.length > 0 && (
									<div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4 border-t border-border">
										<h4 className="font-medium text-sm sm:text-base text-foreground mb-2 sm:mb-3 text-left">
											{plan.includes[0]}
										</h4>
										<ul className="space-y-2 font-semibold">
											{plan.includes.slice(1).map((feature, featureIndex) => (
												<li key={featureIndex} className="flex items-start">
													<span className="h-5 w-5 sm:h-6 sm:w-6 bg-primary/10 border border-primary rounded-full grid place-content-center mt-0.5 mr-2 sm:mr-3 shrink-0">
														<CheckCheck className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
													</span>
													<span className="text-xs sm:text-sm text-muted-foreground text-left">
														{feature}
													</span>
												</li>
											))}
										</ul>
									</div>
								)}
							</CardContent>
						</Card>
					</TimelineContent>
				))}
			</div>

			{/* Single Get Started Button */}
			<TimelineContent
				as="div"
				animationNum={6}
				timelineRef={pricingRef}
				customVariants={revealVariants}
				className="flex justify-center mt-2 mb-8"
			>
				<StyledButton
					intent="primary"
					size="lg"
					className="px-16"
					onClick={handleGetStarted}
				>
					Get Started
				</StyledButton>
			</TimelineContent>
		</div>
	);
}
