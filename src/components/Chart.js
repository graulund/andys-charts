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
	backgroundColor: "#fff",
	chartBottomHeight: 14,
	chartHeight: 145,
	chartLeftWidth: 18,
	chartTopHeight: 4,
	chartWidth: 1000,
	dark: false,
	dataMaskId: "andy-chart-data-mask",
	fillOpacity: .4,
	isSingle: false,
	language: "da",
	linkMainClassName: "",
	maxDays: 183,
	maxEndPaddingDays: 5,
	minDays: 10,
	minMaxPlays: 4,
	minValues: 2,
	overrideEndYmd: "",
	overrideStartYmd: "",
	showEndFirst: true,
	singleColor: "#3faa9e",
	singleFillOpacity: .4,
	todayYmd: "",
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
		backgroundColor,
		chartBottomHeight,
		chartHeight,
		chartLeftWidth,
		chartTopHeight,
		chartWidth,
		colors,
		fillOpacity,
		minMaxPlays,
		minValues,
		singleColor,
		singleFillOpacity
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

	// This is *not* the same as the `isSingle` config value, which has more repercussions
	// This is if a view of a group of tracks just happen to contain *one* track

	const hasSingleItem = dataPointLists.length === 1;

	// Display data for chart and legend

	const displayData = dataPointLists.map((dataPoints, i) => ({
		color: hasSingleItem ? singleColor : colors[i % colors.length],
		dataPoints,
		index: i
	}));

	// Reverse because the first in the list needs to be at the top,
	// and in SVGs, the last drawn item is topmost

	displayData.reverse();

	const legendList = dataSets.map(({ artists, title, url }, i) => ({
		artists,
		color: hasSingleItem ? singleColor : colors[i % colors.length],
		index: i,
		title,
		url
	}));

	const fillOpacityValue = hasSingleItem ? singleFillOpacity : fillOpacity;

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
										fillOpacity={fillOpacityValue}
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
						style={{
							backgroundColor,
							width: `${chartLeftWidth}px`,
							height: `${chartHeight}px`
						}}
					>
						<ChartValueAxis />
					</svg>
					<ChartHighlightInfo value={highlightedValue} />
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
