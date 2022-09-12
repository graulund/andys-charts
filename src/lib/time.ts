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

interface MonthInfo {
	year: number;
	month: number;
	ymd: string;
}

function pad(num: string | number) {
	if (num < 10) {
		return `0${num}`;
	}

	return num as string;
}

export function dateFromYmd(ymd: string) {
	return new Date(`${ymd}T00:00:00`);
	// return new Date(ymd);
}

export function ymdFromDate(date: string | Date) {
	if (typeof date === "string") {
		return date;
	}

	const y = date.getFullYear();
	const m = pad(1 + date.getMonth());
	const d = pad(date.getDate());

	return `${y}-${m}-${d}`;
}

export function ymFromDate(date: string | Date) {
	// Gets you yyyy-mm
	const dateString = typeof date === "string" ? date : date.toISOString();
	return dateString.slice(0, 7);
}

export function dateWithoutTime(date: string | Date) {
	// This converts it to UTC midnight
	return dateFromYmd(ymdFromDate(date));
}

export function todayDate() {
	return dateWithoutTime(new Date());
}

function getDateFromTime(time: number | Date) {
	if (typeof time === "number") {
		return new Date(time);
	}

	if (time instanceof Date) {
		return time;
	}

	return new Date();
}

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

export function nextDay(time: number | Date) {
	return offsetDate(time, 1);
}

export function prevDay(time: number | Date) {
	return offsetDate(time, -1);
}

export function daysBetweenDates(startDate: Date, endDate: Date) {
	const msDiff = Math.abs(endDate.getTime() - startDate.getTime());
	return Math.round(msDiff / 86400000);
}

export function getAllMonthsBetweenDates(firstDateString: string, lastDateString: string): MonthInfo[] {
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

export function formatYearMonth(
	year: number, month: number, prevYear = 0, language = "en", style = "normal"
): string {
	// language is "en" or "da"
	// style is "normal", "small", or "tiny"
	// normal: long month names, followed by year if different from prev year
	// small: short month names, followed by year if different from prev year
	// tiny: year if different from prev year, otherwise short month names

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

export function formatDate(date: Date, language = "en") {
	const day = date.getDate();
	const month = date.getMonth();
	const year = date.getFullYear();

	if (language === "da") {
		return `${day}. ${monthNamesDanish[month]} ${year}`;
	}

	return `${monthNames[month]} ${day}, ${year}`;
}