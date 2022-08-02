import React from "react";
import PropTypes from "prop-types";
import { path } from "d3-path";

import { ymFromDate } from "../lib/time";

import styles from "./ChartItem.module.css";

function ChartItem({
	areaWidth,
	areaHeight,
	data,
	maxValue,
	offsetLeft,
	offsetTop
}) {
	if (!data?.length) {
		return null;
	}

	// Data is assumed to be padded here!

	const numDays = data.length;
	const months = new Set();

	const p = path();
	p.moveTo(offsetLeft, offsetTop + areaHeight);

	/*
	console.log("start", [offsetLeft, offsetTop + areaHeight]);
	console.log("max x", offsetLeft + 1 * areaWidth);
	console.log("max y", offsetTop + 1 * areaHeight);
	*/

	data.forEach(({ date, plays }, index) => {
		// Months
		months.add(ymFromDate(date));

		// Path
		const percY = (maxValue - plays) / maxValue;
		const y = offsetTop + percY * areaHeight;
		const percX = index / (numDays - 1);
		const x = offsetLeft + percX * areaWidth;

		// console.log("percX", percX);

		p.lineTo(x, y);
	});

	console.log("months", months);

	const linePath = p.toString();
	p.closePath();
	const areaPath = p.toString();

	return (
		<>
			<path className={styles.itemArea} d={areaPath} />
			<path className={styles.itemLine} d={linePath} />
		</>
	);
}

ChartItem.propTypes = {
	areaWidth: PropTypes.number.isRequired,
	areaHeight: PropTypes.number.isRequired,
	data: PropTypes.arrayOf(PropTypes.shape({
		date: PropTypes.string,
		plays: PropTypes.number
	})).isRequired,
	maxValue: PropTypes.number.isRequired,
	offsetLeft: PropTypes.number.isRequired,
	offsetTop: PropTypes.number.isRequired
};

export default ChartItem;
