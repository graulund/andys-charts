import { describe, expect, it } from "vitest";

import { classNames } from "./classNames";

describe("class names", () => {
	it("joins strings and omits falsey conditional values", () => {
		expect(classNames("base", false, "active", undefined, null, "")).toBe(
			"base active"
		);
	});
});
