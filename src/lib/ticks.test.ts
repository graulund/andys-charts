import { describe, expect, it } from "vitest";

import { getValueTicks } from "./ticks";

describe("value ticks", () => {
	it("keeps small integer ranges detailed", () => {
		expect(getValueTicks(0, 4)).toEqual([0, 1, 2, 3, 4]);
	});

	it("limits large ranges to readable nice steps", () => {
		expect(getValueTicks(0, 15)).toEqual([0, 5, 10, 15]);
		expect(getValueTicks(0, 103)).toEqual([0, 50, 100, 103]);
	});

	it("handles collapsed and non-zero ranges", () => {
		expect(getValueTicks(3, 3)).toEqual([3]);
		expect(getValueTicks(3, 9, 3)).toEqual([3, 4, 6, 8, 9]);
	});
});
