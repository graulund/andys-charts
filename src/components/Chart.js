import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";

import ChartContext from "./ChartContext";
import ChartDataMask from "./ChartDataMask";
import ChartDataPoints from "./ChartDataPoints";
import ChartHighlightInfo from "./ChartHighlightInfo";
import ChartLegend from "./ChartLegend";
import ChartTimeAxis from "./ChartTimeAxis";
import ChartValueAxis from "./ChartValueAxis";
import ChartValueZones from "./ChartValueZones";
import { maxPlays, padChartDataPointLists, getAllValues } from "../lib/chartData";

import styles from "./Chart.module.css";

const defaultConfig = {
	todayYmd: "",
	maxDays: 183,
	minDays: 10,
	maxEndPaddingDays: 5,
	chartWidth: 1000,
	chartHeight: 145,
	minMaxPlays: 4,
	chartTopHeight: 4,
	chartBottomHeight: 14,
	chartLeftWidth: 18,
	language: "da",
	dataMaskId: "andy-chart-data-mask",
	singleColor: "#3faa9e",
	colors: [
		"#3faa9e", // Seafoam
		"#b7000c", // Red
		"#009107", // Green
		"#2d61c1", // Blue
		"#adb100", // Yellow
		"#b70097", // Purple
		"#666666"  // Grey
	]
};

function Chart({ config: givenConfig, dataSets }) {
	const [highlightedValueKey, setHighlightedValueKey] = useState(null);
	const [highlightedIndex, setHighlightedIndex] = useState(null);
	const config = useMemo(() => ({ ...defaultConfig, ...(givenConfig || {}) }), [givenConfig]);

	const {
		chartBottomHeight,
		chartHeight,
		chartLeftWidth,
		chartTopHeight,
		chartWidth,
		colors,
		minMaxPlays,
		singleColor
	} = config;

	const mainAreaWidth = chartWidth - chartLeftWidth;
	const mainAreaHeight = chartHeight - chartTopHeight - chartBottomHeight;

	const { displayLists, maxValue, values } = useMemo(() => {
		const dataPointLists = (dataSets || []).map(({ dataPoints }) => dataPoints);
		const displayLists = padChartDataPointLists(dataPointLists, config);
		const maxValues = displayLists.map((list) => maxPlays(list));
		const maxValue = Math.max(minMaxPlays, ...maxValues);
		const values = getAllValues(displayLists);

		return { displayLists, maxValue, values };
	}, [config, minMaxPlays, dataSets]);

	const firstDataset = displayLists[0];
	const firstDate = firstDataset[0]?.date;
	const lastDate = firstDataset[firstDataset.length - 1]?.date;

	const chartData = useMemo(() => ({
		config,
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
		config,
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
					titles: value.indexes.map((index) => dataSets[index].title)
				};
			}
		}

		return null;
	}, [highlightedValueKey, dataSets, values]);

	if (!firstDate || !lastDate) {
		return null;
	}

	const isSingle = dataSets.length === 1;

	const displayData = displayLists.map((dataPoints, i) => ({
		color: isSingle ? singleColor : colors[i % colors.length],
		dataPoints,
		index: i
	}));

	// Reverse because the first in the list needs to be at the top,
	// and in SVGs, the last drawn item is topmost
	displayData.reverse();

	const legendList = dataSets.map(({ artists, title, url }, i) => ({
		artists,
		color: isSingle ? singleColor : colors[i % colors.length],
		index: i,
		title,
		url
	}));

	return (
		<div className={styles.chart}>
			<ChartContext.Provider value={chartData}>
				<div className={styles.inner}>
					<svg viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
						<ChartDataMask />
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
					<ChartHighlightInfo
						isSingle={isSingle}
						value={highlightedValue}
					/>
				</div>
				<ChartLegend tracks={legendList} />
			</ChartContext.Provider>
		</div>
	);
}

Chart.propTypes = {
	config: PropTypes.object,
	dataSets: PropTypes.arrayOf(PropTypes.shape({
		title: PropTypes.string,
		artists: PropTypes.object,
		url: PropTypes.string,
		dataPoints: PropTypes.array
	})).isRequired
};

Chart.defaultProps = {
	config: null
};

export default Chart;
