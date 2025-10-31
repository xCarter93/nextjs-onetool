"use client";

import { useAuth, useUser } from "@clerk/nextjs";
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
 * Checks for premium access in two ways:
 * 1. User's public metadata: has_premium_feature_access = true
 * 2. User has the onetool_business_plan
 *
 * User has premium access if EITHER condition is true
 */
export function useFeatureAccess(): FeatureAccess {
	const { has, isLoaded, orgId } = useAuth();
	const { user, isLoaded: isUserLoaded } = useUser();
	const usage = useQuery(api.usage.getCurrentUsage);

	// Check if user has an organization - use orgId instead of role check
	// This works for all roles (admin, member, owner, etc.)
	const hasOrganization = !!orgId;

	// Check for premium access in two ways:
	// 1. Check if user has premium via public metadata
	const hasPremiumViaMetadata =
		user?.publicMetadata?.has_premium_feature_access === true;

	// 2. Check if user has the business plan
	const hasPremiumViaPlan = has
		? has({ plan: "onetool_business_plan" })
		: false;

	// User has premium access if EITHER is true
	const hasPremiumAccess = hasPremiumViaMetadata || hasPremiumViaPlan;

	// Get plan limits based on premium access
	const planLimits = getPlanLimits(hasPremiumAccess);

	return {
		hasOrganization,
		hasPremiumAccess,
		planLimits,
		currentUsage: usage || null,
		isLoading: !isLoaded || !isUserLoaded || usage === undefined,
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
