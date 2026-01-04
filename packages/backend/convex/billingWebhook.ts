import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Clerk Billing Webhook Handlers
 *
 * Handles subscription and payment events from Clerk Billing
 * Note: Only organization-level billing is supported
 */

/**
 * Handle paymentAttempt.created event
 */
export const handlePaymentAttemptCreated = internalMutation({
	args: {
		paymentAttemptId: v.string(),
		organizationId: v.optional(v.string()),
		amount: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		console.log("Payment attempt created:", {
			paymentAttemptId: args.paymentAttemptId,
			organizationId: args.organizationId,
		});

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
	},
	handler: async (ctx, args) => {
		console.log("Payment attempt updated:", {
			id: args.paymentAttemptId,
			status: args.status,
			organizationId: args.organizationId,
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

		const org = await ctx.db
			.query("organizations")
			.withIndex("by_clerk_org", (q) =>
				q.eq("clerkOrganizationId", args.organizationId)
			)
			.first();

		if (!org) {
			console.error(
				`Organization not found for Clerk ID: ${args.organizationId}`
			);
			return { success: false, error: "Organization not found" };
		}

		const statusValue = args.status as
			| "active"
			| "past_due"
			| "canceled"
			| "incomplete"
			| "incomplete_expired"
			| "trialing"
			| "unpaid";

		await ctx.db.patch(org._id, {
			clerkSubscriptionId: args.subscriptionId,
			clerkPlanId: args.planId,
			subscriptionStatus: statusValue,
			billingCycleStart: args.currentPeriodStart || Date.now(),
		});

		console.log(
			`Updated organization ${org._id} with subscription ${args.subscriptionId}`
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

		const org = await ctx.db
			.query("organizations")
			.withIndex("by_clerk_org", (q) =>
				q.eq("clerkOrganizationId", args.organizationId)
			)
			.first();

		if (!org) {
			console.error(
				`Organization not found for Clerk ID: ${args.organizationId}`
			);
			return { success: false, error: "Organization not found" };
		}

		await ctx.db.patch(org._id, {
			clerkSubscriptionId: args.subscriptionId,
			clerkPlanId: args.planId,
			subscriptionStatus: "active",
			billingCycleStart: args.currentPeriodStart || Date.now(),
		});

		console.log(`Activated subscription for organization ${org._id}`);

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
			organizationId: args.organizationId,
		});

		const org = await ctx.db
			.query("organizations")
			.withIndex("by_clerk_org", (q) =>
				q.eq("clerkOrganizationId", args.organizationId)
			)
			.first();

		if (!org) {
			console.error(
				`Organization not found for Clerk ID: ${args.organizationId}`
			);
			return { success: false, error: "Organization not found" };
		}

		const statusValue = args.status as
			| "active"
			| "past_due"
			| "canceled"
			| "incomplete"
			| "incomplete_expired"
			| "trialing"
			| "unpaid";

		await ctx.db.patch(org._id, {
			clerkSubscriptionId: args.subscriptionId,
			clerkPlanId: args.planId,
			subscriptionStatus: statusValue,
			billingCycleStart: args.currentPeriodStart,
		});

		console.log(`Updated subscription for organization ${org._id}`);

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

		const org = await ctx.db
			.query("organizations")
			.withIndex("by_clerk_org", (q) =>
				q.eq("clerkOrganizationId", args.organizationId)
			)
			.first();

		if (!org) {
			console.error(
				`Organization not found for Clerk ID: ${args.organizationId}`
			);
			return { success: false, error: "Organization not found" };
		}

		await ctx.db.patch(org._id, {
			subscriptionStatus: "past_due",
		});

		console.log(`Marked subscription as past due for organization ${org._id}`);

		return { success: true };
	},
});
