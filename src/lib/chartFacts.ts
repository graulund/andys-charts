import { ChartConfig } from "./config";
import { filterDataSets, padChartDataPointLists } from "./chartData";
import { getAllValues } from "./pointValues";
import { dateFromYmd, daysBetweenDates, ymdFromDate } from "./time";

import { ChartDataPoint, ChartDataPointValues, ChartDataSet } from "./types";

interface ChartFacts {
	dataSets: ChartDataSet[];
	dataPointLists: ChartDataPoint[][];
	firstDate: string;
	lastDate: string;
	maxValue: number;
	totalDays: number;
	values: ChartDataPointValues[];
}

/** Find the maximum play value in a list of data points */
function maxPlays(data: ChartDataPoint[]) {
	return (data || []).reduce((val, current) => {
		if (current.plays > val) {
			return current.plays;
		}

		return val;
	}, 0);
}

/**
 * Calculate facts about, and view values for, this chart based on data and
 * configuration
 * @param givenDataSets Chart data sets, as given by the end user
 * @param config Chart config
 * @returns Several calculated chart facts
 */
export default function getChartFacts(
	givenDataSets: ChartDataSet[],
	config: ChartConfig
): ChartFacts {
	const { minMaxPlays, minValues } = config;
	const normalizedDataSets = (givenDataSets || []).map((dataSet) => ({
		...dataSet,
		dataPoints: (dataSet.dataPoints || [])
			.filter(({ date, plays }) => {
				const parsedDate = dateFromYmd(date);
				return (
					Number.isFinite(plays) &&
					Number.isFinite(parsedDate.getTime()) &&
					ymdFromDate(parsedDate) === date
				);
			})
			.map(({ date, plays }) => ({ date, plays: Math.max(0, plays) }))
	}));

	// Pad and limit data

	const paddedLists = padChartDataPointLists(
		normalizedDataSets.map(({ dataPoints }) => dataPoints),
		config
	);

	// Filter data

	const dataSets = filterDataSets(normalizedDataSets, paddedLists, minValues);
	const dataPointLists = dataSets.map(({ dataPoints }) => dataPoints);

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
		totalDays = Math.max(1, daysBetweenDates(start, end));
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
