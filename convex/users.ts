import { internalMutation, query } from "./_generated/server";
import { UserJSON } from "@clerk/backend";
import { v, Validator } from "convex/values";
import {
	getCurrentUser,
	getCurrentUserOrgIdOptional,
	userByExternalId,
} from "./lib/auth";
import { internal } from "./_generated/api";

export const current = query({
	args: {},
	handler: async (ctx) => {
		return await getCurrentUser(ctx);
	},
});

/**
 * List all users in the current user's organization
 */
export const listByOrg = query({
	args: {},
	handler: async (ctx) => {
		const userOrgId = await getCurrentUserOrgIdOptional(ctx);
		if (!userOrgId) {
			return [];
		}

		return await ctx.db
			.query("users")
			.withIndex("by_organization", (q) => q.eq("organizationId", userOrgId))
			.collect();
	},
});

export const upsertFromClerk = internalMutation({
	args: { data: v.any() as Validator<UserJSON> }, // no runtime validation, trust Clerk
	async handler(ctx, { data }) {
		const userAttributes = {
			name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
			email: data.email_addresses?.[0]?.email_address || "",
			image: data.image_url || "",
			lastSignedInDate: Date.now(),
			externalId: data.id,
		};

		const user = await userByExternalId(ctx, data.id);
		if (user === null) {
			await ctx.db.insert("users", userAttributes);
			console.log(`Created new user: ${data.id}`);
		} else {
			await ctx.db.patch(user._id, userAttributes);
			console.log(`Updated existing user: ${data.id}`);
		}

		// After creating/updating a user, check if there are any pending organizations
		// that were waiting for this user to be created
		await ctx.runMutation(
			internal.organizations.retryPendingOrganizationCreation,
			{
				ownerClerkUserId: data.id,
			}
		);
	},
});

export const deleteFromClerk = internalMutation({
	args: { clerkUserId: v.string() },
	async handler(ctx, { clerkUserId }) {
		const user = await userByExternalId(ctx, clerkUserId);

		if (user !== null) {
			await ctx.db.delete(user._id);
		} else {
			console.warn(
				`Can't delete user, there is none for Clerk user ID: ${clerkUserId}`
			);
		}
	},
});

export const updateLastSignedInDate = internalMutation({
	args: { clerkUserId: v.string() },
	async handler(ctx, { clerkUserId }) {
		const user = await userByExternalId(ctx, clerkUserId);

		if (user !== null) {
			await ctx.db.patch(user._id, {
				lastSignedInDate: Date.now(),
			});
		} else {
			console.warn(
				`Can't update last signed in date, no user found for Clerk user ID: ${clerkUserId}`
			);
		}
	},
});

/**
 * Update user organization when they join via Clerk
 */
export const updateUserOrganization = internalMutation({
	args: {
		clerkUserId: v.string(),
		clerkOrganizationId: v.string(),
	},
	async handler(ctx, { clerkUserId, clerkOrganizationId }) {
		const user = await userByExternalId(ctx, clerkUserId);
		if (!user) {
			console.warn(`User not found for Clerk ID: ${clerkUserId}`);
			return;
		}

		// Find the organization by Clerk ID
		const organization = await ctx.db
			.query("organizations")
			.withIndex("by_clerk_org", (q) =>
				q.eq("clerkOrganizationId", clerkOrganizationId)
			)
			.first();

		if (!organization) {
			console.warn(
				`Organization not found for Clerk ID: ${clerkOrganizationId}`
			);
			return;
		}

		// Update user with organization references
		await ctx.db.patch(user._id, {
			organizationId: organization._id,
			clerkOrganizationId: clerkOrganizationId,
		});
	},
});

/**
 * Remove user from organization when they leave via Clerk
 */
export const removeUserFromOrganization = internalMutation({
	args: { clerkUserId: v.string() },
	async handler(ctx, { clerkUserId }) {
		const user = await userByExternalId(ctx, clerkUserId);
		if (!user) {
			console.warn(`User not found for Clerk ID: ${clerkUserId}`);
			return;
		}

		// Remove organization references
		await ctx.db.patch(user._id, {
			organizationId: undefined,
			clerkOrganizationId: undefined,
		});
	},
});
