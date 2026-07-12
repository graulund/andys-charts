import { ChartDataSet, CompressedChartDataSet } from "../lib/types";

export const compressedDataSets: CompressedChartDataSet[] = [
	{
		title: "First track",
		artists: {
			main: [{ id: 1, name: "First artist" }]
		},
		url: "/tracks/first",
		dataPoints: [
			["2024-01-30", 1],
			["2024-01-31", 3],
			["2024-02-01", 2]
		]
	},
	{
		title: "Second track",
		dataPoints: [
			["2024-01-31", 2],
			["2024-02-01", 3]
		]
	}
];

export const dataSets: ChartDataSet[] = compressedDataSets.map((dataSet) => ({
	...dataSet,
	dataPoints: dataSet.dataPoints.map(([date, plays]) => ({ date, plays }))
}));
