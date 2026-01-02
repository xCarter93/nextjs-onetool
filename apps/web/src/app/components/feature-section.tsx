"use client";

import {
	AnimatePresence,
	motion,
	useMotionValue,
	useTransform,
	useMotionValueEvent,
} from "framer-motion";
import {
	Briefcase,
	Calendar,
	CreditCard,
	FileText,
	Mail,
	Shield,
	Smartphone,
	Users,
} from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { StyledButton } from "@/components/ui/styled/styled-button";

// --- Widgets ---

function ClientWidget() {
	return (
		<div className="w-full p-4">
			<div className="space-y-3">
				{[1, 2, 3].map((i) => (
					<div
						key={i}
						className="flex items-center gap-3 p-2 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50"
					>
						<div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
							<div className="h-4 w-4 bg-blue-500 rounded-full opacity-50" />
						</div>
						<div className="flex-1 space-y-1.5">
							<div className="h-2 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
							<div className="h-1.5 w-12 bg-gray-100 dark:bg-gray-800 rounded-full" />
						</div>
						<div
							className={`h-2 w-2 rounded-full ${
								i === 1 ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
							}`}
						/>
					</div>
				))}
			</div>
		</div>
	);
}

function ProjectWidget() {
	return (
		<div className="w-full p-4 flex flex-col justify-center h-full gap-4">
			{/* Project A */}
			<div className="space-y-1.5">
				<div className="flex justify-between items-center px-1">
					<div className="text-[10px] font-semibold text-gray-600 dark:text-gray-300">
						Smith Residence Reno
					</div>
					<div className="text-[9px] font-medium text-gray-400">75%</div>
				</div>
				<div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
					<div className="h-full w-3/4 bg-indigo-500 rounded-full" />
				</div>
			</div>

			{/* Project B */}
			<div className="space-y-1.5">
				<div className="flex justify-between items-center px-1">
					<div className="text-[10px] font-semibold text-gray-600 dark:text-gray-300">
						Office HVAC Install
					</div>
					<div className="text-[9px] font-medium text-gray-400">30%</div>
				</div>
				<div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
					<div className="h-full w-[30%] bg-purple-500 rounded-full" />
				</div>
			</div>

			{/* Project C */}
			<div className="space-y-1.5">
				<div className="flex justify-between items-center px-1">
					<div className="text-[10px] font-semibold text-gray-600 dark:text-gray-300">
						Downtown Lawn Service
					</div>
					<div className="text-[9px] font-medium text-gray-400">90%</div>
				</div>
				<div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
					<div className="h-full w-[90%] bg-green-500 rounded-full" />
				</div>
			</div>
		</div>
	);
}

function InvoiceWidget() {
	return (
		<div className="w-full h-full flex items-center justify-center p-4">
			<div className="w-32 bg-white dark:bg-gray-900 rounded-sm shadow-sm border border-gray-200 dark:border-gray-700 p-3 space-y-2 transform rotate-[-4deg]">
				<div className="flex justify-between items-center">
					<div className="h-2 w-8 bg-gray-300 dark:bg-gray-600 rounded-sm" />
					<div className="h-2 w-2 bg-gray-200 dark:bg-gray-700 rounded-full" />
				</div>
				<div className="space-y-1 py-1">
					<div className="h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full" />
					<div className="h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full" />
					<div className="h-1 w-2/3 bg-gray-100 dark:bg-gray-800 rounded-full" />
				</div>
				<div className="pt-1 border-t border-gray-100 dark:border-gray-800 flex justify-between">
					<div className="h-1.5 w-6 bg-gray-200 dark:bg-gray-700 rounded-full" />
					<div className="h-1.5 w-8 bg-green-500/20 rounded-full" />
				</div>
			</div>
		</div>
	);
}

function TaskWidget() {
	return (
		<div className="w-full p-4 flex gap-3 h-full">
			<div className="flex-1 flex flex-col gap-2">
				<div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
					To Do
				</div>
				<div className="p-2 rounded bg-white/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 space-y-1">
					<div className="h-1.5 w-12 bg-orange-200 dark:bg-orange-900/50 rounded-full" />
					<div className="h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full" />
				</div>
				<div className="p-2 rounded bg-white/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 space-y-1">
					<div className="h-1.5 w-16 bg-orange-300 dark:bg-orange-800/50 rounded-full" />
				</div>
			</div>
			<div className="flex-1 flex flex-col gap-2">
				<div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
					Done
				</div>
				<div className="p-2 rounded bg-white/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 space-y-1 opacity-60">
					<div className="h-1.5 w-10 bg-green-200 dark:bg-green-900/50 rounded-full" />
					<div className="h-1 w-16 bg-gray-100 dark:bg-gray-800 rounded-full" />
				</div>
			</div>
		</div>
	);
}

function MobileWidget() {
	return (
		<div className="w-full h-full flex items-center justify-center p-2">
			<div className="w-24 h-40 border-4 border-gray-800 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-3xl overflow-hidden relative">
				<div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-3 bg-gray-800 dark:bg-gray-700 rounded-b-lg" />
				<div className="grid grid-cols-2 gap-2 p-3 pt-6">
					<div className="aspect-square bg-purple-100 dark:bg-purple-900/20 rounded-lg" />
					<div className="aspect-square bg-blue-100 dark:bg-blue-900/20 rounded-lg" />
					<div className="aspect-square bg-green-100 dark:bg-green-900/20 rounded-lg" />
					<div className="aspect-square bg-orange-100 dark:bg-orange-900/20 rounded-lg" />
				</div>
			</div>
		</div>
	);
}

function StripeWidget() {
	return (
		<div className="w-full h-full flex flex-col justify-center items-center p-4">
			<div className="w-full max-w-[180px] bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-3 transform transition-transform group-hover:-translate-y-1">
				<div className="flex items-center justify-between mb-3">
					<div className="h-1.5 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
					<div className="h-3 w-3 bg-green-500 rounded-full" />
				</div>
				<div className="space-y-1.5">
					<div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded" />
					<div className="h-1.5 w-2/3 bg-gray-100 dark:bg-gray-800 rounded" />
				</div>
				<div className="mt-3 flex justify-between items-center">
					<div className="text-sm font-bold text-gray-900 dark:text-white">
						$1.2k
					</div>
					<div className="h-5 w-12 bg-blue-600 rounded text-[8px] flex items-center justify-center text-white font-medium">
						Pay
					</div>
				</div>
			</div>
		</div>
	);
}

function EmailWidget() {
	return (
		<div className="w-full h-full flex flex-col justify-center items-center p-4">
			<div className="w-full max-w-[180px] bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
				<div className="border-b border-gray-100 dark:border-gray-800 p-2 bg-gray-50/50 dark:bg-gray-800/50 flex items-center gap-1.5">
					<div className="w-1.5 h-1.5 rounded-full bg-red-400" />
					<div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
					<div className="w-1.5 h-1.5 rounded-full bg-green-400" />
				</div>
				<div className="p-2 space-y-1.5">
					{[1, 2].map((i) => (
						<div
							key={i}
							className={`flex items-center gap-2 p-1.5 rounded ${
								i === 2 ? "bg-purple-50 dark:bg-purple-900/20" : ""
							}`}
						>
							<div className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
							<div className="flex-1 min-w-0">
								<div className="h-1 w-10 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
								<div className="h-1 w-full bg-gray-100 dark:bg-gray-800 rounded" />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

function RBACWidget() {
	return (
		<div className="w-full h-full flex flex-col justify-center items-center p-4">
			<div className="flex items-center gap-3">
				<div className="relative group/admin">
					<div className="relative bg-white dark:bg-gray-900 border border-blue-200 dark:border-blue-800 rounded-lg p-2 shadow-sm transform transition-transform hover:scale-110">
						<div className="flex items-center gap-1.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400">
							<Shield className="w-3 h-3" /> Admin
						</div>
					</div>
				</div>
				<div className="relative group/emp">
					<div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2 shadow-sm transform transition-transform hover:scale-110 opacity-60">
						<div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-600 dark:text-gray-400">
							<Users className="w-3 h-3" /> Staff
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

// Color styles mapping
const colorStyles = {
	blue: {
		gradient:
			"from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent",
		iconBg: "bg-blue-500/10",
		iconText: "text-blue-600 dark:text-blue-400",
		cardBorder: "border-blue-100 dark:border-blue-900/50",
		cardBg: "bg-blue-50/50 dark:bg-blue-900/10",
		titleText: "text-blue-900 dark:text-blue-100",
	},
	indigo: {
		gradient:
			"from-indigo-50/50 to-transparent dark:from-indigo-900/10 dark:to-transparent",
		iconBg: "bg-indigo-500/10",
		iconText: "text-indigo-600 dark:text-indigo-400",
		cardBorder: "border-indigo-100 dark:border-indigo-900/50",
		cardBg: "bg-indigo-50/50 dark:bg-indigo-900/10",
		titleText: "text-indigo-900 dark:text-indigo-100",
	},
	green: {
		gradient:
			"from-green-50/50 to-transparent dark:from-green-900/10 dark:to-transparent",
		iconBg: "bg-green-500/10",
		iconText: "text-green-600 dark:text-green-400",
		cardBorder: "border-green-100 dark:border-green-900/50",
		cardBg: "bg-green-50/50 dark:bg-green-900/10",
		titleText: "text-green-900 dark:text-green-100",
	},
	orange: {
		gradient:
			"from-orange-50/50 to-transparent dark:from-orange-900/10 dark:to-transparent",
		iconBg: "bg-orange-500/10",
		iconText: "text-orange-600 dark:text-orange-400",
		cardBorder: "border-orange-100 dark:border-orange-900/50",
		cardBg: "bg-orange-50/50 dark:bg-orange-900/10",
		titleText: "text-orange-900 dark:text-orange-100",
	},
	purple: {
		gradient:
			"from-purple-50/50 to-transparent dark:from-purple-900/10 dark:to-transparent",
		iconBg: "bg-purple-500/10",
		iconText: "text-purple-600 dark:text-purple-400",
		cardBorder: "border-purple-100 dark:border-purple-900/50",
		cardBg: "bg-purple-50/50 dark:bg-purple-900/10",
		titleText: "text-purple-900 dark:text-purple-100",
	},
	red: {
		gradient:
			"from-red-50/50 to-transparent dark:from-red-900/10 dark:to-transparent",
		iconBg: "bg-red-500/10",
		iconText: "text-red-600 dark:text-red-400",
		cardBorder: "border-red-100 dark:border-red-900/50",
		cardBg: "bg-red-50/50 dark:bg-red-900/10",
		titleText: "text-red-900 dark:text-red-100",
	},
	gray: {
		gradient:
			"from-gray-50/50 to-transparent dark:from-gray-900/10 dark:to-transparent",
		iconBg: "bg-gray-500/10",
		iconText: "text-gray-600 dark:text-gray-400",
		cardBorder: "border-gray-100 dark:border-gray-900/50",
		cardBg: "bg-gray-50/50 dark:bg-gray-900/10",
		titleText: "text-gray-900 dark:text-gray-100",
	},
} as const;

type ColorKey = keyof typeof colorStyles;

const features = [
	{
		title: "Client Management",
		description: "Keep detailed client profiles & history.",
		details:
			"Store comprehensive client data including contact info, service history, and communication logs. Never miss a follow-up with automated reminders.",
		icon: Users,
		widget: <ClientWidget />,
		color: "blue" as ColorKey,
	},
	{
		title: "Project Tracking",
		description: "Track status, deadlines, and progress.",
		details:
			"Visual Kanban boards and list views help you manage projects from lead to completion. Track time, expenses, and milestones in real-time.",
		icon: Briefcase,
		widget: <ProjectWidget />,
		color: "indigo" as ColorKey,
	},
	{
		title: "Quoting & Invoicing",
		description: "Create quotes and invoices instantly.",
		details:
			"Generate professional estimates and invoices in seconds. Accept credit cards and bank transfers directly through the secure client portal.",
		icon: FileText,
		widget: <InvoiceWidget />,
		color: "green" as ColorKey,
	},
	{
		title: "Task Scheduling",
		description: "Smart scheduling and reminders.",
		details:
			"Use the calendar view to keep tasks top of mind. Assignment and recurring tasks are also available to help stay on top of recurring items that need to be addressed.",
		icon: Calendar,
		widget: <TaskWidget />,
		color: "orange" as ColorKey,
	},
	{
		title: "Mobile Access",
		description: "Work from anywhere, anytime.",
		details:
			"Developed with mobile first in mind so you can access the site directly from your phone to continue pushing projects further.",
		icon: Smartphone,
		widget: <MobileWidget />,
		color: "purple" as ColorKey,
	},
	{
		title: "Stripe Connect",
		description: "Collect payments automatically.",
		details:
			"Integrated payments mean faster cash flow. set up recurring billing, deposits, and instant payouts to your bank account via Stripe.",
		icon: CreditCard,
		widget: <StripeWidget />,
		color: "blue" as ColorKey,
	},
	{
		title: "Email Hub",
		description: "Unified communication center.",
		details:
			"Draft and respond to email threads directly within OneTool so you don't need to jump between multiple platforms.",
		icon: Mail,
		widget: <EmailWidget />,
		color: "purple" as ColorKey,
	},
	{
		title: "Role-Based Access",
		description: "Secure permissions for your team.",
		details:
			"Distinct views between admins and employees ensure admins have a full view while employees can see only what they need.",
		icon: Shield,
		widget: <RBACWidget />,
		color: "red" as ColorKey,
	},
];

const CARD_WIDTH = 320; // w-80 = 20rem = 320px
const CARD_HEIGHT = 320; // h-80
const ORBIT_RADIUS_X = 500; // Wider orbit
const ORBIT_RADIUS_Z = 200; // Depth of orbit

function FeatureCard({
	feature,
	index,
	rotation,
	total,
}: {
	feature: (typeof features)[0];
	index: number;
	rotation: any;
	total: number;
}) {
	const styles = colorStyles[feature.color] || colorStyles.gray;
	const angleStep = 360 / total;
	const baseAngle = index * angleStep;

	const transform = useTransform(rotation, (r: number) => {
		const currentAngle = (baseAngle + r) * (Math.PI / 180);

		// Calculate orbital position (0° = front, 180° = back)
		const x = Math.sin(currentAngle) * ORBIT_RADIUS_X;
		const z = Math.cos(currentAngle) * ORBIT_RADIUS_Z;
		const normalizedZ = Math.cos(currentAngle);

		// Scale cards based on depth (front = 1.0, back = 0.6)
		const scale = 0.6 + ((normalizedZ + 1) / 2) * 0.4;

		return `translateX(${x}px) translateZ(${z}px) scale(${scale})`;
	});

	const zIndex = useTransform(rotation, (r: number) => {
		const currentAngle = (baseAngle + r) * (Math.PI / 180);
		const normalizedZ = Math.cos(currentAngle);
		return Math.round((normalizedZ + 1) * 100);
	});

	return (
		<motion.div
			style={{
				transform,
				zIndex,
				position: "absolute",
				width: CARD_WIDTH,
				height: CARD_HEIGHT,
				left: "50%",
				top: "50%",
				marginLeft: -CARD_WIDTH / 2,
				marginTop: -CARD_HEIGHT / 2,
			}}
			className="overflow-hidden rounded-3xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors"
		>
			<div className="absolute inset-0 flex flex-col">
				<div className="flex-1 relative overflow-hidden">
					<div
						className={`absolute inset-0 bg-linear-to-b ${styles.gradient} opacity-50`}
					/>
					<div className="relative z-10 h-full w-full">{feature.widget}</div>
				</div>

				<div className="relative z-20 p-6 bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm border-t border-gray-100 dark:border-gray-800">
					<div className="flex items-center gap-3 mb-3">
						<div
							className={`p-2 rounded-xl ${styles.iconBg} ${styles.iconText}`}
						>
							<feature.icon className="w-5 h-5" />
						</div>
						<h3 className="font-semibold text-gray-900 dark:text-white text-base">
							{feature.title}
						</h3>
					</div>
					{/* Description removed from card, shown in center focus area instead */}
				</div>
			</div>
		</motion.div>
	);
}

export default function FeatureSection() {
	const [activeFeature, setActiveFeature] = useState<(typeof features)[0]>(
		features[0]
	);

	const rotation = useMotionValue(0);

	// Animate rotation
	useEffect(() => {
		let lastTime = performance.now();
		let animationFrame: number;

		const loop = (time: number) => {
			const delta = time - lastTime;
			const speed = 0.005; // slower rotation speed
			rotation.set(rotation.get() + delta * speed);
			lastTime = time;
			animationFrame = requestAnimationFrame(loop);
		};

		animationFrame = requestAnimationFrame(loop);

		return () => cancelAnimationFrame(animationFrame);
	}, [rotation]);

	// Detect which feature is closest to the front (angle 0) and set as active
	useMotionValueEvent(rotation, "change", (latest) => {
		const step = 360 / features.length;
		let closestIndex = 0;
		let minDist = 360;

		features.forEach((_, i) => {
			const itemAngle = (i * step + latest) % 360;
			const dist = Math.min(Math.abs(itemAngle), Math.abs(itemAngle - 360));
			if (dist < minDist) {
				minDist = dist;
				closestIndex = i;
			}
		});

		if (features[closestIndex] !== activeFeature) {
			setActiveFeature(features[closestIndex]);
		}
	});

	return (
		<div className="bg-white py-24 sm:py-32 dark:bg-gray-900 min-h-[900px] flex flex-col justify-center relative overflow-hidden">
			<div className="mx-auto max-w-7xl px-6 lg:px-8 mb-8 relative z-30">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
					className="text-center"
				>
					<h2 className="text-base/7 font-semibold text-primary">
						Streamline operations
					</h2>
					<p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-950 sm:text-5xl dark:text-white">
						Every Business, Every Stage, OneTool.
					</p>
					<p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
						From client management to invoicing, OneTool provides a complete
						solution for small business professionals.
					</p>
				</motion.div>
			</div>

			{/* Orbiting Carousel */}
			<div className="relative w-full h-[600px] flex items-center justify-center perspective-1000">
				{/* Fade Gradients */}
				<div className="pointer-events-none absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-white dark:from-gray-900 z-10" />
				<div className="pointer-events-none absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-white dark:from-gray-900 z-10" />

				<div className="relative w-full h-full max-w-5xl mx-auto perspective-[1000px]">
					{features.map((feature, idx) => (
						<FeatureCard
							key={idx}
							feature={feature}
							index={idx}
							rotation={rotation}
							total={features.length}
						/>
					))}
				</div>
			</div>

			{/* Info Card Area */}
			<div className="h-48 mx-auto max-w-3xl px-6 relative flex items-center justify-center z-30 -mt-20">
				<AnimatePresence mode="wait">
					{activeFeature ? (
						<motion.div
							key={activeFeature.title}
							initial={{ opacity: 0, y: 20, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: -20, scale: 0.95 }}
							transition={{ duration: 0.4 }}
							className={`rounded-2xl border ${
								colorStyles[activeFeature.color || "gray"].cardBorder
							} ${
								colorStyles[activeFeature.color || "gray"].cardBg
							} p-6 text-center shadow-lg backdrop-blur-md bg-white/80 dark:bg-gray-900/80`}
						>
							<h4
								className={`text-2xl font-bold ${
									colorStyles[activeFeature.color || "gray"].titleText
								} mb-3`}
							>
								{activeFeature.title}
							</h4>
							<p className="text-base text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
								{activeFeature.details}
							</p>
						</motion.div>
					) : null}
				</AnimatePresence>
			</div>
		</div>
	);
}
