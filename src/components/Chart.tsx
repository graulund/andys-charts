import { useId, useMemo, useRef, useState } from "react";

import { ChartContextData } from "./ChartContext";
import ChartData from "./ChartData";
import ChartDataClip from "./ChartDataClip";
import ChartDataPoints from "./ChartDataPoints";
import ChartHighlightInfo from "./ChartHighlightInfo";
import ChartHighlightMarker from "./ChartHighlightMarker";
import ChartInteractionLayer from "./ChartInteractionLayer";
import ChartLegend from "./ChartLegend";
import ChartScrollContainer from "./ChartScrollContainer";
import ChartTimeAxis from "./ChartTimeAxis";
import ChartValueAxis from "./ChartValueAxis";

import getChartFacts from "../lib/chartFacts";
import { ChartConfig, defaultConfig } from "../lib/config";
import { getHighlightedValue } from "../lib/pointValues";
import {
	ChartDataPointTitles,
	ChartDataSet,
	ChartLegendTrackItem
} from "../lib/types";

import styles from "./Chart.module.css";

export interface ChartProps {
	ariaLabel?: string;
	config?: Partial<ChartConfig> | null;
	dataSets: ChartDataSet[];
}

/**
 * Main chart component: Takes a partial config and non-compressed data sets as props
 */
function Chart({
	ariaLabel = "Line chart",
	config: givenConfig,
	dataSets: givenDataSets
}: ChartProps) {
	const clipPathId = `andy-chart-data-clip-${useId().replace(/:/g, "")}`;
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const [highlightedValueKey, setHighlightedValueKey] = useState<
		string | null
	>(null);
	const [highlightedIndex, setHighlightedIndex] = useState<
		number | undefined
	>(undefined);
	const [highlightedX, setHighlightedX] = useState<number | null>(null);

	const config: ChartConfig = useMemo(
		() => ({ ...defaultConfig, ...(givenConfig || {}) }),
		[givenConfig]
	);

	const {
		chartBottomHeight,
		chartHeight,
		chartLeftWidth,
		chartTopHeight,
		chartWidth,
		colors: configuredColors,
		fillOpacity,
		singleColor,
		singleFillOpacity
	} = config;

	// Calculate chart area

	const mainAreaWidth = chartWidth - chartLeftWidth;
	const mainAreaHeight = chartHeight - chartTopHeight - chartBottomHeight;
	const colors = configuredColors.length
		? configuredColors
		: defaultConfig.colors;

	const {
		dataSets,
		dataPointLists,
		firstDate,
		lastDate,
		maxValue,
		totalDays,
		values
	} = useMemo(
		() => getChartFacts(givenDataSets, config),
		[config, givenDataSets]
	);

	// Data for context

	const chartData: ChartContextData = useMemo(
		() => ({
			clipPathId,
			config,
			firstDate,
			lastDate,
			mainAreaHeight,
			mainAreaWidth,
			minValue: 0,
			maxValue,
			highlightedIndex,
			highlightedX,
			highlightedValueKey,
			scrollContainerRef,
			setHighlightedIndex,
			setHighlightedX,
			setHighlightedValueKey,
			totalDays
		}),
		[
			clipPathId,
			config,
			firstDate,
			lastDate,
			mainAreaHeight,
			mainAreaWidth,
			maxValue,
			highlightedIndex,
			highlightedX,
			highlightedValueKey,
			scrollContainerRef,
			setHighlightedIndex,
			setHighlightedX,
			setHighlightedValueKey,
			totalDays
		]
	);

	// Highlighted value (from moving mouse over data points)

	const highlightedValue: ChartDataPointTitles | undefined = useMemo(() => {
		if (highlightedValueKey) {
			return getHighlightedValue(highlightedValueKey, values, dataSets);
		}
	}, [highlightedValueKey, dataSets, values]);

	// Abort if there's no data

	if (!firstDate || !lastDate || mainAreaWidth <= 0 || mainAreaHeight <= 0) {
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

	const legendList: ChartLegendTrackItem[] = dataSets.map(
		({ artists, title, url }, i) => ({
			artists,
			color: hasSingleItem ? singleColor : colors[i % colors.length],
			index: i,
			title,
			url
		})
	);

	const fillOpacityValue = hasSingleItem ? singleFillOpacity : fillOpacity;

	return (
		<div className={styles.chart} role="group" aria-label={ariaLabel}>
			<ChartData {...chartData}>
				<div className={styles.main}>
					<svg
						aria-hidden="true"
						className={styles.valueAxis}
						viewBox={`0 0 ${chartLeftWidth} ${chartHeight}`}
						style={{
							width: `${chartLeftWidth}px`,
							height: `${chartHeight}px`
						}}
					>
						<ChartValueAxis />
					</svg>
					<ChartScrollContainer>
						<div className={styles.inner}>
							<svg
								aria-hidden="true"
								className={styles.canvas}
								viewBox={`0 0 ${mainAreaWidth} ${chartHeight}`}
								style={{
									width: `${mainAreaWidth}px`,
									height: `${chartHeight}px`
								}}
							>
								<ChartDataClip />
								<ChartTimeAxis />
								{displayData.map(
									({ color, dataPoints, index }) => (
										<ChartDataPoints
											dataPoints={dataPoints}
											color={color}
											fillOpacity={fillOpacityValue}
											index={index}
											key={index}
										/>
									)
								)}
							</svg>
							<ChartInteractionLayer values={values} />
							<ChartHighlightMarker value={highlightedValue} />
						</div>
					</ChartScrollContainer>
					<ChartHighlightInfo value={highlightedValue} />
				</div>
				<ChartLegend tracks={legendList} />
			</ChartData>
		</div>
	);
}

export default Chart;
