import React, { useContext } from "react";
import PropTypes from "prop-types";
import { path } from "d3-path";

import ChartContext from "./ChartContext";

import styles from "./ChartDataPoints.module.css";

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
	const maskSelector = `url(#${dataMaskId})`;

	const p = path();
	let begun = false;

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
			p.lineTo(x, y);
		}
	});

	const linePath = p.toString();
	p.lineTo(offsetLeft + mainAreaWidth, offsetTop + mainAreaHeight);
	p.lineTo(offsetLeft, offsetTop + mainAreaHeight);
	p.closePath();
	const areaPath = p.toString();
	const faded = typeof highlightedIndex === "number" && highlightedIndex !== index;

	const areaClassName = faded ? [styles.area, styles.fadedArea].join(" ") : styles.area;
	const lineClassName = faded ? [styles.line, styles.fadedLine].join(" ") : styles.line;
	const colorAttr = faded ? undefined : color;

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
