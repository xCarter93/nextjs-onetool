"use node";
import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal, api } from "./_generated/api";
import { DocumentApi, DocumentSigner, DocumentCC, SendForSign } from "boldsign";

// Action to send document via BoldSign
export const sendDocumentForSignature = action({
	args: {
		quoteId: v.id("quotes"),
		documentId: v.id("documents"),
		recipients: v.array(
			v.object({
				id: v.optional(v.string()),
				name: v.string(),
				email: v.string(),
				signerType: v.union(v.literal("Signer"), v.literal("CC")),
			})
		),
		documentUrl: v.string(), // URL to the generated PDF
		message: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		// Check if API key is configured
		const apiKey = process.env.BOLDSIGN_API_KEY;
		if (!apiKey) {
			throw new Error(
				"BOLDSIGN_API_KEY is not configured. Please add it to your environment variables."
			);
		}
		// Initialize BoldSign client
		const documentApi = new DocumentApi();
		documentApi.setApiKey(apiKey);

		// Fetch quote details
		const quote = await ctx.runQuery(api.quotes.get, { id: args.quoteId });
		if (!quote) throw new Error("Quote not found");

		// Download PDF
		const pdfResponse = await fetch(args.documentUrl);
		if (!pdfResponse.ok) {
			throw new Error(
				`Failed to download document ${args.documentUrl}: ${pdfResponse.status} ${pdfResponse.statusText}`
			);
		}
		const pdfBuffer = await pdfResponse.arrayBuffer();
		const pdfBufferNode = Buffer.from(pdfBuffer);

		// Prepare signers and CCs
		const signers: InstanceType<typeof DocumentSigner>[] = [];
		const ccs: InstanceType<typeof DocumentCC>[] = [];

		args.recipients.forEach((recipient, index) => {
			if (recipient.signerType === "Signer") {
				const signer = new DocumentSigner();
				signer.name = recipient.name;
				signer.emailAddress = recipient.email;
				signer.signerOrder = index + 1;
				signers.push(signer);
			} else if (recipient.signerType === "CC") {
				const cc = new DocumentCC();
				cc.emailAddress = recipient.email;
				ccs.push(cc);
			}
		});

		// Prepare file
		const file = {
			value: pdfBufferNode,
			options: {
				filename: `Quote-${quote.quoteNumber || quote._id.slice(-6)}.pdf`,
				contentType: "application/pdf",
			},
		};

		// Prepare send request
		const sendForSign = new SendForSign();
		sendForSign.title = `Quote ${quote.quoteNumber || quote._id.slice(-6)}`;
		sendForSign.message =
			args.message ||
			quote.clientMessage ||
			"Please review and sign this quote.";
		sendForSign.signers = signers;
		if (ccs.length > 0) {
			sendForSign.cc = ccs;
		}
		sendForSign.files = [file];
		sendForSign.useTextTags = true; // Enable text tag detection with correct format
		sendForSign.enableSigningOrder = false;
		sendForSign.reminderSettings = {
			enableAutoReminder: true,
			reminderDays: 3,
		};

		// Send document
		console.log(
			"Sending document to BoldSign with",
			signers.length,
			"signers and",
			ccs.length,
			"CCs"
		);
		const response = await documentApi.sendDocument(sendForSign);

		console.log("BoldSign response:", {
			documentId: response.documentId,
			success: !!response.documentId,
		});

		// Update document with BoldSign info
		await ctx.runMutation(internal.boldsign.updateDocumentWithBoldSign, {
			documentId: args.documentId,
			boldsignDocumentId: response.documentId || "",
			recipients: args.recipients,
			viewUrl: undefined, // BoldSign doesn't return a view URL in the response
		});

		// Update quote's latestDocumentId reference
		await ctx.runMutation(internal.boldsign.updateQuoteLatestDocument, {
			quoteId: args.quoteId,
			documentId: args.documentId,
		});

		console.log(
			"Document and quote updated with BoldSign info, documentId:",
			response.documentId
		);
		return { success: true, documentId: response.documentId || "" };
	},
});
