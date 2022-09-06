import React, { useContext, useMemo } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { path } from "d3-path";

import ChartContext from "./ChartContext";
import { dateFromYmd, daysBetweenDates } from "../lib/time";

import styles from "./ChartDataPoints.module.css";

const minDaysForThinLines = 300;

function ChartDataPointsSegment({ color, dataPoints, fillOpacity, index }) {
	const {
		config,
		firstDate,
		getXPositionFromDaysSinceStart,
		getYPosition,
		highlightedIndex,
		mainAreaHeight,
		totalDays
	} = useContext(ChartContext);

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
		let firstX;
		let firstY;
		let prevX;
		let prevY;
		let lastDrawnX;
		let lastDrawnY;

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
					if (typeof prevY === "number") {
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

		if (prevX > lastDrawnX) {
			p.lineTo(prevX, prevY);
			lastDrawnX = prevX;
			lastDrawnY = prevY;
		}

		const linePath = p.toString();

		// Finish the area

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

ChartDataPointsSegment.propTypes = {
	color: PropTypes.string.isRequired,
	dataPoints: PropTypes.arrayOf(PropTypes.shape({
		date: PropTypes.string,
		plays: PropTypes.number
	})).isRequired,
	fillOpacity: PropTypes.number.isRequired,
	index: PropTypes.number.isRequired
};

export default ChartDataPointsSegment;
