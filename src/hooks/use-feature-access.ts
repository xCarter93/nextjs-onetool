"use client";

import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { getPlanLimits } from "@/lib/plan-limits";
import type { PlanLimits } from "@/lib/plan-limits";
import type { UsageStats } from "../../convex/usage";

export interface FeatureAccess {
	hasOrganization: boolean;
	hasPremiumAccess: boolean;
	planLimits: PlanLimits;
	currentUsage: UsageStats | null;
	isLoading: boolean;
}

/**
 * Hook to check user's feature access and plan limits
 *
 * Uses Clerk's has() method to check for premium_feature_access
 * and combines it with usage data from Convex
 */
export function useFeatureAccess(): FeatureAccess {
	const { has, isLoaded } = useAuth();
	const usage = useQuery(api.usage.getCurrentUsage);

	// Check if user has an organization and premium access
	const hasOrganization = has ? has({ role: "org:member" }) : false;
	const hasPremiumAccess = has
		? has({ feature: "premium_feature_access" })
		: false;

	// Get plan limits based on premium access
	const planLimits = getPlanLimits(hasPremiumAccess);

	return {
		hasOrganization,
		hasPremiumAccess,
		planLimits,
		currentUsage: usage || null,
		isLoading: !isLoaded || usage === undefined,
	};
}

/**
 * Hook to check if a specific feature is available
 */
export function useHasFeature(feature: string): boolean {
	const { has, isLoaded } = useAuth();

	if (!isLoaded) {
		return false;
	}

	return has ? has({ feature }) : false;
}

/**
 * Hook to check if user can perform an action based on limits
 */
export function useCanPerformAction(
	action: "create_client" | "create_project" | "send_esignature"
): {
	canPerform: boolean;
	reason?: string;
	currentUsage?: number;
	limit?: number | "unlimited";
} {
	const { hasPremiumAccess, planLimits, currentUsage, isLoading } =
		useFeatureAccess();

	if (isLoading || !currentUsage) {
		return { canPerform: false, reason: "Loading..." };
	}

	// Premium users can always perform actions
	if (hasPremiumAccess) {
		return { canPerform: true };
	}

	// Check limits for free users
	switch (action) {
		case "create_client": {
			const limit = planLimits.clients;
			const usage = currentUsage.clientsCount;
			if (limit === "unlimited" || usage < limit) {
				return { canPerform: true, currentUsage: usage, limit };
			}
			return {
				canPerform: false,
				reason: `You've reached your limit of ${limit} clients. Upgrade to add more.`,
				currentUsage: usage,
				limit,
			};
		}

		case "create_project": {
			const limit = planLimits.activeProjectsPerClient;
			// For projects, we need to check per-client, so we'll return true here
			// and the actual check will happen at the component level
			return {
				canPerform: true,
				limit,
			};
		}

		case "send_esignature": {
			const limit = planLimits.esignaturesPerMonth;
			const usage = currentUsage.esignaturesSentThisMonth;
			if (limit === "unlimited" || usage < limit) {
				return { canPerform: true, currentUsage: usage, limit };
			}
			return {
				canPerform: false,
				reason: `You've reached your limit of ${limit} e-signatures this month. Upgrade for unlimited.`,
				currentUsage: usage,
				limit,
			};
		}

		default:
			return { canPerform: false, reason: "Unknown action" };
	}
}
