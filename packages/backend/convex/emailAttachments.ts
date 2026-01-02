import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser, getCurrentUserOrgId } from "./lib/auth";

/**
 * List all attachments for an email message
 */
export const listByEmail = query({
	args: {
		emailMessageId: v.id("emailMessages"),
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

		// Verify the email belongs to the user's organization
		const email = await ctx.db.get(args.emailMessageId);
		if (!email || email.orgId !== orgId) {
			return [];
		}

		const attachments = await ctx.db
			.query("emailAttachments")
			.withIndex("by_email", (q) => q.eq("emailMessageId", args.emailMessageId))
			.collect();

		return attachments;
	},
});

/**
 * Get download URL for an attachment
 */
export const getDownloadUrl = query({
	args: {
		attachmentId: v.id("emailAttachments"),
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

		const attachment = await ctx.db.get(args.attachmentId);
		if (!attachment || attachment.orgId !== orgId) {
			return null;
		}

		if (!attachment.storageId) {
			return null;
		}

		const url = await ctx.storage.getUrl(attachment.storageId);
		return url;
	},
});

/**
 * Mark an attachment as downloaded (for tracking purposes)
 */
export const markAsDownloaded = mutation({
	args: {
		attachmentId: v.id("emailAttachments"),
	},
	handler: async (ctx, args) => {
		const user = await getCurrentUser(ctx);
		if (!user) {
			return { success: false };
		}

		const orgId = await getCurrentUserOrgId(ctx, { require: false });
		if (!orgId) {
			return { success: false };
		}

		const attachment = await ctx.db.get(args.attachmentId);
		if (!attachment || attachment.orgId !== orgId) {
			return { success: false };
		}

		// In the future, you could add a downloadCount field to track this
		// For now, just return success
		return { success: true };
	},
});

