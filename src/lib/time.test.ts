import { describe, expect, it } from "vitest";

import {
	dateFromYmd,
	dateWithoutTime,
	daysBetweenDates,
	formatDate,
	formatYearMonth,
	getAllMonthsBetweenDates,
	nextDay,
	offsetDate,
	prevDay,
	ymFromDate,
	ymdFromDate
} from "./time";

describe("date-only helpers", () => {
	it("round-trips YYYY-MM-DD values in local calendar time", () => {
		const date = dateFromYmd("2024-02-29");

		expect(ymdFromDate(date)).toBe("2024-02-29");
		expect(ymFromDate("2024-02-29")).toBe("2024-02");
		expect(dateWithoutTime(new Date(2024, 1, 29, 18, 30))).toEqual(date);
	});

	it("derives a month from local rather than UTC calendar time", () => {
		const localMayFirst = new Date(2024, 4, 1, 0, 0, 0);

		expect(ymFromDate(localMayFirst)).toBe("2024-05");
	});

	it("offsets across month and leap-year boundaries", () => {
		const leapDay = dateFromYmd("2024-02-29");

		expect(ymdFromDate(nextDay(leapDay))).toBe("2024-03-01");
		expect(ymdFromDate(prevDay(leapDay))).toBe("2024-02-28");
		expect(ymdFromDate(offsetDate(leapDay, -29))).toBe("2024-01-31");
	});

	it("counts calendar days", () => {
		expect(
			daysBetweenDates(
				dateFromYmd("2024-01-30"),
				dateFromYmd("2024-02-02")
			)
		).toBe(3);
	});

	it("enumerates months across years", () => {
		expect(getAllMonthsBetweenDates("2023-12-20", "2024-02-02")).toEqual([
			{ year: 2023, month: 12, ymd: "2023-12-01" },
			{ year: 2024, month: 1, ymd: "2024-01-01" },
			{ year: 2024, month: 2, ymd: "2024-02-01" }
		]);
	});
});

describe("date labels", () => {
	it("formats English and Danish dates", () => {
		const date = dateFromYmd("2024-05-05");

		expect(formatDate(date, "en")).toBe("May 5, 2024");
		expect(formatDate(date, "da")).toBe("5. maj 2024");
	});

	it("formats normal, small, and tiny month labels", () => {
		expect(formatYearMonth(2024, 9, 2023, "en", "normal")).toBe(
			"September 2024"
		);
		expect(formatYearMonth(2024, 9, 2024, "da", "small")).toBe("sep");
		expect(formatYearMonth(2024, 9, 2023, "en", "tiny")).toBe("2024");
		expect(formatYearMonth(2024, 9, 2024, "en", "tiny")).toBe("Sep");
	});
});
