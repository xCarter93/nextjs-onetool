import { query } from "./_generated/server";
import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { getCurrentUserOrThrow, getCurrentUserOrgId } from "./lib/auth";

/**
 * Activity operations for activity feed
 */

export interface ActivityWithUser extends Doc<"activities"> {
	user: {
		name: string;
		email: string;
		image: string;
	};
}

/**
 * Get recent activities for the current organization with time filtering
 */
export const getRecent = query({
	args: {
		limit: v.optional(v.number()),
		dayRange: v.optional(v.number()), // Number of days to look back
	},
	handler: async (ctx, args): Promise<ActivityWithUser[]> => {
		await getCurrentUserOrThrow(ctx);
		const orgId = await getCurrentUserOrgId(ctx);

		// Calculate timestamp filter if dayRange is provided
		let timestampFilter: number | undefined;
		if (args.dayRange) {
			const daysInMs = args.dayRange * 24 * 60 * 60 * 1000;
			timestampFilter = Date.now() - daysInMs;
		}

		// Query activities for the organization, ordered by timestamp (newest first)
		const activitiesQuery = ctx.db
			.query("activities")
			.withIndex("by_org_timestamp", (q) => {
				if (timestampFilter) {
					return q.eq("orgId", orgId).gte("timestamp", timestampFilter);
				} else {
					return q.eq("orgId", orgId);
				}
			})
			.order("desc")
			.filter((q) => q.eq(q.field("isVisible"), true));

		// Apply limit if provided (default to 50)
		const limit = args.limit || 50;
		const activities = await activitiesQuery.take(limit);

		// Fetch user data for each activity
		const activitiesWithUsers: ActivityWithUser[] = [];
		for (const activity of activities) {
			const activityUser = await ctx.db.get(activity.userId);
			if (activityUser) {
				activitiesWithUsers.push({
					...activity,
					user: {
						name: activityUser.name,
						email: activityUser.email,
						image: activityUser.image,
					},
				});
			}
		}

		return activitiesWithUsers;
	},
});

/**
 * Get activities by type for the current organization
 */
export const getByType = query({
	args: {
		activityType: v.union(
			v.literal("client_created"),
			v.literal("client_updated"),
			v.literal("project_created"),
			v.literal("project_updated"),
			v.literal("project_completed"),
			v.literal("quote_created"),
			v.literal("quote_sent"),
			v.literal("quote_approved"),
			v.literal("quote_declined"),
			v.literal("invoice_created"),
			v.literal("invoice_sent"),
			v.literal("invoice_paid"),
			v.literal("task_created"),
			v.literal("task_completed"),
			v.literal("user_invited"),
			v.literal("user_removed"),
			v.literal("organization_updated")
		),
		limit: v.optional(v.number()),
	},
	handler: async (ctx, args): Promise<ActivityWithUser[]> => {
		await getCurrentUserOrThrow(ctx);
		const orgId = await getCurrentUserOrgId(ctx);

		const activities = await ctx.db
			.query("activities")
			.withIndex("by_type", (q) =>
				q.eq("orgId", orgId).eq("activityType", args.activityType)
			)
			.order("desc")
			.filter((q) => q.eq(q.field("isVisible"), true))
			.take(args.limit || 25);

		// Fetch user data for each activity
		const activitiesWithUsers: ActivityWithUser[] = [];
		for (const activity of activities) {
			const activityUser = await ctx.db.get(activity.userId);
			if (activityUser) {
				activitiesWithUsers.push({
					...activity,
					user: {
						name: activityUser.name,
						email: activityUser.email,
						image: activityUser.image,
					},
				});
			}
		}

		return activitiesWithUsers;
	},
});

/**
 * Get activities for a specific entity
 */
export const getByEntity = query({
	args: {
		entityType: v.union(
			v.literal("client"),
			v.literal("project"),
			v.literal("quote"),
			v.literal("invoice"),
			v.literal("task"),
			v.literal("user"),
			v.literal("organization")
		),
		entityId: v.string(),
		limit: v.optional(v.number()),
	},
	handler: async (ctx, args): Promise<ActivityWithUser[]> => {
		await getCurrentUserOrThrow(ctx);
		const orgId = await getCurrentUserOrgId(ctx);

		const activities = await ctx.db
			.query("activities")
			.withIndex("by_entity", (q) =>
				q.eq("entityType", args.entityType).eq("entityId", args.entityId)
			)
			.filter((q) =>
				q.and(q.eq(q.field("orgId"), orgId), q.eq(q.field("isVisible"), true))
			)
			.order("desc")
			.take(args.limit || 25);

		// Fetch user data for each activity
		const activitiesWithUsers: ActivityWithUser[] = [];
		for (const activity of activities) {
			const activityUser = await ctx.db.get(activity.userId);
			if (activityUser) {
				activitiesWithUsers.push({
					...activity,
					user: {
						name: activityUser.name,
						email: activityUser.email,
						image: activityUser.image,
					},
				});
			}
		}

		return activitiesWithUsers;
	},
});

/**
 * Get activity count for the current organization
 */
export const getCount = query({
	args: {
		dayRange: v.optional(v.number()),
		activityType: v.optional(
			v.union(
				v.literal("client_created"),
				v.literal("client_updated"),
				v.literal("project_created"),
				v.literal("project_updated"),
				v.literal("project_completed"),
				v.literal("quote_created"),
				v.literal("quote_sent"),
				v.literal("quote_approved"),
				v.literal("quote_declined"),
				v.literal("invoice_created"),
				v.literal("invoice_sent"),
				v.literal("invoice_paid"),
				v.literal("task_created"),
				v.literal("task_completed"),
				v.literal("user_invited"),
				v.literal("user_removed"),
				v.literal("organization_updated")
			)
		),
	},
	handler: async (ctx, args): Promise<number> => {
		await getCurrentUserOrThrow(ctx);
		const orgId = await getCurrentUserOrgId(ctx);

		// Calculate timestamp filter if dayRange is provided
		let timestampFilter: number | undefined;
		if (args.dayRange) {
			const daysInMs = args.dayRange * 24 * 60 * 60 * 1000;
			timestampFilter = Date.now() - daysInMs;
		}

		// Build the query based on filters
		let activities;

		if (args.activityType) {
			activities = await ctx.db
				.query("activities")
				.withIndex("by_type", (q) =>
					q.eq("orgId", orgId).eq("activityType", args.activityType!)
				)
				.filter((q) => q.eq(q.field("isVisible"), true))
				.collect();
		} else {
			activities = await ctx.db
				.query("activities")
				.withIndex("by_org_timestamp", (q) => {
					if (timestampFilter) {
						return q.eq("orgId", orgId).gte("timestamp", timestampFilter);
					} else {
						return q.eq("orgId", orgId);
					}
				})
				.filter((q) => q.eq(q.field("isVisible"), true))
				.collect();
		}

		return activities.length;
	},
});
