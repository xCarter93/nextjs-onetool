import Stripe from "stripe";

const API_VERSION = "2025-11-17.clover" as const;

/**
 * Shared Stripe client factory.
 * - Validates the secret key is present.
 * - Pins the requested API version.
 * - Throws a helpful error when configuration is missing.
 */
export function getStripeClient() {
	const secretKey = process.env.STRIPE_SECRET_KEY;

	if (!secretKey) {
		throw new Error(
			"STRIPE_SECRET_KEY is missing. Add it to your environment and redeploy."
		);
	}

	// Instantiate per-call to avoid accidental reuse with stale config in dev.
	return new Stripe(secretKey, {
		apiVersion: API_VERSION,
	});
}

/**
 * Convenience helper for places where we only need to assert configuration.
 */
export function assertStripeEnv() {
	if (!process.env.STRIPE_SECRET_KEY) {
		throw new Error(
			"Stripe is not configured: set STRIPE_SECRET_KEY before using Connect."
		);
	}
}
