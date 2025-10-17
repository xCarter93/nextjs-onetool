"use client";

import { useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

/**
 * Component that dynamically updates the document title based on the current organization
 */
export function DynamicTitle() {
	const organization = useQuery(api.organizations.get);

	useEffect(() => {
		if (organization?.name) {
			document.title = `OneTool - ${organization.name}`;
		} else {
			// Fallback when not logged in or no organization
			document.title = "OneTool";
		}
	}, [organization?.name]);

	// This component doesn't render anything
	return null;
}
