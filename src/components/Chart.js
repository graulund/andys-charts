import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";

import ChartData from "./ChartData";
import ChartDataMask from "./ChartDataMask";
import ChartDataPoints from "./ChartDataPoints";
import ChartHighlightInfo from "./ChartHighlightInfo";
import ChartHighlightMarker from "./ChartHighlightMarker";
import ChartLegend from "./ChartLegend";
import ChartScrollContainer from "./ChartScrollContainer";
import ChartTimeAxis from "./ChartTimeAxis";
import ChartValueAxis from "./ChartValueAxis";
import ChartValueZones from "./ChartValueZones";

import {
	filterDataSets,
	maxPlays,
	padChartDataPointLists,
	getAllValues
} from "../lib/chartData";

import { dateFromYmd, daysBetweenDates } from "../lib/time";

import styles from "./Chart.module.css";

const defaultConfig = {
	todayYmd: "",
	overrideStartYmd: "",
	overrideEndYmd: "",
	maxDays: 183,
	minDays: 10,
	maxEndPaddingDays: 5,
	chartWidth: 1000,
	chartHeight: 145,
	minMaxPlays: 4,
	minValues: 2,
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
		"#666" // Grey
	]
};

function Chart({ config: givenConfig, dataSets: givenDataSets }) {
	const [highlightedValueKey, setHighlightedValueKey] = useState(null);
	const [highlightedIndex, setHighlightedIndex] = useState(null);
	const [scrollLeft, setScrollLeft] = useState(0);
	const config = useMemo(() => ({ ...defaultConfig, ...(givenConfig || {}) }), [givenConfig]);

	const {
		chartBottomHeight,
		chartHeight,
		chartLeftWidth,
		chartTopHeight,
		chartWidth,
		colors,
		minMaxPlays,
		minValues,
		singleColor
	} = config;

	// Calculate chart area

	const mainAreaWidth = chartWidth - chartLeftWidth;
	const mainAreaHeight = chartHeight - chartTopHeight - chartBottomHeight;

	const {
		dataSets,
		dataPointLists,
		firstDate,
		lastDate,
		maxValue,
		totalDays,
		values
	} = useMemo(() => {
		// Pad and limit data

		const paddedLists = padChartDataPointLists(
			(givenDataSets || []).map(({ dataPoints }) => dataPoints),
			config
		);

		// Filter data

		const { dataSets, dataPointLists } = filterDataSets(
			givenDataSets, paddedLists, minValues
		);

		// Get scope of data

		const maxValues = dataPointLists.map((list) => maxPlays(list));
		const maxValue = Math.max(minMaxPlays, ...maxValues);
		const values = getAllValues(dataPointLists);
		const firstDataSet = dataPointLists[0];
		const firstDate = firstDataSet?.[0]?.date;
		const lastDate = firstDataSet?.[firstDataSet.length - 1]?.date;
		let totalDays = 0;

		if (firstDate && lastDate) {
			const start = dateFromYmd(firstDate);
			const end = dateFromYmd(lastDate);
			totalDays = daysBetweenDates(start, end);
		}

		return {
			dataSets,
			dataPointLists,
			firstDate,
			lastDate,
			maxValue,
			totalDays,
			values
		};
	}, [config, minMaxPlays, minValues, givenDataSets]);

	// Data for context

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
		scrollLeft,
		setHighlightedIndex,
		setHighlightedValueKey,
		setScrollLeft,
		totalDays
	}), [
		config,
		firstDate,
		lastDate,
		mainAreaHeight,
		mainAreaWidth,
		maxValue,
		highlightedIndex,
		highlightedValueKey,
		scrollLeft,
		setHighlightedIndex,
		setHighlightedValueKey,
		setScrollLeft,
		totalDays
	]);

	// Highlighted value (from moving mouse over data points)

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

	// Abort if there's no data

	if (!firstDate || !lastDate) {
		return null;
	}

	// Display data for chart and legend

	const isSingle = dataSets.length === 1;

	const displayData = dataPointLists.map((dataPoints, i) => ({
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
		<div className={styles.chart} aria-label="Line chart">
			<ChartData {...chartData}>
				<div className={styles.main}>
					<ChartScrollContainer>
						<div className={styles.inner}>
							<svg
								className={styles.canvas}
								viewBox={`0 0 ${chartWidth} ${chartHeight}`}
								style={{ width: `${chartWidth}px`, height: `${chartHeight}px` }}
							>
								<ChartDataMask />
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
							<ChartHighlightMarker value={highlightedValue} />
						</div>
					</ChartScrollContainer>
					<svg
						className={styles.valueAxis}
						viewBox={`0 0 ${chartLeftWidth} ${chartHeight}`}
						style={{ width: `${chartLeftWidth}px`, height: `${chartHeight}px` }}
					>
						<ChartValueAxis />
					</svg>
					<ChartHighlightInfo
						isSingle={isSingle}
						value={highlightedValue}
					/>
				</div>
				<ChartLegend tracks={legendList} />
			</ChartData>
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
