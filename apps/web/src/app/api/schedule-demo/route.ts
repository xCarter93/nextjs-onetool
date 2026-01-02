import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { render } from "@react-email/render";
import { ScheduleDemoRequestEmail } from "@/emails/schedule-demo-request";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { name, email, company, phone, message } = body;

		// Validate required fields
		if (!name || !email) {
			return NextResponse.json(
				{ error: "Name and email are required" },
				{ status: 400 }
			);
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return NextResponse.json(
				{ error: "Invalid email address" },
				{ status: 400 }
			);
		}

		// Create timestamp
		const timestamp = new Date().toLocaleString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "numeric",
			minute: "2-digit",
			timeZoneName: "short",
		});

		// Render the React Email component to HTML
		const emailHtml = await render(
			ScheduleDemoRequestEmail({
				name,
				email,
				company,
				phone,
				message,
				timestamp,
			})
		);

		// Send email via Resend
		const data = await resend.emails.send({
			from: "OneTool Demo Requests <support@onetool.biz>",
			to: ["support@onetool.biz"],
			subject: `New Demo Request from ${name}${company ? ` - ${company}` : ""}`,
			html: emailHtml,
			replyTo: email,
		});

		return NextResponse.json(
			{
				success: true,
				message: "Demo request sent successfully",
				data,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error sending demo request email:", error);
		return NextResponse.json(
			{
				error: "Failed to send demo request",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
