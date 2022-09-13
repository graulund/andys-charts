import {
	ChartDataSet,
	CompressedChartDataSet,
	ChartDataItem,
	CompressedChartDataItem
} from "./types";

export function unpackCompressedDataPoints(compressedDataPoints: CompressedChartDataItem[]): ChartDataItem[] {
	return compressedDataPoints.map((data) => {
		const [date, plays] = data;
		return { date, plays };
	});
}

export function unpackDataPointsInDataSets(dataSets: CompressedChartDataSet[]): ChartDataSet[] {
	return dataSets.map((data) => {
		const { dataPoints } = data;

		return {
			...data,
			dataPoints: unpackCompressedDataPoints(dataPoints)
		};
	});
}
