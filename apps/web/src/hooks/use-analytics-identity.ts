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
 * Hook that handles PostHog user and organization identification.
 * Automatically identifies users when they sign in via Clerk and
 * associates them with their organization for B2B analytics.
 *
 * Call this hook once in a layout that wraps all authenticated routes.
 */
export function useAnalyticsIdentity() {
	const { user, isSignedIn, isLoaded: userLoaded } = useUser();
	const { organization, isLoaded: orgLoaded } = useOrganization();
	const { orgRole } = useAuth();
	const orgData = useQuery(api.organizations.get, {});

	const hasIdentified = useRef(false);
	const prevSignedIn = useRef<boolean | null>(null);

	// Handle sign-out - reset PostHog identity
	useEffect(() => {
		if (prevSignedIn.current === true && isSignedIn === false) {
			resetAnalytics();
			hasIdentified.current = false;
		}
		prevSignedIn.current = isSignedIn ?? null;
	}, [isSignedIn]);

	// Handle identification when user signs in
	useEffect(() => {
		// Wait for all data to load
		if (!userLoaded || !orgLoaded) return;
		if (!isSignedIn || !user || !organization) return;
		if (hasIdentified.current) return;

		// Determine user role
		const role = orgRole?.toLowerCase().includes("admin") ? "admin" : "member";

		// Determine plan type from org data
		const planType: "free" | "trial" | "pro" =
			orgData?.subscriptionStatus === "active" ? "pro" : "free";

		// Identify the user
		identifyUser(user.id, {
			email: user.primaryEmailAddress?.emailAddress ?? "",
			name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
			role,
			orgId: organization.id,
			orgName: organization.name,
			planType,
		});

		// Set first-time properties (won't overwrite on subsequent logins)
		setUserOnce({
			first_login: new Date().toISOString(),
			initial_referrer: document.referrer || "direct",
		});

		// Set organization group for B2B analytics
		if (orgData) {
			setOrganizationGroup(organization.id, {
				name: organization.name,
				planType,
				stripeConnected: !!orgData.stripeConnectAccountId,
			});
		}

		hasIdentified.current = true;
	}, [user, organization, orgRole, orgData, isSignedIn, userLoaded, orgLoaded]);
}
