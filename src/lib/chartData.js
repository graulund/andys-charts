import {
	dateFromYmd,
	ymdFromDate,
	offsetDate,
	nextDay,
	todayDate,
	dateWithoutTime
} from "./time";

function chartDataItem(date, plays) {
	return { date: ymdFromDate(date), plays };
}

/*
function emptyChartDataItem(date) {
	return chartDataItem(date, 0);
}
*/

function convertDataPointsToDateMap(dataPoints) {
	return (dataPoints || []).reduce((map, data) => {
		map[data.date] = data.plays;
		return map;
	}, {});
}

export function padChartDataPointLists(dataPointLists, options) {
	const {
		maxDays = 183,
		minDays = 10,
		maxEndPaddingDays = 5,
		todayYmd = ""
	} = options || {};

	const today = todayYmd ? dateFromYmd(todayYmd) : todayDate();

	const earliestDate = dataPointLists.reduce((extreme, data) => {
		if (!data?.length) {
			return extreme;
		}

		const firstItem = data[0];
		const firstDate = dateFromYmd(firstItem.date);

		if (!extreme || firstDate < extreme) {
			return firstDate;
		}

		return extreme;
	}, null);

	const latestDate = dataPointLists.reduce((extreme, data) => {
		if (!data?.length) {
			return extreme;
		}

		const lastItem = data[data.length - 1];
		const lastDate = dateFromYmd(lastItem.date);

		if (!extreme || lastDate > extreme) {
			return lastDate;
		}

		return extreme;
	}, null);

	const latestDateWithPadding = dateWithoutTime(offsetDate(latestDate, maxEndPaddingDays));
	const endDate = new Date(Math.min(latestDateWithPadding, today));

	const minDaysAgo = dateWithoutTime(offsetDate(endDate, -1 * minDays));
	const maxDaysAgo = dateWithoutTime(offsetDate(endDate, -1 * maxDays));

	const startDate = new Date(Math.min(minDaysAgo, Math.max(maxDaysAgo, earliestDate)));

	/*
	console.log({
		today,
		minDaysAgo,
		maxDaysAgo,
		earliestDate,
		latestDate,
		endDate,
		startDate
	});
	*/

	return dataPointLists
		.map((data) => padChartDataPoints(data, startDate, endDate))
		.filter((l) => !!l);
}

export function padChartDataPoints(dataPoints, startDate, endDate) {
	if (!dataPoints?.length) {
		return null;
	}

	const playsMap = convertDataPointsToDateMap(dataPoints);
	let current = startDate;
	let out = [];

	while (current <= endDate) {
		const ymd = ymdFromDate(current);
		out.push(chartDataItem(ymd, playsMap[ymd] || 0));
		// current = dateWithoutTime(nextDay(current));
		current = nextDay(current);
		// console.log("current", current, ymdFromDate(current));
	}

	return out;

	/*

	// console.log("dataPoints before padding", dataPoints);

	let out = [];
	let firstItem = dataPoints[0];
	let firstDate = dateFromYmd(firstItem.date);
	const lastItem = dataPoints[dataPoints.length - 1];
	const lastDate = dateFromYmd(lastItem.date);
	let list = dataPoints;

	console.log("firstDate 1", firstDate);

	if (firstDate < startDate) {
		// Find start date and trim every item before that
		const startDateIndex = dataPoints.findIndex(({ date: ymd }, index) => {
			return dateFromYmd(ymd) >= startDate;
		});
		console.log("startDateIndex", startDateIndex);
		list = dataPoints.slice(startDateIndex);
	}

	// Reload new first item
	firstItem = list[0];
	firstDate = dateFromYmd(firstItem.date);
	console.log("firstDate 2", firstDate);

	if (firstDate > startDate) {
		// Pad before first date
		console.log("pad before first date");
		let current = prevDay(firstDate);
		console.log("current", current);
		while (current >= startDate) {
			out.unshift(emptyChartDataItem(current));
			current = prevDay(current);
		}

	}

	let prevDate = null;

	list.forEach(({ date: ymd, plays }) => {
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

	if (lastDate < endDate) {
		// Padding in the ending
		let current = nextDay(lastDate);
		while (current <= endDate) {
			out.push(emptyChartDataItem(current));
			current = nextDay(current);
		}
	}

	return out;
	*/
}


// DEPRECATED
/*
export function padChartData(data, options) {
	if (!data?.length) {
		return [];
	}

	const {
		maxDays = 183,
		// maxDays = 2 * 365,
		minDays = 10,
		maxEndPaddingDays = 5
	} = options || {};

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
*/

export function maxPlays(data) {
	return (data || []).reduce((val, current) => {
		if (current.plays > val) {
			return current.plays;
		}

		return val;
	}, 0);
}
