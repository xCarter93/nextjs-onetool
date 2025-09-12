import { internalMutation, query, QueryCtx } from "./_generated/server";
import { UserJSON } from "@clerk/backend";
import { v, Validator } from "convex/values";

export const current = query({
	args: {},
	handler: async (ctx) => {
		return await getCurrentUser(ctx);
	},
});

export const upsertFromClerk = internalMutation({
	args: { data: v.any() as Validator<UserJSON> }, // no runtime validation, trust Clerk
	async handler(ctx, { data }) {
		const userAttributes = {
			name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
			email: data.email_addresses?.[0]?.email_address || "",
			image: data.image_url || "",
			lastSignedInDate: Date.now(),
			externalId: data.id,
		};

		const user = await userByExternalId(ctx, data.id);
		if (user === null) {
			await ctx.db.insert("users", userAttributes);
		} else {
			await ctx.db.patch(user._id, userAttributes);
		}
	},
});

export const deleteFromClerk = internalMutation({
	args: { clerkUserId: v.string() },
	async handler(ctx, { clerkUserId }) {
		const user = await userByExternalId(ctx, clerkUserId);

		if (user !== null) {
			await ctx.db.delete(user._id);
		} else {
			console.warn(
				`Can't delete user, there is none for Clerk user ID: ${clerkUserId}`
			);
		}
	},
});

export const updateLastSignedInDate = internalMutation({
	args: { clerkUserId: v.string() },
	async handler(ctx, { clerkUserId }) {
		const user = await userByExternalId(ctx, clerkUserId);

		if (user !== null) {
			await ctx.db.patch(user._id, {
				lastSignedInDate: Date.now(),
			});
		} else {
			console.warn(
				`Can't update last signed in date, no user found for Clerk user ID: ${clerkUserId}`
			);
		}
	},
});

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
	const userRecord = await getCurrentUser(ctx);
	if (!userRecord) throw new Error("Can't get current user");
	return userRecord;
}

export async function getCurrentUser(ctx: QueryCtx) {
	const identity = await ctx.auth.getUserIdentity();
	if (identity === null) {
		return null;
	}
	return await userByExternalId(ctx, identity.subject);
}

async function userByExternalId(ctx: QueryCtx, externalId: string) {
	return await ctx.db
		.query("users")
		.withIndex("by_external_id", (q) => q.eq("externalId", externalId))
		.unique();
}
