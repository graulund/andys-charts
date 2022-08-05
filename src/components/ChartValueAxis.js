import React, { useContext } from "react";
import { path } from "d3-path";

import ChartContext from "./ChartContext";
import range from "../lib/range";

import styles from "./ChartAxes.module.css";

const tickSize = 3;
const tickTextOffsetTop = 4;
const tickTextOffsetLeft = -5;

function ChartValueAxis() {
	const {
		chartLeftWidth: offsetLeft,
		chartTopHeight: offsetTop,
		mainAreaHeight,
		minValue,
		maxValue
	} = useContext(ChartContext);

	const valueRange = maxValue - minValue;

	// Vertical axis line
	const axisPath = path();
	axisPath.moveTo(offsetLeft, offsetTop);
	axisPath.lineTo(offsetLeft, offsetTop + mainAreaHeight);

	return (
		<>
			<path className={styles.axisLine} d={axisPath.toString()} />
			{ range(minValue, maxValue).map((val) => {
				// Render each tick, and tick value
				const perc = 1 - (val - minValue) / valueRange;
				const tickHeight = offsetTop + perc * mainAreaHeight;
				const tickPath = path();
				tickPath.moveTo(offsetLeft - tickSize, tickHeight);
				tickPath.lineTo(offsetLeft, tickHeight);

				return (
					<React.Fragment key={val}>
						<path className={styles.axisLine} d={tickPath.toString()} />
						<text
							className={styles.axisValueText}
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
