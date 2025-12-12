import { NextRequest, NextResponse } from "next/server";
import { api } from "../../../../../convex/_generated/api";
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
		const data = await convex.query(api.invoices.getByPublicToken, {
			publicToken: body.token,
		});

		if (!data) {
			return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
		}

		const accountId = data.org?.stripeConnectAccountId;
		if (!accountId) {
			return NextResponse.json(
				{ error: "Payments are not enabled for this organization." },
				{ status: 400 }
			);
		}

		// If already paid, short-circuit.
		if (data.invoice.status === "paid") {
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
