import { internalMutation } from "../_generated/server";
import { v } from "convex/values";

/**
 * Migration scripts to remove deprecated fields from the database
 * Run these BEFORE deploying the schema changes that remove these fields
 *
 * IMPORTANT: Each migration processes ONE PAGE at a time due to Convex pagination limits.
 * You need to call each migration repeatedly until isDone = true.
 *
 * To run these migrations:
 * 1. Deploy your convex functions: `npx convex deploy`
 * 2. Go to the Convex dashboard
 * 3. Navigate to Functions tab
 * 4. Run each migration function repeatedly until it returns isDone: true
 *    - First call: migrateUsers with no args
 *    - If isDone is false, call again with the continueCursor from the response
 *    - Repeat until isDone is true
 *
 * Run in this order:
 * 1. migrateUsers
 * 2. migrateOrganizations
 * 3. migrateClients (also migrates prospect -> lead)
 * 4. migrateClientContacts
 * 5. migrateClientProperties
 * 6. migrateProjects
 * 7. migrateTasks
 * 8. migrateQuotes
 * 9. migrateQuoteLineItems
 * 10. migrateInvoices
 * 11. migrateNotifications
 */

/**
 * Remove deprecated fields from users table:
 * - clerkSubscriptionId
 * - clerkPlanId
 * - billingCycleStart
 */
export const migrateUsers = internalMutation({
	args: {
		cursor: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const errors: string[] = [];
		let processed = 0;

		try {
			const page = await ctx.db
				.query("users")
				.paginate({ numItems: 100, cursor: args.cursor || null });

			for (const user of page.page) {
				try {
					if (
						user.clerkSubscriptionId !== undefined ||
						user.clerkPlanId !== undefined ||
						user.billingCycleStart !== undefined
					) {
						await ctx.db.patch(user._id, {
							clerkSubscriptionId: undefined,
							clerkPlanId: undefined,
							billingCycleStart: undefined,
						});
						processed++;
					}
				} catch (error) {
					errors.push(`Failed to migrate user ${user._id}: ${error}`);
				}
			}

			const isDone = page.continueCursor === null;
			console.log(`Users migration: ${processed} processed, isDone: ${isDone}`);

			return {
				processed,
				errors,
				isDone,
				continueCursor: page.continueCursor || undefined,
			};
		} catch (error) {
			errors.push(`Users migration failed: ${error}`);
			return { processed, errors, isDone: true };
		}
	},
});

/**
 * Remove deprecated fields from organizations table:
 * - brandColor
 * - stripeCustomerId
 * - defaultTaxRate
 * - defaultReminderTiming
 * - smsEnabled
 */
export const migrateOrganizations = internalMutation({
	args: {
		cursor: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const errors: string[] = [];
		let processed = 0;

		try {
			const page = await ctx.db
				.query("organizations")
				.paginate({ numItems: 100, cursor: args.cursor || null });

			for (const org of page.page) {
				try {
					if (
						org.brandColor !== undefined ||
						org.stripeCustomerId !== undefined ||
						org.defaultTaxRate !== undefined ||
						org.defaultReminderTiming !== undefined ||
						org.smsEnabled !== undefined
					) {
						await ctx.db.patch(org._id, {
							brandColor: undefined,
							stripeCustomerId: undefined,
							defaultTaxRate: undefined,
							defaultReminderTiming: undefined,
							smsEnabled: undefined,
						});
						processed++;
					}
				} catch (error) {
					errors.push(`Failed to migrate organization ${org._id}: ${error}`);
				}
			}

			const isDone = page.continueCursor === null;
			console.log(
				`Organizations migration: ${processed} processed, isDone: ${isDone}`
			);

			return {
				processed,
				errors,
				isDone,
				continueCursor: page.continueCursor || undefined,
			};
		} catch (error) {
			errors.push(`Organizations migration failed: ${error}`);
			return { processed, errors, isDone: true };
		}
	},
});

/**
 * Remove deprecated fields from clients table and migrate prospect -> lead:
 * - industry
 * - category
 * - clientSize
 * - clientType
 * - priorityLevel
 * - projectDimensions
 * - emailOptIn
 * - smsOptIn
 * - servicesNeeded
 * - status: "prospect" -> "lead"
 */
export const migrateClients = internalMutation({
	args: {
		cursor: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const errors: string[] = [];
		let processed = 0;
		let prospectsMigrated = 0;

		try {
			const page = await ctx.db
				.query("clients")
				.paginate({ numItems: 100, cursor: args.cursor || null });

			for (const client of page.page) {
				try {
					const updates: Record<string, unknown> = {};

					// Check for deprecated fields
					if (client.industry !== undefined) updates.industry = undefined;
					if (client.category !== undefined) updates.category = undefined;
					if (client.clientSize !== undefined) updates.clientSize = undefined;
					if (client.clientType !== undefined) updates.clientType = undefined;
					if (client.priorityLevel !== undefined)
						updates.priorityLevel = undefined;
					if (client.projectDimensions !== undefined)
						updates.projectDimensions = undefined;
					if (client.emailOptIn !== undefined) updates.emailOptIn = undefined;
					if (client.smsOptIn !== undefined) updates.smsOptIn = undefined;
					if (client.servicesNeeded !== undefined)
						updates.servicesNeeded = undefined;

					// Migrate prospect status to lead
					if (client.status === "prospect") {
						updates.status = "lead";
						prospectsMigrated++;
					}

					if (Object.keys(updates).length > 0) {
						await ctx.db.patch(client._id, updates);
						processed++;
					}
				} catch (error) {
					errors.push(`Failed to migrate client ${client._id}: ${error}`);
				}
			}

			const isDone = page.continueCursor === null;
			console.log(
				`Clients migration: ${processed} processed, ${prospectsMigrated} prospects->leads, isDone: ${isDone}`
			);

			return {
				processed,
				errors,
				isDone,
				continueCursor: page.continueCursor || undefined,
			};
		} catch (error) {
			errors.push(`Clients migration failed: ${error}`);
			return { processed, errors, isDone: true };
		}
	},
});

/**
 * Remove deprecated fields from clientContacts table:
 * - role
 * - department
 * - photoUrl
 * - photoStorageId
 */
export const migrateClientContacts = internalMutation({
	args: {
		cursor: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const errors: string[] = [];
		let processed = 0;

		try {
			const page = await ctx.db
				.query("clientContacts")
				.paginate({ numItems: 100, cursor: args.cursor || null });

			for (const contact of page.page) {
				try {
					if (
						contact.role !== undefined ||
						contact.department !== undefined ||
						contact.photoUrl !== undefined ||
						contact.photoStorageId !== undefined
					) {
						await ctx.db.patch(contact._id, {
							role: undefined,
							department: undefined,
							photoUrl: undefined,
							photoStorageId: undefined,
						});
						processed++;
					}
				} catch (error) {
					errors.push(`Failed to migrate contact ${contact._id}: ${error}`);
				}
			}

			const isDone = page.continueCursor === null;
			console.log(
				`ClientContacts migration: ${processed} processed, isDone: ${isDone}`
			);

			return {
				processed,
				errors,
				isDone,
				continueCursor: page.continueCursor || undefined,
			};
		} catch (error) {
			errors.push(`ClientContacts migration failed: ${error}`);
			return { processed, errors, isDone: true };
		}
	},
});

/**
 * Remove deprecated fields from clientProperties table:
 * - squareFootage
 * - description
 * - imageStorageIds
 */
export const migrateClientProperties = internalMutation({
	args: {
		cursor: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const errors: string[] = [];
		let processed = 0;

		try {
			const page = await ctx.db
				.query("clientProperties")
				.paginate({ numItems: 100, cursor: args.cursor || null });

			for (const property of page.page) {
				try {
					if (
						property.squareFootage !== undefined ||
						property.description !== undefined ||
						property.imageStorageIds !== undefined
					) {
						await ctx.db.patch(property._id, {
							squareFootage: undefined,
							description: undefined,
							imageStorageIds: undefined,
						});
						processed++;
					}
				} catch (error) {
					errors.push(`Failed to migrate property ${property._id}: ${error}`);
				}
			}

			const isDone = page.continueCursor === null;
			console.log(
				`ClientProperties migration: ${processed} processed, isDone: ${isDone}`
			);

			return {
				processed,
				errors,
				isDone,
				continueCursor: page.continueCursor || undefined,
			};
		} catch (error) {
			errors.push(`ClientProperties migration failed: ${error}`);
			return { processed, errors, isDone: true };
		}
	},
});

/**
 * Remove deprecated fields from projects table:
 * - instructions
 * - salespersonId
 * - invoiceReminderEnabled
 * - scheduleForLater
 */
export const migrateProjects = internalMutation({
	args: {
		cursor: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const errors: string[] = [];
		let processed = 0;

		try {
			const page = await ctx.db
				.query("projects")
				.paginate({ numItems: 100, cursor: args.cursor || null });

			for (const project of page.page) {
				try {
					if (
						project.instructions !== undefined ||
						project.salespersonId !== undefined ||
						project.invoiceReminderEnabled !== undefined ||
						project.scheduleForLater !== undefined
					) {
						await ctx.db.patch(project._id, {
							instructions: undefined,
							salespersonId: undefined,
							invoiceReminderEnabled: undefined,
							scheduleForLater: undefined,
						});
						processed++;
					}
				} catch (error) {
					errors.push(`Failed to migrate project ${project._id}: ${error}`);
				}
			}

			const isDone = page.continueCursor === null;
			console.log(
				`Projects migration: ${processed} processed, isDone: ${isDone}`
			);

			return {
				processed,
				errors,
				isDone,
				continueCursor: page.continueCursor || undefined,
			};
		} catch (error) {
			errors.push(`Projects migration failed: ${error}`);
			return { processed, errors, isDone: true };
		}
	},
});

/**
 * Remove deprecated fields from tasks table:
 * - priority
 */
export const migrateTasks = internalMutation({
	args: {
		cursor: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const errors: string[] = [];
		let processed = 0;

		try {
			const page = await ctx.db
				.query("tasks")
				.paginate({ numItems: 100, cursor: args.cursor || null });

			for (const task of page.page) {
				try {
					if (task.priority !== undefined) {
						await ctx.db.patch(task._id, {
							priority: undefined,
						});
						processed++;
					}
				} catch (error) {
					errors.push(`Failed to migrate task ${task._id}: ${error}`);
				}
			}

			const isDone = page.continueCursor === null;
			console.log(`Tasks migration: ${processed} processed, isDone: ${isDone}`);

			return {
				processed,
				errors,
				isDone,
				continueCursor: page.continueCursor || undefined,
			};
		} catch (error) {
			errors.push(`Tasks migration failed: ${error}`);
			return { processed, errors, isDone: true };
		}
	},
});

/**
 * Remove deprecated fields from quotes table:
 * - approval
 * - publicToken
 */
export const migrateQuotes = internalMutation({
	args: {
		cursor: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const errors: string[] = [];
		let processed = 0;

		try {
			const page = await ctx.db
				.query("quotes")
				.paginate({ numItems: 100, cursor: args.cursor || null });

			for (const quote of page.page) {
				try {
					if (quote.approval !== undefined || quote.publicToken !== undefined) {
						await ctx.db.patch(quote._id, {
							approval: undefined,
							publicToken: undefined,
						});
						processed++;
					}
				} catch (error) {
					errors.push(`Failed to migrate quote ${quote._id}: ${error}`);
				}
			}

			const isDone = page.continueCursor === null;
			console.log(
				`Quotes migration: ${processed} processed, isDone: ${isDone}`
			);

			return {
				processed,
				errors,
				isDone,
				continueCursor: page.continueCursor || undefined,
			};
		} catch (error) {
			errors.push(`Quotes migration failed: ${error}`);
			return { processed, errors, isDone: true };
		}
	},
});

/**
 * Remove deprecated fields from quoteLineItems table:
 * - optional
 */
export const migrateQuoteLineItems = internalMutation({
	args: {
		cursor: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const errors: string[] = [];
		let processed = 0;

		try {
			const page = await ctx.db
				.query("quoteLineItems")
				.paginate({ numItems: 100, cursor: args.cursor || null });

			for (const item of page.page) {
				try {
					if (item.optional !== undefined) {
						await ctx.db.patch(item._id, {
							optional: undefined,
						});
						processed++;
					}
				} catch (error) {
					errors.push(`Failed to migrate line item ${item._id}: ${error}`);
				}
			}

			const isDone = page.continueCursor === null;
			console.log(
				`QuoteLineItems migration: ${processed} processed, isDone: ${isDone}`
			);

			return {
				processed,
				errors,
				isDone,
				continueCursor: page.continueCursor || undefined,
			};
		} catch (error) {
			errors.push(`QuoteLineItems migration failed: ${error}`);
			return { processed, errors, isDone: true };
		}
	},
});

/**
 * Remove deprecated fields from invoices table:
 * - paymentMethod
 */
export const migrateInvoices = internalMutation({
	args: {
		cursor: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const errors: string[] = [];
		let processed = 0;

		try {
			const page = await ctx.db
				.query("invoices")
				.paginate({ numItems: 100, cursor: args.cursor || null });

			for (const invoice of page.page) {
				try {
					if (invoice.paymentMethod !== undefined) {
						await ctx.db.patch(invoice._id, {
							paymentMethod: undefined,
						});
						processed++;
					}
				} catch (error) {
					errors.push(`Failed to migrate invoice ${invoice._id}: ${error}`);
				}
			}

			const isDone = page.continueCursor === null;
			console.log(
				`Invoices migration: ${processed} processed, isDone: ${isDone}`
			);

			return {
				processed,
				errors,
				isDone,
				continueCursor: page.continueCursor || undefined,
			};
		} catch (error) {
			errors.push(`Invoices migration failed: ${error}`);
			return { processed, errors, isDone: true };
		}
	},
});

/**
 * Remove deprecated fields from notifications table:
 * - priority
 */
export const migrateNotifications = internalMutation({
	args: {
		cursor: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const errors: string[] = [];
		let processed = 0;

		try {
			const page = await ctx.db
				.query("notifications")
				.paginate({ numItems: 100, cursor: args.cursor || null });

			for (const notification of page.page) {
				try {
					if (notification.priority !== undefined) {
						await ctx.db.patch(notification._id, {
							priority: undefined,
						});
						processed++;
					}
				} catch (error) {
					errors.push(
						`Failed to migrate notification ${notification._id}: ${error}`
					);
				}
			}

			const isDone = page.continueCursor === null;
			console.log(
				`Notifications migration: ${processed} processed, isDone: ${isDone}`
			);

			return {
				processed,
				errors,
				isDone,
				continueCursor: page.continueCursor || undefined,
			};
		} catch (error) {
			errors.push(`Notifications migration failed: ${error}`);
			return { processed, errors, isDone: true };
		}
	},
});
