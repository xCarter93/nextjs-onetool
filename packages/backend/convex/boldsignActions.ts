"use node";
import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal, api } from "./_generated/api";
import { DocumentApi, DocumentSigner, DocumentCC, SendForSign } from "boldsign";

// ============================================================================
// BoldSign API Configuration
// ============================================================================

const LOG_PREFIX = "[BoldSign]";

/**
 * Get the BoldSign API key from environment, throwing if not configured.
 */
function getBoldSignApiKey(): string {
	const apiKey = process.env.BOLDSIGN_API_KEY;
	if (!apiKey) {
		throw new Error(
			"BOLDSIGN_API_KEY is not configured. Please add it to your environment variables."
		);
	}
	return apiKey;
}

/**
 * Initialize and configure the BoldSign DocumentApi client.
 */
function createDocumentApi(): InstanceType<typeof DocumentApi> {
	const apiKey = getBoldSignApiKey();
	const documentApi = new DocumentApi();
	documentApi.setApiKey(apiKey);
	return documentApi;
}

// ============================================================================
// Actions
// ============================================================================

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
		// Initialize BoldSign client
		const documentApi = createDocumentApi();

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
			`${LOG_PREFIX} Sending document with ${signers.length} signers and ${ccs.length} CCs`
		);
		const response = await documentApi.sendDocument(sendForSign);

		console.log(`${LOG_PREFIX} Document sent`, {
			boldsignDocumentId: response.documentId,
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

		console.log(`${LOG_PREFIX} Document and quote records updated`, {
			boldsignDocumentId: response.documentId,
		});
		return { success: true, documentId: response.documentId || "" };
	},
});

// Action to download completed/signed document from BoldSign
export const downloadCompletedDocument = action({
	args: {
		documentId: v.id("documents"),
		boldsignDocumentId: v.string(),
	},
	handler: async (ctx, args) => {
		// Validate API key is configured
		const apiKey = getBoldSignApiKey();

		console.log(`${LOG_PREFIX} Downloading completed document`, {
			boldsignDocumentId: args.boldsignDocumentId,
		});

		try {
			// Download the signed PDF from BoldSign API
			const downloadUrl = `https://api.boldsign.com/v1/document/download?documentId=${args.boldsignDocumentId}`;

			// Set up fetch timeout using AbortController
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

			let response;
			try {
				response = await fetch(downloadUrl, {
					method: "GET",
					headers: {
						accept: "application/pdf, application/octet-stream",
						"X-API-KEY": apiKey,
					},
					signal: controller.signal,
				});
			} catch (error) {
				clearTimeout(timeoutId);
				if ((error as Error).name === "AbortError") {
					throw new Error(
						"Request to download document from BoldSign timed out after 10 seconds"
					);
				}
				throw error;
			}

			// Clear timeout on success
			clearTimeout(timeoutId);

			if (!response.ok) {
				throw new Error(
					`Failed to download document from BoldSign: ${response.status} ${response.statusText}`
				);
			}

			// Get the PDF buffer
			const pdfBuffer = await response.arrayBuffer();

			// Store the signed PDF in Convex storage
			const blob = new Blob([pdfBuffer], { type: "application/pdf" });
			const signedStorageId = await ctx.storage.store(blob);

			console.log(`${LOG_PREFIX} Signed document stored`, {
				signedStorageId,
			});

			// Update the document record with the signed storage ID
			await ctx.runMutation(internal.boldsign.updateDocumentWithSignedPdf, {
				documentId: args.documentId,
				signedStorageId,
			});

			return { success: true, signedStorageId };
		} catch (error) {
			console.error(`${LOG_PREFIX} Error downloading completed document`, {
				boldsignDocumentId: args.boldsignDocumentId,
				error: error instanceof Error ? error.message : String(error),
			});
			throw error;
		}
	},
});
