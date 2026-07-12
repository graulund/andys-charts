import { expect, test } from "vitest";
import { page } from "vitest/browser";

import "./legacy";
import { compressedDataSets } from "./test/fixtures";

test("preserves the window.createAndyCharts legacy contract", async () => {
	const root = document.createElement("div");
	root.id = "legacy-chart-root";
	document.body.appendChild(root);

	window.createAndyCharts(
		{
			config: {
				overrideStartYmd: "2024-01-29",
				overrideEndYmd: "2024-02-02",
				showEndFirst: false
			},
			dataSets: compressedDataSets
		},
		"#legacy-chart-root"
	);

	await expect.element(page.getByText("First track")).toBeVisible();
	await expect.element(page.getByText("Second track")).toBeVisible();
});
