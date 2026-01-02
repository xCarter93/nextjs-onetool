import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "edge-runtime",
		server: { deps: { inline: ["convex-test"] } },
		include: ["convex/**/*.test.ts"],
		exclude: ["**/node_modules/**", "**/dist/**", "**/.next/**"],
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			include: ["convex/**/*.ts"],
			exclude: [
				"convex/**/*.test.ts",
				"convex/_generated/**",
				"convex/test.setup.ts",
			],
		},
	},
});
