import { convexTest } from "convex-test";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import schema from "./schema";

/**
 * Test setup for Convex tests
 * This file exports a modules glob that convex-test uses to load all Convex functions
 */
// @ts-expect-error - import.meta.glob is provided by Vitest
export const modules = import.meta.glob("./**/*.ts");

// Schema for aggregate components (from @convex-dev/aggregate)
const item = v.object({
	k: v.any(),
	v: v.any(),
	s: v.number(),
});

const aggregate = v.object({
	count: v.number(),
	sum: v.number(),
});

const aggregateSchema = defineSchema({
	btree: defineTable({
		root: v.id("btreeNode"),
		namespace: v.optional(v.any()),
		maxNodeSize: v.number(),
	}).index("by_namespace", ["namespace"]),
	btreeNode: defineTable({
		items: v.array(item),
		subtrees: v.array(v.id("btreeNode")),
		aggregate: v.optional(aggregate),
	}),
});

// Modules for aggregate components
// @ts-expect-error - import.meta.glob is provided by Vitest
const aggregateModules = import.meta.glob(
	"../node_modules/@convex-dev/aggregate/dist/esm/component/**/*.js"
);

/**
 * Creates a test instance with all components registered
 * Use this instead of calling convexTest directly to ensure components are available
 */
export function setupConvexTest() {
	const t = convexTest(schema, modules);

	// Register aggregate components
	t.registerComponent("clientCounts", aggregateSchema, aggregateModules);
	t.registerComponent("projectCounts", aggregateSchema, aggregateModules);
	t.registerComponent("quoteCounts", aggregateSchema, aggregateModules);
	t.registerComponent("invoiceRevenue", aggregateSchema, aggregateModules);
	t.registerComponent("invoiceCounts", aggregateSchema, aggregateModules);

	return t;
}
