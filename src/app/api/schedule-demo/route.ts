import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

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

		// Build HTML email with inline styles for maximum compatibility
		const emailHtml = `
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>New Demo Request</title>
	<style>
		body {
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
			line-height: 1.6;
			color: #333;
			margin: 0;
			padding: 0;
			background-color: #f5f5f5;
		}
		.container {
			max-width: 600px;
			margin: 20px auto;
			background-color: #ffffff;
			border-radius: 8px;
			overflow: hidden;
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		}
		.header {
			background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
			color: #ffffff;
			padding: 32px 24px;
			text-align: center;
		}
		.header h1 {
			margin: 0;
			font-size: 24px;
			font-weight: 700;
		}
		.content {
			padding: 32px 24px;
		}
		.info-section {
			margin-bottom: 24px;
			padding-bottom: 24px;
			border-bottom: 1px solid #e5e7eb;
		}
		.info-section:last-of-type {
			border-bottom: none;
		}
		.info-label {
			font-size: 12px;
			font-weight: 600;
			text-transform: uppercase;
			color: #6b7280;
			margin-bottom: 6px;
			letter-spacing: 0.5px;
		}
		.info-value {
			font-size: 16px;
			color: #1f2937;
			font-weight: 500;
		}
		.message-box {
			background-color: #f9fafb;
			border-left: 4px solid #3b82f6;
			padding: 16px;
			border-radius: 4px;
			margin-top: 8px;
		}
		.message-text {
			color: #374151;
			font-size: 15px;
			line-height: 1.7;
			margin: 0;
			white-space: pre-wrap;
			word-wrap: break-word;
		}
		.footer {
			background-color: #f9fafb;
			padding: 20px 24px;
			text-align: center;
			border-top: 1px solid #e5e7eb;
		}
		.timestamp {
			font-size: 13px;
			color: #6b7280;
		}
		.cta-note {
			margin-top: 24px;
			padding: 16px;
			background-color: #fef3c7;
			border-radius: 6px;
			border-left: 4px solid #f59e0b;
		}
		.cta-note p {
			margin: 0;
			color: #92400e;
			font-size: 14px;
			font-weight: 500;
		}
		a {
			color: #3b82f6;
			text-decoration: none;
		}
	</style>
</head>
<body>
	<div class="container">
		<div class="header">
			<h1>🎯 New Demo Request</h1>
		</div>
		<div class="content">
			<div class="info-section">
				<div class="info-label">Contact Name</div>
				<div class="info-value">${name}</div>
			</div>
			<div class="info-section">
				<div class="info-label">Email Address</div>
				<div class="info-value">
					<a href="mailto:${email}">${email}</a>
				</div>
			</div>
			${
				company
					? `<div class="info-section">
				<div class="info-label">Company</div>
				<div class="info-value">${company}</div>
			</div>`
					: ""
			}
			${
				phone
					? `<div class="info-section">
				<div class="info-label">Phone Number</div>
				<div class="info-value">
					<a href="tel:${phone}">${phone}</a>
				</div>
			</div>`
					: ""
			}
			${
				message
					? `<div class="info-section">
				<div class="info-label">Message</div>
				<div class="message-box">
					<p class="message-text">${message}</p>
				</div>
			</div>`
					: ""
			}
			<div class="cta-note">
				<p>💡 Please reach out to this prospect within 24 hours to schedule their demo.</p>
			</div>
		</div>
		<div class="footer">
			<div class="timestamp">Request received: <strong>${timestamp}</strong></div>
		</div>
	</div>
</body>
</html>
		`.trim();

		// Send email via Resend
		const data = await resend.emails.send({
			from: "OneTool Demo Requests <noreply@onetool.biz>",
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
