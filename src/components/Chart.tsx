import { useMemo, useState } from "react";

import { ChartContextData } from "./ChartContext";
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

import getChartFacts from "../lib/chartFacts";
import { ChartConfig, defaultConfig } from "../lib/config";
import { getHighlightedValue } from "../lib/pointValues";
import { ChartDataPointTitles, ChartDataSet, ChartLegendTrackItem } from "../lib/types";

import styles from "./Chart.module.css";

interface ChartProps {
	config: Partial<ChartConfig>;
	dataSets: ChartDataSet[];
}

function Chart({
	config: givenConfig,
	dataSets: givenDataSets
}: ChartProps) {
	const [highlightedValueKey, setHighlightedValueKey] = useState<string | null>(null);
	const [highlightedIndex, setHighlightedIndex] = useState<number | undefined>(undefined);
	const [scrollLeft, setScrollLeft] = useState(0);

	const config: ChartConfig = useMemo(
		() => ({ ...defaultConfig, ...(givenConfig || {}) }), [givenConfig]
	);

	const {
		backgroundColor,
		chartBottomHeight,
		chartHeight,
		chartLeftWidth,
		chartTopHeight,
		chartWidth,
		colors,
		fillOpacity,
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
	} = useMemo(() => getChartFacts(givenDataSets, config), [config, givenDataSets]);

	// Data for context

	const chartData: ChartContextData = useMemo(() => ({
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

	const highlightedValue: ChartDataPointTitles | undefined = useMemo(() => {
		if (highlightedValueKey) {
			return getHighlightedValue(highlightedValueKey, values, dataSets);
		}
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

	const legendList: ChartLegendTrackItem[] = dataSets.map(({ artists, title, url }, i) => ({
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

Chart.defaultProps = {
	config: null
};

export default Chart;
