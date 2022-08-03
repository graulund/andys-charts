import React from "react";
import PropTypes from "prop-types";
import { path } from "d3-path";

import {
	dateFromYmd,
	daysBetweenDates,
	formatYearMonth,
	getAllMonthsBetweenDates
} from "../lib/time";

import styles from "./ChartAxes.module.css";

const tickTextOffsetTop = 12;

function ChartTimeAxis({
	areaWidth,
	areaHeight,
	firstDate,
	lastDate,
	offsetLeft,
	offsetTop
}) {
	// Horizontal axis line
	const axisPath = path();
	axisPath.moveTo(offsetLeft, offsetTop + areaHeight);
	axisPath.lineTo(offsetLeft + areaWidth, offsetTop + areaHeight);

	const start = dateFromYmd(firstDate);
	const end = dateFromYmd(lastDate);
	const totalDays = daysBetweenDates(start, end);

	const months = getAllMonthsBetweenDates(firstDate, lastDate);
	const monthCount = months.length;
	let monthFormatStyle = "normal";

	if (monthCount >= 20) {
		monthFormatStyle = "tiny";
	} else if (monthCount >= 12) {
		monthFormatStyle = "small";
	}

	return (
		<>
			<path className={styles.axisLine} d={axisPath.toString()} />
			{ months.map(({ year, month, ymd }, index) => {
				// Render each tick, and tick value
				const monthDate = new Date(Math.max(start, dateFromYmd(ymd)));
				const days = daysBetweenDates(start, monthDate);
				const perc = days / totalDays;
				const tickPos = offsetLeft + perc * areaWidth;
				const tickPath = path();
				tickPath.moveTo(tickPos, offsetTop);
				tickPath.lineTo(tickPos, offsetTop + areaHeight);

				const prevMonth = months[index - 1];

				const label = formatYearMonth(
					year, month, prevMonth?.year || 0, "da", monthFormatStyle
				);

				// TODO: Somehow detect if there's not space for the label?

				return (
					<React.Fragment key={ymd}>
						<path className={styles.axisLine} d={tickPath.toString()} />
						<text
							className={styles.axisText}
							x={tickPos}
							y={offsetTop + areaHeight + tickTextOffsetTop}
						>
							{ label }
						</text>
					</React.Fragment>
				);
			}) }
		</>
	);
}

ChartTimeAxis.propTypes = {
	areaHeight: PropTypes.number.isRequired,
	firstDate: PropTypes.string.isRequired, // yyyy-mm-dd
	lastDate: PropTypes.string.isRequired,
	offsetLeft: PropTypes.number.isRequired,
	offsetTop: PropTypes.number.isRequired
};

export default ChartTimeAxis;
