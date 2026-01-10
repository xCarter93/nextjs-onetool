/**
 * Shared Webhook Utilities
 *
 * Common patterns for webhook handling across different integrations
 * (Clerk, BoldSign, Resend, Stripe).
 */

import type { WebhookEvent } from "@clerk/backend";
import { Webhook } from "svix";

// ============================================================================
// Types
// ============================================================================

/**
 * Result of webhook signature verification
 */
export interface WebhookVerificationResult<T = unknown> {
	valid: boolean;
	payload?: T;
	error?: string;
}

/**
 * Standard webhook response helper
 */
export interface WebhookResponse {
	status: number;
	body?: string;
}

// ============================================================================
// Svix Webhook Verification (Used by Clerk and Resend)
// ============================================================================

/**
 * Verify a webhook request using Svix (used by Clerk and Resend)
 */
export async function verifySvixWebhook(
	request: Request,
	secret: string
): Promise<WebhookVerificationResult<WebhookEvent>> {
	const payloadString = await request.text();
	const svixHeaders = {
		"svix-id": request.headers.get("svix-id") ?? "",
		"svix-timestamp": request.headers.get("svix-timestamp") ?? "",
		"svix-signature": request.headers.get("svix-signature") ?? "",
	};

	if (!svixHeaders["svix-id"] || !svixHeaders["svix-timestamp"] || !svixHeaders["svix-signature"]) {
		return {
			valid: false,
			error: "Missing required Svix headers",
		};
	}

	const wh = new Webhook(secret);

	try {
		const payload = wh.verify(payloadString, svixHeaders) as unknown as WebhookEvent;
		return { valid: true, payload };
	} catch (error) {
		console.error("Svix webhook verification failed:", error);
		return {
			valid: false,
			error: error instanceof Error ? error.message : "Verification failed",
		};
	}
}

// ============================================================================
// HMAC Webhook Verification (Used by BoldSign)
// ============================================================================

/**
 * Verify BoldSign webhook signature using HMAC-SHA256
 *
 * BoldSign signature format: "t=timestamp, s0=signature"
 */
export async function verifyBoldSignWebhook(
	request: Request,
	secret: string
): Promise<WebhookVerificationResult<Record<string, unknown>>> {
	const payloadString = await request.text();
	const signatureHeader = request.headers.get("x-boldsign-signature");

	if (!signatureHeader) {
		return {
			valid: false,
			error: "Missing BoldSign signature header",
		};
	}

	// Parse signature header
	const sigParts: Record<string, string> = {};
	signatureHeader.split(",").forEach((part) => {
		const [key, value] = part.trim().split("=");
		sigParts[key] = value;
	});

	const timestamp = sigParts["t"];
	const signature = sigParts["s0"];

	if (!timestamp || !signature) {
		return {
			valid: false,
			error: "Invalid BoldSign signature format",
		};
	}

	// Verify HMAC signature
	const signedPayload = `${timestamp}.${payloadString}`;
	const encoder = new TextEncoder();

	try {
		const key = await crypto.subtle.importKey(
			"raw",
			encoder.encode(secret),
			{ name: "HMAC", hash: "SHA-256" },
			false,
			["sign"]
		);

		const signatureBytes = await crypto.subtle.sign(
			"HMAC",
			key,
			encoder.encode(signedPayload)
		);

		const expectedSignature = Array.from(new Uint8Array(signatureBytes))
			.map((b) => b.toString(16).padStart(2, "0"))
			.join("");

		if (signature !== expectedSignature) {
			return {
				valid: false,
				error: "Signature mismatch",
			};
		}

		const payload = JSON.parse(payloadString);
		return { valid: true, payload };
	} catch (error) {
		console.error("BoldSign webhook verification failed:", error);
		return {
			valid: false,
			error: error instanceof Error ? error.message : "Verification failed",
		};
	}
}

// ============================================================================
// Response Helpers
// ============================================================================

/**
 * Create a successful webhook response
 */
export function webhookSuccess(body?: string): Response {
	return new Response(body ?? null, { status: 200 });
}

/**
 * Create an error webhook response
 */
export function webhookError(status: number, message?: string): Response {
	return new Response(message ?? "Error", { status });
}

/**
 * Create an unauthorized webhook response
 */
export function webhookUnauthorized(message?: string): Response {
	return webhookError(401, message ?? "Unauthorized");
}

/**
 * Create a bad request webhook response
 */
export function webhookBadRequest(message?: string): Response {
	return webhookError(400, message ?? "Bad Request");
}

// ============================================================================
// Logging Helpers
// ============================================================================

/**
 * Log webhook event received
 */
export function logWebhookReceived(
	service: string,
	eventType: string,
	identifier?: string
): void {
	console.log(
		`${service} webhook received: ${eventType}${identifier ? ` for ${identifier}` : ""}`
	);
}

/**
 * Log webhook processing success
 */
export function logWebhookSuccess(
	service: string,
	eventType: string,
	identifier?: string
): void {
	console.log(
		`${service} webhook processed: ${eventType}${identifier ? ` for ${identifier}` : ""}`
	);
}

/**
 * Log webhook processing error
 */
export function logWebhookError(
	service: string,
	eventType: string,
	error: unknown,
	identifier?: string
): void {
	console.error(
		`${service} webhook error: ${eventType}${identifier ? ` for ${identifier}` : ""}`,
		error instanceof Error ? error.message : String(error)
	);
}

// ============================================================================
// Timestamp Conversion
// ============================================================================

/**
 * Convert Unix seconds to milliseconds (used by BoldSign)
 */
export function secondsToMilliseconds(seconds: number): number {
	return seconds * 1000;
}

/**
 * Convert ISO date string to milliseconds (used by Resend)
 */
export function isoToMilliseconds(isoString: string): number {
	return new Date(isoString).getTime();
}

// ============================================================================
// Event Type Helpers
// ============================================================================

/**
 * Common webhook event status types
 */
export type WebhookEventStatus =
	| "sent"
	| "delivered"
	| "opened"
	| "bounced"
	| "complained"
	| "completed"
	| "declined"
	| "expired"
	| "revoked"
	| "viewed"
	| "signed";

/**
 * Map webhook event types to internal status
 */
export function normalizeEventType(
	eventType: string
): WebhookEventStatus | null {
	const normalized = eventType.toLowerCase().replace(/[._]/g, "");

	const mapping: Record<string, WebhookEventStatus> = {
		sent: "sent",
		delivered: "delivered",
		opened: "opened",
		bounced: "bounced",
		complained: "complained",
		completed: "completed",
		declined: "declined",
		expired: "expired",
		revoked: "revoked",
		viewed: "viewed",
		signed: "signed",
		emailsent: "sent",
		emaildelivered: "delivered",
		emaildelivereddelayed: "delivered",
		emailopened: "opened",
		emailbounced: "bounced",
		emailcomplained: "complained",
	};

	return mapping[normalized] ?? null;
}
