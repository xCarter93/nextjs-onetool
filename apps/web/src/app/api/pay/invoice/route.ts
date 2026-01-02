import { NextRequest, NextResponse } from "next/server";
import { api } from "@onetool/backend/convex/_generated/api";
import { getConvexClient } from "@/lib/convexClient";

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const token = searchParams.get("token");

		if (!token) {
			return NextResponse.json(
				{ error: "Missing invoice token" },
				{ status: 400 }
			);
		}

		const client = getConvexClient();
		const data = await client.query(api.invoices.getByPublicToken, {
			publicToken: token,
		});

		if (!data) {
			return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
		}

		return NextResponse.json(data);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to load invoice";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
