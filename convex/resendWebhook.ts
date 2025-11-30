import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Process Resend webhook events for email tracking
 */
export const handleWebhookEvent = internalMutation({
	args: {
		eventType: v.union(
			v.literal("email.sent"),
			v.literal("email.delivered"),
			v.literal("email.delivered_delayed"),
			v.literal("email.complained"),
			v.literal("email.bounced"),
			v.literal("email.opened")
		),
		emailId: v.string(),
		timestamp: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		const eventTimestamp = args.timestamp || Date.now();

		// Find the email message by Resend email ID
		const emailMessage = await ctx.db
			.query("emailMessages")
			.withIndex("by_resend_id", (q) => q.eq("resendEmailId", args.emailId))
			.first();

		if (!emailMessage) {
			// This can happen for outbound emails if the webhook arrives before we've saved the record,
			// or if this is an email sent from another source.
			// For inbound emails, this shouldn't happen as we create them when processing.
			console.warn(`Email message not found for Resend ID: ${args.emailId} (event: ${args.eventType})`);
			return { success: false, message: "Email message not found" };
		}

		// Update email status based on event type
		switch (args.eventType) {
			case "email.delivered":
			case "email.delivered_delayed":
				await ctx.db.patch(emailMessage._id, {
					status: "delivered",
					deliveredAt: eventTimestamp,
				});

				// Create activity for delivery
				await ctx.db.insert("activities", {
					orgId: emailMessage.orgId,
					userId: emailMessage.sentBy,
					activityType: "email_delivered",
					entityType: "client",
					entityId: emailMessage.clientId,
					entityName: emailMessage.toName,
					description: `Email delivered: ${emailMessage.subject}`,
					metadata: {
						emailId: emailMessage._id,
						subject: emailMessage.subject,
					},
					timestamp: eventTimestamp,
					isVisible: true,
				});
				break;

			case "email.opened":
				// Only update if not already opened
				if (!emailMessage.openedAt) {
					await ctx.db.patch(emailMessage._id, {
						status: "opened",
						openedAt: eventTimestamp,
					});

					// Create activity for first open
					await ctx.db.insert("activities", {
						orgId: emailMessage.orgId,
						userId: emailMessage.sentBy,
						activityType: "email_opened",
						entityType: "client",
						entityId: emailMessage.clientId,
						entityName: emailMessage.toName,
						description: `Email opened: ${emailMessage.subject}`,
						metadata: {
							emailId: emailMessage._id,
							subject: emailMessage.subject,
						},
						timestamp: eventTimestamp,
						isVisible: true,
					});
				}
				break;

			case "email.bounced":
				await ctx.db.patch(emailMessage._id, {
					status: "bounced",
					bouncedAt: eventTimestamp,
				});
				break;

			case "email.complained":
				await ctx.db.patch(emailMessage._id, {
					status: "complained",
					complainedAt: eventTimestamp,
				});
				break;

			case "email.sent":
				// Update sent timestamp if needed
				if (!emailMessage.sentAt) {
					await ctx.db.patch(emailMessage._id, {
						sentAt: eventTimestamp,
					});
				}
				break;
		}

		return { success: true };
	},
});

