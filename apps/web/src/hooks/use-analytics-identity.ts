"use client";

import { useEffect, useRef } from "react";
import { useUser, useOrganization, useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@onetool/backend/convex/_generated/api";
import {
	identifyUser,
	setUserOnce,
	setOrganizationGroup,
	resetAnalytics,
} from "@/lib/analytics";

/**
 * Determine plan type from subscription status.
 */
function getPlanType(
	subscriptionStatus: string | undefined
): "free" | "trial" | "pro" {
	if (subscriptionStatus === "active") return "pro";
	if (subscriptionStatus === "trialing") return "trial";
	return "free";
}

/**
 * Hook that handles PostHog user and organization identification.
 * Automatically identifies users when they sign in via Clerk and
 * associates them with their organization for B2B analytics.
 *
 * User identification happens immediately when Clerk data is available.
 * Organization group data is set separately when Convex org data loads.
 *
 * Call this hook once in a layout that wraps all authenticated routes.
 */
export function useAnalyticsIdentity() {
	const { user, isSignedIn, isLoaded: userLoaded } = useUser();
	const { organization, isLoaded: orgLoaded } = useOrganization();
	const { orgRole } = useAuth();
	const orgData = useQuery(api.organizations.get, {});

	const hasIdentified = useRef(false);
	const hasSetOrgGroup = useRef(false);
	const prevSignedIn = useRef<boolean | null>(null);

	// Handle sign-out - reset PostHog identity and flags
	useEffect(() => {
		if (prevSignedIn.current === true && isSignedIn === false) {
			resetAnalytics();
			hasIdentified.current = false;
			hasSetOrgGroup.current = false;
		}
		prevSignedIn.current = isSignedIn ?? null;
	}, [isSignedIn]);

	// Identify user immediately when Clerk data is available (don't wait for Convex)
	useEffect(() => {
		if (!userLoaded || !orgLoaded) return;
		if (!isSignedIn || !user || !organization) return;
		if (hasIdentified.current) return;

		const role = orgRole?.toLowerCase().includes("admin") ? "admin" : "member";
		const planType = getPlanType(orgData?.subscriptionStatus);

		identifyUser(user.id, {
			email: user.primaryEmailAddress?.emailAddress ?? "",
			name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
			role,
			orgId: organization.id,
			orgName: organization.name,
			planType,
		});

		setUserOnce({
			first_login: new Date().toISOString(),
			initial_referrer: document.referrer || "direct",
		});

		hasIdentified.current = true;
	}, [user, organization, orgRole, orgData?.subscriptionStatus, isSignedIn, userLoaded, orgLoaded]);

	// Set organization group when Convex org data becomes available
	// This runs separately to avoid blocking user identification on Convex query
	useEffect(() => {
		if (!isSignedIn || !organization) return;
		if (!orgData) return;
		if (hasSetOrgGroup.current) return;

		const planType = getPlanType(orgData.subscriptionStatus);

		setOrganizationGroup(organization.id, {
			name: organization.name,
			planType,
			stripeConnected: !!orgData.stripeConnectAccountId,
		});

		hasSetOrgGroup.current = true;
	}, [isSignedIn, organization, orgData]);
}
