import { expect, test } from "vitest";
import { page } from "vitest/browser";

import Chart from "./Chart";
import { dataSets } from "../test/fixtures";

test("renders axes and legend in a real browser", async () => {
	await page.render(
		<Chart
			config={{
				overrideStartYmd: "2024-01-29",
				overrideEndYmd: "2024-02-02",
				showEndFirst: false
			}}
			dataSets={dataSets}
		/>
	);

	await expect.element(page.getByText("January 2024")).toBeVisible();
	await expect.element(page.getByText("February")).toBeVisible();
	await expect.element(page.getByText("First track")).toBeVisible();
	await expect.element(page.getByText("Second track")).toBeVisible();
});

test("keeps the fixed value axis transparent over a non-solid background", async () => {
	await page.render(
		<div
			style={{
				background:
					"linear-gradient(90deg, rgb(255, 0, 0), rgb(0, 0, 255))"
			}}
		>
			<Chart
				config={{
					backgroundColor: "rgb(0, 255, 0)",
					overrideStartYmd: "2024-01-29",
					overrideEndYmd: "2024-02-02",
					showEndFirst: false
				}}
				dataSets={dataSets}
			/>
		</div>
	);

	const valueAxis = document.querySelector("svg");

	expect(valueAxis).not.toBeNull();
	expect(getComputedStyle(valueAxis as SVGElement).backgroundColor).toBe(
		"rgba(0, 0, 0, 0)"
	);
});

test("generates unique clip-path IDs for multiple charts", async () => {
	await page.render(
		<>
			<Chart dataSets={dataSets} />
			<Chart dataSets={dataSets} />
		</>
	);

	const ids = Array.from(
		document.querySelectorAll("clipPath"),
		({ id }) => id
	);

	expect(ids).toHaveLength(2);
	expect(new Set(ids).size).toBe(2);
});

test("resolves one pointer layer to the nearest data value", async () => {
	await page.render(
		<Chart
			config={{
				overrideStartYmd: "2024-01-29",
				overrideEndYmd: "2024-02-02",
				showEndFirst: false
			}}
			dataSets={dataSets}
		/>
	);

	const layer = page.getByTestId("chart-interaction-layer").element();
	const bounds = layer.getBoundingClientRect();
	const x = bounds.left + (bounds.width * 3) / 4;
	const y = bounds.top + 4 + (127 * 1) / 4;

	layer.dispatchEvent(
		new PointerEvent("pointermove", {
			bubbles: true,
			clientX: x,
			clientY: y,
			pointerType: "mouse"
		})
	);

	await expect
		.element(page.getByText("3 plays on February 1, 2024"))
		.toBeVisible();
});

test("makes legend-only tracks keyboard focusable", async () => {
	await page.render(
		<Chart
			dataSets={dataSets.map((dataSet) => ({ ...dataSet, url: null }))}
		/>
	);

	const secondTrack = page.getByRole("button", { name: "Second track" });

	(secondTrack.element() as HTMLButtonElement).focus();
	await expect.element(secondTrack).toHaveFocus();
});

test("keeps fixture SVG geometry stable", async () => {
	await page.render(
		<Chart
			config={{
				overrideStartYmd: "2024-01-29",
				overrideEndYmd: "2024-02-02",
				showEndFirst: false
			}}
			dataSets={dataSets}
		/>
	);

	const plot = document.querySelectorAll("svg")[1];
	const paths = Array.from(plot.querySelectorAll("path"), (path) =>
		path.getAttribute("d")
	);

	expect(paths).toMatchSnapshot();
});

test("uses native overflow and initially shows the end on narrow charts", async () => {
	await page.render(
		<div style={{ width: "300px" }}>
			<Chart dataSets={dataSets} />
		</div>
	);

	const scrollContainer = page
		.getByTestId("chart-scroll-container")
		.element();

	await expect.poll(() => scrollContainer.scrollLeft).toBeGreaterThan(0);
	expect(getComputedStyle(scrollContainer).overflowX).toBe("auto");
});
