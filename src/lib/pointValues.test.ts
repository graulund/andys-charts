import { describe, expect, it } from "vitest";

import {
	getAllValues,
	getHighlightedValue,
	getValueFromKey,
	getValueKey
} from "./pointValues";
import { dataSets } from "../test/fixtures";

describe("point values", () => {
	it("round-trips value keys", () => {
		const key = getValueKey("2024-02-03", 12);

		expect(key).toBe("2024-02-03:12");
		expect(getValueFromKey(key)).toEqual({ date: "2024-02-03", plays: 12 });
	});

	it("groups equal date/value points across datasets and ignores zeroes", () => {
		const values = getAllValues([
			[
				{ date: "2024-01-01", plays: 2 },
				{ date: "2024-01-02", plays: 0 }
			],
			[{ date: "2024-01-01", plays: 2 }]
		]);

		expect(values).toEqual([
			{
				date: "2024-01-01",
				plays: 2,
				indexes: [0, 1],
				valueKey: "2024-01-01:2"
			}
		]);
	});

	it("adds dataset titles to a highlighted value", () => {
		const values = getAllValues(
			dataSets.map(({ dataPoints }) => dataPoints)
		);

		expect(
			getHighlightedValue("2024-02-01:3", values, dataSets)
		).toMatchObject({
			indexes: [1],
			titles: ["Second track"]
		});
		expect(
			getHighlightedValue("missing", values, dataSets)
		).toBeUndefined();
	});
});
