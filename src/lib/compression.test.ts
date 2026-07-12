import { describe, expect, it } from "vitest";

import {
	unpackCompressedDataPoints,
	unpackDataPointsInDataSets
} from "./compression";
import { compressedDataSets } from "../test/fixtures";

describe("compression helpers", () => {
	it("unpacks tuple data without changing values", () => {
		expect(
			unpackCompressedDataPoints([
				["2024-01-01", 2],
				["2024-01-02", 0]
			])
		).toEqual([
			{ date: "2024-01-01", plays: 2 },
			{ date: "2024-01-02", plays: 0 }
		]);
	});

	it("preserves dataset metadata while unpacking points", () => {
		const [first] = unpackDataPointsInDataSets(compressedDataSets);

		expect(first).toMatchObject({
			title: "First track",
			url: "/tracks/first",
			artists: { main: [{ id: 1, name: "First artist" }] }
		});
		expect(first.dataPoints[0]).toEqual({ date: "2024-01-30", plays: 1 });
	});
});
