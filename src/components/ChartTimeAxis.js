import React, { useContext } from "react";
import PropTypes from "prop-types";
import { path } from "d3-path";

import ChartContext from "./ChartContext";

import {
	dateFromYmd,
	daysBetweenDates,
	formatYearMonth,
	getAllMonthsBetweenDates
} from "../lib/time";

import styles from "./ChartAxes.module.css";

const tickTextOffsetTop = 12;

function ChartTimeAxis() {
	const {
		chartLeftWidth: offsetLeft,
		chartTopHeight: offsetTop,
		firstDate,
		lastDate,
		mainAreaWidth,
		mainAreaHeight
	} = useContext(ChartContext);

	// Horizontal axis line
	const axisPath = path();
	axisPath.moveTo(offsetLeft, offsetTop + mainAreaHeight);
	axisPath.lineTo(offsetLeft + mainAreaWidth, offsetTop + mainAreaHeight);

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
				const tickPos = offsetLeft + perc * mainAreaWidth;
				const tickPath = path();
				tickPath.moveTo(tickPos, offsetTop);
				tickPath.lineTo(tickPos, offsetTop + mainAreaHeight);

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
							y={offsetTop + mainAreaHeight + tickTextOffsetTop}
						>
							{ label }
						</text>
					</React.Fragment>
				);
			}) }
		</>
	);
}

export default ChartTimeAxis;
