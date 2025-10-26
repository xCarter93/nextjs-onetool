import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Clerk Billing Webhook Handlers
 *
 * Handles subscription and payment events from Clerk Billing
 */

/**
 * Handle paymentAttempt.created event
 */
export const handlePaymentAttemptCreated = internalMutation({
	args: {
		paymentAttemptId: v.string(),
		organizationId: v.optional(v.string()),
		userId: v.optional(v.string()),
		amount: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		console.log("Payment attempt created:", args.paymentAttemptId);

		// Log the payment attempt - you could store this in a payments table if needed
		// For now, we just log it

		return { success: true };
	},
});

/**
 * Handle paymentAttempt.updated event
 */
export const handlePaymentAttemptUpdated = internalMutation({
	args: {
		paymentAttemptId: v.string(),
		status: v.optional(v.string()),
		organizationId: v.optional(v.string()),
		userId: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		console.log("Payment attempt updated:", {
			id: args.paymentAttemptId,
			status: args.status,
		});

		// You could update a payments table here if tracking payment history
		// For now, we just log the status change

		return { success: true };
	},
});

/**
 * Handle subscription.created event
 */
export const handleSubscriptionCreated = internalMutation({
	args: {
		subscriptionId: v.string(),
		organizationId: v.string(),
		planId: v.string(),
		status: v.string(),
		currentPeriodStart: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		console.log("Subscription created:", {
			subscriptionId: args.subscriptionId,
			organizationId: args.organizationId,
			planId: args.planId,
		});

		// Find the organization by Clerk organization ID
		const organization = await ctx.db
			.query("organizations")
			.withIndex("by_clerk_org", (q) =>
				q.eq("clerkOrganizationId", args.organizationId)
			)
			.first();

		if (!organization) {
			console.error(
				`Organization not found for Clerk ID: ${args.organizationId}`
			);
			return { success: false, error: "Organization not found" };
		}

		// Update organization with subscription details
		await ctx.db.patch(organization._id, {
			clerkSubscriptionId: args.subscriptionId,
			clerkPlanId: args.planId,
			subscriptionStatus: args.status as any,
			billingCycleStart: args.currentPeriodStart || Date.now(),
		});

		console.log(
			`Updated organization ${organization._id} with subscription ${args.subscriptionId}`
		);

		return { success: true };
	},
});

/**
 * Handle subscription.active event
 */
export const handleSubscriptionActive = internalMutation({
	args: {
		subscriptionId: v.string(),
		organizationId: v.string(),
		planId: v.string(),
		currentPeriodStart: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		console.log("Subscription activated:", {
			subscriptionId: args.subscriptionId,
			organizationId: args.organizationId,
		});

		// Find the organization by Clerk organization ID
		const organization = await ctx.db
			.query("organizations")
			.withIndex("by_clerk_org", (q) =>
				q.eq("clerkOrganizationId", args.organizationId)
			)
			.first();

		if (!organization) {
			console.error(
				`Organization not found for Clerk ID: ${args.organizationId}`
			);
			return { success: false, error: "Organization not found" };
		}

		// Update organization to active status
		await ctx.db.patch(organization._id, {
			clerkSubscriptionId: args.subscriptionId,
			clerkPlanId: args.planId,
			subscriptionStatus: "active",
			billingCycleStart: args.currentPeriodStart || Date.now(),
		});

		console.log(`Activated subscription for organization ${organization._id}`);

		return { success: true };
	},
});

/**
 * Handle subscription.updated event
 */
export const handleSubscriptionUpdated = internalMutation({
	args: {
		subscriptionId: v.string(),
		organizationId: v.string(),
		planId: v.string(),
		status: v.string(),
		currentPeriodStart: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		console.log("Subscription updated:", {
			subscriptionId: args.subscriptionId,
			status: args.status,
		});

		// Find the organization by Clerk organization ID
		const organization = await ctx.db
			.query("organizations")
			.withIndex("by_clerk_org", (q) =>
				q.eq("clerkOrganizationId", args.organizationId)
			)
			.first();

		if (!organization) {
			console.error(
				`Organization not found for Clerk ID: ${args.organizationId}`
			);
			return { success: false, error: "Organization not found" };
		}

		// Update subscription details
		await ctx.db.patch(organization._id, {
			clerkSubscriptionId: args.subscriptionId,
			clerkPlanId: args.planId,
			subscriptionStatus: args.status as any,
			billingCycleStart: args.currentPeriodStart,
		});

		console.log(`Updated subscription for organization ${organization._id}`);

		return { success: true };
	},
});

/**
 * Handle subscription.pastDue event
 */
export const handleSubscriptionPastDue = internalMutation({
	args: {
		subscriptionId: v.string(),
		organizationId: v.string(),
	},
	handler: async (ctx, args) => {
		console.log("Subscription past due:", {
			subscriptionId: args.subscriptionId,
			organizationId: args.organizationId,
		});

		// Find the organization by Clerk organization ID
		const organization = await ctx.db
			.query("organizations")
			.withIndex("by_clerk_org", (q) =>
				q.eq("clerkOrganizationId", args.organizationId)
			)
			.first();

		if (!organization) {
			console.error(
				`Organization not found for Clerk ID: ${args.organizationId}`
			);
			return { success: false, error: "Organization not found" };
		}

		// Update status to past_due
		await ctx.db.patch(organization._id, {
			subscriptionStatus: "past_due",
		});

		console.log(`Marked subscription as past due for org ${organization._id}`);

		// You might want to send a notification to the org owner here

		return { success: true };
	},
});
