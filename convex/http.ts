import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import type { WebhookEvent } from "@clerk/backend";
import { Webhook } from "svix";

const http = httpRouter();

/**
 * Comprehensive Clerk Webhook Handler
 *
 * Handles all Clerk events for users and organizations with:
 * - Robust error handling and logging
 * - Data validation before processing
 * - Graceful handling of webhook timing issues
 * - Support for organization lifecycle (create, update, delete)
 * - User membership management
 *
 * Supported Events:
 * - user.created / user.updated: Sync user data to Convex
 * - user.deleted: Clean up user data
 * - session.created: Update last sign-in date
 * - organization.created: Create organization metadata in Convex
 * - organization.updated: Sync organization name changes
 * - organization.deleted: Clean up organization and remove all members
 * - organizationMembership.created: Add user to organization
 * - organizationMembership.deleted: Remove user from organization
 */
http.route({
	path: "/clerk-users-webhook",
	method: "POST",
	handler: httpAction(async (ctx, request) => {
		const event = await validateRequest(request);
		if (!event) {
			return new Response("Error occured", { status: 400 });
		}
		switch (event.type) {
			case "user.created": // intentional fallthrough
			case "user.updated":
				await ctx.runMutation(internal.users.upsertFromClerk, {
					data: event.data,
				});
				break;

			case "user.deleted": {
				const clerkUserId = event.data.id!;
				await ctx.runMutation(internal.users.deleteFromClerk, { clerkUserId });
				break;
			}

			case "session.created": {
				const clerkUserId = event.data.user_id!;
				await ctx.runMutation(internal.users.updateLastSignedInDate, {
					clerkUserId,
				});
				break;
			}

			// Organization events
			case "organization.created": {
				const orgData = event.data;
				console.log("Processing organization.created webhook:", {
					orgId: orgData.id,
					name: orgData.name,
					createdBy: orgData.created_by,
					imageUrl: orgData.image_url,
				});

				if (!orgData.id || !orgData.name || !orgData.created_by) {
					console.error("Missing required organization data:", orgData);
					break;
				}

				try {
					await ctx.runMutation(internal.organizations.createFromClerk, {
						clerkOrganizationId: orgData.id,
						name: orgData.name,
						ownerClerkUserId: orgData.created_by,
						logoUrl: orgData.image_url || undefined,
					});
					console.log("Successfully created organization:", orgData.id);
				} catch (error) {
					console.error("Failed to create organization:", {
						orgId: orgData.id,
						error: error instanceof Error ? error.message : String(error),
					});
					// Don't throw - let webhook succeed but log the error
				}
				break;
			}

			case "organization.updated": {
				const orgData = event.data;
				console.log("Processing organization.updated webhook:", {
					orgId: orgData.id,
					name: orgData.name,
					imageUrl: orgData.image_url,
				});

				if (!orgData.id || !orgData.name) {
					console.error(
						"Missing required organization data for update:",
						orgData
					);
					break;
				}

				try {
					await ctx.runMutation(internal.organizations.updateFromClerk, {
						clerkOrganizationId: orgData.id,
						name: orgData.name,
						logoUrl: orgData.image_url || undefined,
					});
					console.log("Successfully updated organization:", orgData.id);
				} catch (error) {
					console.error("Failed to update organization:", {
						orgId: orgData.id,
						error: error instanceof Error ? error.message : String(error),
					});
				}
				break;
			}

			case "organization.deleted": {
				const orgData = event.data;
				console.log("Processing organization.deleted webhook:", {
					orgId: orgData.id,
				});

				if (!orgData.id) {
					console.error("Missing organization ID for deletion:", orgData);
					break;
				}

				try {
					await ctx.runMutation(internal.organizations.deleteFromClerk, {
						clerkOrganizationId: orgData.id,
					});
					console.log(
						"Successfully processed organization deletion:",
						orgData.id
					);
				} catch (error) {
					console.error("Failed to process organization deletion:", {
						orgId: orgData.id,
						error: error instanceof Error ? error.message : String(error),
					});
				}
				break;
			}

			case "organizationMembership.created": {
				const membershipData = event.data;
				const userId = membershipData.public_user_data?.user_id;
				const orgId = membershipData.organization?.id;

				console.log("Processing organizationMembership.created webhook:", {
					userId,
					orgId,
					role: membershipData.role,
				});

				if (!userId || !orgId) {
					console.error("Missing required membership data:", {
						userId,
						orgId,
						membershipData,
					});
					break;
				}

				try {
					await ctx.runMutation(internal.users.updateUserOrganization, {
						clerkUserId: userId,
						clerkOrganizationId: orgId,
						role: membershipData.role ?? undefined,
					});
					console.log("Successfully added user to organization:", {
						userId,
						orgId,
					});
				} catch (error) {
					console.error("Failed to add user to organization:", {
						userId,
						orgId,
						error: error instanceof Error ? error.message : String(error),
					});
				}
				break;
			}

			case "organizationMembership.updated": {
				const membershipData = event.data;
				const userId = membershipData.public_user_data?.user_id;
				const orgId = membershipData.organization?.id;

				console.log("Processing organizationMembership.updated webhook:", {
					userId,
					orgId,
					role: membershipData.role,
				});

				if (!userId || !orgId) {
					console.error("Missing required membership data for update:", {
						userId,
						orgId,
						membershipData,
					});
					break;
				}

				try {
					await ctx.runMutation(internal.users.updateUserOrganization, {
						clerkUserId: userId,
						clerkOrganizationId: orgId,
						role: membershipData.role ?? undefined,
					});
					console.log("Successfully updated user organization membership:", {
						userId,
						orgId,
						role: membershipData.role,
					});
				} catch (error) {
					console.error("Failed to update user organization membership:", {
						userId,
						orgId,
						error: error instanceof Error ? error.message : String(error),
					});
				}
				break;
			}

			case "organizationMembership.deleted": {
				const membershipData = event.data;
				const userId = membershipData.public_user_data?.user_id;

				console.log("Processing organizationMembership.deleted webhook:", {
					userId,
					orgId: membershipData.organization?.id,
				});

				if (!userId) {
					console.error(
						"Missing user ID for membership deletion:",
						membershipData
					);
					break;
				}

				const orgId = membershipData.organization?.id;
				if (!orgId) {
					console.error(
						"Missing organization ID for membership deletion:",
						membershipData
					);
					break;
				}

				try {
					await ctx.runMutation(internal.users.removeUserFromOrganization, {
						clerkUserId: userId,
						clerkOrganizationId: orgId,
					});
					console.log("Successfully removed user from organization:", userId);
				} catch (error) {
					console.error("Failed to remove user from organization:", {
						userId,
						error: error instanceof Error ? error.message : String(error),
					});
				}
				break;
			}

			default:
				console.log("Ignored Clerk webhook event", event.type);
		}

		return new Response(null, { status: 200 });
	}),
});

async function validateRequest(req: Request): Promise<WebhookEvent | null> {
	const payloadString = await req.text();
	const svixHeaders = {
		"svix-id": req.headers.get("svix-id")!,
		"svix-timestamp": req.headers.get("svix-timestamp")!,
		"svix-signature": req.headers.get("svix-signature")!,
	};
	const wh = new Webhook(process.env.CLERK_USER_WEBHOOK_SECRET!);
	try {
		return wh.verify(payloadString, svixHeaders) as unknown as WebhookEvent;
	} catch (error) {
		console.error("Error verifying webhook event", error);
		return null;
	}
}

async function validateBillingRequest(
	req: Request
): Promise<WebhookEvent | null> {
	const payloadString = await req.text();
	const svixHeaders = {
		"svix-id": req.headers.get("svix-id")!,
		"svix-timestamp": req.headers.get("svix-timestamp")!,
		"svix-signature": req.headers.get("svix-signature")!,
	};
	const wh = new Webhook(process.env.CLERK_BILLING_WEBHOOK_SECRET!);
	try {
		return wh.verify(payloadString, svixHeaders) as unknown as WebhookEvent;
	} catch (error) {
		console.error("Error verifying billing webhook event", error);
		return null;
	}
}

/**
 * BoldSign Webhook Handler
 *
 * Handles BoldSign e-signature document events:
 * - Verification: Initial webhook URL verification during setup
 * - Completed: Document was signed by all parties
 * - Declined: Document was declined by a signer
 * - Revoked: Document was revoked by sender
 * - Expired: Document expired before completion
 */
http.route({
	path: "/boldsign-webhook",
	method: "POST",
	handler: httpAction(async (ctx, request) => {
		const payloadString = await request.text();

		// Handle BoldSign verification event (sent during webhook setup)
		const event = JSON.parse(payloadString);
		if (event.event?.eventType === "Verification") {
			console.log("BoldSign webhook verification received");
			return new Response("OK", { status: 200 });
		}

		// Verify webhook signature for actual events (optional)
		const signatureHeader = request.headers.get("x-boldsign-signature");

		// Only verify if we have a webhook secret configured
		if (process.env.BOLDSIGN_WEBHOOK_SECRET) {
			if (!signatureHeader) {
				console.warn("BoldSign webhook received without signature header");
				return new Response("Unauthorized", { status: 401 });
			} else {
				// Parse the signature header: "t=timestamp, s0=signature"
				const sigParts: Record<string, string> = {};
				signatureHeader.split(",").forEach((part) => {
					const [key, value] = part.trim().split("=");
					sigParts[key] = value;
				});

				const timestamp = sigParts["t"];
				const signature = sigParts["s0"]; // Primary signature

				if (!timestamp || !signature) {
					console.error("Invalid BoldSign signature format:", signatureHeader);
					return new Response("Unauthorized", { status: 401 });
				}

				// Create the signed payload: timestamp.payload
				const signedPayload = `${timestamp}.${payloadString}`;

				// Use Web Crypto API for HMAC verification
				const encoder = new TextEncoder();
				const key = await crypto.subtle.importKey(
					"raw",
					encoder.encode(process.env.BOLDSIGN_WEBHOOK_SECRET),
					{ name: "HMAC", hash: "SHA-256" },
					false,
					["sign"]
				);

				const signatureBytes = await crypto.subtle.sign(
					"HMAC",
					key,
					encoder.encode(signedPayload)
				);

				// Convert to hex string
				const expectedSignature = Array.from(new Uint8Array(signatureBytes))
					.map((b) => b.toString(16).padStart(2, "0"))
					.join("");

				if (signature !== expectedSignature) {
					console.error(
						"BoldSign webhook signature verification failed",
						"Expected:",
						expectedSignature.substring(0, 20) + "...",
						"Received:",
						signature?.substring(0, 20) + "..."
					);
					return new Response("Unauthorized", { status: 401 });
				}

				console.log("BoldSign webhook signature verified successfully");
			}
		} else {
			console.log(
				"BoldSign webhook received (signature verification skipped - no secret configured)"
			);
		}

		// Handle document status events
		console.log(
			"BoldSign webhook event received:",
			event.event?.eventType,
			"for document:",
			event.data?.documentId || event.documentId
		);

		const eventType = event.event?.eventType;
		const boldsignDocumentId = event.data?.documentId || event.documentId;

		// BoldSign returns timestamps in seconds, convert to milliseconds
		const eventTimestamp = event.event?.created
			? event.event.created * 1000
			: undefined;

		// Handle all signature lifecycle events
		switch (eventType) {
			case "Sent":
			case "Viewed":
			case "Signed":
			case "Completed":
			case "Declined":
			case "Revoked":
			case "Expired":
				await ctx.runMutation(internal.boldsign.handleWebhook, {
					boldsignDocumentId,
					eventType,
					eventTimestamp,
				});
				console.log(
					`Document status updated successfully: ${eventType} for ${boldsignDocumentId}`
				);
				break;
			default:
				console.log("Unhandled BoldSign event type:", eventType);
		}

		return new Response("OK", { status: 200 });
	}),
});

/**
 * Clerk Billing Webhook Handler
 *
 * Handles Clerk billing events for subscriptions and payments:
 * - paymentAttempt.created: Log new payment attempts
 * - paymentAttempt.updated: Track payment status changes
 * - subscription.created: Initialize new subscriptions
 * - subscription.active: Activate premium features
 * - subscription.updated: Sync subscription changes
 * - subscription.pastDue: Handle payment failures
 */
http.route({
	path: "/clerk-billing-webhook",
	method: "POST",
	handler: httpAction(async (ctx, request) => {
		const event = await validateBillingRequest(request);
		if (!event) {
			return new Response("Error validating webhook", { status: 400 });
		}

		console.log("Received billing webhook event:", event.type);

		// Type definitions for Clerk billing webhook data
		interface BillingWebhookData {
			id: string;
			organization_id?: string;
			user_id?: string;
			amount?: number;
			status?: string;
			plan_id?: string;
			plan?: { id: string };
			current_period_start?: number;
			payer?: {
				organization_id?: string;
				user_id?: string;
			};
		}

		switch (event.type) {
			case "paymentAttempt.created": {
				const data = event.data as BillingWebhookData;
				await ctx.runMutation(
					internal.billingWebhook.handlePaymentAttemptCreated,
					{
						paymentAttemptId: data.id,
						userId: data.user_id,
						amount: data.amount,
					}
				);
				break;
			}

			case "paymentAttempt.updated": {
				const data = event.data as BillingWebhookData;
				await ctx.runMutation(
					internal.billingWebhook.handlePaymentAttemptUpdated,
					{
						paymentAttemptId: data.id,
						status: data.status,
						userId: data.user_id,
					}
				);
				break;
			}

			case "subscription.created": {
				const data = event.data as BillingWebhookData;
				const organizationId =
					data.payer?.organization_id || data.organization_id;
				const userId = data.payer?.user_id || data.user_id;

				if (!userId && !organizationId) {
					console.error(
						"No user_id or organization_id in subscription.created event"
					);
					break;
				}
				await ctx.runMutation(
					internal.billingWebhook.handleSubscriptionCreated,
					{
						subscriptionId: data.id,
						userId: userId || undefined,
						organizationId: organizationId || undefined,
						planId: data.plan_id || data.plan?.id || "",
						status: data.status || "active",
						currentPeriodStart: data.current_period_start
							? data.current_period_start * 1000
							: undefined,
					}
				);
				break;
			}

			case "subscription.active": {
				const data = event.data as BillingWebhookData;
				const organizationId =
					data.payer?.organization_id || data.organization_id;
				const userId = data.payer?.user_id || data.user_id;

				if (!userId && !organizationId) {
					console.error(
						"No user_id or organization_id in subscription.active event"
					);
					break;
				}
				await ctx.runMutation(
					internal.billingWebhook.handleSubscriptionActive,
					{
						subscriptionId: data.id,
						userId: userId || undefined,
						organizationId: organizationId || undefined,
						planId: data.plan_id || data.plan?.id || "",
						currentPeriodStart: data.current_period_start
							? data.current_period_start * 1000
							: undefined,
					}
				);
				break;
			}

			case "subscription.updated": {
				const data = event.data as BillingWebhookData;
				console.log("subscription.updated event data:", data);

				const organizationId =
					data.payer?.organization_id || data.organization_id;
				const userId = data.payer?.user_id || data.user_id;

				if (!userId && !organizationId) {
					console.error(
						"No user_id or organization_id in subscription.updated event"
					);
					break;
				}
				await ctx.runMutation(
					internal.billingWebhook.handleSubscriptionUpdated,
					{
						subscriptionId: data.id,
						userId: userId || undefined,
						organizationId: organizationId || undefined,
						planId: data.plan_id || data.plan?.id || "",
						status: data.status || "active",
						currentPeriodStart: data.current_period_start
							? data.current_period_start * 1000
							: undefined,
					}
				);
				break;
			}

			case "subscription.pastDue": {
				const data = event.data as BillingWebhookData;
				const organizationId =
					data.payer?.organization_id || data.organization_id;
				const userId = data.payer?.user_id || data.user_id;

				if (!userId && !organizationId) {
					console.error(
						"No user_id or organization_id in subscription.pastDue event"
					);
					break;
				}
				await ctx.runMutation(
					internal.billingWebhook.handleSubscriptionPastDue,
					{
						subscriptionId: data.id,
						userId: userId || undefined,
						organizationId: organizationId || undefined,
					}
				);
				break;
			}

			default:
				console.log("Ignored billing webhook event:", event.type);
		}

		return new Response(null, { status: 200 });
	}),
});

/**
 * Resend Email Webhook Handler
 *
 * Handles Resend email events for tracking:
 * - email.sent: Email was accepted by Resend
 * - email.delivered: Email was delivered to recipient
 * - email.opened: Email was opened by recipient
 * - email.bounced: Email bounced
 * - email.complained: Recipient marked as spam
 */
http.route({
	path: "/resend-webhook",
	method: "POST",
	handler: httpAction(async (ctx, request) => {
		const payloadString = await request.text();

		try {
			const event = JSON.parse(payloadString);

			// Validate webhook signature if secret is configured
			if (process.env.RESEND_WEBHOOK_SECRET) {
				const signatureHeader = request.headers.get("svix-signature");
				const svixId = request.headers.get("svix-id");
				const svixTimestamp = request.headers.get("svix-timestamp");

				if (!signatureHeader) {
					console.warn("Resend webhook received without signature header");
					return new Response("Unauthorized", { status: 401 });
				}

				if (!svixId) {
					console.error("Resend webhook received without svix-id header");
					return new Response("Unauthorized", { status: 401 });
				}

				if (!svixTimestamp) {
					console.error(
						"Resend webhook received without svix-timestamp header"
					);
					return new Response("Unauthorized", { status: 401 });
				}

				// Use svix to validate (Resend uses Svix for webhooks)
				const wh = new Webhook(process.env.RESEND_WEBHOOK_SECRET);
				try {
					wh.verify(payloadString, {
						"svix-id": svixId,
						"svix-timestamp": svixTimestamp,
						"svix-signature": signatureHeader,
					});
				} catch (error) {
					console.error("Resend webhook signature verification failed:", error);
					return new Response("Unauthorized", { status: 401 });
				}
			}

			console.log("Resend webhook event received:", event.type);

			const eventType = event.type;
			const emailId = event.data?.email_id;

			if (!emailId) {
				console.warn("No email_id in Resend webhook event");
				return new Response("Bad Request", { status: 400 });
			}

			// Resend timestamps are in ISO format, convert to milliseconds
			const eventTimestamp = event.created_at
				? new Date(event.created_at).getTime()
				: Date.now();

			// Handle email events
			switch (eventType) {
				case "email.sent":
				case "email.delivered":
				case "email.delivered_delayed":
				case "email.opened":
				case "email.bounced":
				case "email.complained":
					await ctx.runMutation(internal.resendWebhook.handleWebhookEvent, {
						eventType,
						emailId,
						timestamp: eventTimestamp,
					});
					console.log(`Processed Resend webhook: ${eventType} for ${emailId}`);
					break;

				case "email.received":
					// Handle inbound email (use runAction instead of runMutation)
					// Note: Webhook payload does NOT include html/text content, only metadata
					// We need to fetch content separately using the Received emails API
					console.log("Processing inbound email:", emailId);
					try {
						await ctx.runAction(internal.resendReceiving.handleInboundEmail, {
							emailId,
							from: event.data.from || "",
							to: event.data.to || [],
							subject: event.data.subject || "(No subject)",
							messageId: event.data.message_id || emailId,
							inReplyTo: event.data.in_reply_to,
							references: event.data.references,
							attachments: event.data.attachments || [],
						});
						console.log(`Successfully processed inbound email: ${emailId}`);
					} catch (error) {
						console.error("Error processing inbound email:", error);
						// Return 200 anyway to prevent Resend from retrying
					}
					break;

				default:
					console.log("Unhandled Resend event type:", eventType);
			}

			return new Response("OK", { status: 200 });
		} catch (error) {
			console.error("Error processing Resend webhook:", error);
			return new Response("Internal Server Error", { status: 500 });
		}
	}),
});

export default http;
