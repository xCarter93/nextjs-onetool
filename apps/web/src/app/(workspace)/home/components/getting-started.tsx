"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@onetool/backend/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface JourneyProgress {
	hasOrganization: boolean;
	hasClient: boolean;
	hasProject: boolean;
	hasQuote: boolean;
	hasESignature: boolean;
	hasInvoice: boolean;
	hasStripeConnect: boolean;
	hasPayment: boolean;
}

interface JourneyStep {
	id: number;
	title: string;
	description: string;
	completionKey: keyof JourneyProgress;
}

const journeySteps: JourneyStep[] = [
	{
		id: 1,
		title: "Create your Organization",
		description:
			"Complete your organization setup and customize OneTool for your business.",
		completionKey: "hasOrganization",
	},
	{
		id: 2,
		title: "Create Your First Client",
		description: "Add a client to manage their projects and services.",
		completionKey: "hasClient",
	},
	{
		id: 3,
		title: "Create Your First Project",
		description: "Set up a project to organize tasks and track progress.",
		completionKey: "hasProject",
	},
	{
		id: 4,
		title: "Create Your First Quote",
		description: "Create and send professional quotes with PDF generation.",
		completionKey: "hasQuote",
	},
	{
		id: 5,
		title: "Send Your First E-Signature Request",
		description: "Send documents for e-signature using BoldSign integration.",
		completionKey: "hasESignature",
	},
	{
		id: 6,
		title: "Create Your First Invoice",
		description: "Generate and send invoices to your clients.",
		completionKey: "hasInvoice",
	},
	{
		id: 7,
		title: "Set up your Stripe Connect Account",
		description: "Connect your Stripe account to accept online payments.",
		completionKey: "hasStripeConnect",
	},
	{
		id: 8,
		title: "Collect Your First Payment",
		description: "Receive your first payment from a client.",
		completionKey: "hasPayment",
	},
];

// Custom hook for mobile detection
const useIsMobile = (breakpoint: number = 768): boolean => {
	const [isMobile, setIsMobile] = React.useState<boolean>(false);

	React.useEffect(() => {
		if (typeof window === "undefined") return;
		const checkScreenSize = (): void =>
			setIsMobile(window.innerWidth < breakpoint);

		checkScreenSize();
		window.addEventListener("resize", checkScreenSize);
		return () => window.removeEventListener("resize", checkScreenSize);
	}, [breakpoint]);

	return isMobile;
};

export default function GettingStarted() {
	const journeyProgress = useQuery(api.homeStats.getJourneyProgress);
	const [activeIndex, setActiveIndex] = React.useState(0);
	const isMobile = useIsMobile();

	const containerRadius = isMobile ? 160 : 240;
	const iconSize = isMobile ? 56 : 64;
	const containerSize = containerRadius * 2 + 100;

	// Calculate rotation for each step
	const getRotation = React.useCallback(
		(index: number): number =>
			(index - activeIndex) * (360 / journeySteps.length),
		[activeIndex]
	);

	// Navigation
	const next = React.useCallback(() => {
		setActiveIndex((i) => (i + 1) % journeySteps.length);
	}, []);

	const prev = React.useCallback(() => {
		setActiveIndex((i) => (i - 1 + journeySteps.length) % journeySteps.length);
	}, []);

	const handleStepClick = React.useCallback(
		(index: number) => {
			if (index === activeIndex) return;
			setActiveIndex(index);
		},
		[activeIndex]
	);

	// Keyboard navigation
	React.useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent): void => {
			if (event.key === "ArrowLeft") prev();
			else if (event.key === "ArrowRight") next();
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [prev, next]);

	if (!journeyProgress) {
		return <GettingStartedSkeleton />;
	}

	const currentStep = journeySteps[activeIndex];
	const isCurrentCompleted =
		journeyProgress[currentStep.completionKey as keyof typeof journeyProgress];

	return (
		<Card className="group relative backdrop-blur-md overflow-hidden ring-1 ring-border/20 dark:ring-border/40">
			{/* Glass morphism overlay */}
			<div className="absolute inset-0 bg-linear-to-br from-white/10 via-white/5 to-transparent dark:from-white/5 dark:via-white/2 dark:to-transparent rounded-2xl" />
			<CardContent className="relative z-10">
				<div className="flex items-center gap-3 mb-4">
					<div className="w-1.5 h-6 bg-linear-to-b from-primary to-primary/60 rounded-full" />
					<h2 className="text-lg font-semibold text-foreground tracking-tight">
						Your Journey
					</h2>
				</div>
				<p className="mt-2 text-sm text-muted-foreground leading-relaxed">
					Complete these steps to get the most out of OneTool and streamline
					your business operations.
				</p>

				{/* Orbiting Carousel */}
				<div className="flex flex-col items-center mt-8 relative min-h-[600px]">
					<div
						className="relative flex items-center justify-center"
						style={{ width: containerSize, height: containerSize }}
					>
						{/* Single orbit circle */}
						<div
							className="absolute rounded-full border-4 border-dashed border-border/70 dark:border-border/50"
							style={{
								width: containerRadius * 2,
								height: containerRadius * 2,
								top: "50%",
								left: "50%",
								transform: "translate(-50%, -50%)",
							}}
						/>

						{/* Active Step Card - Center */}
						<AnimatePresence mode="wait">
							<motion.div
								key={currentStep.id}
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.95 }}
								transition={{
									duration: 0.3,
									ease: "easeInOut",
								}}
								className="z-10 bg-card/80 backdrop-blur-sm shadow-xl rounded-xl p-4 md:p-6 w-56 md:w-64 text-center border border-border"
							>
								<motion.div
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ duration: 0.3, delay: 0.1 }}
									className="flex justify-center -mt-12 md:-mt-14"
								>
									<div
										className={`flex size-20 md:size-24 items-center justify-center rounded-full border-4 border-card shadow-lg transition-all duration-300 ${
											isCurrentCompleted
												? "bg-green-600 dark:bg-green-500"
												: "bg-primary"
										}`}
									>
										<span className="text-2xl md:text-3xl font-bold text-white">
											{currentStep.id}
										</span>
									</div>
								</motion.div>
								<motion.div
									initial={{ opacity: 0, y: 5 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3, delay: 0.15 }}
								>
									<h3 className="mt-4 text-base md:text-lg font-bold text-foreground">
										{currentStep.title}
									</h3>
									<p className="mt-2 text-xs md:text-sm text-muted-foreground">
										{currentStep.description}
									</p>
								</motion.div>
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.3, delay: 0.2 }}
									className="flex justify-center items-center mt-4 space-x-2"
								>
									<button
										onClick={prev}
										className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
										aria-label="Previous step"
									>
										<ChevronLeft size={18} className="text-foreground" />
									</button>
									<div className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary font-medium">
										{activeIndex + 1} / {journeySteps.length}
									</div>
									<button
										onClick={next}
										className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
										aria-label="Next step"
									>
										<ChevronRight size={18} className="text-foreground" />
									</button>
								</motion.div>
							</motion.div>
						</AnimatePresence>

						{/* Orbiting Step Icons with Counter-Rotation */}
						{journeySteps.map((step, i) => {
							const rotation = getRotation(i);
							const isCompleted =
								journeyProgress[
									step.completionKey as keyof typeof journeyProgress
								];
							return (
								<motion.div
									key={step.id}
									animate={{
										transform: `rotate(${rotation}deg) translateY(-${containerRadius}px)`,
									}}
									transition={{
										duration: 0.8,
										ease: [0.34, 1.56, 0.64, 1],
									}}
									style={{
										width: iconSize,
										height: iconSize,
										position: "absolute",
										top: `calc(50% - ${iconSize / 2}px)`,
										left: `calc(50% - ${iconSize / 2}px)`,
									}}
								>
									{/* Counter-rotation to keep icon upright */}
									<motion.div
										animate={{ rotate: -rotation }}
										transition={{
											duration: 0.8,
											ease: [0.34, 1.56, 0.64, 1],
										}}
										className="w-full h-full"
									>
										<motion.div
											onClick={() => handleStepClick(i)}
											whileHover={{ scale: 1.1 }}
											whileTap={{ scale: 0.95 }}
											className={`w-full h-full flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 ${
												i === activeIndex
													? "border-4 border-primary shadow-lg"
													: "border-2 border-border hover:border-primary/60"
											} ${
												isCompleted
													? "bg-green-600 dark:bg-green-500"
													: "bg-primary/90"
											}`}
										>
											<span className="text-base md:text-lg font-bold text-white">
												{step.id}
											</span>
										</motion.div>
									</motion.div>
								</motion.div>
							);
						})}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

function GettingStartedSkeleton() {
	return (
		<Card className="group relative backdrop-blur-md overflow-hidden ring-1 ring-border/20 dark:ring-border/40">
			<div className="absolute inset-0 bg-linear-to-br from-white/10 via-white/5 to-transparent dark:from-white/5 dark:via-white/2 dark:to-transparent rounded-2xl" />
			<CardContent className="relative z-10">
				<div className="flex items-center gap-3 mb-4">
					<div className="w-1.5 h-6 bg-linear-to-b from-primary to-primary/60 rounded-full" />
					<Skeleton className="h-6 w-32" />
				</div>
				<Skeleton className="h-4 w-full max-w-md" />

				{/* Carousel skeleton */}
				<div className="flex flex-col items-center mt-8 min-h-[600px] md:min-h-[700px]">
					<div className="relative flex items-center justify-center w-full h-full">
						<Skeleton className="w-64 h-96 rounded-xl" />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
