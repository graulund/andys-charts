import { describe, expect, it } from "vitest";

import { createSvgPath } from "./svgPath";

describe("SVG path builder", () => {
	it("preserves the exact M/L/Z command format previously emitted by d3-path", () => {
		const path = createSvgPath();

		path.moveTo(0.333333333333, 1.23456789);
		path.lineTo(999.99999, -0);
		path.closePath();

		expect(path.toString()).toBe("M0.333333333333,1.23456789L999.99999,0Z");
	});
});
