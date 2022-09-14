import { ChartConfig } from "./config";

/**
 * An object type representing a musical artist
 */
export interface TrackArtist {
	name: string;
	id: number;
}

/**
 * An object type representing the various types of artist relationships a
 * track can have
 */
export interface TrackArtists {
	main?: TrackArtist[];
	with?: TrackArtist[];
	feat?: TrackArtist[];
	as?: TrackArtist;
}

/** A chart data set without data points */
interface ChartDataSetBase { // TODO: Make this independent of track?
	title: string;
	artists?: TrackArtists;
	url?: string;
}

/**
 * An object type representing a single (uncompressed) chart data set
 */
export interface ChartDataSet extends ChartDataSetBase {
	dataPoints: ChartDataPoint[];
}

/**
 * An object type representing a single compressed chart data set
 */
export interface CompressedChartDataSet extends ChartDataSetBase {
	dataPoints: CompressedChartDataPoint[];
}

/**
 * An object type representing a specific data point on the chart
 */
export interface ChartDataPoint {
	date: string;
	plays: number;
}

/**
 * An object type representing a "compressed" data point
 */
export type CompressedChartDataPoint = [string, number];

/**
 * An object type representing multiple data points as a map, allowing fast
 * value (y) lookup based on time (x)
 */
export interface ChartDataMap {
	[date: string]: number;
}

/**
 * An object type represesnting info about a specific "point value": A specific
 * combination of time and value, along with indexes of the data sets
 * containing this combination
 */
export interface ChartDataPointValues {
	date: string;
	indexes: number[];
	plays: number;
	valueKey: string;
}

/**
 * Same as ChartDataPointValues, but with track titles for each data set
 * (same order)
 */
export interface ChartDataPointTitles extends ChartDataPointValues {
	titles: string[];
}

/**
 * An object representing everything needed to render a chart legend item for
 * a specific data set
 */
export interface ChartLegendTrackItem extends ChartDataSetBase {
	color: string;
	index: number;
}

/**
 * An object representing the inputs to the chart from the implementing party:
 * A (partial) chart config, and a list of "compressed" data sets
 */
export interface CompressedChartData {
	config: Partial<ChartConfig>;
	dataSets: CompressedChartDataSet[];
}
