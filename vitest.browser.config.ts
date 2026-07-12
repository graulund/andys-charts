import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
	esbuild: {
		jsx: "automatic"
	},
	server: {
		host: "127.0.0.1"
	},
	optimizeDeps: {
		include: [
			"react",
			"react-dom/client",
			"react/jsx-runtime",
			"react/jsx-dev-runtime"
		]
	},
	test: {
		include: ["src/**/*.browser.test.tsx"],
		setupFiles: ["./src/test/browserSetup.ts"],
		browser: {
			enabled: true,
			headless: true,
			provider: playwright(),
			instances: [{ browser: "chromium" }]
		}
	}
});
