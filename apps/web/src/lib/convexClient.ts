import { ConvexHttpClient } from "convex/browser";

/**
 * Lightweight Convex HTTP client for server-side routes.
 * Throws with a clear message if the deployment URL is not configured.
 */
export function getConvexClient() {
	const url = process.env.NEXT_PUBLIC_CONVEX_URL;
	if (!url) {
		throw new Error(
			"NEXT_PUBLIC_CONVEX_URL is missing. Add it to your environment to use public pay links."
		);
	}
	return new ConvexHttpClient(url);
}
