import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getStripeClient } from "@/lib/stripe";

/**
 * Create an onboarding account link for a connected account.
 */
export async function POST(request: NextRequest) {
	try {
		const { userId } = await auth();
		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = (await request.json().catch(() => ({}))) as {
			accountId?: string;
			returnPath?: string;
		};

		if (!body.accountId) {
			return NextResponse.json(
				{ error: "accountId is required to generate an onboarding link" },
				{ status: 400 }
			);
		}

		const origin =
			request.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL;
		if (!origin) {
			return NextResponse.json(
				{
					error:
						"Origin is missing. Provide an Origin header or configure NEXT_PUBLIC_APP_URL.",
				},
				{ status: 400 }
			);
		}

		// Allow caller to override the return path; default to payments tab.
		const returnUrl = `${origin}${
			body.returnPath ?? "/organization/profile?tab=payments"
		}`;
		const refreshUrl = `${origin}/organization/profile?tab=payments&refresh=1`;

		const stripe = getStripeClient();
		const accountLink = await stripe.accountLinks.create({
			account: body.accountId,
			type: "account_onboarding",
			return_url: returnUrl,
			refresh_url: refreshUrl,
		});

		return NextResponse.json({
			url: accountLink.url,
			expires_at: accountLink.expires_at,
		});
	} catch (error) {
		const message =
			error instanceof Error
				? error.message
				: "Failed to create onboarding link";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
