import { query, mutation, QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { getCurrentUserOrgId } from "./lib/auth";
import { ActivityHelpers } from "./lib/activities";

/**
 * Client Property operations with embedded CRUD helpers
 * All client property-specific logic lives in this file for better organization
 */

// Client Property-specific helper functions

/**
 * Get a client property by ID with organization and client validation
 */
async function getPropertyWithValidation(
	ctx: QueryCtx | MutationCtx,
	id: Id<"clientProperties">
): Promise<Doc<"clientProperties"> | null> {
	const userOrgId = await getCurrentUserOrgId(ctx);
	const property = await ctx.db.get(id);

	if (!property) {
		return null;
	}

	if (property.orgId !== userOrgId) {
		throw new Error("Property does not belong to your organization");
	}

	return property;
}

/**
 * Get a client property by ID, throwing if not found
 */
async function getPropertyOrThrow(
	ctx: QueryCtx | MutationCtx,
	id: Id<"clientProperties">
): Promise<Doc<"clientProperties">> {
	const property = await getPropertyWithValidation(ctx, id);
	if (!property) {
		throw new Error("Client property not found");
	}
	return property;
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
 * Create a client property with automatic orgId assignment
 */
async function createPropertyWithOrg(
	ctx: MutationCtx,
	data: Omit<Doc<"clientProperties">, "_id" | "_creationTime" | "orgId">
): Promise<Id<"clientProperties">> {
	const userOrgId = await getCurrentUserOrgId(ctx);

	// Validate client access
	await validateClientAccess(ctx, data.clientId);

	const propertyData = {
		...data,
		orgId: userOrgId,
	};

	return await ctx.db.insert("clientProperties", propertyData);
}

/**
 * Update a client property with validation
 */
async function updatePropertyWithValidation(
	ctx: MutationCtx,
	id: Id<"clientProperties">,
	updates: Partial<Doc<"clientProperties">>
): Promise<void> {
	// Validate property exists and belongs to user's org
	await getPropertyOrThrow(ctx, id);

	// If clientId is being updated, validate the new client
	if (updates.clientId) {
		await validateClientAccess(ctx, updates.clientId);
	}

	// Update the property
	await ctx.db.patch(id, updates);
}

// Define specific types for client property operations
type ClientPropertyDocument = Doc<"clientProperties">;
type ClientPropertyId = Id<"clientProperties">;

/**
 * Get all properties for a specific client
 */
export const listByClient = query({
	args: { clientId: v.id("clients") },
	handler: async (ctx, args): Promise<ClientPropertyDocument[]> => {
		await validateClientAccess(ctx, args.clientId);

		return await ctx.db
			.query("clientProperties")
			.withIndex("by_client", (q) => q.eq("clientId", args.clientId))
			.collect();
	},
});

/**
 * Get all properties for the current user's organization
 */
export const list = query({
	args: {},
	handler: async (ctx): Promise<ClientPropertyDocument[]> => {
		const userOrgId = await getCurrentUserOrgId(ctx);

		return await ctx.db
			.query("clientProperties")
			.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
			.collect();
	},
});

/**
 * Get a specific client property by ID
 */
export const get = query({
	args: { id: v.id("clientProperties") },
	handler: async (ctx, args): Promise<ClientPropertyDocument | null> => {
		return await getPropertyWithValidation(ctx, args.id);
	},
});

/**
 * Get primary property for a client
 */
export const getPrimaryProperty = query({
	args: { clientId: v.id("clients") },
	handler: async (ctx, args): Promise<ClientPropertyDocument | null> => {
		await validateClientAccess(ctx, args.clientId);

		return await ctx.db
			.query("clientProperties")
			.withIndex("by_primary", (q) =>
				q.eq("clientId", args.clientId).eq("isPrimary", true)
			)
			.unique();
	},
});

/**
 * Create a new client property
 */
export const create = mutation({
	args: {
		clientId: v.id("clients"),
		propertyName: v.optional(v.string()),
		propertyType: v.optional(
			v.union(
				v.literal("residential"),
				v.literal("commercial"),
				v.literal("industrial"),
				v.literal("retail"),
				v.literal("office"),
				v.literal("mixed-use")
			)
		),
		squareFootage: v.optional(v.number()),
		streetAddress: v.string(),
		city: v.string(),
		state: v.string(),
		zipCode: v.string(),
		country: v.optional(v.string()),
		description: v.optional(v.string()),
		imageStorageIds: v.optional(v.array(v.id("_storage"))),
		isPrimary: v.boolean(),
	},
	handler: async (ctx, args): Promise<ClientPropertyId> => {
		// Validate required address fields are not empty
		if (!args.streetAddress.trim()) {
			throw new Error("Street address is required");
		}
		if (!args.city.trim()) {
			throw new Error("City is required");
		}
		if (!args.state.trim()) {
			throw new Error("State is required");
		}
		if (!args.zipCode.trim()) {
			throw new Error("ZIP code is required");
		}

		// Validate square footage is positive if provided
		if (args.squareFootage !== undefined && args.squareFootage <= 0) {
			throw new Error("Square footage must be positive");
		}

		// If setting as primary, ensure no other primary property exists for this client
		if (args.isPrimary) {
			const existingPrimary = await ctx.db
				.query("clientProperties")
				.withIndex("by_primary", (q) =>
					q.eq("clientId", args.clientId).eq("isPrimary", true)
				)
				.unique();

			if (existingPrimary) {
				// Unset the existing primary property
				await ctx.db.patch(existingPrimary._id, { isPrimary: false });
			}
		}

		const propertyId = await createPropertyWithOrg(ctx, args);

		// Get the created property for activity logging
		const property = await ctx.db.get(propertyId);
		if (property) {
			await ActivityHelpers.clientUpdated(
				ctx,
				(await ctx.db.get(property.clientId)) as Doc<"clients">
			);
		}

		return propertyId;
	},
});

/**
 * Update a client property
 */
export const update = mutation({
	args: {
		id: v.id("clientProperties"),
		clientId: v.optional(v.id("clients")),
		propertyName: v.optional(v.string()),
		propertyType: v.optional(
			v.union(
				v.literal("residential"),
				v.literal("commercial"),
				v.literal("industrial"),
				v.literal("retail"),
				v.literal("office"),
				v.literal("mixed-use")
			)
		),
		squareFootage: v.optional(v.number()),
		streetAddress: v.optional(v.string()),
		city: v.optional(v.string()),
		state: v.optional(v.string()),
		zipCode: v.optional(v.string()),
		country: v.optional(v.string()),
		description: v.optional(v.string()),
		imageStorageIds: v.optional(v.array(v.id("_storage"))),
		isPrimary: v.optional(v.boolean()),
	},
	handler: async (ctx, args): Promise<ClientPropertyId> => {
		const { id, ...updates } = args;

		// Validate required address fields are not empty if being updated
		if (updates.streetAddress !== undefined && !updates.streetAddress.trim()) {
			throw new Error("Street address cannot be empty");
		}
		if (updates.city !== undefined && !updates.city.trim()) {
			throw new Error("City cannot be empty");
		}
		if (updates.state !== undefined && !updates.state.trim()) {
			throw new Error("State cannot be empty");
		}
		if (updates.zipCode !== undefined && !updates.zipCode.trim()) {
			throw new Error("ZIP code cannot be empty");
		}

		// Validate square footage is positive if provided
		if (updates.squareFootage !== undefined && updates.squareFootage <= 0) {
			throw new Error("Square footage must be positive");
		}

		// Filter out undefined values
		const filteredUpdates = Object.fromEntries(
			Object.entries(updates).filter(([, value]) => value !== undefined)
		) as Partial<ClientPropertyDocument>;

		if (Object.keys(filteredUpdates).length === 0) {
			throw new Error("No valid updates provided");
		}

		// Get current property to check clientId for primary validation
		const currentProperty = await getPropertyOrThrow(ctx, id);
		const clientId = filteredUpdates.clientId || currentProperty.clientId;

		// If setting as primary, ensure no other primary property exists for this client
		if (filteredUpdates.isPrimary === true) {
			const existingPrimary = await ctx.db
				.query("clientProperties")
				.withIndex("by_primary", (q) =>
					q.eq("clientId", clientId).eq("isPrimary", true)
				)
				.unique();

			if (existingPrimary && existingPrimary._id !== id) {
				// Unset the existing primary property
				await ctx.db.patch(existingPrimary._id, { isPrimary: false });
			}
		}

		await updatePropertyWithValidation(ctx, id, filteredUpdates);

		// Log activity on the client
		const client = await ctx.db.get(clientId);
		if (client) {
			await ActivityHelpers.clientUpdated(ctx, client);
		}

		return id;
	},
});

/**
 * Delete a client property
 */
export const remove = mutation({
	args: { id: v.id("clientProperties") },
	handler: async (ctx, args): Promise<ClientPropertyId> => {
		const property = await getPropertyOrThrow(ctx, args.id);

		// Delete the property
		await ctx.db.delete(args.id);

		// Log activity on the client
		const client = await ctx.db.get(property.clientId);
		if (client) {
			await ActivityHelpers.clientUpdated(ctx, client);
		}

		return args.id;
	},
});

/**
 * Search properties across the organization
 */
export const search = query({
	args: {
		query: v.string(),
		clientId: v.optional(v.id("clients")),
		propertyType: v.optional(
			v.union(
				v.literal("residential"),
				v.literal("commercial"),
				v.literal("industrial"),
				v.literal("retail"),
				v.literal("office"),
				v.literal("mixed-use")
			)
		),
	},
	handler: async (ctx, args): Promise<ClientPropertyDocument[]> => {
		let properties: ClientPropertyDocument[];

		if (args.clientId) {
			await validateClientAccess(ctx, args.clientId);
			properties = await ctx.db
				.query("clientProperties")
				.withIndex("by_client", (q) => q.eq("clientId", args.clientId!))
				.collect();
		} else {
			const userOrgId = await getCurrentUserOrgId(ctx);
			properties = await ctx.db
				.query("clientProperties")
				.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
				.collect();
		}

		// Filter by property type if specified
		if (args.propertyType) {
			properties = properties.filter(
				(property: ClientPropertyDocument) =>
					property.propertyType === args.propertyType
			);
		}

		// Search in property name, address, city, state, and description
		const searchQuery = args.query.toLowerCase();
		return properties.filter(
			(property: ClientPropertyDocument) =>
				(property.propertyName &&
					property.propertyName.toLowerCase().includes(searchQuery)) ||
				property.streetAddress.toLowerCase().includes(searchQuery) ||
				property.city.toLowerCase().includes(searchQuery) ||
				property.state.toLowerCase().includes(searchQuery) ||
				property.zipCode.toLowerCase().includes(searchQuery) ||
				(property.description &&
					property.description.toLowerCase().includes(searchQuery))
		);
	},
});

/**
 * Set a property as primary (and unset others)
 */
export const setPrimary = mutation({
	args: { id: v.id("clientProperties") },
	handler: async (ctx, args): Promise<ClientPropertyId> => {
		const property = await getPropertyOrThrow(ctx, args.id);

		// Unset any existing primary property for this client
		const existingPrimary = await ctx.db
			.query("clientProperties")
			.withIndex("by_primary", (q) =>
				q.eq("clientId", property.clientId).eq("isPrimary", true)
			)
			.unique();

		if (existingPrimary && existingPrimary._id !== args.id) {
			await ctx.db.patch(existingPrimary._id, { isPrimary: false });
		}

		// Set this property as primary
		await ctx.db.patch(args.id, { isPrimary: true });

		// Log activity on the client
		const client = await ctx.db.get(property.clientId);
		if (client) {
			await ActivityHelpers.clientUpdated(ctx, client);
		}

		return args.id;
	},
});

/**
 * Bulk create properties for a client
 */
export const bulkCreate = mutation({
	args: {
		clientId: v.id("clients"),
		properties: v.array(
			v.object({
				propertyName: v.optional(v.string()),
				propertyType: v.optional(
					v.union(
						v.literal("residential"),
						v.literal("commercial"),
						v.literal("industrial"),
						v.literal("retail"),
						v.literal("office"),
						v.literal("mixed-use")
					)
				),
				squareFootage: v.optional(v.number()),
				streetAddress: v.string(),
				city: v.string(),
				state: v.string(),
				zipCode: v.string(),
				country: v.optional(v.string()),
				description: v.optional(v.string()),
				imageStorageIds: v.optional(v.array(v.id("_storage"))),
				isPrimary: v.boolean(),
			})
		),
	},
	handler: async (ctx, args): Promise<ClientPropertyId[]> => {
		const userOrgId = await getCurrentUserOrgId(ctx);

		// Validate client access
		await validateClientAccess(ctx, args.clientId);

		const propertyIds: ClientPropertyId[] = [];
		let hasPrimary = false;

		// Check if any property is marked as primary
		for (const property of args.properties) {
			if (property.isPrimary) {
				if (hasPrimary) {
					throw new Error("Only one property can be marked as primary");
				}
				hasPrimary = true;
			}
		}

		// If setting a primary property, unset existing primary
		if (hasPrimary) {
			const existingPrimary = await ctx.db
				.query("clientProperties")
				.withIndex("by_primary", (q) =>
					q.eq("clientId", args.clientId).eq("isPrimary", true)
				)
				.unique();

			if (existingPrimary) {
				await ctx.db.patch(existingPrimary._id, { isPrimary: false });
			}
		}

		// Create all properties
		for (const propertyData of args.properties) {
			// Validate required address fields
			if (!propertyData.streetAddress.trim()) {
				throw new Error("Street address is required for all properties");
			}
			if (!propertyData.city.trim()) {
				throw new Error("City is required for all properties");
			}
			if (!propertyData.state.trim()) {
				throw new Error("State is required for all properties");
			}
			if (!propertyData.zipCode.trim()) {
				throw new Error("ZIP code is required for all properties");
			}

			// Validate square footage is positive if provided
			if (
				propertyData.squareFootage !== undefined &&
				propertyData.squareFootage <= 0
			) {
				throw new Error("Square footage must be positive");
			}

			const propertyId = await ctx.db.insert("clientProperties", {
				...propertyData,
				clientId: args.clientId,
				orgId: userOrgId,
			});

			propertyIds.push(propertyId);
		}

		// Log activity on the client
		const client = await ctx.db.get(args.clientId);
		if (client) {
			await ActivityHelpers.clientUpdated(ctx, client);
		}

		return propertyIds;
	},
});

/**
 * Get property statistics for the organization
 */
export const getStats = query({
	args: {},
	handler: async (ctx) => {
		const userOrgId = await getCurrentUserOrgId(ctx);
		const properties = await ctx.db
			.query("clientProperties")
			.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
			.collect();

		const stats = {
			total: properties.length,
			byType: {
				residential: 0,
				commercial: 0,
				industrial: 0,
				retail: 0,
				office: 0,
				"mixed-use": 0,
				unspecified: 0,
			},
			totalSquareFootage: 0,
			averageSquareFootage: 0,
		};

		properties.forEach((property: ClientPropertyDocument) => {
			// Count by type
			if (property.propertyType) {
				stats.byType[property.propertyType]++;
			} else {
				stats.byType.unspecified++;
			}

			// Sum square footage
			if (property.squareFootage) {
				stats.totalSquareFootage += property.squareFootage;
			}
		});

		// Calculate average square footage
		const propertiesWithSquareFootage = properties.filter(
			(p) => p.squareFootage
		).length;
		if (propertiesWithSquareFootage > 0) {
			stats.averageSquareFootage = Math.round(
				stats.totalSquareFootage / propertiesWithSquareFootage
			);
		}

		return stats;
	},
});
