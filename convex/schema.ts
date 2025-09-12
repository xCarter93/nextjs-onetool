import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	users: defineTable({
		name: v.string(),
		email: v.string(),
		image: v.string(),
		lastSignedInDate: v.optional(v.number()),
		externalId: v.string(),
	}).index("by_external_id", ["externalId"]),
});
