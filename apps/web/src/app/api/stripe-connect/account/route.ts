import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getStripeClient } from "@/lib/stripe";

/**
 * Create (or return) a connected account for the current user/org.
 * The caller should persist the returned accountId on their organization record.
 */
export async function POST(request: NextRequest) {
	try {
		const { userId } = await auth();
		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = (await request.json().catch(() => ({}))) as {
			accountId?: string;
			country?: string;
			email?: string;
		};

		const stripe = getStripeClient();

		// If the caller already has an account, just return its latest state.
		if (body.accountId) {
			const account = await stripe.accounts.retrieve(body.accountId);
			return NextResponse.json({
				accountId: account.id,
				account,
			});
		}

		// Minimal account creation using controller properties only (no top-level type).
		const account = await stripe.accounts.create({
			country: body.country || "US", // Accept override; defaults to US for demo.
			email: body.email,
			controller: {
				fees: { payer: "account" },
				losses: { payments: "stripe" },
				stripe_dashboard: { type: "none" },
			},
			// Required when stripe_dashboard.type is "none" (Custom accounts)
			capabilities: {
				card_payments: { requested: true },
				transfers: { requested: true },
			},
		});

		return NextResponse.json({
			accountId: account.id,
			account,
		});
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to create account";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
