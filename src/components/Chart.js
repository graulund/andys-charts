import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";

import ChartContext from "./ChartContext";
import ChartDataPoints from "./ChartDataPoints";
import ChartHighlightInfo from "./ChartHighlightInfo";
import ChartLegend from "./ChartLegend";
import ChartTimeAxis from "./ChartTimeAxis";
import ChartValueAxis from "./ChartValueAxis";
import ChartValueZones from "./ChartValueZones";
import { maxPlays, padChartDataPointLists, getAllValues } from "../lib/chartData";

import styles from "./Chart.module.css";

const chartWidth = 1000;
const chartHeight = 145;
const minMaxPlays = 4;
const chartTopHeight = 4;
const chartBottomHeight = 14;
const chartLeftWidth = 18;
const mainAreaWidth = chartWidth - chartLeftWidth;
const mainAreaHeight = chartHeight - chartTopHeight - chartBottomHeight;

const singleColor = "#3faa9e";

const colors = [
	"#3faa9e", // Seafoam
	"#b7000c", // Red
	"#009107", // Green
	"#2d61c1", // Blue
	"#adb100", // Yellow
	"#b70097", // Purple
	"#666666"  // Grey
];

function Chart({ tracks }) {
	const [highlightedValueKey, setHighlightedValueKey] = useState(null);
	const [highlightedIndex, setHighlightedIndex] = useState(null);
	const dataPointLists = (tracks || []).map(({ dataPoints }) => dataPoints);
	const displayLists = padChartDataPointLists(dataPointLists);
	const maxValues = displayLists.map((list) => maxPlays(list));
	const maxValue = Math.max(minMaxPlays, ...maxValues);

	const values = getAllValues(displayLists);

	const firstDataset = displayLists[0];
	const firstDate = firstDataset[0]?.date;
	const lastDate = firstDataset[firstDataset.length - 1]?.date;

	const chartData = useMemo(() => ({
		chartLeftWidth,
		chartTopHeight,
		firstDate,
		lastDate,
		mainAreaHeight,
		mainAreaWidth,
		minValue: 0,
		maxValue,
		highlightedIndex,
		highlightedValueKey,
		setHighlightedIndex,
		setHighlightedValueKey
	}), [
		chartLeftWidth,
		chartTopHeight,
		firstDate,
		lastDate,
		mainAreaHeight,
		mainAreaWidth,
		maxValue,
		highlightedIndex,
		highlightedValueKey,
		setHighlightedIndex,
		setHighlightedValueKey
	]);

	const highlightedValue = useMemo(() => {
		if (highlightedValueKey) {
			const value = values.find(({ valueKey }) => valueKey === highlightedValueKey);

			if (value) {
				return {
					...value,
					titles: value.indexes.map((index) => tracks[index].title)
				};
			}
		}

		return null;
	}, [highlightedValueKey]);

	if (!firstDate || !lastDate) {
		return null;
	}

	const isSingle = tracks.length === 1;

	const displayData = displayLists.map((dataPoints, i) => ({
		color: isSingle ? singleColor : colors[i % colors.length],
		dataPoints,
		index: i
	}));

	// Reverse because the first in the list needs to be at the top,
	// and in SVGs, the last drawn item is topmost
	displayData.reverse();

	const legendList = tracks.map(({ title, url }, i) => ({
		color: isSingle ? singleColor : colors[i % colors.length],
		index: i,
		title,
		url
	}));

	return (
		<div className={styles.chart}>
			<ChartContext.Provider value={chartData}>
				<svg viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
					<ChartValueAxis />
					<ChartTimeAxis />
					{ displayData.map(({ color, dataPoints, index }) => (
						<ChartDataPoints
							dataPoints={dataPoints}
							color={color}
							index={index}
							key={index}
						/>
					)) }
				</svg>
				<ChartValueZones values={values} />
				<ChartHighlightInfo isSingle={isSingle} value={highlightedValue} />
				<ChartLegend tracks={legendList} />
			</ChartContext.Provider>
		</div>
	);
}

Chart.propTypes = {
	tracks: PropTypes.arrayOf(PropTypes.shape({
		title: PropTypes.string,
		url: PropTypes.string,
		dataPoints: PropTypes.array
	})).isRequired
};

export default Chart;
