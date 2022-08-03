import React from "react";
import PropTypes from "prop-types";
import { path } from "d3-path";

import styles from "./ChartDataPoints.module.css";

function ChartDataPoints({
	areaWidth,
	areaHeight,
	dataPoints,
	maxValue,
	offsetLeft,
	offsetTop
}) {
	if (!dataPoints?.length) {
		return null;
	}

	// Data is assumed to be padded here!

	const numDays = dataPoints.length;

	const p = path();
	p.moveTo(offsetLeft, offsetTop + areaHeight);

	dataPoints.forEach(({ date, plays }, index) => {
		const percY = (maxValue - plays) / maxValue;
		const y = offsetTop + percY * areaHeight;
		const percX = index / (numDays - 1);
		const x = offsetLeft + percX * areaWidth;

		p.lineTo(x, y);
	});

	const linePath = p.toString();
	p.lineTo(offsetLeft + areaWidth, offsetTop + areaHeight);
	p.closePath();
	const areaPath = p.toString();

	return (
		<>
			<path className={styles.area} d={areaPath} />
			<path className={styles.line} d={linePath} />
		</>
	);
}

ChartDataPoints.propTypes = {
	areaWidth: PropTypes.number.isRequired,
	areaHeight: PropTypes.number.isRequired,
	dataPoints: PropTypes.arrayOf(PropTypes.shape({
		date: PropTypes.string,
		plays: PropTypes.number
	})).isRequired,
	maxValue: PropTypes.number.isRequired,
	offsetLeft: PropTypes.number.isRequired,
	offsetTop: PropTypes.number.isRequired
};

export default ChartDataPoints;
