import React from "react";
import PropTypes from "prop-types";
import { path } from "d3-path";

import range from "../lib/range";

import styles from "./ChartAxes.module.css";

const tickSize = 3;
const tickTextOffsetTop = 4;
const tickTextOffsetLeft = -5;

function ChartValueAxis({
	areaHeight,
	maxValue,
	minValue,
	offsetLeft,
	offsetTop
}) {
	const valueRange = maxValue - minValue;

	// Vertical axis line
	const axisPath = path();
	axisPath.moveTo(offsetLeft, offsetTop);
	axisPath.lineTo(offsetLeft, offsetTop + areaHeight);

	return (
		<>
			<path className={styles.axisLine} d={axisPath.toString()} />
			{ range(minValue, maxValue).map((val) => {
				// Render each tick, and tick value
				const perc = 1 - (val - minValue) / valueRange;
				const tickHeight = offsetTop + perc * areaHeight;
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

ChartValueAxis.propTypes = {
	areaHeight: PropTypes.number.isRequired,
	minValue: PropTypes.number,
	maxValue: PropTypes.number.isRequired,
	offsetLeft: PropTypes.number.isRequired,
	offsetTop: PropTypes.number.isRequired
};

ChartValueAxis.defaultProps = {
	minValue: 0
};

export default ChartValueAxis;
