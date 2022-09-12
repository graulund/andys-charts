import {
	ChartDataItem,
	ChartDataPointTitles,
	ChartDataPointValues,
	ChartDataSet
} from "./chartData";

export function getValueKey(date: string, plays: number) {
	return `${date}:${plays}`;
}

export function getValueFromKey(valueKey: string): ChartDataItem {
	const [date, plays] = valueKey.split(":");
	return { date, plays: Number(plays) };
}

export function getAllValues(dataPointLists: ChartDataItem[][]): ChartDataPointValues[] {
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

export function getHighlightedValue(
	highlightedValueKey: string,
	values: ChartDataPointValues[],
	dataSets: ChartDataSet[]
): ChartDataPointTitles | null {
	const value = values.find(({ valueKey }) => valueKey === highlightedValueKey);

	if (value) {
		return {
			...value,
			titles: value.indexes.map((index) => dataSets[index].title)
		};
	}

	return null;
}
