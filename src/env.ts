import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		CLERK_SECRET_KEY: z.string().min(1),
		CLERK_WEBHOOK_SECRET: z.string().min(1),
		BOLDSIGN_API_KEY: z.string().min(1),
		BOLDSIGN_WEBHOOK_SECRET: z.string().optional(),
		OPENAI_API_KEY: z.string().min(1),
		UNSPLASH_ACCESS_KEY: z.string().min(1),
		UNSPLASH_SECRET_KEY: z.string().min(1),
		UNSPLASH_APP_ID: z.string().min(1),
		CLERK_ISSUER_DOMAIN: z.string().min(1),
	},
	client: {
		NEXT_PUBLIC_CONVEX_URL: z.string().min(1),
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
		NEXT_PUBLIC_CLERK_FRONTEND_API_URL: z.string().min(1),
	},
	experimental__runtimeEnv: {
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
			process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
		NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
		NEXT_PUBLIC_CLERK_FRONTEND_API_URL:
			process.env.NEXT_PUBLIC_CLERK_FRONTEND_API_URL,
	},
});
