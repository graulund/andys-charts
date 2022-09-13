import {
	dateFromYmd,
	ymdFromDate,
	offsetDate,
	prevDay,
	nextDay,
	todayDate
} from "./time";

import { ChartConfig } from "./config";

import {
	ChartDataItem,
	ChartDataMap,
	ChartDataSet,
	FilteredChartDataSetResult
} from "./types";

// TODO Rename this file

function chartDataItem(date: string, plays: number): ChartDataItem {
	return { date: ymdFromDate(date), plays };
}

function convertDataPointsToDateMap(dataPoints: ChartDataItem[]): ChartDataMap {
	return (dataPoints || []).reduce<ChartDataMap>((map, data) => {
		map[data.date] = data.plays;
		return map;
	}, {});
}

function getExtremeDateInDataPoints(dataPoints: ChartDataItem[], type: "earliest" | "latest"): Date | null {
	if (!dataPoints.length) {
		return null;
	}

	const item = dataPoints[type === "earliest" ? 0 : dataPoints.length - 1];
	return dateFromYmd(item.date);
}

function getExtremeDateInDataPointLists(
	dataPointLists: ChartDataItem[][],
	type: "earliest" | "latest"
): Date | null {
	const extremeDates = dataPointLists.map((data) => getExtremeDateInDataPoints(data, type))
		.filter((d) => !!d) as Date[];

	const mathFunc = type === "earliest" ? "min" : "max";
	const result = Math[mathFunc](...extremeDates.map((d) => d.getTime()));

	if (Math.abs(result) === Infinity) {
		return null;
	}

	return new Date(result);
}

export function padChartDataPointLists(
	dataPointLists: ChartDataItem[][],
	options: Partial<ChartConfig> = {}
): ChartDataItem[][] {
	const {
		maxDays = 183,
		minDays = 10,
		maxEndPaddingDays = 5,
		overrideStartYmd = "",
		overrideEndYmd = "",
		todayYmd = ""
	} = options;

	if (!dataPointLists?.length) {
		return [];
	}

	let startDate: Date;
	let endDate: Date;
	const today = todayYmd ? dateFromYmd(todayYmd) : todayDate();

	// If not overridden, analyze the data's scope (overall earliest and latest play times),
	// and calculate start and end dates from that, according to our rules

	if (overrideStartYmd && overrideEndYmd) {
		startDate = dateFromYmd(overrideStartYmd);
		endDate = dateFromYmd(overrideEndYmd);
	} else {
		const earliestDate = getExtremeDateInDataPointLists(dataPointLists, "earliest");
		const latestDate = getExtremeDateInDataPointLists(dataPointLists, "latest");

		if (!earliestDate || !latestDate) {
			return [];
		}

		const earliestDateWithPadding = prevDay(earliestDate);
		const latestDateWithPadding = offsetDate(latestDate, maxEndPaddingDays);

		// Only include padding at the ends if the ends are within scope
		// Otherwise the hard cutoff is visualized by not having padding

		endDate = new Date(Math.min(
			latestDateWithPadding.getTime(),
			today.getTime()
		));

		const minDaysAgo = offsetDate(endDate, -1 * minDays);
		const maxDaysAgo = offsetDate(endDate, -1 * maxDays);

		startDate = new Date(Math.min(
			minDaysAgo.getTime(),
			Math.max(maxDaysAgo.getTime(), earliestDateWithPadding.getTime())
		));
	}

	return dataPointLists
		.map((data) => padChartDataPoints(data, startDate, endDate))
		.filter((l) => !!l) as ChartDataItem[][]; // There are no more nulls in this list now
}

export function padChartDataPoints(dataPoints: ChartDataItem[], startDate: Date, endDate: Date) {
	// Pad spaces in data set with 0 play days
	// Note: This function also cuts off all days before the supplied startDate
	if (!dataPoints?.length) {
		return null;
	}

	const playsMap = convertDataPointsToDateMap(dataPoints);
	const out: ChartDataItem[] = [];
	let current = startDate;

	while (current <= endDate) {
		const ymd = ymdFromDate(current);
		out.push(chartDataItem(ymd, playsMap[ymd] || 0));
		current = nextDay(current);
	}

	return out;
}

export function filterDataSets(
	dataSets: ChartDataSet[],
	processedDataPointLists: ChartDataItem[][],
	minValues = 2
): FilteredChartDataSetResult {
	// Exclude data sets with very few data points (less than 2)
	return processedDataPointLists.reduce<FilteredChartDataSetResult>((out, dataPoints, index) => {
		const hasMinValues = dataPoints.filter(({ plays }) => plays > 0).length >= minValues;

		if (hasMinValues) {
			out.dataSets.push(dataSets[index]);
			out.dataPointLists.push(dataPoints);
		}

		return out;
	}, { dataSets: [], dataPointLists: [] });
}

export function getPaddedDataPointSegments(dataPoints: ChartDataItem[]) {
	// Split segments of the padded data points list into line segments,
	// removing any big swaths (>= 2) of contiguous zeroes
	// (All dates within a segment are guaranteed to be continguous)

	let numZeroes = 0;
	let lastDataPoint: ChartDataItem | null = null;
	let currentSegment: ChartDataItem[] | null = null;

	const segments = dataPoints.reduce<ChartDataItem[][]>((segments, dataPoint, index) => {
		const { plays } = dataPoint;

		if (plays > 0) {
			// Date has value
			if (!currentSegment) {
				// Segment opens
				currentSegment = [];

				if (lastDataPoint) {
					// Push first zero
					currentSegment.push(lastDataPoint);
				}
			} else if (numZeroes > 0 && lastDataPoint) {
				// Push single middle zero
				currentSegment.push(lastDataPoint);
			}

			currentSegment.push(dataPoint);
			numZeroes = 0;
		} else if (++numZeroes >= 2 && currentSegment) {
			// Date has no value, and at least two zeroes behind us now

			// Push last zero
			if (lastDataPoint) {
				currentSegment.push(lastDataPoint);
			}

			// Segment closes
			segments.push(currentSegment);
			currentSegment = null;
		} else if (index === dataPoints.length - 1 && currentSegment) {
			// If the last item is a zero, remember to push that
			currentSegment.push(dataPoint);
		}

		lastDataPoint = dataPoint;
		return segments;
	}, []);

	if (currentSegment) {
		segments.push(currentSegment);
	}

	return segments;
}
