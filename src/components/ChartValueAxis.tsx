import React, { useContext } from "react";
import clsx from "clsx";
import { path } from "d3-path";

import ChartContext, { ChartContextContent } from "./ChartContext";

import styles from "./ChartAxes.module.css";

const tickSize = 3;
const tickTextOffsetTop = 4;
const tickTextOffsetLeft = -5;
const maxUnfilteredRangeMax = 10;

function range(start: number, end: number) {
	// Both values inclusive
	const size = end - start;
	return [...Array(1 + size).keys()].map(i => i + start);
}

function getEvens(range: number[]) {
	return range.filter((n) => n % 2 === 0);
}

/** Renders the value (y) axis of the chart */
function ChartValueAxis() {
	const {
		config,
		getYPosition,
		mainAreaHeight,
		minValue,
		maxValue
	} = useContext(ChartContext) as ChartContextContent;

	const {
		chartLeftWidth: offsetLeft,
		chartTopHeight: offsetTop,
		dark
	} = config;

	// Vertical axis line
	const axisPath = path();
	axisPath.moveTo(offsetLeft, offsetTop);
	axisPath.lineTo(offsetLeft, offsetTop + mainAreaHeight);

	// Range of numbers displayed in axis
	let tickRange = range(minValue, maxValue);

	// Only display every other tick at a certain point
	// (This is a very simple implementation that assumes max value will never be above 15)
	if (maxValue > maxUnfilteredRangeMax) {
		tickRange = getEvens(tickRange);
	}

	const lineClassName = clsx(styles.axisLine, {
		[styles.darkAxisLine]: dark
	});

	const labelClassName = clsx(styles.axisLabel, styles.axisValueLabel, {
		[styles.darkAxisLabel]: dark
	});

	return (
		<>
			<path className={lineClassName} d={axisPath.toString()} />
			{ tickRange.map((val) => {
				// Render each tick, and tick value
				const tickHeight = getYPosition(val);
				const tickPath = path();
				tickPath.moveTo(offsetLeft - tickSize, tickHeight);
				tickPath.lineTo(offsetLeft, tickHeight);

				return (
					<React.Fragment key={val}>
						<path className={lineClassName} d={tickPath.toString()} />
						<text
							className={labelClassName}
							x={offsetLeft + tickTextOffsetLeft}
							y={tickHeight + tickTextOffsetTop}
						>
							{ val }
						</text>
					</React.Fragment>
				);
			}) }
		</>
	);
}

export default ChartValueAxis;
