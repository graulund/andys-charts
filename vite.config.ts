import { defineConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import dts from "vite-plugin-dts";

// Library build: ESM module with type declarations, for npm consumers.
// Component styles (CSS modules) are compiled into the JS bundle and injected
// into the document head at runtime, so consumers need no CSS setup.
export default defineConfig({
	esbuild: {
		jsx: "automatic"
	},
	build: {
		outDir: "dist",
		sourcemap: true,
		lib: {
			entry: "src/index.ts",
			formats: ["es"],
			fileName: "index"
		},
		rollupOptions: {
			external: [
				/^react($|\/)/,
				/^react-dom($|\/)/,
				"clsx",
				"d3-path"
			]
		}
	},
	plugins: [
		cssInjectedByJsPlugin(),
		dts({
			include: ["src", "env.d.ts"],
			exclude: ["src/legacy.tsx", "**/*.stories.tsx", "**/*.test.tsx"]
		})
	]
});
