import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

// Legacy build: A self-contained classic-script (IIFE) bundle that exposes
// window.createAndyCharts, with React included. Existing sites (P3 Trends,
// Playte) copy the build folder and load the files listed in the
// asset-manifest.json entrypoints, exactly like the old create-react-app
// output — so this build reproduces that output contract:
//
//   build/static/js/main.[hash].js
//   build/static/css/main.[hash].css
//   build/asset-manifest.json  (with an "entrypoints" list)
//   build/index.html           (demo page)

/** Emits a CRA-compatible asset-manifest.json and demo index.html */
function craCompatOutput(): Plugin {
	return {
		name: "cra-compat-output",
		apply: "build",
		enforce: "post",
		generateBundle(options, bundle) {
			let jsFile = "";
			let cssFile = "";

			for (const [fileName, chunk] of Object.entries(bundle)) {
				if (chunk.type === "chunk" && chunk.isEntry) {
					jsFile = fileName;
				} else if (fileName.endsWith(".css")) {
					cssFile = fileName;
				}
			}

			if (!jsFile || !cssFile) {
				this.error("Expected the legacy build to contain one JS entry and one CSS file");
			}

			const files: Record<string, string> = {
				"main.css": `/${cssFile}`,
				"main.js": `/${jsFile}`,
				"index.html": "/index.html"
			};

			if (options.sourcemap) {
				files[`${jsFile.replace(/^.*\//, "")}.map`] = `/${jsFile}.map`;
			}

			const manifest = {
				files,
				entrypoints: [cssFile, jsFile]
			};

			this.emitFile({
				type: "asset",
				fileName: "asset-manifest.json",
				source: `${JSON.stringify(manifest, null, 2)}\n`
			});

			// Demo page: the dev-mode module script is swapped for the built
			// stylesheet and classic script tags, like create-react-app did

			const html = readFileSync(resolve(rootDir, "index.html"), "utf8")
				.replace(
					/[ \t]*<script type="module" src="\/src\/legacy\.tsx"><\/script>\n/,
					""
				)
				.replace(
					"</head>",
					`\t<script defer="defer" src="/${jsFile}"></script>\n` +
					`\t\t<link href="/${cssFile}" rel="stylesheet" />\n\t</head>`
				);

			this.emitFile({
				type: "asset",
				fileName: "index.html",
				source: html
			});
		}
	};
}

export default defineConfig(({ command }) => ({
	esbuild: {
		jsx: "automatic"
	},
	// React's CJS build branches on process.env.NODE_ENV, which does not exist
	// in the browser; bake in the production build
	define: command === "build"
		? { "process.env.NODE_ENV": JSON.stringify("production") }
		: {},
	build: {
		outDir: "build",
		sourcemap: true,
		cssCodeSplit: false,
		lib: {
			entry: "src/legacy.tsx",
			// The entry has no exports; the bundle works via window side effect.
			// A name is still required for the IIFE format.
			name: "AndyCharts",
			formats: ["iife"]
		},
		rollupOptions: {
			output: {
				entryFileNames: "static/js/main.[hash].js",
				assetFileNames: "static/css/main.[hash][extname]"
			}
		}
	},
	plugins: [craCompatOutput()]
}));
