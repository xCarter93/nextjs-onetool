import { QueryCtx, MutationCtx } from "../_generated/server";

/**
 * Get the current authenticated user, throwing an error if not found
 */
export async function getCurrentUserOrThrow(ctx: QueryCtx | MutationCtx) {
	const userRecord = await getCurrentUser(ctx);
	if (!userRecord) throw new Error("User not authenticated");
	return userRecord;
}

/**
 * Get the current authenticated user, returning null if not found
 */
export async function getCurrentUser(ctx: QueryCtx | MutationCtx) {
	const identity = await ctx.auth.getUserIdentity();
	if (identity === null) {
		return null;
	}
	return await userByExternalId(ctx, identity.subject);
}

/**
 * Find a user by their external (Clerk) ID
 */
export async function userByExternalId(
	ctx: QueryCtx | MutationCtx,
	externalId: string
) {
	return await ctx.db
		.query("users")
		.withIndex("by_external_id", (q) => q.eq("externalId", externalId))
		.unique();
}

/**
 * Get the current user's organization ID, throwing an error if not found
 */
export async function getCurrentUserOrgId(ctx: QueryCtx | MutationCtx) {
	const user = await getCurrentUserOrThrow(ctx);
	if (!user.organizationId) {
		throw new Error("User is not associated with an organization");
	}
	return user.organizationId;
}

/**
 * Ensure the current user has access to the specified organization
 */
export async function validateOrgAccess(
	ctx: QueryCtx | MutationCtx,
	orgId: string
) {
	const userOrgId = await getCurrentUserOrgId(ctx);
	if (userOrgId !== orgId) {
		throw new Error("User does not have access to this organization");
	}
	return userOrgId;
}
