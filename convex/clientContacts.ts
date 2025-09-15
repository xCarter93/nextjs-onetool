import { query, mutation, QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { getCurrentUserOrgId } from "./lib/auth";
import { ActivityHelpers } from "./lib/activities";
import { ValidationPatterns } from "./lib/shared";

/**
 * Client Contact operations with embedded CRUD helpers
 * All client contact-specific logic lives in this file for better organization
 */

// Client Contact-specific helper functions

/**
 * Get a client contact by ID with organization and client validation
 */
async function getContactWithValidation(
	ctx: QueryCtx | MutationCtx,
	id: Id<"clientContacts">
): Promise<Doc<"clientContacts"> | null> {
	const userOrgId = await getCurrentUserOrgId(ctx);
	const contact = await ctx.db.get(id);

	if (!contact) {
		return null;
	}

	if (contact.orgId !== userOrgId) {
		throw new Error("Contact does not belong to your organization");
	}

	return contact;
}

/**
 * Get a client contact by ID, throwing if not found
 */
async function getContactOrThrow(
	ctx: QueryCtx | MutationCtx,
	id: Id<"clientContacts">
): Promise<Doc<"clientContacts">> {
	const contact = await getContactWithValidation(ctx, id);
	if (!contact) {
		throw new Error("Client contact not found");
	}
	return contact;
}

/**
 * Validate client exists and belongs to user's org
 */
async function validateClientAccess(
	ctx: QueryCtx | MutationCtx,
	clientId: Id<"clients">
): Promise<void> {
	const userOrgId = await getCurrentUserOrgId(ctx);
	const client = await ctx.db.get(clientId);

	if (!client) {
		throw new Error("Client not found");
	}

	if (client.orgId !== userOrgId) {
		throw new Error("Client does not belong to your organization");
	}
}

/**
 * Create a client contact with automatic orgId assignment
 */
async function createContactWithOrg(
	ctx: MutationCtx,
	data: Omit<Doc<"clientContacts">, "_id" | "_creationTime" | "orgId">
): Promise<Id<"clientContacts">> {
	const userOrgId = await getCurrentUserOrgId(ctx);

	// Validate client access
	await validateClientAccess(ctx, data.clientId);

	const contactData = {
		...data,
		orgId: userOrgId,
	};

	return await ctx.db.insert("clientContacts", contactData);
}

/**
 * Update a client contact with validation
 */
async function updateContactWithValidation(
	ctx: MutationCtx,
	id: Id<"clientContacts">,
	updates: Partial<Doc<"clientContacts">>
): Promise<void> {
	// Validate contact exists and belongs to user's org
	await getContactOrThrow(ctx, id);

	// If clientId is being updated, validate the new client
	if (updates.clientId) {
		await validateClientAccess(ctx, updates.clientId);
	}

	// Update the contact
	await ctx.db.patch(id, updates);
}

// Define specific types for client contact operations
type ClientContactDocument = Doc<"clientContacts">;
type ClientContactId = Id<"clientContacts">;

/**
 * Get all contacts for a specific client
 */
export const listByClient = query({
	args: { clientId: v.id("clients") },
	handler: async (ctx, args): Promise<ClientContactDocument[]> => {
		await validateClientAccess(ctx, args.clientId);

		return await ctx.db
			.query("clientContacts")
			.withIndex("by_client", (q) => q.eq("clientId", args.clientId))
			.collect();
	},
});

/**
 * Get all contacts for the current user's organization
 */
export const list = query({
	args: {},
	handler: async (ctx): Promise<ClientContactDocument[]> => {
		const userOrgId = await getCurrentUserOrgId(ctx);

		return await ctx.db
			.query("clientContacts")
			.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
			.collect();
	},
});

/**
 * Get a specific client contact by ID
 */
export const get = query({
	args: { id: v.id("clientContacts") },
	handler: async (ctx, args): Promise<ClientContactDocument | null> => {
		return await getContactWithValidation(ctx, args.id);
	},
});

/**
 * Get primary contact for a client
 */
export const getPrimaryContact = query({
	args: { clientId: v.id("clients") },
	handler: async (ctx, args): Promise<ClientContactDocument | null> => {
		await validateClientAccess(ctx, args.clientId);

		return await ctx.db
			.query("clientContacts")
			.withIndex("by_primary", (q) =>
				q.eq("clientId", args.clientId).eq("isPrimary", true)
			)
			.unique();
	},
});

/**
 * Create a new client contact
 */
export const create = mutation({
	args: {
		clientId: v.id("clients"),
		firstName: v.string(),
		lastName: v.string(),
		email: v.optional(v.string()),
		phone: v.optional(v.string()),
		jobTitle: v.optional(v.string()),
		role: v.optional(v.string()),
		department: v.optional(v.string()),
		isPrimary: v.boolean(),
		photoUrl: v.optional(v.string()),
		photoStorageId: v.optional(v.id("_storage")),
	},
	handler: async (ctx, args): Promise<ClientContactId> => {
		// Validate email format if provided
		if (args.email && !ValidationPatterns.isValidEmail(args.email)) {
			throw new Error("Invalid email format");
		}

		// Validate phone format if provided
		if (args.phone && !ValidationPatterns.isValidPhone(args.phone)) {
			throw new Error("Invalid phone format");
		}

		// If setting as primary, ensure no other primary contact exists for this client
		if (args.isPrimary) {
			const existingPrimary = await ctx.db
				.query("clientContacts")
				.withIndex("by_primary", (q) =>
					q.eq("clientId", args.clientId).eq("isPrimary", true)
				)
				.unique();

			if (existingPrimary) {
				// Unset the existing primary contact
				await ctx.db.patch(existingPrimary._id, { isPrimary: false });
			}
		}

		const contactId = await createContactWithOrg(ctx, args);

		// Get the created contact for activity logging
		const contact = await ctx.db.get(contactId);
		if (contact) {
			await ActivityHelpers.clientUpdated(
				ctx,
				(await ctx.db.get(contact.clientId)) as Doc<"clients">
			);
		}

		return contactId;
	},
});

/**
 * Update a client contact
 */
export const update = mutation({
	args: {
		id: v.id("clientContacts"),
		clientId: v.optional(v.id("clients")),
		firstName: v.optional(v.string()),
		lastName: v.optional(v.string()),
		email: v.optional(v.string()),
		phone: v.optional(v.string()),
		jobTitle: v.optional(v.string()),
		role: v.optional(v.string()),
		department: v.optional(v.string()),
		isPrimary: v.optional(v.boolean()),
		photoUrl: v.optional(v.string()),
		photoStorageId: v.optional(v.id("_storage")),
	},
	handler: async (ctx, args): Promise<ClientContactId> => {
		const { id, ...updates } = args;

		// Validate email format if provided
		if (updates.email && !ValidationPatterns.isValidEmail(updates.email)) {
			throw new Error("Invalid email format");
		}

		// Validate phone format if provided
		if (updates.phone && !ValidationPatterns.isValidPhone(updates.phone)) {
			throw new Error("Invalid phone format");
		}

		// Filter out undefined values
		const filteredUpdates = Object.fromEntries(
			Object.entries(updates).filter(([, value]) => value !== undefined)
		) as Partial<ClientContactDocument>;

		if (Object.keys(filteredUpdates).length === 0) {
			throw new Error("No valid updates provided");
		}

		// Get current contact to check clientId for primary validation
		const currentContact = await getContactOrThrow(ctx, id);
		const clientId = filteredUpdates.clientId || currentContact.clientId;

		// If setting as primary, ensure no other primary contact exists for this client
		if (filteredUpdates.isPrimary === true) {
			const existingPrimary = await ctx.db
				.query("clientContacts")
				.withIndex("by_primary", (q) =>
					q.eq("clientId", clientId).eq("isPrimary", true)
				)
				.unique();

			if (existingPrimary && existingPrimary._id !== id) {
				// Unset the existing primary contact
				await ctx.db.patch(existingPrimary._id, { isPrimary: false });
			}
		}

		await updateContactWithValidation(ctx, id, filteredUpdates);

		// Log activity on the client
		const client = await ctx.db.get(clientId);
		if (client) {
			await ActivityHelpers.clientUpdated(ctx, client);
		}

		return id;
	},
});

/**
 * Delete a client contact
 */
export const remove = mutation({
	args: { id: v.id("clientContacts") },
	handler: async (ctx, args): Promise<ClientContactId> => {
		const contact = await getContactOrThrow(ctx, args.id);

		// Delete the contact
		await ctx.db.delete(args.id);

		// Log activity on the client
		const client = await ctx.db.get(contact.clientId);
		if (client) {
			await ActivityHelpers.clientUpdated(ctx, client);
		}

		return args.id;
	},
});

/**
 * Search contacts across the organization
 */
export const search = query({
	args: {
		query: v.string(),
		clientId: v.optional(v.id("clients")),
	},
	handler: async (ctx, args): Promise<ClientContactDocument[]> => {
		let contacts: ClientContactDocument[];

		if (args.clientId) {
			await validateClientAccess(ctx, args.clientId);
			contacts = await ctx.db
				.query("clientContacts")
				.withIndex("by_client", (q) => q.eq("clientId", args.clientId!))
				.collect();
		} else {
			const userOrgId = await getCurrentUserOrgId(ctx);
			contacts = await ctx.db
				.query("clientContacts")
				.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
				.collect();
		}

		// Search in first name, last name, email, and job title
		const searchQuery = args.query.toLowerCase();
		return contacts.filter(
			(contact: ClientContactDocument) =>
				contact.firstName.toLowerCase().includes(searchQuery) ||
				contact.lastName.toLowerCase().includes(searchQuery) ||
				(contact.email && contact.email.toLowerCase().includes(searchQuery)) ||
				(contact.jobTitle &&
					contact.jobTitle.toLowerCase().includes(searchQuery)) ||
				(contact.role && contact.role.toLowerCase().includes(searchQuery))
		);
	},
});

/**
 * Set a contact as primary (and unset others)
 */
export const setPrimary = mutation({
	args: { id: v.id("clientContacts") },
	handler: async (ctx, args): Promise<ClientContactId> => {
		const contact = await getContactOrThrow(ctx, args.id);

		// Unset any existing primary contact for this client
		const existingPrimary = await ctx.db
			.query("clientContacts")
			.withIndex("by_primary", (q) =>
				q.eq("clientId", contact.clientId).eq("isPrimary", true)
			)
			.unique();

		if (existingPrimary && existingPrimary._id !== args.id) {
			await ctx.db.patch(existingPrimary._id, { isPrimary: false });
		}

		// Set this contact as primary
		await ctx.db.patch(args.id, { isPrimary: true });

		// Log activity on the client
		const client = await ctx.db.get(contact.clientId);
		if (client) {
			await ActivityHelpers.clientUpdated(ctx, client);
		}

		return args.id;
	},
});
