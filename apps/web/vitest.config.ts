import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "edge-runtime",
		server: { deps: { inline: ["convex-test"] } },
		// Web app tests should be in src/ - backend tests are in packages/backend
		include: ["src/**/*.test.ts", "src/**/*.spec.ts"],
		exclude: ["**/node_modules/**", "**/dist/**", "**/.next/**"],
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			include: ["src/**/*.ts", "src/**/*.tsx"],
			exclude: ["src/**/*.test.ts", "src/**/*.spec.ts"],
		},
	},
});
