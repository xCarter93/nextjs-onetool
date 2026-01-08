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
// In pnpm monorepo, dependencies are hoisted to root node_modules
// Try multiple paths to find the aggregate component modules
// @ts-expect-error - import.meta.glob is provided by Vitest
const aggregateModulesRoot = import.meta.glob(
	"/node_modules/@convex-dev/aggregate/dist/esm/component/**/*.js"
) as Record<string, () => Promise<unknown>>;

// Fallback: try relative path from packages/backend
// @ts-expect-error - import.meta.glob is provided by Vitest
const aggregateModulesRelative = import.meta.glob(
	"../../node_modules/@convex-dev/aggregate/dist/esm/component/**/*.js"
) as Record<string, () => Promise<unknown>>;

// Use whichever path found the modules
const aggregateModules =
	Object.keys(aggregateModulesRoot).length > 0
		? aggregateModulesRoot
		: aggregateModulesRelative;

/**
 * Creates a test instance with all components registered
 * Use this instead of calling convexTest directly to ensure components are available
 */
export function setupConvexTest() {
	const t = convexTest(schema, modules);

	// Register aggregate components if available
	// Some tests may not need aggregates, so we register conditionally
	if (Object.keys(aggregateModules).length > 0) {
		t.registerComponent("clientCounts", aggregateSchema, aggregateModules);
		t.registerComponent("projectCounts", aggregateSchema, aggregateModules);
		t.registerComponent("quoteCounts", aggregateSchema, aggregateModules);
		t.registerComponent("invoiceRevenue", aggregateSchema, aggregateModules);
		t.registerComponent("invoiceCounts", aggregateSchema, aggregateModules);
	} else {
		console.warn(
			"Warning: Aggregate modules not found. Tests requiring aggregates may fail."
		);
	}

	return t;
}
