import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import type { WebhookEvent } from "@clerk/backend";
import { Webhook } from "svix";

const http = httpRouter();

/**
 * Comprehensive Clerk Webhook Handler
 *
 * Handles all Clerk events for users and organizations with:
 * - Robust error handling and logging
 * - Data validation before processing
 * - Graceful handling of webhook timing issues
 * - Support for organization lifecycle (create, update, delete)
 * - User membership management
 *
 * Supported Events:
 * - user.created / user.updated: Sync user data to Convex
 * - user.deleted: Clean up user data
 * - session.created: Update last sign-in date
 * - organization.created: Create organization metadata in Convex
 * - organization.updated: Sync organization name changes
 * - organization.deleted: Clean up organization and remove all members
 * - organizationMembership.created: Add user to organization
 * - organizationMembership.deleted: Remove user from organization
 */
http.route({
	path: "/clerk-users-webhook",
	method: "POST",
	handler: httpAction(async (ctx, request) => {
		const event = await validateRequest(request);
		if (!event) {
			return new Response("Error occured", { status: 400 });
		}
		switch (event.type) {
			case "user.created": // intentional fallthrough
			case "user.updated":
				await ctx.runMutation(internal.users.upsertFromClerk, {
					data: event.data,
				});
				break;

			case "user.deleted": {
				const clerkUserId = event.data.id!;
				await ctx.runMutation(internal.users.deleteFromClerk, { clerkUserId });
				break;
			}

			case "session.created": {
				const clerkUserId = event.data.user_id!;
				await ctx.runMutation(internal.users.updateLastSignedInDate, {
					clerkUserId,
				});
				break;
			}

			// Organization events
			case "organization.created": {
				const orgData = event.data;
				console.log("Processing organization.created webhook:", {
					orgId: orgData.id,
					name: orgData.name,
					createdBy: orgData.created_by,
					imageUrl: orgData.image_url,
				});

				if (!orgData.id || !orgData.name || !orgData.created_by) {
					console.error("Missing required organization data:", orgData);
					break;
				}

				try {
					await ctx.runMutation(internal.organizations.createFromClerk, {
						clerkOrganizationId: orgData.id,
						name: orgData.name,
						ownerClerkUserId: orgData.created_by,
						logoUrl: orgData.image_url || undefined,
					});
					console.log("Successfully created organization:", orgData.id);
				} catch (error) {
					console.error("Failed to create organization:", {
						orgId: orgData.id,
						error: error instanceof Error ? error.message : String(error),
					});
					// Don't throw - let webhook succeed but log the error
				}
				break;
			}

			case "organization.updated": {
				const orgData = event.data;
				console.log("Processing organization.updated webhook:", {
					orgId: orgData.id,
					name: orgData.name,
					imageUrl: orgData.image_url,
				});

				if (!orgData.id || !orgData.name) {
					console.error(
						"Missing required organization data for update:",
						orgData
					);
					break;
				}

				try {
					await ctx.runMutation(internal.organizations.updateFromClerk, {
						clerkOrganizationId: orgData.id,
						name: orgData.name,
						logoUrl: orgData.image_url || undefined,
					});
					console.log("Successfully updated organization:", orgData.id);
				} catch (error) {
					console.error("Failed to update organization:", {
						orgId: orgData.id,
						error: error instanceof Error ? error.message : String(error),
					});
				}
				break;
			}

			case "organization.deleted": {
				const orgData = event.data;
				console.log("Processing organization.deleted webhook:", {
					orgId: orgData.id,
				});

				if (!orgData.id) {
					console.error("Missing organization ID for deletion:", orgData);
					break;
				}

				try {
					await ctx.runMutation(internal.organizations.deleteFromClerk, {
						clerkOrganizationId: orgData.id,
					});
					console.log(
						"Successfully processed organization deletion:",
						orgData.id
					);
				} catch (error) {
					console.error("Failed to process organization deletion:", {
						orgId: orgData.id,
						error: error instanceof Error ? error.message : String(error),
					});
				}
				break;
			}

			case "organizationMembership.created": {
				const membershipData = event.data;
				const userId = membershipData.public_user_data?.user_id;
				const orgId = membershipData.organization?.id;

				console.log("Processing organizationMembership.created webhook:", {
					userId,
					orgId,
					role: membershipData.role,
				});

				if (!userId || !orgId) {
					console.error("Missing required membership data:", {
						userId,
						orgId,
						membershipData,
					});
					break;
				}

				try {
					await ctx.runMutation(internal.users.updateUserOrganization, {
						clerkUserId: userId,
						clerkOrganizationId: orgId,
					});
					console.log("Successfully added user to organization:", {
						userId,
						orgId,
					});
				} catch (error) {
					console.error("Failed to add user to organization:", {
						userId,
						orgId,
						error: error instanceof Error ? error.message : String(error),
					});
				}
				break;
			}

			case "organizationMembership.deleted": {
				const membershipData = event.data;
				const userId = membershipData.public_user_data?.user_id;

				console.log("Processing organizationMembership.deleted webhook:", {
					userId,
					orgId: membershipData.organization?.id,
				});

				if (!userId) {
					console.error(
						"Missing user ID for membership deletion:",
						membershipData
					);
					break;
				}

				try {
					await ctx.runMutation(internal.users.removeUserFromOrganization, {
						clerkUserId: userId,
					});
					console.log("Successfully removed user from organization:", userId);
				} catch (error) {
					console.error("Failed to remove user from organization:", {
						userId,
						error: error instanceof Error ? error.message : String(error),
					});
				}
				break;
			}

			default:
				console.log("Ignored Clerk webhook event", event.type);
		}

		return new Response(null, { status: 200 });
	}),
});

async function validateRequest(req: Request): Promise<WebhookEvent | null> {
	const payloadString = await req.text();
	const svixHeaders = {
		"svix-id": req.headers.get("svix-id")!,
		"svix-timestamp": req.headers.get("svix-timestamp")!,
		"svix-signature": req.headers.get("svix-signature")!,
	};
	const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
	try {
		return wh.verify(payloadString, svixHeaders) as unknown as WebhookEvent;
	} catch (error) {
		console.error("Error verifying webhook event", error);
		return null;
	}
}

export default http;
