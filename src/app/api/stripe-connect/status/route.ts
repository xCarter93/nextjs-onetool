import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getStripeClient } from "@/lib/stripe";

/**
 * Retrieve live status for a connected account.
 * Always fetch directly from Stripe (no cached status).
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
				{ error: "accountId is required to fetch status" },
				{ status: 400 }
			);
		}

		const stripe = getStripeClient();
		const account = await stripe.accounts.retrieve(body.accountId);

		return NextResponse.json({
			accountId: account.id,
			chargesEnabled: account.charges_enabled,
			payoutsEnabled: account.payouts_enabled,
			detailsSubmitted: account.details_submitted,
			requirements: account.requirements,
		});
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to fetch account status";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
