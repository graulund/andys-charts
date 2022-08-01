export function dateFromYmd(ymd) {
	// return new Date(`${ymd} 00:00:00`);
	return new Date(ymd);
}

export function ymdFromDate(date) {
	if (typeof date === "string") {
		return date;
	}

	return date.toISOString().slice(0, 10);
}

export function ymFromDate(date) {
	// Gets you yyyy-mm
	const dateString = typeof date === "string" ? date : date.toISOString();
	return dateString.slice(0, 7);
}

export function todayDate() {
	// This converts it to UTC midnight
	return dateFromYmd(ymdFromDate(new Date()));
}

function getDateFromTime(time) {
	if (typeof time === "number") {
		return new Date(time);
	}

	if (time instanceof Date) {
		return time;
	}

	return new Date();
}

export function offsetDate(time, daysOffset) {
	const date = getDateFromTime(time);

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

export function nextDay(time) {
	return offsetDate(time, 1);
}

export function prevDay(time) {
	return offsetDate(time, -1);
}
