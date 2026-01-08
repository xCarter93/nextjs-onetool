import { NextRequest, NextResponse } from "next/server";
import { api } from "@onetool/backend/convex/_generated/api";
import { getConvexClient } from "@/lib/convexClient";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ slug: string }> }
) {
	try {
		const { slug } = await params;

		if (!slug) {
			return NextResponse.json({ error: "Missing slug" }, { status: 400 });
		}

		const client = getConvexClient();
		const data = await client.query(api.communityPages.getBySlug, { slug });

		if (!data) {
			return NextResponse.json({ error: "Page not found" }, { status: 404 });
		}

		return NextResponse.json(data);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to load page";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
