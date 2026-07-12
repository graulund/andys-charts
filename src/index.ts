export { default as Chart } from "./components/Chart";
export type { ChartProps } from "./components/Chart";

export { defaultConfig } from "./lib/config";
export type { ChartConfig } from "./lib/config";

export {
	unpackCompressedDataPoints,
	unpackDataPointsInDataSets
} from "./lib/compression";

export type {
	ChartDataPoint,
	ChartDataSet,
	CompressedChartData,
	CompressedChartDataPoint,
	CompressedChartDataSet,
	TrackArtist,
	TrackArtists
} from "./lib/types";
