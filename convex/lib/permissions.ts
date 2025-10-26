import type { QueryCtx, MutationCtx } from "../_generated/server";

/**
 * Server-side permission checking utilities
 *
 * These functions check feature access using Clerk's auth context
 */

/**
 * Check if the current user has a specific feature
 */
export async function hasFeature(
	ctx: QueryCtx | MutationCtx,
	feature: string
): Promise<boolean> {
	const identity = await ctx.auth.getUserIdentity();
	if (!identity) {
		return false;
	}

	// Clerk's has() method is available on the auth context
	// Feature checks are done via JWT token claims
	// The feature claim is in the format "fea" with the feature name

	// For now, we'll check the raw token data
	// In production, Clerk adds features to the token's custom claims
	const auth = await ctx.auth.getUserIdentity();
	if (!auth) {
		return false;
	}

	// Check if user has the feature in their organization
	// This will be available in the JWT token after Clerk billing is set up
	const tokenData = auth as any;

	// Check for premium feature access
	// The actual implementation depends on how Clerk structures the JWT
	// Typically it's in tokenData.features or similar
	if (feature === "premium_feature_access") {
		// Check if organization has premium features
		// This would typically be in the org-level claims
		return tokenData.org_features?.includes("premium_feature_access") || false;
	}

	return false;
}

/**
 * Require that the user has a specific feature, throw if not
 */
export async function requireFeature(
	ctx: QueryCtx | MutationCtx,
	feature: string
): Promise<void> {
	const hasAccess = await hasFeature(ctx, feature);
	if (!hasAccess) {
		throw new Error(
			`Access denied: This feature requires ${feature}. Please upgrade your plan.`
		);
	}
}

/**
 * Check if user has premium access
 */
export async function hasPremiumAccess(
	ctx: QueryCtx | MutationCtx
): Promise<boolean> {
	return hasFeature(ctx, "premium_feature_access");
}

/**
 * Require premium access, throw if not available
 */
export async function requirePremiumAccess(
	ctx: QueryCtx | MutationCtx
): Promise<void> {
	await requireFeature(ctx, "premium_feature_access");
}

/**
 * Check feature access and return result
 */
export async function checkFeatureAccess(
	ctx: QueryCtx | MutationCtx,
	feature: string
): Promise<{ hasAccess: boolean; reason?: string }> {
	const identity = await ctx.auth.getUserIdentity();
	if (!identity) {
		return {
			hasAccess: false,
			reason: "Not authenticated",
		};
	}

	const hasAccess = await hasFeature(ctx, feature);
	if (!hasAccess) {
		return {
			hasAccess: false,
			reason: `Feature ${feature} not available on your current plan`,
		};
	}

	return { hasAccess: true };
}
