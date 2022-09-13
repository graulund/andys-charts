import { useContext, useMemo } from "react";
import clsx from "clsx";
import { path } from "d3-path";

import ChartContext, { ChartContextContent } from "./ChartContext";
import { dateFromYmd, daysBetweenDates } from "../lib/time";
import { ChartDataPoint } from "../lib/types";

import styles from "./ChartDataPoints.module.css";

const minDaysForThinLines = 300;

interface ChartDataPointsSegmentProps {
	color: string;
	dataPoints: ChartDataPoint[];
	fillOpacity: number;
	index: number;
}

function ChartDataPointsSegment({
	color,
	dataPoints,
	fillOpacity,
	index
}: ChartDataPointsSegmentProps) {
	const {
		config,
		firstDate,
		getXPositionFromDaysSinceStart,
		getYPosition,
		highlightedIndex,
		mainAreaHeight,
		totalDays
	} = useContext(ChartContext) as ChartContextContent;

	const {
		chartTopHeight: offsetTop,
		dark,
		dataMaskId
	} = config;

	const startOffset = useMemo(() => {
		const overallStart = dateFromYmd(firstDate);
		const segmentStart = dateFromYmd(dataPoints[0].date);
		return daysBetweenDates(overallStart, segmentStart);
	}, [dataPoints, firstDate]);

	const chartBottomY = offsetTop + mainAreaHeight;
	const manyDays = totalDays >= minDaysForThinLines;
	const maskSelector = `url(#${dataMaskId})`;

	const { areaPath, linePath } = useMemo(() => {
		const p = path();
		let begun = false;
		let firstX: number | undefined;
		let firstY: number | undefined;
		let prevX: number | undefined;
		let prevY: number | undefined;
		let lastDrawnX: number | undefined;
		let lastDrawnY: number | undefined;

		if (!dataPoints.length) {
			return {};
		}

		dataPoints.forEach(({ plays }, index) => {
			const y = getYPosition(plays);
			const x = getXPositionFromDaysSinceStart(startOffset + index);

			if (!begun) {
				p.moveTo(x, y);
				firstX = x;
				firstY = y;
				begun = true;
			} else {
				// Filter out needless points in straight horizontal lines
				if (y !== prevY) {
					if (
						typeof prevX === "number" &&
						typeof prevY === "number"
					) {
						p.lineTo(prevX, prevY);
					}

					p.lineTo(x, y);
					lastDrawnX = x;
					lastDrawnY = y;
				}

				prevX = x;
				prevY = y;
			}
		});

		if (
			typeof firstX !== "number" ||
			typeof firstY !== "number" ||
			typeof prevX !== "number" ||
			typeof prevY !== "number" ||
			typeof lastDrawnX !== "number" ||
			typeof lastDrawnY !== "number"
		) {
			// This case shouldn't really happen if dataPoints length is non-zero...
			return {};
		}

		// Finish the line path

		if (prevX > lastDrawnX) {
			p.lineTo(prevX, prevY);
			lastDrawnX = prevX;
			lastDrawnY = prevY;
		}

		const linePath = p.toString();

		// Finish the area path

		if (lastDrawnY < chartBottomY) {
			p.lineTo(lastDrawnX, chartBottomY);
		}

		if (firstY < chartBottomY) {
			p.lineTo(firstX, chartBottomY);
		}

		p.closePath();

		const areaPath = p.toString();

		return { areaPath, linePath };
	}, [
		chartBottomY,
		dataPoints,
		getXPositionFromDaysSinceStart,
		getYPosition,
		startOffset
	]);

	if (!areaPath || !linePath) {
		return null;
	}

	// Fade if this segment is not part of the highlighted track index

	const faded = typeof highlightedIndex === "number" && highlightedIndex !== index;
	const colorAttr = !faded ? color : undefined;
	const areaOpacity = !faded ? fillOpacity : undefined;

	const areaClassName = clsx(styles.area, {
		[styles.fadedArea]: faded
	});

	const lineClassName = clsx(styles.line, {
		[styles.darkLine]: dark,
		[styles.fadedLine]: faded,
		[styles.thinLine]: manyDays
	});

	return (
		<>
			<path
				className={areaClassName}
				d={areaPath}
				fill={colorAttr}
				opacity={areaOpacity}
				mask={maskSelector}
			/>
			<path
				className={lineClassName}
				d={linePath}
				stroke={colorAttr}
				mask={maskSelector}
			/>
		</>
	);
}

export default ChartDataPointsSegment;
