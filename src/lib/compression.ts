import {
	ChartDataSet,
	CompressedChartDataSet,
	ChartDataPoint,
	CompressedChartDataPoint
} from "./types";

// "Decompression", summarized: [x, y] => { date: x, plays: y }

/**
 * Unpacks "compressed data points", which are data points stored in such a way
 * (a list of two-value arrays) that prevents an overly verbose JSON payload
 * @param compressedDataPoints A list of two-value arrays
 * @returns A list of objects
 */
export function unpackCompressedDataPoints(
	compressedDataPoints: CompressedChartDataPoint[]
): ChartDataPoint[] {
	return compressedDataPoints.map((data) => {
		const [date, plays] = data;
		return { date, plays };
	});
}

/**
 * Unpacks data sets with "compressed data points", and returns data sets that
 * contain lists of data points that are not compressed
 * @param dataSets A list of data sets with compressed data points
 * @returns A list of data sets with non-compressed data points
 */
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
