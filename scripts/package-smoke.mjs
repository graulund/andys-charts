import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const root = resolve(import.meta.dirname, "..");
const fixtureRoot = await mkdtemp(join(tmpdir(), "andys-charts-package-"));

function run(command, args, cwd) {
	const result = spawnSync(command, args, {
		cwd,
		encoding: "utf8",
		stdio: "pipe"
	});

	if (result.status !== 0) {
		throw new Error(
			`${command} ${args.join(" ")} failed:\n${result.stdout}\n${result.stderr}`
		);
	}

	return result.stdout;
}

try {
	const packOutput = run(
		"npm",
		[
			"pack",
			"--ignore-scripts",
			"--json",
			"--pack-destination",
			fixtureRoot
		],
		root
	);
	const [{ filename }] = JSON.parse(packOutput);
	const tarball = join(fixtureRoot, filename);

	for (const version of ["18.2.0", "19.2.7"]) {
		const fixture = join(fixtureRoot, `react-${version}`);
		await mkdir(fixture);
		await writeFile(
			join(fixture, "package.json"),
			JSON.stringify(
				{
					private: true,
					type: "module",
					dependencies: {
						"andys-charts": `file:${tarball}`,
						react: version,
						"react-dom": version
					}
				},
				null,
				2
			)
		);
		await writeFile(
			join(fixture, "smoke.mjs"),
			`
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Chart, defaultConfig, unpackCompressedDataPoints } from "andys-charts";

const points = unpackCompressedDataPoints([["2024-01-01", 2]]);
const html = renderToStaticMarkup(React.createElement(Chart, {
  config: {
    ...defaultConfig,
    minValues: 1,
    overrideStartYmd: "2024-01-01",
    overrideEndYmd: "2024-01-01"
  },
  dataSets: [{ title: "Package smoke test", dataPoints: points }]
}));

if (!html.includes("Package smoke test")) {
  throw new Error("The packed chart failed to render");
}
`
		);

		run(
			"npm",
			["install", "--ignore-scripts", "--no-audit", "--no-fund"],
			fixture
		);
		run("node", ["smoke.mjs"], fixture);

		const css = await readFile(
			join(fixture, "node_modules/andys-charts/dist/style.css"),
			"utf8"
		);
		if (!css.includes("--andys-charts-axis-line")) {
			throw new Error(
				`The React ${version} fixture did not receive the standalone CSS`
			);
		}
	}
} finally {
	await rm(fixtureRoot, { recursive: true, force: true });
}
