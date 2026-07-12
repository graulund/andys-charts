import { describe, expect, it } from "vitest";

import getChartFacts from "./chartFacts";
import { defaultConfig } from "./config";
import { dataSets } from "../test/fixtures";

describe("chart facts", () => {
	it("pads, filters, and summarizes chart data", () => {
		const facts = getChartFacts(dataSets, {
			...defaultConfig,
			overrideStartYmd: "2024-01-29",
			overrideEndYmd: "2024-02-02",
			minValues: 2
		});

		expect(facts.dataSets.map(({ title }) => title)).toEqual([
			"First track",
			"Second track"
		]);
		expect(facts.firstDate).toBe("2024-01-29");
		expect(facts.lastDate).toBe("2024-02-02");
		expect(facts.totalDays).toBe(4);
		expect(facts.maxValue).toBe(defaultConfig.minMaxPlays);
		expect(facts.values).toContainEqual({
			date: "2024-02-01",
			plays: 3,
			indexes: [1],
			valueKey: "2024-02-01:3"
		});
	});

	it("returns empty facts when no dataset survives", () => {
		const facts = getChartFacts([], defaultConfig);

		expect(facts.dataSets).toEqual([]);
		expect(facts.dataPointLists).toEqual([]);
		expect(facts.firstDate).toBeUndefined();
		expect(facts.lastDate).toBeUndefined();
		expect(facts.totalDays).toBe(0);
		expect(facts.maxValue).toBe(defaultConfig.minMaxPlays);
	});

	it("uses one coordinate interval for a one-day range", () => {
		const facts = getChartFacts(
			[
				{
					title: "one day",
					dataPoints: [{ date: "2024-01-01", plays: 8 }]
				}
			],
			{
				...defaultConfig,
				minValues: 1,
				overrideStartYmd: "2024-01-01",
				overrideEndYmd: "2024-01-01"
			}
		);

		expect(facts.totalDays).toBe(1);
		expect(facts.maxValue).toBe(8);
	});

	it("drops invalid points and clamps impossible negative play counts", () => {
		const facts = getChartFacts(
			[
				{
					title: "normalized",
					dataPoints: [
						{ date: "2024-01-01", plays: -2 },
						{ date: "2024-01-02", plays: Number.POSITIVE_INFINITY },
						{ date: "2024-02-31", plays: 3 },
						{ date: "2024-01-03", plays: 4 }
					]
				}
			],
			{
				...defaultConfig,
				minValues: 1,
				overrideStartYmd: "2024-01-01",
				overrideEndYmd: "2024-01-03"
			}
		);

		expect(facts.dataSets[0].dataPoints).toEqual([
			{ date: "2024-01-01", plays: 0 },
			{ date: "2024-01-02", plays: 0 },
			{ date: "2024-01-03", plays: 4 }
		]);
	});
});
