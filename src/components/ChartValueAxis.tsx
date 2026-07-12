import React, { useContext } from "react";

import ChartContext, { ChartContextContent } from "./ChartContext";
import { classNames } from "../lib/classNames";
import { getValueTicks } from "../lib/ticks";
import { createSvgPath } from "../lib/svgPath";

import styles from "./ChartAxes.module.css";

const tickSize = 3;
const tickTextOffsetTop = 4;
const tickTextOffsetLeft = -5;

/** Renders the value (y) axis of the chart */
function ChartValueAxis() {
	const { config, getYPosition, mainAreaHeight, minValue, maxValue } =
		useContext(ChartContext) as ChartContextContent;

	const {
		chartLeftWidth: offsetLeft,
		chartTopHeight: offsetTop,
		dark
	} = config;

	// Vertical axis line
	const axisPath = createSvgPath();
	axisPath.moveTo(offsetLeft, offsetTop);
	axisPath.lineTo(offsetLeft, offsetTop + mainAreaHeight);

	// Range of numbers displayed in axis
	const tickRange = getValueTicks(minValue, maxValue);

	const lineClassName = classNames(
		styles.axisLine,
		dark && styles.darkAxisLine
	);

	const labelClassName = classNames(
		styles.axisLabel,
		styles.axisValueLabel,
		dark && styles.darkAxisLabel
	);

	return (
		<>
			<path className={lineClassName} d={axisPath.toString()} />
			{tickRange.map((val) => {
				// Render each tick, and tick value
				const tickHeight = getYPosition(val);
				const tickPath = createSvgPath();
				tickPath.moveTo(offsetLeft - tickSize, tickHeight);
				tickPath.lineTo(offsetLeft, tickHeight);

				return (
					<React.Fragment key={val}>
						<path
							className={lineClassName}
							d={tickPath.toString()}
						/>
						<text
							className={labelClassName}
							x={offsetLeft + tickTextOffsetLeft}
							y={tickHeight + tickTextOffsetTop}
						>
							{val}
						</text>
					</React.Fragment>
				);
			})}
		</>
	);
}

export default ChartValueAxis;
