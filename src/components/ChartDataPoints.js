import React, { useContext } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { path } from "d3-path";

import ChartContext from "./ChartContext";

import styles from "./ChartDataPoints.module.css";

const minDaysForThinLines = 300;

function ChartDataPoints({ color, dataPoints, index }) {
	const {
		config,
		highlightedIndex,
		mainAreaWidth,
		mainAreaHeight,
		maxValue
	} = useContext(ChartContext);

	if (!dataPoints?.length) {
		return null;
	}

	const {
		chartLeftWidth: offsetLeft,
		chartTopHeight: offsetTop,
		dataMaskId
	} = config;

	// Data is assumed to be padded here!

	const numDays = dataPoints.length;
	const manyDays = numDays >= minDaysForThinLines;
	const maskSelector = `url(#${dataMaskId})`;

	const p = path();
	let begun = false;
	let lastDrawnX;
	let prevX;
	let prevY;

	dataPoints.forEach(({ date, plays }, index) => {
		// Calculating coords
		const percY = (maxValue - plays) / maxValue;
		const y = offsetTop + percY * mainAreaHeight;
		const percX = index / (numDays - 1);
		const x = offsetLeft + percX * mainAreaWidth;

		if (!begun) {
			p.moveTo(x, y);
			begun = true;
		} else {
			// Filter out needless points in straight horizontal lines
			if (y !== prevY) {
				if (typeof prevY === "number") {
					p.lineTo(prevX, prevY);
				}

				p.lineTo(x, y);
				lastDrawnX = x;
			}

			prevX = x;
			prevY = y;
		}
	});

	if (prevX > lastDrawnX) {
		p.lineTo(prevX, prevY);
	}

	const linePath = p.toString();
	p.lineTo(offsetLeft + mainAreaWidth, offsetTop + mainAreaHeight);
	p.lineTo(offsetLeft, offsetTop + mainAreaHeight);
	p.closePath();
	const areaPath = p.toString();
	const faded = typeof highlightedIndex === "number" && highlightedIndex !== index;
	const colorAttr = !faded ? color : undefined;

	const areaClassName = clsx(styles.area, {
		[styles.fadedArea]: faded
	});

	const lineClassName = clsx(styles.line, {
		[styles.fadedLine]: faded,
		[styles.thinLine]: manyDays
	});

	return (
		<>
			<path
				className={areaClassName}
				d={areaPath}
				fill={colorAttr}
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

ChartDataPoints.propTypes = {
	color: PropTypes.string.isRequired,
	dataPoints: PropTypes.arrayOf(PropTypes.shape({
		date: PropTypes.string,
		plays: PropTypes.number
	})).isRequired,
	index: PropTypes.number.isRequired
};

export default ChartDataPoints;
