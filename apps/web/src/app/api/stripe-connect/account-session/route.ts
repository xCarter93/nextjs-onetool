import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getStripeClient } from "@/lib/stripe";

/**
 * Create an Account Session for Stripe Connect embedded components.
 * This generates a client secret that allows the frontend to render
 * embedded components like Payouts for a connected account.
 */
export async function POST(request: NextRequest) {
	try {
		const { userId } = await auth();
		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = (await request.json().catch(() => ({}))) as {
			accountId?: string;
		};

		if (!body.accountId) {
			return NextResponse.json(
				{ error: "accountId is required" },
				{ status: 400 }
			);
		}

		const stripe = getStripeClient();

		// Create an account session with payouts component enabled
		// and all payout features available
		const accountSession = await stripe.accountSessions.create({
			account: body.accountId,
			components: {
				payouts: {
					enabled: true,
					features: {
						instant_payouts: true,
						standard_payouts: true,
						edit_payout_schedule: true,
						external_account_collection: true,
					},
				},
			},
		});

		return NextResponse.json({
			clientSecret: accountSession.client_secret,
		});
	} catch (error) {
		console.error("Account session creation error:", error);
		const message =
			error instanceof Error
				? error.message
				: "Failed to create account session";
		return NextResponse.json(
			{
				error: message,
				details: error instanceof Error ? error.stack : undefined,
			},
			{ status: 500 }
		);
	}
}
