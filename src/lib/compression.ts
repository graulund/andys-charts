import {
	ChartDataSet,
	CompressedChartDataSet,
	ChartDataPoint,
	CompressedChartDataPoint
} from "./types";

export function unpackCompressedDataPoints(
	compressedDataPoints: CompressedChartDataPoint[]
): ChartDataPoint[] {
	return compressedDataPoints.map((data) => {
		const [date, plays] = data;
		return { date, plays };
	});
}

export function unpackDataPointsInDataSets(
	dataSets: CompressedChartDataSet[]
): ChartDataSet[] {
	return dataSets.map((data) => {
		const { dataPoints } = data;

		return {
			...data,
			dataPoints: unpackCompressedDataPoints(dataPoints)
		};
	});
}
