import React, { useContext } from "react";
import PropTypes from "prop-types";
import { path } from "d3-path";

import ChartContext from "./ChartContext";

import styles from "./ChartDataPoints.module.css";

function ChartDataPoints({ color, dataPoints }) {
	const {
		chartLeftWidth: offsetLeft,
		chartTopHeight: offsetTop,
		mainAreaWidth,
		mainAreaHeight,
		maxValue
	} = useContext(ChartContext);

	if (!dataPoints?.length) {
		return null;
	}

	// Data is assumed to be padded here!

	const numDays = dataPoints.length;

	const p = path();
	let begun = false;

	dataPoints.forEach(({ date, plays }, index) => {
		const percY = (maxValue - plays) / maxValue;
		const y = offsetTop + percY * mainAreaHeight;
		const percX = index / (numDays - 1);
		const x = offsetLeft + percX * mainAreaWidth;

		if (!begun) {
			p.moveTo(x, y);
			begun = true;
		} else {
			p.lineTo(x, y);
		}
	});

	const linePath = p.toString();
	p.lineTo(offsetLeft + mainAreaWidth, offsetTop + mainAreaHeight);
	p.lineTo(offsetLeft, offsetTop + mainAreaHeight);
	p.closePath();
	const areaPath = p.toString();

	return (
		<>
			<path className={styles.area} d={areaPath} fill={color} />
			<path className={styles.line} d={linePath} stroke={color} />
		</>
	);
}

ChartDataPoints.propTypes = {
	color: PropTypes.string.isRequired,
	dataPoints: PropTypes.arrayOf(PropTypes.shape({
		date: PropTypes.string,
		plays: PropTypes.number
	})).isRequired
};

export default ChartDataPoints;
