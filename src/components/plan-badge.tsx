"use client";

import { useState } from "react";
import { useFeatureAccess } from "@/hooks/use-feature-access";
import { useRouter } from "next/navigation";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
	Crown,
	Users,
	FileSignature,
	Briefcase,
	ArrowUpRight,
	Loader2,
} from "lucide-react";
import { formatLimit, getUsagePercentage } from "@/lib/plan-limits";
import { motion } from "motion/react";

export function PlanBadge() {
	const [open, setOpen] = useState(false);
	const {
		hasPremiumAccess,
		planLimits,
		currentUsage,
		isLoading,
		hasOrganization,
	} = useFeatureAccess();
	const router = useRouter();

	// Don't show badge if no organization
	if (!hasOrganization && !isLoading) {
		return null;
	}

	if (isLoading) {
		return (
			<div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
				<Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
				<span className="text-xs font-medium text-muted-foreground">
					Loading...
				</span>
			</div>
		);
	}

	const planName = hasPremiumAccess ? "Business" : "Free";

	const handleUpgrade = () => {
		setOpen(false);
		router.push("/pricing");
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 ${
						hasPremiumAccess
							? "bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border-2 border-amber-500/30 hover:border-amber-500/50"
							: "bg-muted/50 border border-border/50 hover:border-border/70"
					}`}
				>
					{hasPremiumAccess ? (
						<Crown className="h-3.5 w-3.5 text-amber-500" />
					) : (
						<Users className="h-3.5 w-3.5 text-muted-foreground" />
					)}
					<span
						className={`text-xs font-semibold ${
							hasPremiumAccess
								? "text-amber-600 dark:text-amber-400"
								: "text-foreground"
						}`}
					>
						{planName}
					</span>
				</motion.button>
			</PopoverTrigger>
			<PopoverContent className="w-80 p-0" align="end">
				<div className="p-4 border-b border-border">
					<div className="flex items-center justify-between mb-2">
						<div className="flex items-center gap-2">
							{hasPremiumAccess ? (
								<Crown className="h-5 w-5 text-amber-500" />
							) : (
								<Users className="h-5 w-5 text-muted-foreground" />
							)}
							<h3 className="font-semibold text-foreground">{planName} Plan</h3>
						</div>
					</div>
					<p className="text-sm text-muted-foreground">
						{hasPremiumAccess
							? "Enjoy unlimited access to all features"
							: "You're on the free plan with limited features"}
					</p>
				</div>

				{/* Usage Stats for Free Plan */}
				{!hasPremiumAccess && currentUsage && (
					<div className="p-4 space-y-4">
						{/* Clients Usage */}
						<div className="space-y-2">
							<div className="flex items-center justify-between text-sm">
								<div className="flex items-center gap-2">
									<Briefcase className="h-4 w-4 text-muted-foreground" />
									<span className="font-medium">Clients</span>
								</div>
								<span className="text-muted-foreground">
									{currentUsage.clientsCount} /{" "}
									{formatLimit(planLimits.clients)}
								</span>
							</div>
							<Progress
								value={getUsagePercentage(
									currentUsage.clientsCount,
									planLimits.clients
								)}
								className="h-2"
							/>
						</div>

						{/* E-signatures Usage */}
						<div className="space-y-2">
							<div className="flex items-center justify-between text-sm">
								<div className="flex items-center gap-2">
									<FileSignature className="h-4 w-4 text-muted-foreground" />
									<span className="font-medium">E-signatures (monthly)</span>
								</div>
								<span className="text-muted-foreground">
									{currentUsage.esignaturesSentThisMonth} /{" "}
									{formatLimit(planLimits.esignaturesPerMonth)}
								</span>
							</div>
							<Progress
								value={getUsagePercentage(
									currentUsage.esignaturesSentThisMonth,
									planLimits.esignaturesPerMonth
								)}
								className="h-2"
							/>
						</div>

						{/* Upgrade CTA */}
						<Button
							onClick={handleUpgrade}
							className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
						>
							Upgrade to Business
							<ArrowUpRight className="h-4 w-4 ml-2" />
						</Button>
					</div>
				)}

				{/* Premium Plan Features */}
				{hasPremiumAccess && (
					<div className="p-4 space-y-3">
						<div className="space-y-2 text-sm">
							<div className="flex items-center gap-2 text-muted-foreground">
								<span className="text-green-500">✓</span>
								<span>Unlimited clients</span>
							</div>
							<div className="flex items-center gap-2 text-muted-foreground">
								<span className="text-green-500">✓</span>
								<span>Unlimited projects</span>
							</div>
							<div className="flex items-center gap-2 text-muted-foreground">
								<span className="text-green-500">✓</span>
								<span>Unlimited e-signatures</span>
							</div>
							<div className="flex items-center gap-2 text-muted-foreground">
								<span className="text-green-500">✓</span>
								<span>Custom SKUs</span>
							</div>
							<div className="flex items-center gap-2 text-muted-foreground">
								<span className="text-green-500">✓</span>
								<span>Organization documents</span>
							</div>
							<div className="flex items-center gap-2 text-muted-foreground">
								<span className="text-green-500">✓</span>
								<span>AI import</span>
							</div>
						</div>

						{/* Manage Subscription Button */}
						<Button
							onClick={() => {
								// Link to Clerk account portal
								window.open(
									"https://accounts.clerk.com/user/billing",
									"_blank"
								);
							}}
							className="w-full border border-border bg-background hover:bg-accent"
						>
							Manage Subscription
						</Button>
					</div>
				)}
			</PopoverContent>
		</Popover>
	);
}
