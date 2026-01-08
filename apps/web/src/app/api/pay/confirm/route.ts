import { NextRequest, NextResponse } from "next/server";
import { api } from "@onetool/backend/convex/_generated/api";
import { getConvexClient } from "@/lib/convexClient";
import { getStripeClient } from "@/lib/stripe";

export async function POST(request: NextRequest) {
	try {
		const body = (await request.json().catch(() => ({}))) as {
			token?: string;
			sessionId?: string;
		};

		if (!body.token || !body.sessionId) {
			return NextResponse.json(
				{ error: "Missing token or sessionId" },
				{ status: 400 }
			);
		}

		const convex = getConvexClient();

		// First, try to find a payment by token (new payment splitting flow)
		const paymentData = await convex.query(api.payments.getByPublicToken, {
			publicToken: body.token,
		});

		// If payment found, use payment-specific flow
		if (paymentData) {
			const accountId = paymentData.org?.stripeConnectAccountId;
			if (!accountId) {
				return NextResponse.json(
					{ error: "Payments are not enabled for this organization." },
					{ status: 400 }
				);
			}

			// If already paid, short-circuit
			if (paymentData.payment.status === "paid") {
				return NextResponse.json({ status: "already_paid" });
			}

			const stripe = getStripeClient();
			const session = await stripe.checkout.sessions.retrieve(
				body.sessionId,
				{ expand: ["payment_intent"] },
				{ stripeAccount: accountId }
			);

			if (session.payment_status !== "paid" || !session.payment_intent) {
				return NextResponse.json(
					{ error: "Payment not completed yet." },
					{ status: 400 }
				);
			}

			const paymentIntentId =
				typeof session.payment_intent === "string"
					? session.payment_intent
					: session.payment_intent.id;

			// Mark the payment as paid (this will auto-update invoice status when all payments are complete)
			await convex.mutation(api.payments.markPaidByPublicToken, {
				publicToken: body.token,
				stripeSessionId: session.id,
				stripePaymentIntentId: paymentIntentId,
			});

			return NextResponse.json({ status: "paid" });
		}

		// Fall back to legacy invoice token flow
		const invoiceData = await convex.query(api.invoices.getByPublicToken, {
			publicToken: body.token,
		});

		if (!invoiceData) {
			return NextResponse.json({ error: "Invoice or payment not found" }, { status: 404 });
		}

		const accountId = invoiceData.org?.stripeConnectAccountId;
		if (!accountId) {
			return NextResponse.json(
				{ error: "Payments are not enabled for this organization." },
				{ status: 400 }
			);
		}

		// If already paid, short-circuit
		if (invoiceData.invoice.status === "paid") {
			return NextResponse.json({ status: "already_paid" });
		}

		const stripe = getStripeClient();
		const session = await stripe.checkout.sessions.retrieve(
			body.sessionId,
			{ expand: ["payment_intent"] },
			{ stripeAccount: accountId }
		);

		if (session.payment_status !== "paid" || !session.payment_intent) {
			return NextResponse.json(
				{ error: "Payment not completed yet." },
				{ status: 400 }
			);
		}

		const paymentIntentId =
			typeof session.payment_intent === "string"
				? session.payment_intent
				: session.payment_intent.id;

		await convex.mutation(api.invoices.markPaidByPublicToken, {
			publicToken: body.token,
			stripeSessionId: session.id,
			stripePaymentIntentId: paymentIntentId,
		});

		return NextResponse.json({ status: "paid" });
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to confirm payment";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
