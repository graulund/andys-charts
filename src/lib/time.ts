import { ChartConfig } from "./config";

/*
 * Various helper methods for time-related tasks: A tiny replacement for a real
 * date function lib
 */

const monthNames = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];

const monthNamesShort = monthNames.map((name) => name.slice(0, 3));

const monthNamesDanish = [
	"januar",
	"februar",
	"marts",
	"april",
	"maj",
	"juni",
	"juli",
	"august",
	"september",
	"oktober",
	"november",
	"december"
];

const monthNamesDanishShort = monthNamesDanish.map((name) => name.slice(0, 3));

/**
 * Various representations of a specific month, packed together to aid view
 * components
 */
interface MonthInfo {
	year: number;
	month: number;
	ymd: string;
}

function pad(num: string | number) {
	if (num < 10) {
		return `0${num}`;
	}

	return "" + num;
}

/**
 * Returns a `Date` object representing the date as given by the date string.
 * Uses midnight local time
 * @param ymd Date string in `YYYY-MM-DD` format
 * @returns `Date` object
 */
export function dateFromYmd(ymd: string) {
	return new Date(`${ymd}T00:00:00`);
}

/**
 * Returns a date string from a `Date` object
 * @param date `Date` object
 * @returns Date string in `YYYY-MM-DD` format
 */
export function ymdFromDate(date: string | Date) {
	if (typeof date === "string") {
		return date;
	}

	const y = date.getFullYear();
	const m = pad(1 + date.getMonth());
	const d = pad(date.getDate());

	return `${y}-${m}-${d}`;
}

/**
 * Returns a month string from a date string or `Date` object
 * @param date Full date string in `YYYY-MM-DD` format, or `Date` object
 * @returns Month string in `YYYY-MM` format
 */
export function ymFromDate(date: string | Date) {
	// Gets you yyyy-mm
	const dateString = typeof date === "string" ? date : date.toISOString();
	return dateString.slice(0, 7);
}

/**
 * Returns a `Date` object without time component (converts to local midnight)
 * @param date Date string in `YYYY-MM-DD` format, or `Date` object
 * @returns `Date` object without time component
 */
export function dateWithoutTime(date: string | Date) {
	return dateFromYmd(ymdFromDate(date));
}

/**
 * Returns today's date as a `Date` object at local midnight
 * @returns `Date` object
 */
export function todayDate() {
	return dateWithoutTime(new Date());
}

/** Utility func to get `Date` object from number or `Date` object, or now */
function getDateFromTime(time: number | Date) {
	if (typeof time === "number" && time > 0) {
		return new Date(time);
	}

	if (time instanceof Date) {
		return time;
	}

	return new Date();
}

/**
 * Performs date math: Adds or subtracts days from the given time.
 * If `includeHours` is `false`, as it is by default, it returns a time at
 * local midnight
 * @param time Time to calculate from, as a Unix epoch number or `Date` object
 * @param daysOffset Days to add or subtract
 * @param includeHours Whether to include original hours, or return midnight
 * if `false`
 * @returns `Date` object
 */
export function offsetDate(time: number | Date, daysOffset: number, includeHours = false) {
	const date = getDateFromTime(time);

	if (!includeHours) {
		return new Date(
			date.getFullYear(),
			date.getMonth(),
			date.getDate() + daysOffset
		);
	}

	return new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate() + daysOffset,
		date.getHours(),
		date.getMinutes(),
		date.getSeconds(),
		date.getMilliseconds()
	);
}

/**
 * Adds one day to the given time
 * @param time Time to calculate from, as a Unix epoch number or `Date` object
 * @param includeHours Whether to include original hours, or return midnight
 * if `false`
 * @returns `Date` object
 */
export function nextDay(time: number | Date, includeHours = false) {
	return offsetDate(time, 1, includeHours);
}

/**
 * Subtracts one day from the given time
 * @param time Time to calculate from, as a Unix epoch number or `Date` object
 * @param includeHours Whether to include original hours, or return midnight
 * if `false`
 * @returns `Date` object
 */
export function prevDay(time: number | Date, includeHours = false) {
	return offsetDate(time, -1, includeHours);
}

/**
 * Calculates (roughly) the amount of days between two times. This is not a
 * perfect solution... but it gets the job done for now
 * @param startDate `Date` object
 * @param endDate `Date` object
 * @returns Rounded number of days
 */
export function daysBetweenDates(startDate: Date, endDate: Date) {
	const msDiff = Math.abs(endDate.getTime() - startDate.getTime());
	return Math.round(msDiff / 86400000);
}

/**
 * Returns a list of all months between the first and the last date
 * (both inclusive)
 * @param firstDateString Date string in `YYYY-MM-DD` format
 * @param lastDateString Date string in `YYYY-MM-DD` format
 * @returns List of `MonthInfo` objects
 */
export function getAllMonthsBetweenDates(
	firstDateString: string,
	lastDateString: string
): MonthInfo[] {
	// dates must be yyyy-mm-dd strings
	const firstDate = dateFromYmd(firstDateString);
	const lastDate = dateFromYmd(lastDateString);
	const ymStrings = [ymFromDate(firstDate)];
	let current = nextDay(firstDate);

	while (current <= lastDate) {
		const ym = ymFromDate(current);

		if (!ymStrings.includes(ym)) {
			ymStrings.push(ym);
		}

		current = nextDay(current);
	}

	return ymStrings.map((ym) => {
		const year = parseInt(ym.slice(0, 4), 10);
		const month = parseInt(ym.slice(5, 7), 10);

		return { year, month, ymd: `${ym}-01` };
	});
}

/**
 * Various display styles for representing a month as a user-facing string
 */
export type YearMonthFormattingStyle = "normal" | "small" | "tiny";

/**
 * Returns a formatted string representing a specific month. Various styles and
 * languages are supported. Used for several string representations in a row;
 * thus, specifying the year of the previous month potentially gives a
 * different string: This is due to the fact that the context in which the
 * formatted string will be displayed will imply the year
 * @param year Given year
 * @param month Given month (between 1 and 12 inclusive)
 * @param prevYear Year of previously occurring date in sequence
 * @param language Danish (`da`) or English (`en`)
 * @param style Display style: `normal`, `small`, or `tiny`
 * @returns A formatted string
 */
export function formatYearMonth(
	year: number,
	month: number,
	prevYear = 0,
	language: ChartConfig["language"] = "en",
	style: YearMonthFormattingStyle = "normal"
): string {
	// Styles:
	// `normal`: long month names, followed by year if different from prev year
	// `small`: short month names, followed by year if different from prev year
	// `tiny`: year if different from prev year, otherwise short month names

	let monthNamesList = null;

	switch (language) {
		case "da":
			if (style === "normal") {
				monthNamesList = monthNamesDanish;
			} else {
				monthNamesList = monthNamesDanishShort;
			}
			break;
		case "en":
		default:
			if (style === "normal") {
				monthNamesList = monthNames;
			} else {
				monthNamesList = monthNamesShort;
			}
			break;
	}

	const monthName = monthNamesList[month - 1];

	switch (style) {
		case "normal":
		case "small":
		default:
			if (year !== prevYear) {
				return monthName + " " + year;
			}

			return monthName;
		case "tiny":
			if (year !== prevYear) {
				return `${year}`;
			}

			return monthName;
	}
}

/**
 * Returns a formatted string representing a specific date. Different languages
 * are supported
 * @param date `Date` object
 * @param language Danish (`da`) or English (`en`)
 * @returns A formatted string
 */
export function formatDate(date: Date, language: ChartConfig["language"] = "en") {
	const day = date.getDate();
	const month = date.getMonth();
	const year = date.getFullYear();

	if (language === "da") {
		return `${day}. ${monthNamesDanish[month]} ${year}`;
	}

	return `${monthNames[month]} ${day}, ${year}`;
}
