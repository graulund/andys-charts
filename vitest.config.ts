import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["src/**/*.test.ts"],
		coverage: {
			provider: "v8",
			include: ["src/lib/**/*.ts"],
			exclude: [
				"src/**/*.test.ts",
				"src/lib/config.ts",
				"src/lib/types.ts"
			],
			reporter: ["text", "html"],
			thresholds: {
				statements: 90,
				branches: 80,
				functions: 90,
				lines: 90
			}
		}
	}
});
