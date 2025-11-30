import { internalMutation } from "../_generated/server";

/**
 * Migration to add receiving addresses to organizations that don't have one
 * Run this once to backfill existing organizations
 */
export const addReceivingAddresses = internalMutation({
	args: {},
	handler: async (ctx) => {
		const organizations = await ctx.db.query("organizations").collect();

		let updated = 0;
		for (const org of organizations) {
			if (!org.receivingAddress) {
				const receivingAddress = `org-${crypto.randomUUID().slice(0, 8)}@onetool.biz`;
				await ctx.db.patch(org._id, {
					receivingAddress,
				});
				console.log(`Added receiving address for org ${org._id}: ${receivingAddress}`);
				updated++;
			}
		}

		console.log(`Migration complete: Updated ${updated} organizations`);
		return { updated, total: organizations.length };
	},
});

