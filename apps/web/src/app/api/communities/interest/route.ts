import { NextRequest, NextResponse } from "next/server";
import { api } from "@onetool/backend/convex/_generated/api";
import { getConvexClient } from "@/lib/convexClient";

// Simple in-memory rate limiting (use Redis in production for multi-instance deployments)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Clean up old entries periodically to prevent memory leaks
setInterval(
	() => {
		const now = Date.now();
		for (const [key, value] of rateLimitMap.entries()) {
			if (now > value.resetTime) {
				rateLimitMap.delete(key);
			}
		}
	},
	60 * 1000
); // Clean up every minute

export async function POST(request: NextRequest) {
	try {
		// Rate limiting by IP
		const ip =
			request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
			request.headers.get("x-real-ip") ||
			"unknown";
		const now = Date.now();
		const windowMs = 60 * 1000; // 1 minute window
		const maxRequests = 5; // 5 requests per minute

		const rateLimit = rateLimitMap.get(ip);

		if (rateLimit) {
			if (now < rateLimit.resetTime) {
				if (rateLimit.count >= maxRequests) {
					return NextResponse.json(
						{ error: "Too many requests. Please try again later." },
						{ status: 429 }
					);
				}
				rateLimit.count++;
			} else {
				rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
			}
		} else {
			rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
		}

		const body = await request.json();
		const { slug, name, email, phone, message } = body;

		// Validate required fields
		if (!slug || typeof slug !== "string") {
			return NextResponse.json(
				{ error: "Community page slug is required" },
				{ status: 400 }
			);
		}

		if (!name || typeof name !== "string" || name.trim().length < 2) {
			return NextResponse.json(
				{ error: "Name is required (at least 2 characters)" },
				{ status: 400 }
			);
		}

		if (!email || typeof email !== "string") {
			return NextResponse.json(
				{ error: "Email is required" },
				{ status: 400 }
			);
		}

		// Basic email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return NextResponse.json(
				{ error: "Invalid email address" },
				{ status: 400 }
			);
		}

		// Validate phone format if provided
		if (phone && typeof phone === "string" && phone.trim().length > 0) {
			// Allow various phone formats but require at least 7 digits
			const digitsOnly = phone.replace(/\D/g, "");
			if (digitsOnly.length < 7 || digitsOnly.length > 15) {
				return NextResponse.json(
					{ error: "Invalid phone number" },
					{ status: 400 }
				);
			}
		}

		const client = getConvexClient();
		await client.mutation(api.communityPages.submitInterest, {
			slug: slug.trim(),
			name: name.trim(),
			email: email.trim().toLowerCase(),
			phone: phone?.trim() || undefined,
			message: message?.trim() || undefined,
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Submission failed";

		// Don't expose internal errors to clients
		if (message.includes("Community page not found")) {
			return NextResponse.json(
				{ error: "Community page not found" },
				{ status: 404 }
			);
		}

		console.error("Interest form submission error:", error);
		return NextResponse.json(
			{ error: "Something went wrong. Please try again." },
			{ status: 500 }
		);
	}
}
