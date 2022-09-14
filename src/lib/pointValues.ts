import {
	ChartDataPoint,
	ChartDataPointTitles,
	ChartDataPointValues,
	ChartDataSet
} from "./types";

/*
 * This file has various helper methods for calculating "point values": Unique
 * combinations of time and value, regardless of the data sets in which these
 * combination occur
 */

/**
 * Returns a string representation of a combination of time and value
 * @param date Date string in `YYYY-MM-DD` format
 * @param plays Amount of plays
 * @returns Value key string (`date:plays` format)
 */
export function getValueKey(date: string, plays: number) {
	return `${date}:${plays}`;
}

/**
 * Parses a point value key string and returns the underlying chart data point
 * object
 * @param valueKey Value key string
 * @returns Chart data point object
 */
export function getValueFromKey(valueKey: string): ChartDataPoint {
	const [date, plays] = valueKey.split(":");
	return { date, plays: Number(plays) };
}

/**
 * Takes lists of data points and calculates all "point values"; unique
 * combinations of time and value, across all of the data sets
 * @param dataPointLists List of lists of chart data point objects
 * @returns List of chart data point values info objects
 */
export function getAllValues(
	dataPointLists: ChartDataPoint[][]
): ChartDataPointValues[] {
	const valuesMap: { [valueKey: string]: number[] } = {};

	dataPointLists.forEach((dataPoints, trackIndex) => {
		dataPoints.forEach(({ date, plays }) => {
			if (plays <= 0) {
				return;
			}

			const valueKey = getValueKey(date, plays);

			if (!valuesMap[valueKey]) {
				valuesMap[valueKey] = [];
			}

			valuesMap[valueKey].push(trackIndex);
		});
	});

	return Object.keys(valuesMap).map((valueKey) => {
		const { date, plays } = getValueFromKey(valueKey);
		return {
			date,
			plays,
			indexes: valuesMap[valueKey],
			valueKey
		};
	});
}

/**
 * Gets info to display about any specific "point value"; a unique combination
 * of time and value: Includes info about all the data sets that are have an
 * occurrence at this point value
 * @param highlightedValueKey The value key of the specific point value
 * @param values List of calculated point values across all data sets
 * @param dataSets All data sets in the chart: Titles are read from this
 * @returns Info about all data sets at this point value, if any
 */
export function getHighlightedValue(
	highlightedValueKey: string,
	values: ChartDataPointValues[],
	dataSets: ChartDataSet[]
): ChartDataPointTitles | undefined {
	const value = values.find(({ valueKey }) => valueKey === highlightedValueKey);

	if (value) {
		return {
			...value,
			titles: value.indexes.map((index) => dataSets[index].title)
		};
	}
}
