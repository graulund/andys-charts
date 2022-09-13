import { ChartConfig } from "./config";

export interface TrackArtist {
	name: string;
	id: number;
}

export interface TrackArtists {
	main?: TrackArtist[];
	with?: TrackArtist[];
	feat?: TrackArtist[];
	as?: TrackArtist;
}

interface ChartDataSetBase { // TODO: Make this independent of track?
	title: string;
	artists?: TrackArtists;
	url?: string;
}

export interface ChartDataSet extends ChartDataSetBase {
	dataPoints: ChartDataItem[];
}

export interface CompressedChartDataSet extends ChartDataSetBase {
	dataPoints: CompressedChartDataItem[];
}

export interface ChartDataItem {
	date: string;
	plays: number;
}

export type CompressedChartDataItem = [string, number];

export interface ChartDataMap {
	[date: string]: number;
}

export interface FilteredChartDataSetResult {
	dataSets: ChartDataSet[];
	dataPointLists: ChartDataItem[][];
}

export interface ChartDataPointValues {
	date: string;
	indexes: number[];
	plays: number;
	valueKey: string;
}

export interface ChartDataPointTitles extends ChartDataPointValues {
	titles: string[];
}

export interface ChartLegendTrackItem extends ChartDataSetBase {
	color: string;
	index: number;
}

export interface CompressedChartData {
	config: Partial<ChartConfig>,
	dataSets: CompressedChartDataSet[]
}
