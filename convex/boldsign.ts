import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

// Internal mutation to update document with BoldSign info
export const updateDocumentWithBoldSign = internalMutation({
	args: {
		documentId: v.id("documents"),
		boldsignDocumentId: v.string(),
		recipients: v.array(
			v.object({
				name: v.string(),
				email: v.string(),
				signerType: v.union(v.literal("Signer"), v.literal("CC")),
			})
		),
		viewUrl: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await ctx.db.patch(args.documentId, {
			boldsign: {
				documentId: args.boldsignDocumentId,
				status: "Sent",
				sentTo: args.recipients,
				sentAt: Date.now(),
				viewUrl: args.viewUrl,
			},
		});
	},
});

// Internal mutation to update quote's latestDocumentId
export const updateQuoteLatestDocument = internalMutation({
	args: {
		quoteId: v.id("quotes"),
		documentId: v.id("documents"),
	},
	handler: async (ctx, args) => {
		await ctx.db.patch(args.quoteId, {
			latestDocumentId: args.documentId,
			status: "sent",
			sentAt: Date.now(),
		});
	},
});

// Internal mutation to handle webhook events
export const handleWebhook = internalMutation({
	args: {
		boldsignDocumentId: v.string(),
		eventType: v.string(),
		eventTimestamp: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		// Find document by BoldSign document ID
		const allDocuments = await ctx.db.query("documents").collect();
		const document = allDocuments.find(
			(d) => d.boldsign?.documentId === args.boldsignDocumentId
		);

		if (!document || !document.boldsign) {
			console.log(
				"Document not found for BoldSign ID:",
				args.boldsignDocumentId
			);
			return;
		}

		const timestamp = args.eventTimestamp || Date.now();

		// Build the updated boldsign object based on event type
		const updatedBoldsign = { ...document.boldsign };

		switch (args.eventType) {
			case "Sent":
				updatedBoldsign.status = "Sent";
				updatedBoldsign.sentAt = timestamp;
				break;
			case "Viewed":
				updatedBoldsign.status = "Viewed";
				updatedBoldsign.viewedAt = timestamp;
				break;
			case "Signed":
				updatedBoldsign.status = "Signed";
				updatedBoldsign.signedAt = timestamp;
				break;
			case "Completed":
				updatedBoldsign.status = "Completed";
				updatedBoldsign.completedAt = timestamp;
				break;
			case "Declined":
				updatedBoldsign.status = "Declined";
				updatedBoldsign.declinedAt = timestamp;
				break;
			case "Revoked":
				updatedBoldsign.status = "Revoked";
				updatedBoldsign.revokedAt = timestamp;
				break;
			case "Expired":
				updatedBoldsign.status = "Expired";
				updatedBoldsign.expiredAt = timestamp;
				break;
			default:
				console.log("Unhandled event type:", args.eventType);
				return;
		}

		// Update the document
		await ctx.db.patch(document._id, {
			boldsign: updatedBoldsign,
		});

		// If the document is associated with a quote, update quote status
		if (document.documentType === "quote") {
			const quote = await ctx.db.get(document.documentId as any);
			if (quote) {
				const quoteUpdates: any = {};

				// Update quote status based on BoldSign event
				if (args.eventType === "Completed") {
					quoteUpdates.status = "approved";
					quoteUpdates.approvedAt = timestamp;
				} else if (args.eventType === "Declined") {
					quoteUpdates.status = "declined";
					quoteUpdates.declinedAt = timestamp;
				} else if (args.eventType === "Expired") {
					quoteUpdates.status = "expired";
				}

				if (Object.keys(quoteUpdates).length > 0) {
					await ctx.db.patch(quote._id, quoteUpdates);
				}
			}
		}
	},
});
