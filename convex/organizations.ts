import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import {
	getCurrentUserOrThrow,
	getCurrentUser,
	getCurrentUserOrgId,
} from "./lib/auth";
import { ActivityHelpers } from "./lib/activities";

/**
 * Get the current user's organization
 */
export const get = query({
	args: {},
	handler: async (ctx) => {
		const user = await getCurrentUser(ctx);
		if (!user) {
			return null;
		}

		try {
			const userOrgId = await getCurrentUserOrgId(ctx);
			return await ctx.db.get(userOrgId);
		} catch (error) {
			// User might not have an active organization
			return null;
		}
	},
});

/**
 * Check if the current user needs to complete organization metadata
 */
export const needsMetadataCompletion = query({
	args: {},
	handler: async (ctx) => {
		const user = await getCurrentUser(ctx);
		if (!user) {
			return false;
		}

		try {
			const userOrgId = await getCurrentUserOrgId(ctx);
			const organization = await ctx.db.get(userOrgId);
			if (!organization) {
				return false;
			}

			// Return true if metadata is not complete and user is the owner
			return (
				!organization.isMetadataComplete &&
				organization.ownerUserId === user._id
			);
		} catch (error) {
			// User might not have an active organization
			return false;
		}
	},
});

/**
 * Create organization metadata from Clerk webhook
 * This is called when Clerk creates an organization
 */
export const createFromClerk = internalMutation({
	args: {
		clerkOrganizationId: v.string(),
		name: v.string(),
		ownerClerkUserId: v.string(),
		logoUrl: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		// Find the owner user by Clerk ID
		const ownerUser = await ctx.db
			.query("users")
			.withIndex("by_external_id", (q) =>
				q.eq("externalId", args.ownerClerkUserId)
			)
			.first();

		if (!ownerUser) {
			console.warn(
				`Owner user not found for organization creation. User ID: ${args.ownerClerkUserId}. This might be a timing issue with webhooks.`
			);
			throw new Error(`Owner user not found: ${args.ownerClerkUserId}`);
		}

		// Check if organization already exists
		const existingOrg = await ctx.db
			.query("organizations")
			.withIndex("by_clerk_org", (q) =>
				q.eq("clerkOrganizationId", args.clerkOrganizationId)
			)
			.first();

		if (existingOrg) {
			return existingOrg._id;
		}

		// Create minimal organization metadata (just sync from Clerk)
		// Full setup will happen when user completes onboarding
		const orgId = await ctx.db.insert("organizations", {
			clerkOrganizationId: args.clerkOrganizationId,
			name: args.name,
			ownerUserId: ownerUser._id,
			logoUrl: args.logoUrl,
			plan: "trial", // Default to trial plan
			isMetadataComplete: false, // User needs to complete additional setup
		});

		// Update user to link to the organization
		await ctx.db.patch(ownerUser._id, {
			organizationId: orgId,
			clerkOrganizationId: args.clerkOrganizationId,
		});

		console.log(
			`Created minimal organization record for Clerk org: ${args.clerkOrganizationId}`
		);

		// NOTE: We don't create activities here because webhooks don't have user auth context
		// Activities will be created when the user completes the onboarding flow

		return orgId;
	},
});

/**
 * Complete organization metadata after Clerk creation
 * This replaces the original create function for the new flow
 */
export const completeMetadata = mutation({
	args: {
		email: v.optional(v.string()),
		website: v.optional(v.string()),
		address: v.optional(v.string()),
		phone: v.optional(v.string()),
		companySize: v.optional(
			v.union(v.literal("1-10"), v.literal("10-100"), v.literal("100+"))
		),
		defaultTaxRate: v.optional(v.number()),
		defaultReminderTiming: v.optional(v.number()),
		smsEnabled: v.optional(v.boolean()),
		monthlyRevenueTarget: v.optional(v.number()),
		logoUrl: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const user = await getCurrentUserOrThrow(ctx);
		const userOrgId = await getCurrentUserOrgId(ctx);

		const organization = await ctx.db.get(userOrgId);
		if (!organization) {
			throw new Error("Organization not found");
		}

		// Only organization owner can complete metadata
		if (organization.ownerUserId !== user._id) {
			throw new Error("Only organization owner can complete metadata");
		}

		// Update the organization with metadata
		await ctx.db.patch(userOrgId, {
			email: args.email,
			website: args.website,
			address: args.address,
			phone: args.phone,
			companySize: args.companySize,
			defaultTaxRate: args.defaultTaxRate,
			defaultReminderTiming: args.defaultReminderTiming,
			smsEnabled: args.smsEnabled ?? false,
			monthlyRevenueTarget: args.monthlyRevenueTarget,
			logoUrl: args.logoUrl,
			isMetadataComplete: true,
		});

		// Log activity
		const updatedOrganization = await ctx.db.get(userOrgId);
		if (updatedOrganization) {
			await ActivityHelpers.organizationUpdated(ctx, updatedOrganization);
		}

		return userOrgId;
	},
});

/**
 * Update organization from Clerk webhook
 */
export const updateFromClerk = internalMutation({
	args: {
		clerkOrganizationId: v.string(),
		name: v.string(),
		logoUrl: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const organization = await ctx.db
			.query("organizations")
			.withIndex("by_clerk_org", (q) =>
				q.eq("clerkOrganizationId", args.clerkOrganizationId)
			)
			.first();

		if (!organization) {
			console.error(
				`Organization not found for Clerk ID: ${args.clerkOrganizationId}`
			);
			return;
		}

		// Update the organization name and logo URL
		const updates: { name: string; logoUrl?: string } = {
			name: args.name,
		};

		// Only update logoUrl if provided (Clerk might not always include it)
		if (args.logoUrl !== undefined && args.logoUrl !== null) {
			updates.logoUrl = args.logoUrl;
		}

		await ctx.db.patch(organization._id, updates);

		console.log(
			`Updated organization name for Clerk org: ${args.clerkOrganizationId}`
		);

		// NOTE: We don't create activities here because webhooks don't have user auth context
		// Activities for name changes will be logged when users interact with the organization directly

		return organization._id;
	},
});

/**
 * Handle organization deletion from Clerk webhook
 */
export const deleteFromClerk = internalMutation({
	args: {
		clerkOrganizationId: v.string(),
	},
	handler: async (ctx, args) => {
		const organization = await ctx.db
			.query("organizations")
			.withIndex("by_clerk_org", (q) =>
				q.eq("clerkOrganizationId", args.clerkOrganizationId)
			)
			.first();

		if (!organization) {
			console.warn(
				`Organization not found for Clerk ID: ${args.clerkOrganizationId}`
			);
			return;
		}

		// Remove all users from the organization first
		const orgMembers = await ctx.db
			.query("users")
			.withIndex("by_organization", (q) =>
				q.eq("organizationId", organization._id)
			)
			.collect();

		for (const member of orgMembers) {
			await ctx.db.patch(member._id, {
				organizationId: undefined,
				clerkOrganizationId: undefined,
			});
		}

		// Delete the organization
		await ctx.db.delete(organization._id);

		console.log(
			`Successfully deleted organization: ${args.clerkOrganizationId}`
		);
		return { success: true };
	},
});

/**
 * Retry pending organization creation when user becomes available
 * This helps handle webhook timing issues
 */
export const retryPendingOrganizationCreation = internalMutation({
	args: {
		ownerClerkUserId: v.string(),
	},
	handler: async (_ctx, args) => {
		// This is a placeholder for now - in a production system, you might want to
		// store pending organization creation requests and retry them here
		console.log(
			`Checking for pending organization creation for user: ${args.ownerClerkUserId}`
		);

		// For now, just log that the user is available for organization creation
		// In the future, you could implement a pending_organizations table to track these
		return { success: true };
	},
});

/**
 * Update the current user's organization
 */
export const update = mutation({
	args: {
		name: v.optional(v.string()),
		email: v.optional(v.string()),
		website: v.optional(v.string()),
		logoUrl: v.optional(v.string()),
		logoStorageId: v.optional(v.id("_storage")),
		brandColor: v.optional(v.string()),
		address: v.optional(v.string()),
		phone: v.optional(v.string()),
		companySize: v.optional(
			v.union(v.literal("1-10"), v.literal("10-100"), v.literal("100+"))
		),
		defaultTaxRate: v.optional(v.number()),
		defaultReminderTiming: v.optional(v.number()),
		smsEnabled: v.optional(v.boolean()),
		monthlyRevenueTarget: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		const user = await getCurrentUserOrThrow(ctx);
		const userOrgId = await getCurrentUserOrgId(ctx);

		// Get the organization to ensure it exists and user is owner
		const organization = await ctx.db.get(userOrgId);
		if (!organization) {
			throw new Error("Organization not found");
		}

		// Only organization owner can update organization details
		if (organization.ownerUserId !== user._id) {
			throw new Error(
				"Only organization owner can update organization details"
			);
		}

		// Filter out undefined values
		const updates = Object.fromEntries(
			Object.entries(args).filter(([, value]) => value !== undefined)
		);

		if (Object.keys(updates).length === 0) {
			throw new Error("No valid updates provided");
		}

		// Update the organization
		await ctx.db.patch(userOrgId, updates);

		// Log activity
		const updatedOrganization = await ctx.db.get(userOrgId);
		if (updatedOrganization) {
			await ActivityHelpers.organizationUpdated(ctx, updatedOrganization);
		}

		return userOrgId;
	},
});

/**
 * Update organization plan (for billing/subscription management)
 */
export const updatePlan = mutation({
	args: {
		plan: v.union(v.literal("trial"), v.literal("pro"), v.literal("cancelled")),
		stripeCustomerId: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const user = await getCurrentUserOrThrow(ctx);
		const userOrgId = await getCurrentUserOrgId(ctx);

		const organization = await ctx.db.get(userOrgId);
		if (!organization) {
			throw new Error("Organization not found");
		}

		// Only organization owner can update plan
		if (organization.ownerUserId !== user._id) {
			throw new Error("Only organization owner can update plan");
		}

		await ctx.db.patch(userOrgId, {
			plan: args.plan,
			stripeCustomerId: args.stripeCustomerId,
		});

		return userOrgId;
	},
});

/**
 * Get organization members (users in the organization)
 */
export const getMembers = query({
	args: {},
	handler: async (ctx) => {
		const user = await getCurrentUser(ctx);
		if (!user) {
			return [];
		}

		try {
			const userOrgId = await getCurrentUserOrgId(ctx);
			return await ctx.db
				.query("users")
				.withIndex("by_organization", (q) => q.eq("organizationId", userOrgId))
				.collect();
		} catch (error) {
			// User might not have an active organization
			return [];
		}
	},
});

/**
 * Remove user from organization (owner only)
 */
export const removeMember = mutation({
	args: {
		userId: v.id("users"),
	},
	handler: async (ctx, args) => {
		const currentUser = await getCurrentUserOrThrow(ctx);

		if (!currentUser.organizationId) {
			throw new Error("User is not associated with an organization");
		}

		const organization = await ctx.db.get(currentUser.organizationId);
		if (!organization) {
			throw new Error("Organization not found");
		}

		// Only organization owner can remove members
		if (organization.ownerUserId !== currentUser._id) {
			throw new Error("Only organization owner can remove members");
		}

		// Cannot remove the owner
		if (args.userId === currentUser._id) {
			throw new Error("Organization owner cannot be removed");
		}

		// Get the user to be removed
		const userToRemove = await ctx.db.get(args.userId);
		if (!userToRemove) {
			throw new Error("User not found");
		}

		// Check if user belongs to this organization
		if (userToRemove.organizationId !== currentUser.organizationId) {
			throw new Error("User does not belong to this organization");
		}

		// Remove user from organization
		await ctx.db.patch(args.userId, {
			organizationId: undefined,
		});

		return args.userId;
	},
});

/**
 * Delete organization (owner only) - careful operation!
 */
export const deleteOrganization = mutation({
	args: {
		confirmationText: v.string(), // Require typing organization name for confirmation
	},
	handler: async (ctx, args) => {
		const user = await getCurrentUserOrThrow(ctx);
		const userOrgId = await getCurrentUserOrgId(ctx);

		const organization = await ctx.db.get(userOrgId);
		if (!organization) {
			throw new Error("Organization not found");
		}

		// Only organization owner can delete
		if (organization.ownerUserId !== user._id) {
			throw new Error("Only organization owner can delete organization");
		}

		// Require exact organization name for confirmation
		if (args.confirmationText !== organization.name) {
			throw new Error("Confirmation text must match organization name exactly");
		}

		// Remove all users from the organization first
		const orgMembers = await ctx.db
			.query("users")
			.withIndex("by_organization", (q) => q.eq("organizationId", userOrgId))
			.collect();

		for (const member of orgMembers) {
			await ctx.db.patch(member._id, {
				organizationId: undefined,
			});
		}

		// Delete the organization
		await ctx.db.delete(userOrgId);

		return { success: true };
	},
});
