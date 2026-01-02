import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { internal, api } from "./_generated/api";

// Internal mutation to update document with BoldSign info
export const updateDocumentWithBoldSign = internalMutation({
	args: {
		documentId: v.id("documents"),
		boldsignDocumentId: v.string(),
		recipients: v.array(
			v.object({
				id: v.optional(v.string()),
				name: v.string(),
				email: v.string(),
				signerType: v.union(v.literal("Signer"), v.literal("CC")),
			})
		),
		viewUrl: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		// Verify document exists before patching
		const document = await ctx.db.get(args.documentId);
		if (!document) {
			throw new Error(`Document not found: ${args.documentId}`);
		}

		await ctx.db.patch(args.documentId, {
			boldsignDocumentId: args.boldsignDocumentId,
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
		// Verify quote exists before patching
		const quote = await ctx.db.get(args.quoteId);
		if (!quote) {
			throw new Error("Quote not found");
		}

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
		// Find document by BoldSign document ID using index
		const document = await ctx.db
			.query("documents")
			.withIndex("by_boldsign_documentId", (q) =>
				q.eq("boldsignDocumentId", args.boldsignDocumentId)
			)
			.first();

		if (!document) {
			throw new Error(
				`Document not found for BoldSign document ID: ${args.boldsignDocumentId}`
			);
		}

		if (!document.boldsign) {
			throw new Error(
				`Document missing BoldSign data for BoldSign document ID: ${args.boldsignDocumentId}`
			);
		}

		const timestamp = args.eventTimestamp || Date.now();

		// Build the updated boldsign object based on event type
		const updatedBoldsign = { ...document.boldsign };

		switch (args.eventType) {
			case "Sent":
				updatedBoldsign.status = "Sent";
				updatedBoldsign.sentAt = timestamp;
				// Track e-signature usage for plan limits
				await ctx.scheduler.runAfter(
					0,
					internal.usage.incrementEsignatureCount,
					{
						orgId: document.orgId,
					}
				);
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
			// Try to get the quote - documentId should be a valid quote ID
			const quote = await ctx.db.get(document.documentId as Id<"quotes">);

			if (!quote) {
				console.warn(
					`Quote not found for document ${document._id} with documentId: ${document.documentId}`
				);
				return;
			}

			const quoteUpdates: {
				status?: "approved" | "declined" | "expired";
				approvedAt?: number;
				declinedAt?: number;
			} = {};

			// Update quote status based on BoldSign event
			if (args.eventType === "Completed") {
				quoteUpdates.status = "approved";
				quoteUpdates.approvedAt = timestamp;

				// Download signed document if quote has a project
				if (quote.projectId) {
					console.log(
						`Scheduling download of signed document for quote ${quote._id} linked to project ${quote.projectId}`
					);
					await ctx.scheduler.runAfter(
						0,
						internal.boldsign.triggerDocumentDownload,
						{
							documentId: document._id,
							boldsignDocumentId: args.boldsignDocumentId,
						}
					);
				} else {
					console.log(
						`Skipping download for quote ${quote._id} - no project linked`
					);
				}
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
	},
});

// Internal mutation to update document with signed PDF storage ID
export const updateDocumentWithSignedPdf = internalMutation({
	args: {
		documentId: v.id("documents"),
		signedStorageId: v.id("_storage"),
	},
	handler: async (ctx, args) => {
		// Verify document exists before patching
		const document = await ctx.db.get(args.documentId);
		if (!document) {
			throw new Error(`Document not found: ${args.documentId}`);
		}

		await ctx.db.patch(args.documentId, {
			signedStorageId: args.signedStorageId,
		});

		console.log(
			`Document ${args.documentId} updated with signed storage ID: ${args.signedStorageId}`
		);
	},
});

// Internal mutation wrapper to trigger document download action
export const triggerDocumentDownload = internalMutation({
	args: {
		documentId: v.id("documents"),
		boldsignDocumentId: v.string(),
	},
	handler: async (ctx, args) => {
		// Call the download action
		await ctx.scheduler.runAfter(
			0,
			api.boldsignActions.downloadCompletedDocument,
			{
				documentId: args.documentId,
				boldsignDocumentId: args.boldsignDocumentId,
			}
		);
	},
});
