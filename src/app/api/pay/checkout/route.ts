import { NextRequest, NextResponse } from "next/server";
import { api } from "../../../../../convex/_generated/api";
import { getConvexClient } from "@/lib/convexClient";
import { getStripeClient } from "@/lib/stripe";

export async function POST(request: NextRequest) {
	try {
		const body = (await request.json().catch(() => ({}))) as {
			token?: string;
		};

		if (!body.token) {
			return NextResponse.json(
				{ error: "Missing invoice token" },
				{ status: 400 }
			);
		}

		const origin =
			request.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL;
		if (!origin) {
			return NextResponse.json(
				{
					error:
						"Origin is missing. Provide an Origin header or set NEXT_PUBLIC_APP_URL.",
				},
				{ status: 400 }
			);
		}

		// Fetch invoice + org payment metadata.
		const convex = getConvexClient();
		const data = await convex.query(api.invoices.getByPublicToken, {
			publicToken: body.token,
		});

		if (!data) {
			return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
		}

		if (data.invoice.status === "paid") {
			return NextResponse.json(
				{ error: "Invoice is already paid." },
				{ status: 400 }
			);
		}

		const accountId = data.org?.stripeConnectAccountId;
		if (!accountId) {
			return NextResponse.json(
				{
					error:
						"Payments are not enabled for this organization. Complete onboarding first.",
				},
				{ status: 400 }
			);
		}

		const amountInCents = Math.max(
			0,
			Math.round((data.invoice.total ?? 0) * 100)
		);
		if (!amountInCents) {
			return NextResponse.json(
				{ error: "Invoice total is zero or invalid." },
				{ status: 400 }
			);
		}

		const stripe = getStripeClient();

		const session = await stripe.checkout.sessions.create(
			{
				customer_creation: "always",
				invoice_creation: {
					enabled: true,
				},
				mode: "payment",
				line_items: [
					{
						price_data: {
							currency: "usd", // Adjust if you add multi-currency invoices.
							product_data: {
								name: data.invoice.invoiceNumber ?? "Invoice payment",
								description: `Invoice payment for ${
									data.org?.name ?? "organization"
								}`,
							},
							unit_amount: amountInCents,
						},
						quantity: 1,
					},
				],
				payment_intent_data: {
					application_fee_amount: parseInt(
						process.env.STRIPE_APPLICATION_FEE_CENTS || "100"
					),
					metadata: {
						publicToken: data.invoice.publicToken,
						invoiceNumber: data.invoice.invoiceNumber ?? "",
					},
				},
				metadata: {
					publicToken: data.invoice.publicToken,
					invoiceId: data.invoice._id,
				},
				success_url: `${origin}/pay/${data.invoice.publicToken}?session_id={CHECKOUT_SESSION_ID}`,
				cancel_url: `${origin}/pay/${data.invoice.publicToken}?canceled=1`,
			},
			{
				stripeAccount: accountId,
			}
		);

		return NextResponse.json({ url: session.url });
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to start checkout";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
