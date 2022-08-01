import { dateFromYmd, ymdFromDate, offsetDate, nextDay, prevDay, todayDate } from "./time";

function chartDataItem(date, plays) {
	return { date: ymdFromDate(date), plays };
}

function emptyChartDataItem(date) {
	return chartDataItem(date, 0);
}

export function padChartData(data, maxDays = 183, minDays = 10, maxEndPaddingDays = 5) {
	if (!data?.length) {
		return [];
	}

	let out = [];
	// TODO: Define "now yesterday" in a custom way
	const nowYesterday = prevDay(todayDate());
	const firstItem = data[0];
	const firstDate = dateFromYmd(firstItem.date);
	const lastItem = data[data.length - 1];
	const lastDate = dateFromYmd(lastItem.date);
	let prevDate = null;

	// Padding in the beginning
	out.push(emptyChartDataItem(prevDay(firstDate)));

	data.forEach(({ date: ymd, plays }) => {
		const date = dateFromYmd(ymd);

		if (prevDate !== null) {
			let yesterday = prevDay(date);

			// Padding between dates
			while (yesterday > prevDate) {
				out.push(emptyChartDataItem(yesterday));
				yesterday = prevDay(yesterday);
			}
		}

		out.push(chartDataItem(ymd, plays));
		prevDate = date;
	});

	if (lastDate < nowYesterday) {
		// Padding in the ending
		const endPadMaxDate = Math.min(offsetDate(lastDate, maxEndPaddingDays), nowYesterday);

		let current = nextDay(lastDate);
		while (current <= endPadMaxDate) {
			out.push(emptyChartDataItem(current));
			current = nextDay(current);
		}
	}

	// Enforce minimum amount of days

	while (out.length < minDays) {
		const firstItem = out[0];
		const firstDate = dateFromYmd(firstItem.date);

		out = [
			emptyChartDataItem(prevDay(firstDate)),
			...out
		];
	}

	// Enforce maximum amount of days

	return out.slice(-1 * maxDays);
}

export function maxPlays(data) {
	return (data || []).reduce((val, current) => {
		if (current.plays > val) {
			return current.plays;
		}

		return val;
	}, 0);
}
