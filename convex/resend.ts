import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { components } from "./_generated/api";
import { Resend } from "@convex-dev/resend";
import { getCurrentUserOrThrow, getCurrentUserOrgId } from "./lib/auth";

// Initialize Resend component
export const resend = new Resend(components.resend, {
	testMode: false, // Allow sending to real addresses
	apiKey: process.env.RESEND_API_KEY, // Explicitly pass API key
});

/**
 * Send an email to a client with organization branding
 */
export const sendClientEmail = mutation({
	args: {
		clientId: v.id("clients"),
		subject: v.string(),
		messageBody: v.string(),
		threadId: v.optional(v.string()), // Optional for starting a thread
	},
	handler: async (ctx, args) => {
		const user = await getCurrentUserOrThrow(ctx);
		const orgId = await getCurrentUserOrgId(ctx);

		// Get organization details for branding
		const organization = await ctx.db.get(orgId);
		if (!organization) {
			throw new Error("Organization not found");
		}

		// Get client details
		const client = await ctx.db.get(args.clientId);
		if (!client) {
			throw new Error("Client not found");
		}

		// Verify client belongs to the organization
		if (client.orgId !== orgId) {
			throw new Error("Client does not belong to your organization");
		}

		// Get primary contact
		const primaryContact = await ctx.db
			.query("clientContacts")
			.withIndex("by_primary", (q) =>
				q.eq("clientId", args.clientId).eq("isPrimary", true)
			)
			.first();

		if (!primaryContact || !primaryContact.email) {
			throw new Error("Client does not have a valid primary contact email");
		}

		// Build email HTML with organization branding
		const emailHtml = buildEmailHtml({
			logoUrl: organization.logoUrl,
			brandColor: organization.brandColor || "#3b82f6",
			organizationName: organization.name,
			organizationEmail: organization.email,
			organizationPhone: organization.phone,
			organizationAddress: organization.address,
			clientName: `${primaryContact.firstName} ${primaryContact.lastName}`,
			messageBody: args.messageBody,
			senderName: user.name, // Add sender's name for personalization
		});

		// Use verified company domain with user's name for personalization
		// Reply-to ensures responses go to the actual user
		const fromEmail = "support@onetool.biz"; // Verified domain
		const fromName = user.name || organization.name || "OneTool"; // Fallback to org name or "OneTool"

		// Ensure organization has a receiving address
		if (!organization.receivingAddress) {
			throw new Error(
				"Organization does not have a receiving email address configured. Please contact support."
			);
		}

		// Prepare email options with threading support
		const emailOptions: {
			from: string;
			to: string;
			subject: string;
			html: string;
			replyTo: string[];
		} = {
			from: `${fromName} <${fromEmail}>`,
			to: primaryContact.email,
			subject: args.subject,
			html: emailHtml,
			// Use organization's receiving address for replies
			replyTo: [organization.receivingAddress],
		};

		// Send email via Resend
		const emailId = await resend.sendEmail(ctx, emailOptions);

		// Create message preview (first 100 chars)
		const messagePreview = args.messageBody.substring(0, 100);

		// Use provided threadId or create new one from emailId
		const threadId = args.threadId || emailId;

		// Store email record
		const emailMessageId = await ctx.db.insert("emailMessages", {
			orgId,
			clientId: args.clientId,
			resendEmailId: emailId,
			direction: "outbound",
			threadId,
			subject: args.subject,
			messageBody: args.messageBody,
			messagePreview,
			fromEmail: fromEmail,
			fromName: fromName,
			toEmail: primaryContact.email,
			toName: `${primaryContact.firstName} ${primaryContact.lastName}`,
			status: "sent",
			sentAt: Date.now(),
			sentBy: user._id,
		});

		// Log activity
		await ctx.db.insert("activities", {
			orgId,
			userId: user._id,
			activityType: "email_sent",
			entityType: "client",
			entityId: args.clientId,
			entityName: client.companyName,
			description: `Sent email: ${args.subject}`,
			metadata: {
				emailId: emailMessageId,
				subject: args.subject,
				preview: messagePreview,
			},
			timestamp: Date.now(),
			isVisible: true,
		});

		return {
			emailId,
			emailMessageId,
			threadId,
		};
	},
});

/**
 * Reply to an email thread
 */
export const replyToEmail = mutation({
	args: {
		emailMessageId: v.id("emailMessages"), // The message being replied to
		messageBody: v.string(),
	},
	handler: async (ctx, args) => {
		const user = await getCurrentUserOrThrow(ctx);
		const orgId = await getCurrentUserOrgId(ctx);

		// Get the original email
		const originalEmail = await ctx.db.get(args.emailMessageId);
		if (!originalEmail) {
			throw new Error("Original email not found");
		}

		if (originalEmail.orgId !== orgId) {
			throw new Error("Email does not belong to your organization");
		}

		// Get organization details
		const organization = await ctx.db.get(orgId);
		if (!organization) {
			throw new Error("Organization not found");
		}

		// Get client details
		const client = await ctx.db.get(originalEmail.clientId);
		if (!client) {
			throw new Error("Client not found");
		}

		// Get primary contact
		const primaryContact = await ctx.db
			.query("clientContacts")
			.withIndex("by_primary", (q) =>
				q.eq("clientId", originalEmail.clientId).eq("isPrimary", true)
			)
			.first();

		if (!primaryContact || !primaryContact.email) {
			throw new Error("Client does not have a valid primary contact email");
		}

		// Build references chain
		const references = originalEmail.references || [];
		if (!references.includes(originalEmail.resendEmailId)) {
			references.push(originalEmail.resendEmailId);
		}

		// Build email HTML with organization branding
		const emailHtml = buildEmailHtml({
			logoUrl: organization.logoUrl,
			brandColor: organization.brandColor || "#3b82f6",
			organizationName: organization.name,
			organizationEmail: organization.email,
			organizationPhone: organization.phone,
			organizationAddress: organization.address,
			clientName: `${primaryContact.firstName} ${primaryContact.lastName}`,
			messageBody: args.messageBody,
			senderName: user.name,
		});

		const fromEmail = "support@onetool.biz";
		const fromName = user.name || organization.name || "OneTool";

		// Ensure organization has a receiving address
		if (!organization.receivingAddress) {
			throw new Error(
				"Organization does not have a receiving email address configured. Please contact support."
			);
		}

		// Add "Re: " prefix if not already present
		const subject = originalEmail.subject.startsWith("Re:")
			? originalEmail.subject
			: `Re: ${originalEmail.subject}`;

		// Send email with threading headers
		// Note: Resend doesn't directly support custom headers like In-Reply-To,
		// but we track threading in our database
		const emailId = await resend.sendEmail(ctx, {
			from: `${fromName} <${fromEmail}>`,
			to: primaryContact.email,
			subject,
			html: emailHtml,
			replyTo: [organization.receivingAddress],
		});

		// Create message preview
		const messagePreview = args.messageBody.substring(0, 100);

		// Store email record with threading information
		const emailMessageId = await ctx.db.insert("emailMessages", {
			orgId,
			clientId: originalEmail.clientId,
			resendEmailId: emailId,
			direction: "outbound",
			threadId: originalEmail.threadId || originalEmail.resendEmailId,
			inReplyTo: originalEmail.resendEmailId,
			references,
			subject,
			messageBody: args.messageBody,
			messagePreview,
			fromEmail,
			fromName,
			toEmail: primaryContact.email,
			toName: `${primaryContact.firstName} ${primaryContact.lastName}`,
			status: "sent",
			sentAt: Date.now(),
			sentBy: user._id,
		});

		// Log activity
		await ctx.db.insert("activities", {
			orgId,
			userId: user._id,
			activityType: "email_sent",
			entityType: "client",
			entityId: originalEmail.clientId,
			entityName: client.companyName,
			description: `Replied to email: ${subject}`,
			metadata: {
				emailId: emailMessageId,
				subject,
				preview: messagePreview,
			},
			timestamp: Date.now(),
			isVisible: true,
		});

		return {
			emailId,
			emailMessageId,
		};
	},
});

/**
 * Build email HTML with organization branding
 */
function buildEmailHtml(options: {
	logoUrl?: string;
	brandColor: string;
	organizationName: string;
	organizationEmail?: string;
	organizationPhone?: string;
	organizationAddress?: string;
	clientName: string;
	messageBody: string;
	senderName: string; // Name of the person sending the email
}): string {
	const {
		logoUrl,
		brandColor,
		organizationName,
		organizationEmail,
		organizationPhone,
		organizationAddress,
		clientName,
		messageBody,
		senderName,
	} = options;

	// Convert message body to HTML (preserve line breaks)
	const messageHtml = messageBody
		.split("\n")
		.map((line) => `<p style="margin: 8px 0;">${line || "&nbsp;"}</p>`)
		.join("");

	return `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>${organizationName}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6; color: #1f2937;">
	<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
		<tr>
			<td align="center">
				<!-- Main container -->
				<table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
					<!-- Header with logo -->
					<tr>
						<td style="background-color: ${brandColor}; padding: 40px 40px 30px 40px; text-align: center;">
							${
								logoUrl
									? `<img src="${logoUrl}" alt="${organizationName}" style="max-width: 180px; height: auto; display: block; margin: 0 auto;" />`
									: `<h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">${organizationName}</h1>`
							}
						</td>
					</tr>
					
					<!-- Content -->
					<tr>
						<td style="padding: 40px;">
							<p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">Hi ${clientName},</p>
							
							<div style="margin: 20px 0; font-size: 16px; line-height: 1.6; color: #374151;">
								${messageHtml}
							</div>
							
							<p style="margin: 30px 0 10px 0; font-size: 16px; line-height: 1.6;">Best regards,</p>
							<p style="margin: 0 0 5px 0; font-size: 18px; line-height: 1.6; font-weight: 700; color: ${brandColor};">${senderName}</p>
							<p style="margin: 0 0 15px 0; font-size: 14px; line-height: 1.6; color: #6b7280;">${organizationName}</p>
						</td>
					</tr>
					
					<!-- Footer -->
					<tr>
						<td style="background-color: #f9fafb; padding: 30px 40px; border-top: 1px solid #e5e7eb;">
							<table width="100%" cellpadding="0" cellspacing="0">
								<tr>
									<td style="font-size: 14px; line-height: 1.6; color: #6b7280;">
										<strong style="color: #1f2937;">${organizationName}</strong><br />
										${organizationEmail ? `Email: <a href="mailto:${organizationEmail}" style="color: ${brandColor}; text-decoration: none;">${organizationEmail}</a><br />` : ""}
										${organizationPhone ? `Phone: ${organizationPhone}<br />` : ""}
										${organizationAddress ? `${organizationAddress}` : ""}
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
				
				<!-- Footer note -->
				<table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin-top: 20px;">
					<tr>
						<td style="text-align: center; font-size: 12px; color: #9ca3af; line-height: 1.5;">
							<p style="margin: 0;">This email was sent by ${organizationName}</p>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
</body>
</html>
	`.trim();
}
