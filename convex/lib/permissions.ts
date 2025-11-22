import type { QueryCtx, MutationCtx } from "../_generated/server";
import { query } from "../_generated/server";

/**
 * Server-side permission checking utilities
 *
 * These functions check feature access using Clerk's auth context
 */

// Extended identity type that includes custom claims
interface ClerkIdentityWithClaims {
	tokenIdentifier: string;
	subject: string;
	issuer: string;
	email?: string;
	publicMetadata?: {
		has_premium_feature_access?: boolean;
		[key: string]: unknown;
	};
	public_metadata?: {
		has_premium_feature_access?: boolean;
		[key: string]: unknown;
	};
	// Plan claims (Clerk Billing)
	pla?: string; // Plan claim (Clerk convention)
	plan?: string; // Alternative plan location
	[key: string]: unknown;
}

/**
 * Debug query to inspect JWT token structure
 * Useful for troubleshooting plan and metadata detection
 */
export const debugAuthToken = query({
	args: {},
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			return { error: "Not authenticated" };
		}

		const tokenData = identity as ClerkIdentityWithClaims;

		return {
			// Safe to log these for debugging
			subject: tokenData.subject,
			issuer: tokenData.issuer,
			email: tokenData.email,
			// Full public metadata object
			publicMetadata:
				tokenData.publicMetadata || tokenData.public_metadata || null,
			// Check various public metadata locations
			publicMetadataChecks: {
				"publicMetadata.has_premium_feature_access":
					tokenData.publicMetadata?.has_premium_feature_access,
				"public_metadata.has_premium_feature_access":
					tokenData.public_metadata?.has_premium_feature_access,
			},
			// Check for plan in various locations
			planChecks: {
				pla: tokenData.pla,
				plan: tokenData.plan,
			},
			// List all top-level keys in the token (helps identify structure)
			availableKeys: Object.keys(tokenData),
			// Show the ENTIRE token (be careful - only use in development)
			fullTokenData: tokenData,
		};
	},
});

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

	const tokenData = identity as ClerkIdentityWithClaims;

	// Check for premium feature access at the USER level
	// Backend checks public metadata since we can't use Clerk's has() method here
	// Frontend uses both has({ plan: 'onetool_business_plan' }) and publicMetadata
	if (feature === "premium_feature_access") {
		// Check public metadata for has_premium_feature_access flag
		// This should be set to true when user subscribes or is granted premium access
		const hasPremiumViaMetadata =
			tokenData.publicMetadata?.has_premium_feature_access === true ||
			tokenData.public_metadata?.has_premium_feature_access === true;

		// Debug logging to help troubleshoot (remove after confirming it works)
		console.log("Backend premium access check:", {
			hasPremiumViaMetadata,
			publicMetadataExists:
				!!tokenData.publicMetadata || !!tokenData.public_metadata,
			publicMetadataValue:
				tokenData.publicMetadata || tokenData.public_metadata,
		});

		return hasPremiumViaMetadata;
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

/**
 * Role-based permission utilities
 */

import { getCurrentUser, getCurrentUserOrgId } from "./auth";
import { getMembership } from "./memberships";
import type { Id } from "../_generated/dataModel";

/**
 * Get the current user's role in their active organization
 */
export async function getCurrentUserRole(
	ctx: QueryCtx | MutationCtx
): Promise<string | null> {
	const user = await getCurrentUser(ctx);
	if (!user) {
		return null;
	}

	const orgId = await getCurrentUserOrgId(ctx, { require: false });
	if (!orgId) {
		return null;
	}

	const membership = await getMembership(ctx, user._id, orgId);
	return membership?.role ?? null;
}

/**
 * Check if the current user is an admin in their organization
 * Admin is defined as any role containing "admin" (case-insensitive)
 */
export async function isAdmin(ctx: QueryCtx | MutationCtx): Promise<boolean> {
	const role = await getCurrentUserRole(ctx);
	if (!role) {
		return false;
	}

	return role.toLowerCase().includes("admin");
}

/**
 * Check if the current user is a member (non-admin) in their organization
 * Member is defined as any role not containing "admin" or no role set
 */
export async function isMember(ctx: QueryCtx | MutationCtx): Promise<boolean> {
	const role = await getCurrentUserRole(ctx);
	
	// If no role is set, treat as member for safety
	if (!role) {
		return true;
	}

	return !role.toLowerCase().includes("admin");
}

/**
 * Require that the current user is an admin, throw if not
 */
export async function requireAdmin(
	ctx: QueryCtx | MutationCtx
): Promise<void> {
	const isAdminUser = await isAdmin(ctx);
	if (!isAdminUser) {
		throw new Error(
			"Access denied: This action requires administrator privileges."
		);
	}
}

/**
 * Get the current user's ID for filtering assigned items
 */
export async function getCurrentUserId(
	ctx: QueryCtx | MutationCtx
): Promise<Id<"users"> | null> {
	const user = await getCurrentUser(ctx);
	return user?._id ?? null;
}
