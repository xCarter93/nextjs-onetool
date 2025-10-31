"use client";

import { Briefcase, CheckCheck, Database, Server } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { TimelineContent } from "@/components/shared/timeline-animation";
import { StyledButton } from "@/components/ui/styled/styled-button";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

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
		],
		includes: [],
	},
	{
		name: "Business",
		description:
			"Best value for growing businesses that need advanced features and unlimited access",
		price: 120,
		yearlyPrice: 1200,
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
							className="absolute top-0 left-0 sm:h-12 h-10 w-full rounded-full border-4 shadow-sm shadow-primary border-primary bg-gradient-to-t from-primary via-primary/80 to-primary"
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
							className="absolute top-0 left-0 sm:h-12 h-10 w-full rounded-full border-4 shadow-sm shadow-primary border-primary bg-gradient-to-t from-primary via-primary/80 to-primary"
							transition={{ type: "spring", stiffness: 500, damping: 30 }}
						/>
					)}
					<span className="relative flex items-center gap-2">
						Yearly
						<span className="rounded-full bg-white dark:bg-gray-900 px-2 py-0.5 text-xs font-medium text-primary border border-primary/20">
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
	const { isLoaded, userId } = useAuth();
	const router = useRouter();
	const toast = useToast();

	useEffect(() => {
		setMounted(true);
	}, []);

	const handlePlanSelection = async (planName: string) => {
		// Check if user is authenticated
		if (!isLoaded) {
			return;
		}

		if (!userId) {
			// Redirect to sign-in with return to pricing
			router.push("/sign-in?redirect_url=/pricing");
			return;
		}

		// Handle plan selection based on plan type
		if (planName === "Free") {
			// User is authenticated and selecting free plan
			toast.success("Already on Free Plan", "You're already on the free plan!");
			router.push("/home");
		} else if (planName === "Business") {
			// User is authenticated and wants to upgrade
			// This will be handled by Clerk's checkout flow
			// For now, we'll show a message and redirect to home
			// In production, you'd call Clerk's checkout API here
			toast.info(
				"Coming Soon",
				"Business plan checkout coming soon! Contact support to upgrade."
			);

			// Example of how to trigger Clerk checkout (to be implemented):
			// await clerk.checkout({ planId: 'onetool_business_plan' });
		}
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
			className="not-prose relative flex w-full flex-col gap-16 overflow-hidden bg-white px-4 py-24 text-center sm:px-8 min-h-screen mx-auto dark:bg-gray-900"
			ref={pricingRef}
		>
			{/* Background gradient effects for visual appeal */}
			<div className="absolute inset-0 -z-10 overflow-hidden">
				<div className="absolute -top-[10%] left-[50%] h-[40%] w-[60%] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
				<div className="absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-3xl" />
				<div className="absolute -bottom-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-3xl" />
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
						className="border border-dashed border-primary px-2 py-1 rounded-xl bg-primary/10 capitalize inline-block"
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

			<div className="grid md:grid-cols-2 max-w-5xl gap-6 py-6 mx-auto">
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
								"relative h-full transition-all duration-300",
								plan.popular
									? "ring-2 ring-primary bg-primary/5 border-primary/20"
									: "ring-1 ring-gray-300 dark:ring-gray-700 bg-gray-50/50 dark:bg-gray-800/30 border-gray-300 dark:border-gray-700 hover:ring-2 hover:ring-gray-400 dark:hover:ring-gray-600"
							)}
						>
							<CardHeader className="text-left">
								<div className="flex justify-between">
									<h3 className="text-3xl font-semibold text-foreground mb-2">
										{plan.name}
									</h3>
									{plan.popular && (
										<div className="">
											<span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
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
								<div className="flex justify-center mb-6">
									<StyledButton
										intent={plan.popular ? "primary" : "secondary"}
										size="lg"
										className="px-12"
										onClick={() => handlePlanSelection(plan.name)}
										disabled={!isLoaded}
									>
										{plan.buttonText}
									</StyledButton>
								</div>
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

								{plan.includes.length > 0 && (
									<div className="space-y-3 pt-4 border-t border-border">
										<h4 className="font-medium text-base text-foreground mb-3">
											{plan.includes[0]}
										</h4>
										<ul className="space-y-2 font-semibold">
											{plan.includes.slice(1).map((feature, featureIndex) => (
												<li key={featureIndex} className="flex items-center">
													<span className="h-6 w-6 bg-primary/10 border border-primary rounded-full grid place-content-center mt-0.5 mr-3">
														<CheckCheck className="h-4 w-4 text-primary" />
													</span>
													<span className="text-sm text-muted-foreground">
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
		</div>
	);
}
