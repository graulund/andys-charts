import { defineConfig, type Plugin } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import dts from "vite-plugin-dts";

/** Keeps a standalone copy while the compatibility injector consumes the original CSS. */
function standaloneCss(): Plugin {
	return {
		name: "andys-charts-standalone-css",
		apply: "build",
		enforce: "post",
		generateBundle(_options, bundle) {
			const css = Object.values(bundle).find(
				(asset) =>
					asset.type === "asset" && asset.fileName.endsWith(".css")
			);

			if (css?.type === "asset") {
				this.emitFile({
					type: "asset",
					fileName: "style.css",
					source: css.source
				});
			}
		}
	};
}

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
			fileName: "index",
			cssFileName: "andys-charts"
		},
		rollupOptions: {
			external: [/^react($|\/)/, /^react-dom($|\/)/]
		}
	},
	plugins: [
		standaloneCss(),
		cssInjectedByJsPlugin({
			cssAssetsFilterFunction: ({ fileName }) => fileName !== "style.css"
		}),
		dts({
			include: ["src", "env.d.ts"],
			exclude: [
				"src/legacy.tsx",
				"src/test/**",
				"**/*.stories.tsx",
				"**/*.test.ts",
				"**/*.test.tsx"
			]
		})
	]
});
