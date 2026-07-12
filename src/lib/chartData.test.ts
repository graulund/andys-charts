import { describe, expect, it } from "vitest";

import {
	filterDataSets,
	getPaddedDataPointSegments,
	padChartDataPointLists,
	padChartDataPoints
} from "./chartData";
import { dateFromYmd } from "./time";
import { ChartDataPoint, ChartDataSet } from "./types";

describe("chart data padding", () => {
	it("pads missing dates and clips outside the requested range", () => {
		expect(
			padChartDataPoints(
				[
					{ date: "2024-01-01", plays: 2 },
					{ date: "2024-01-03", plays: 4 },
					{ date: "2024-01-05", plays: 8 }
				],
				dateFromYmd("2024-01-02"),
				dateFromYmd("2024-01-04")
			)
		).toEqual([
			{ date: "2024-01-02", plays: 0 },
			{ date: "2024-01-03", plays: 4 },
			{ date: "2024-01-04", plays: 0 }
		]);
	});

	it("returns null for an empty point list", () => {
		expect(
			padChartDataPoints(
				[],
				dateFromYmd("2024-01-01"),
				dateFromYmd("2024-01-02")
			)
		).toBeNull();
	});

	it("applies explicit start and end overrides", () => {
		const [points] = padChartDataPointLists(
			[[{ date: "2024-01-02", plays: 2 }]],
			{
				overrideStartYmd: "2024-01-01",
				overrideEndYmd: "2024-01-03"
			}
		);

		expect(points).toEqual([
			{ date: "2024-01-01", plays: 0 },
			{ date: "2024-01-02", plays: 2 },
			{ date: "2024-01-03", plays: 0 }
		]);
	});

	it("applies start-only and end-only overrides independently", () => {
		const data = [
			[
				{ date: "2024-01-05", plays: 2 },
				{ date: "2024-01-06", plays: 2 }
			]
		];
		const [startOnly] = padChartDataPointLists(data, {
			overrideStartYmd: "2024-01-04",
			todayYmd: "2024-01-07"
		});
		const [endOnly] = padChartDataPointLists(data, {
			minDays: 1,
			overrideEndYmd: "2024-01-08"
		});

		expect(startOnly[0].date).toBe("2024-01-04");
		expect(startOnly.at(-1)?.date).toBe("2024-01-07");
		expect(endOnly[0].date).toBe("2024-01-04");
		expect(endOnly.at(-1)?.date).toBe("2024-01-08");
	});

	it("finds the data extent when input points are unsorted", () => {
		const [points] = padChartDataPointLists(
			[
				[
					{ date: "2024-01-10", plays: 2 },
					{ date: "2024-01-02", plays: 1 },
					{ date: "2024-01-06", plays: 3 }
				]
			],
			{
				maxEndPaddingDays: 0,
				minDays: 1,
				todayYmd: "2024-01-10"
			}
		);

		expect(points[0].date).toBe("2024-01-01");
		expect(points.at(-1)?.date).toBe("2024-01-10");
	});

	it("preserves empty list positions so datasets stay aligned", () => {
		const lists = padChartDataPointLists(
			[[], [{ date: "2024-01-02", plays: 2 }]],
			{
				overrideStartYmd: "2024-01-01",
				overrideEndYmd: "2024-01-03"
			}
		);

		expect(lists).toHaveLength(2);
		expect(lists[0]).toEqual([]);
		expect(lists[1][1]).toEqual({ date: "2024-01-02", plays: 2 });
	});

	it("limits old data and never pads beyond today", () => {
		const [points] = padChartDataPointLists(
			[
				[
					{ date: "2024-01-01", plays: 1 },
					{ date: "2024-01-10", plays: 1 }
				]
			],
			{
				maxDays: 5,
				minDays: 2,
				maxEndPaddingDays: 5,
				todayYmd: "2024-01-12"
			}
		);

		expect(points[0].date).toBe("2024-01-07");
		expect(points.at(-1)?.date).toBe("2024-01-12");
	});
});

describe("dataset filtering", () => {
	it("keeps metadata aligned and requires the configured number of positive days", () => {
		const dataSets: ChartDataSet[] = [
			{ title: "included", dataPoints: [] },
			{ title: "excluded", dataPoints: [] }
		];
		const processed: ChartDataPoint[][] = [
			[
				{ date: "2024-01-01", plays: 1 },
				{ date: "2024-01-02", plays: 2 }
			],
			[
				{ date: "2024-01-01", plays: 0 },
				{ date: "2024-01-02", plays: 2 }
			]
		];

		expect(filterDataSets(dataSets, processed, 2)).toEqual([
			{
				title: "included",
				dataPoints: processed[0]
			}
		]);
	});
});

describe("data point segmentation", () => {
	it("includes one zero around gaps and splits on two consecutive zeroes", () => {
		const points: ChartDataPoint[] = [
			{ date: "2024-01-01", plays: 0 },
			{ date: "2024-01-02", plays: 2 },
			{ date: "2024-01-03", plays: 0 },
			{ date: "2024-01-04", plays: 0 },
			{ date: "2024-01-05", plays: 3 },
			{ date: "2024-01-06", plays: 0 }
		];

		expect(getPaddedDataPointSegments(points)).toEqual([
			points.slice(0, 3),
			points.slice(3)
		]);
	});

	it("returns no segments for all-zero data", () => {
		expect(
			getPaddedDataPointSegments([
				{ date: "2024-01-01", plays: 0 },
				{ date: "2024-01-02", plays: 0 }
			])
		).toEqual([]);
	});
});
