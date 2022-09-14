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
	ChartDataPoint,
	ChartDataMap,
	ChartDataSet
} from "./types";

// This file has various helper methods for calculating the chart facts

/** Create a single data point object from values */
function chartDataPoint(date: string, plays: number): ChartDataPoint {
	return { date: ymdFromDate(date), plays };
}

/**
 * Convert list of data points to a date => plays map
 * @param dataPoints List of data points
 * @returns ChartDataMap
 */
function convertDataPointsToDateMap(dataPoints: ChartDataPoint[]): ChartDataMap {
	return (dataPoints || []).reduce<ChartDataMap>((map, data) => {
		map[data.date] = data.plays;
		return map;
	}, {});
}

/** Get either earliest or latest date in list of data points */
function getExtremeDateInDataPoints(
	dataPoints: ChartDataPoint[],
	type: "earliest" | "latest"
): Date | null {
	if (!dataPoints.length) {
		return null;
	}

	const item = dataPoints[type === "earliest" ? 0 : dataPoints.length - 1];
	return dateFromYmd(item.date);
}

/** Get either earliest or latest date with data across several lists of data points */
function getExtremeDateInDataPointLists(
	dataPointLists: ChartDataPoint[][],
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

/**
 * Pad and limit data point lists according to chart config
 * @param dataPointLists Lists of data points
 * @param options Chart config, specifying min/max chart days, override start/end times, etc.
 * @returns Padded (including days with zero plays) and limited data point lists
 */
export function padChartDataPointLists(
	dataPointLists: ChartDataPoint[][],
	options: Partial<ChartConfig> = {}
): ChartDataPoint[][] {
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
		.filter((l) => !!l) as ChartDataPoint[][]; // There are no more nulls in this list now
}

/**
 * Pad spaces in list of data points with zero-play days.
 * This function also cuts off all days not within the supplied start and end dates
 * @param dataPoints List of data points
 * @param startDate Chart start date
 * @param endDate Chart end date
 * @returns Padded and limited list of data points
 */
export function padChartDataPoints(dataPoints: ChartDataPoint[], startDate: Date, endDate: Date) {
	if (!dataPoints?.length) {
		return null;
	}

	const playsMap = convertDataPointsToDateMap(dataPoints);
	const out: ChartDataPoint[] = [];
	let current = startDate;

	while (current <= endDate) {
		const ymd = ymdFromDate(current);
		out.push(chartDataPoint(ymd, playsMap[ymd] || 0));
		current = nextDay(current);
	}

	return out;
}

/**
 * Exclude data sets with very few data points.
 * This needs to be run *after* processing the data point lists, since the result of
 * this processing (the limiting) might cause some data point lists to have fewer
 * non-zero play days than when initially supplied
 * @param dataSets All chart data sets
 * @param processedDataPointLists Padded and limited lists of data points (same order as data sets)
 * @param minValues Minimum number of non-zero play days in data point lists for inclusion
 * @returns Filtered data sets with processed data point lists
 */
export function filterDataSets(
	dataSets: ChartDataSet[],
	processedDataPointLists: ChartDataPoint[][],
	minValues = 2
): ChartDataSet[] {
	return processedDataPointLists.reduce<ChartDataSet[]>((out, dataPoints, index) => {
		const hasMinValues = dataPoints.filter(({ plays }) => plays > 0).length >= minValues;

		if (hasMinValues) {
			out.push({ ...dataSets[index], dataPoints });
		}

		return out;
	}, []);
}

/**
 * Split segments of the padded data points list into line segments,
 * removing any big swaths (>= 2) of contiguous zero play days.
 * (All dates within a segment are guaranteed to be continguous (aka padded with zeroes))
 * @param dataPoints Padded and limited list of data points
 * @returns Segmented list of data points
 */
export function getPaddedDataPointSegments(dataPoints: ChartDataPoint[]) {
	let numZeroes = 0;
	let lastDataPoint: ChartDataPoint | null = null;
	let currentSegment: ChartDataPoint[] | null = null;

	const segments = dataPoints.reduce<ChartDataPoint[][]>((segments, dataPoint, index) => {
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
