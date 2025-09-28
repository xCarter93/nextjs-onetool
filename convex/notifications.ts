import { query, mutation, QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { getCurrentUserOrgId } from "./lib/auth";
import { DateUtils } from "./lib/shared";
import { requireMembership } from "./lib/memberships";

/**
 * Notification operations with embedded CRUD helpers
 * All notification-specific logic lives in this file for better organization
 */

// Notification-specific helper functions

/**
 * Get a notification by ID with organization and user validation
 */
async function getNotificationWithValidation(
	ctx: QueryCtx | MutationCtx,
	id: Id<"notifications">
): Promise<Doc<"notifications"> | null> {
	const userOrgId = await getCurrentUserOrgId(ctx);
	const notification = await ctx.db.get(id);

	if (!notification) {
		return null;
	}

	if (notification.orgId !== userOrgId) {
		throw new Error("Notification does not belong to your organization");
	}

	return notification;
}

/**
 * Get a notification by ID, throwing if not found
 */
async function getNotificationOrThrow(
	ctx: QueryCtx | MutationCtx,
	id: Id<"notifications">
): Promise<Doc<"notifications">> {
	const notification = await getNotificationWithValidation(ctx, id);
	if (!notification) {
		throw new Error("Notification not found");
	}
	return notification;
}

/**
 * Validate user exists and belongs to user's org
 */
async function validateUserAccess(
	ctx: QueryCtx | MutationCtx,
	userId: Id<"users">
): Promise<void> {
	const userOrgId = await getCurrentUserOrgId(ctx);
	const user = await ctx.db.get(userId);

	if (!user) {
		throw new Error("User not found");
	}

	await requireMembership(ctx, userId, userOrgId);
}

/**
 * Create a notification with automatic orgId assignment
 */
async function createNotificationWithOrg(
	ctx: MutationCtx,
	data: Omit<Doc<"notifications">, "_id" | "_creationTime" | "orgId">
): Promise<Id<"notifications">> {
	const userOrgId = await getCurrentUserOrgId(ctx);

	// Validate user access
	await validateUserAccess(ctx, data.userId);

	const notificationData = {
		...data,
		orgId: userOrgId,
	};

	return await ctx.db.insert("notifications", notificationData);
}

/**
 * Update a notification with validation
 */
async function updateNotificationWithValidation(
	ctx: MutationCtx,
	id: Id<"notifications">,
	updates: Partial<Doc<"notifications">>
): Promise<void> {
	// Validate notification exists and belongs to user's org
	await getNotificationOrThrow(ctx, id);

	// If userId is being updated, validate the new user
	if (updates.userId) {
		await validateUserAccess(ctx, updates.userId);
	}

	// Update the notification
	await ctx.db.patch(id, updates);
}

// Define specific types for notification operations
type NotificationDocument = Doc<"notifications">;
type NotificationId = Id<"notifications">;

// Interface for notification statistics
interface NotificationStats {
	total: number;
	unread: number;
	byType: {
		task_reminder: number;
		quote_approved: number;
		invoice_overdue: number;
		payment_received: number;
		project_deadline: number;
		team_assignment: number;
	};
	byPriority: {
		low: number;
		medium: number;
		high: number;
		urgent: number;
	};
	today: number;
	pending: number; // scheduled but not sent yet
}

/**
 * Get all notifications for a specific user
 */
// TODO: Candidate for deletion if confirmed unused.
export const listByUser = query({
	args: {
		userId: v.id("users"),
		isRead: v.optional(v.boolean()),
		notificationType: v.optional(
			v.union(
				v.literal("task_reminder"),
				v.literal("quote_approved"),
				v.literal("invoice_overdue"),
				v.literal("payment_received"),
				v.literal("project_deadline"),
				v.literal("team_assignment")
			)
		),
		limit: v.optional(v.number()),
	},
	handler: async (ctx, args): Promise<NotificationDocument[]> => {
		// Validate user access
		await validateUserAccess(ctx, args.userId);

		let notifications: NotificationDocument[];

		if (args.isRead !== undefined) {
			notifications = await ctx.db
				.query("notifications")
				.withIndex("by_user_read", (q) =>
					q.eq("userId", args.userId).eq("isRead", args.isRead as boolean)
				)
				.collect();
		} else {
			notifications = await ctx.db
				.query("notifications")
				.filter((q) => q.eq(q.field("userId"), args.userId))
				.collect();
		}

		// Filter by notification type if specified
		if (args.notificationType) {
			notifications = notifications.filter(
				(notification) =>
					notification.notificationType === args.notificationType
			);
		}

		// Sort by creation time (newest first)
		notifications.sort((a, b) => b._creationTime - a._creationTime);

		// Apply limit if specified
		if (args.limit) {
			notifications = notifications.slice(0, args.limit);
		}

		return notifications;
	},
});

/**
 * Get all notifications for the current user's organization
 */
// TODO: Candidate for deletion if confirmed unused.
export const list = query({
	args: {
		notificationType: v.optional(
			v.union(
				v.literal("task_reminder"),
				v.literal("quote_approved"),
				v.literal("invoice_overdue"),
				v.literal("payment_received"),
				v.literal("project_deadline"),
				v.literal("team_assignment")
			)
		),
		priority: v.optional(
			v.union(
				v.literal("low"),
				v.literal("medium"),
				v.literal("high"),
				v.literal("urgent")
			)
		),
	},
	handler: async (ctx, args): Promise<NotificationDocument[]> => {
		const userOrgId = await getCurrentUserOrgId(ctx);

		let notifications: NotificationDocument[];

		if (args.notificationType) {
			notifications = await ctx.db
				.query("notifications")
				.withIndex("by_type", (q) =>
					q.eq(
						"notificationType",
						args.notificationType as NonNullable<typeof args.notificationType>
					)
				)
				.collect();

			// Filter by organization
			notifications = notifications.filter((n) => n.orgId === userOrgId);
		} else {
			notifications = await ctx.db
				.query("notifications")
				.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
				.collect();
		}

		// Filter by priority if specified
		if (args.priority) {
			notifications = notifications.filter(
				(notification) => notification.priority === args.priority
			);
		}

		// Sort by creation time (newest first)
		return notifications.sort((a, b) => b._creationTime - a._creationTime);
	},
});

/**
 * Get a specific notification by ID
 */
// TODO: Candidate for deletion if confirmed unused.
export const get = query({
	args: { id: v.id("notifications") },
	handler: async (ctx, args): Promise<NotificationDocument | null> => {
		return await getNotificationWithValidation(ctx, args.id);
	},
});

/**
 * Create a new notification
 */
// TODO: Candidate for deletion if confirmed unused.
export const create = mutation({
	args: {
		userId: v.id("users"),
		notificationType: v.union(
			v.literal("task_reminder"),
			v.literal("quote_approved"),
			v.literal("invoice_overdue"),
			v.literal("payment_received"),
			v.literal("project_deadline"),
			v.literal("team_assignment")
		),
		title: v.string(),
		message: v.string(),
		entityType: v.optional(
			v.union(
				v.literal("client"),
				v.literal("project"),
				v.literal("quote"),
				v.literal("invoice"),
				v.literal("task")
			)
		),
		entityId: v.optional(v.string()),
		actionUrl: v.optional(v.string()),
		scheduledFor: v.optional(v.number()),
		sentVia: v.optional(
			v.union(v.literal("email"), v.literal("sms"), v.literal("in_app"))
		),
		priority: v.union(
			v.literal("low"),
			v.literal("medium"),
			v.literal("high"),
			v.literal("urgent")
		),
	},
	handler: async (ctx, args): Promise<NotificationId> => {
		// Validate required fields
		if (!args.title.trim()) {
			throw new Error("Notification title is required");
		}

		if (!args.message.trim()) {
			throw new Error("Notification message is required");
		}

		// Validate scheduled time if provided
		if (args.scheduledFor && args.scheduledFor <= Date.now()) {
			throw new Error("Scheduled time must be in the future");
		}

		const notificationId = await createNotificationWithOrg(ctx, {
			...args,
			isRead: false,
		});

		return notificationId;
	},
});

/**
 * Update a notification
 */
// TODO: Candidate for deletion if confirmed unused.
export const update = mutation({
	args: {
		id: v.id("notifications"),
		title: v.optional(v.string()),
		message: v.optional(v.string()),
		actionUrl: v.optional(v.string()),
		scheduledFor: v.optional(v.number()),
		sentVia: v.optional(
			v.union(v.literal("email"), v.literal("sms"), v.literal("in_app"))
		),
		priority: v.optional(
			v.union(
				v.literal("low"),
				v.literal("medium"),
				v.literal("high"),
				v.literal("urgent")
			)
		),
	},
	handler: async (ctx, args): Promise<NotificationId> => {
		const { id, ...updates } = args;

		// Validate fields if being updated
		if (updates.title !== undefined && !updates.title.trim()) {
			throw new Error("Notification title cannot be empty");
		}

		if (updates.message !== undefined && !updates.message.trim()) {
			throw new Error("Notification message cannot be empty");
		}

		if (updates.scheduledFor && updates.scheduledFor <= Date.now()) {
			throw new Error("Scheduled time must be in the future");
		}

		// Filter out undefined values
		const filteredUpdates = Object.fromEntries(
			Object.entries(updates).filter(([, value]) => value !== undefined)
		) as Partial<NotificationDocument>;

		if (Object.keys(filteredUpdates).length === 0) {
			throw new Error("No valid updates provided");
		}

		await updateNotificationWithValidation(ctx, id, filteredUpdates);

		return id;
	},
});

/**
 * Mark a notification as read
 */
// TODO: Candidate for deletion if confirmed unused.
export const markRead = mutation({
	args: { id: v.id("notifications") },
	handler: async (ctx, args): Promise<NotificationId> => {
		const notification = await getNotificationOrThrow(ctx, args.id);

		if (notification.isRead) {
			throw new Error("Notification is already read");
		}

		await ctx.db.patch(args.id, {
			isRead: true,
			readAt: Date.now(),
		});

		return args.id;
	},
});

/**
 * Mark a notification as unread
 */
// TODO: Candidate for deletion if confirmed unused.
export const markUnread = mutation({
	args: { id: v.id("notifications") },
	handler: async (ctx, args): Promise<NotificationId> => {
		const notification = await getNotificationOrThrow(ctx, args.id);

		if (!notification.isRead) {
			throw new Error("Notification is already unread");
		}

		await ctx.db.patch(args.id, {
			isRead: false,
			readAt: undefined,
		});

		return args.id;
	},
});

/**
 * Mark multiple notifications as read
 */
// TODO: Candidate for deletion if confirmed unused.
export const markMultipleRead = mutation({
	args: { ids: v.array(v.id("notifications")) },
	handler: async (ctx, args): Promise<{ updated: number }> => {
		const now = Date.now();
		let updated = 0;

		for (const id of args.ids) {
			const notification = await getNotificationWithValidation(ctx, id);
			if (notification && !notification.isRead) {
				await ctx.db.patch(id, {
					isRead: true,
					readAt: now,
				});
				updated++;
			}
		}

		return { updated };
	},
});

/**
 * Mark a notification as sent
 */
// TODO: Candidate for deletion if confirmed unused.
export const markSent = mutation({
	args: {
		id: v.id("notifications"),
		sentVia: v.union(v.literal("email"), v.literal("sms"), v.literal("in_app")),
	},
	handler: async (ctx, args): Promise<NotificationId> => {
		await getNotificationOrThrow(ctx, args.id);

		await ctx.db.patch(args.id, {
			sentAt: Date.now(),
			sentVia: args.sentVia,
		});

		return args.id;
	},
});

/**
 * Delete a notification
 */
// TODO: Candidate for deletion if confirmed unused.
export const remove = mutation({
	args: { id: v.id("notifications") },
	handler: async (ctx, args): Promise<NotificationId> => {
		await getNotificationOrThrow(ctx, args.id); // Validate access
		await ctx.db.delete(args.id);
		return args.id;
	},
});

/**
 * Get notification statistics for a user
 */
// TODO: Candidate for deletion if confirmed unused.
export const getStatsForUser = query({
	args: { userId: v.id("users") },
	handler: async (ctx, args): Promise<NotificationStats> => {
		// Validate user access
		await validateUserAccess(ctx, args.userId);

		const notifications = await ctx.db
			.query("notifications")
			.filter((q) => q.eq(q.field("userId"), args.userId))
			.collect();

		const stats: NotificationStats = {
			total: notifications.length,
			unread: 0,
			byType: {
				task_reminder: 0,
				quote_approved: 0,
				invoice_overdue: 0,
				payment_received: 0,
				project_deadline: 0,
				team_assignment: 0,
			},
			byPriority: {
				low: 0,
				medium: 0,
				high: 0,
				urgent: 0,
			},
			today: 0,
			pending: 0,
		};

		const now = Date.now();
		const todayStart = DateUtils.startOfDay(now);
		const todayEnd = DateUtils.endOfDay(now);

		notifications.forEach((notification: NotificationDocument) => {
			// Count unread
			if (!notification.isRead) {
				stats.unread++;
			}

			// Count by type
			stats.byType[notification.notificationType]++;

			// Count by priority
			stats.byPriority[notification.priority]++;

			// Count today's notifications
			if (
				notification._creationTime >= todayStart &&
				notification._creationTime <= todayEnd
			) {
				stats.today++;
			}

			// Count pending (scheduled but not sent)
			if (
				notification.scheduledFor &&
				notification.scheduledFor > now &&
				!notification.sentAt
			) {
				stats.pending++;
			}
		});

		return stats;
	},
});

/**
 * Get notification statistics for the organization
 */
// TODO: Candidate for deletion if confirmed unused.
export const getStats = query({
	args: {},
	handler: async (ctx): Promise<NotificationStats> => {
		const userOrgId = await getCurrentUserOrgId(ctx);
		const notifications = await ctx.db
			.query("notifications")
			.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
			.collect();

		const stats: NotificationStats = {
			total: notifications.length,
			unread: 0,
			byType: {
				task_reminder: 0,
				quote_approved: 0,
				invoice_overdue: 0,
				payment_received: 0,
				project_deadline: 0,
				team_assignment: 0,
			},
			byPriority: {
				low: 0,
				medium: 0,
				high: 0,
				urgent: 0,
			},
			today: 0,
			pending: 0,
		};

		const now = Date.now();
		const todayStart = DateUtils.startOfDay(now);
		const todayEnd = DateUtils.endOfDay(now);

		notifications.forEach((notification: NotificationDocument) => {
			// Count unread
			if (!notification.isRead) {
				stats.unread++;
			}

			// Count by type
			stats.byType[notification.notificationType]++;

			// Count by priority
			stats.byPriority[notification.priority]++;

			// Count today's notifications
			if (
				notification._creationTime >= todayStart &&
				notification._creationTime <= todayEnd
			) {
				stats.today++;
			}

			// Count pending (scheduled but not sent)
			if (
				notification.scheduledFor &&
				notification.scheduledFor > now &&
				!notification.sentAt
			) {
				stats.pending++;
			}
		});

		return stats;
	},
});

/**
 * Get notifications due to be sent
 */
// TODO: Candidate for deletion if confirmed unused.
export const getDueNotifications = query({
	args: {},
	handler: async (ctx): Promise<NotificationDocument[]> => {
		const now = Date.now();

		const notifications = await ctx.db
			.query("notifications")
			.withIndex("by_scheduled", (q) => q.lte("scheduledFor", now))
			.collect();

		// Only return notifications that haven't been sent yet
		return notifications.filter((notification) => !notification.sentAt);
	},
});

/**
 * Delete old read notifications (cleanup)
 */
// TODO: Candidate for deletion if confirmed unused.
export const cleanupOldNotifications = mutation({
	args: { daysOld: v.number() },
	handler: async (ctx, args): Promise<{ deletedCount: number }> => {
		if (args.daysOld < 1) {
			throw new Error("Days old must be at least 1");
		}

		const userOrgId = await getCurrentUserOrgId(ctx);
		const cutoffTime = Date.now() - args.daysOld * 24 * 60 * 60 * 1000;

		const notifications = await ctx.db
			.query("notifications")
			.withIndex("by_org", (q) => q.eq("orgId", userOrgId))
			.collect();

		// Filter to old read notifications
		const toDelete = notifications.filter(
			(notification) =>
				notification.isRead && notification._creationTime < cutoffTime
		);

		// Delete old notifications
		for (const notification of toDelete) {
			await ctx.db.delete(notification._id);
		}

		return { deletedCount: toDelete.length };
	},
});
