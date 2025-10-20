"use client";

import { useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

/**
 * Custom hook to automatically detect and set organization timezone
 * if it's not already set. Runs once when the component mounts.
 */
export function useAutoTimezone() {
	const organization = useQuery(api.organizations.get);
	const updateOrganization = useMutation(api.organizations.update);
	const hasAttemptedUpdate = useRef(false);

	useEffect(() => {
		// Only run once and only if we have the organization data
		if (hasAttemptedUpdate.current || !organization) {
			return;
		}

		// If timezone is already set, do nothing
		if (organization.timezone) {
			hasAttemptedUpdate.current = true;
			return;
		}

		// Detect the user's timezone using the browser's Intl API
		try {
			const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

			if (detectedTimezone) {
				// Automatically save the detected timezone
				updateOrganization({ timezone: detectedTimezone })
					.then(() => {
						console.log(
							`Auto-detected and saved timezone: ${detectedTimezone}`
						);
					})
					.catch((error) => {
						console.error("Failed to save timezone:", error);
					});

				hasAttemptedUpdate.current = true;
			}
		} catch (error) {
			console.error("Failed to detect timezone:", error);
			hasAttemptedUpdate.current = true;
		}
	}, [organization, updateOrganization]);

	return {
		timezone: organization?.timezone,
		isDetected: !!organization?.timezone,
	};
}
