"use client";

import { useAnalyticsIdentity } from "@/hooks/use-analytics-identity";

/**
 * Client component that handles PostHog user/organization identification.
 * Add this component to the workspace layout to identify users after sign-in.
 *
 * This component renders nothing but runs the identification hook.
 */
export function AnalyticsIdentity() {
	useAnalyticsIdentity();
	return null;
}
