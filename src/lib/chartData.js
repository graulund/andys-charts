import {
	dateFromYmd,
	ymdFromDate,
	offsetDate,
	prevDay,
	nextDay,
	todayDate
} from "./time";

function chartDataItem(date, plays) {
	return { date: ymdFromDate(date), plays };
}

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

	const earliestDateWithPadding = prevDay(earliestDate);
	const latestDateWithPadding = offsetDate(latestDate, maxEndPaddingDays);
	const endDate = new Date(Math.min(latestDateWithPadding, today));

	const minDaysAgo = offsetDate(endDate, -1 * minDays);
	const maxDaysAgo = offsetDate(endDate, -1 * maxDays);

	const startDate = new Date(Math.min(minDaysAgo, Math.max(maxDaysAgo, earliestDateWithPadding)));

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
		current = nextDay(current);
	}

	return out;
}

export function maxPlays(data) {
	return (data || []).reduce((val, current) => {
		if (current.plays > val) {
			return current.plays;
		}

		return val;
	}, 0);
}
