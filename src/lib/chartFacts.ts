// TODO: Rename this file, please please please

import { ChartConfig } from "./config";

import {
	filterDataSets,
	padChartDataPointLists
} from "./chartData";

import { getAllValues } from "./pointValues";
import { dateFromYmd, daysBetweenDates } from "./time";

import {
	ChartDataItem,
	ChartDataPointValues,
	ChartDataSet,
} from "./types";

interface ChartFacts {
	dataSets: ChartDataSet[];
	dataPointLists: ChartDataItem[][];
	firstDate: string;
	lastDate: string;
	maxValue: number;
	totalDays: number;
	values: ChartDataPointValues[]
}

function maxPlays(data: ChartDataItem[]) {
	return (data || []).reduce((val, current) => {
		if (current.plays > val) {
			return current.plays;
		}

		return val;
	}, 0);
}

export default function getChartFacts(givenDataSets: ChartDataSet[], config: ChartConfig): ChartFacts {
	const { minMaxPlays, minValues } = config;

	// Pad and limit data

	const paddedLists = padChartDataPointLists(
		(givenDataSets || []).map(({ dataPoints }) => dataPoints),
		config
	);

	// Filter data

	const { dataSets, dataPointLists } = filterDataSets(
		givenDataSets, paddedLists, minValues
	);

	// Get scope of data

	const maxValues = dataPointLists.map((list) => maxPlays(list));
	const maxValue = Math.max(minMaxPlays, ...maxValues);
	const values = getAllValues(dataPointLists);
	const firstDataSet = dataPointLists[0];
	const firstDate = firstDataSet?.[0]?.date;
	const lastDate = firstDataSet?.[firstDataSet.length - 1]?.date;
	let totalDays = 0;

	if (firstDate && lastDate) {
		const start = dateFromYmd(firstDate);
		const end = dateFromYmd(lastDate);
		totalDays = daysBetweenDates(start, end);
	}

	return {
		dataSets,
		dataPointLists,
		firstDate,
		lastDate,
		maxValue,
		totalDays,
		values
	};
}
