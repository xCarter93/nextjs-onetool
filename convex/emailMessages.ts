import { query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser, getCurrentUserOrgId } from "./lib/auth";

/**
 * List emails sent to a specific client
 */
export const listByClient = query({
	args: {
		clientId: v.id("clients"),
	},
	handler: async (ctx, args) => {
		const user = await getCurrentUser(ctx);
		if (!user) {
			return [];
		}

		const orgId = await getCurrentUserOrgId(ctx, { require: false });
		if (!orgId) {
			return [];
		}

		// Get emails for this client
		const emails = await ctx.db
			.query("emailMessages")
			.withIndex("by_client", (q) => q.eq("clientId", args.clientId))
			.order("desc")
			.collect();

		// Filter to only emails from the user's organization
		return emails.filter((email) => email.orgId === orgId);
	},
});

/**
 * Get a specific email by Resend email ID
 */
export const getByResendId = query({
	args: {
		resendEmailId: v.string(),
	},
	handler: async (ctx, args) => {
		const user = await getCurrentUser(ctx);
		if (!user) {
			return null;
		}

		const orgId = await getCurrentUserOrgId(ctx, { require: false });
		if (!orgId) {
			return null;
		}

		const email = await ctx.db
			.query("emailMessages")
			.withIndex("by_resend_id", (q) =>
				q.eq("resendEmailId", args.resendEmailId)
			)
			.first();

		if (!email || email.orgId !== orgId) {
			return null;
		}

		return email;
	},
});

/**
 * Get recent email activities for the organization
 */
export const getRecentEmails = query({
	args: {
		limit: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		const user = await getCurrentUser(ctx);
		if (!user) {
			return [];
		}

		const orgId = await getCurrentUserOrgId(ctx, { require: false });
		if (!orgId) {
			return [];
		}

		const emails = await ctx.db
			.query("emailMessages")
			.withIndex("by_org", (q) => q.eq("orgId", orgId))
			.order("desc")
			.take(args.limit || 50);

		return emails;
	},
});

/**
 * Count unread/unopened emails for a client
 */
export const countUnopened = query({
	args: {
		clientId: v.id("clients"),
	},
	handler: async (ctx, args) => {
		const user = await getCurrentUser(ctx);
		if (!user) {
			return 0;
		}

		const orgId = await getCurrentUserOrgId(ctx, { require: false });
		if (!orgId) {
			return 0;
		}

		const emails = await ctx.db
			.query("emailMessages")
			.withIndex("by_client_status", (q) =>
				q.eq("clientId", args.clientId).eq("status", "sent")
			)
			.collect();

		// Filter to only emails from the user's organization
		const orgEmails = emails.filter((email) => email.orgId === orgId);

		// Count emails that are sent or delivered but not opened
		return orgEmails.filter(
			(email) =>
				!email.openedAt &&
				(email.status === "sent" || email.status === "delivered")
		).length;
	},
});

/**
 * Get email statistics for a client
 */
export const getClientEmailStats = query({
	args: {
		clientId: v.id("clients"),
	},
	handler: async (ctx, args) => {
		const user = await getCurrentUser(ctx);
		if (!user) {
			return null;
		}

		const orgId = await getCurrentUserOrgId(ctx, { require: false });
		if (!orgId) {
			return null;
		}

		const emails = await ctx.db
			.query("emailMessages")
			.withIndex("by_client", (q) => q.eq("clientId", args.clientId))
			.collect();

		// Filter to only emails from the user's organization
		const orgEmails = emails.filter((email) => email.orgId === orgId);

		const stats = {
			total: orgEmails.length,
			sent: orgEmails.filter((e) => e.status === "sent").length,
			delivered: orgEmails.filter((e) => e.status === "delivered").length,
			opened: orgEmails.filter((e) => e.status === "opened").length,
			bounced: orgEmails.filter((e) => e.status === "bounced").length,
			complained: orgEmails.filter((e) => e.status === "complained").length,
			openRate:
				orgEmails.length > 0
					? Math.round(
							(orgEmails.filter((e) => e.openedAt).length / orgEmails.length) *
								100
						)
					: 0,
		};

		return stats;
	},
});
