import React, { useContext } from "react";
import PropTypes from "prop-types";

import ChartContext from "./ChartContext";

import styles from "./ChartHighlightInfo.module.css";

import {
	dateFromYmd,
	daysBetweenDates,
	formatYearMonth,
	getAllMonthsBetweenDates
} from "../lib/time";

const infoVerticalOffset = 30;

function ChartHighlightInfo({ value }) {
	const {
		chartLeftWidth: offsetLeft,
		chartTopHeight: offsetTop,
		firstDate,
		highlightedValue,
		lastDate,
		mainAreaWidth,
		mainAreaHeight,
		maxValue
	} = useContext(ChartContext);

	if (!value) {
		return null;
	}

	const start = dateFromYmd(firstDate);
	const end = dateFromYmd(lastDate);
	const totalDays = daysBetweenDates(start, end);

	const { date: ymd, plays, indexes, titles } = value;

	const date = dateFromYmd(ymd);
	const percY = (maxValue - plays) / maxValue;
	const y = offsetTop + percY * mainAreaHeight + infoVerticalOffset;
	const days = daysBetweenDates(start, date);
	const percX = days / totalDays;
	const x = offsetLeft + percX * mainAreaWidth;

	return (
		<div className={styles.info} style={{ left: `${x}px`, top: `${y}px` }}>
			<ul className={styles.tracks}>
				{ titles.map((title, i) => (
					<li key={indexes[i]}>{ title }</li>
				)) }
			</ul>
			<p className={styles.playInfo}>
				{ `${plays} afspilninger d. ${ymd}` }
			</p>
		</div>
	);
}

ChartHighlightInfo.propTypes = {
	value: PropTypes.shape({
		date: PropTypes.string,
		plays: PropTypes.number,
		titles: PropTypes.array
	})
};

ChartHighlightInfo.defaultProps = {
	value: null
};

export default ChartHighlightInfo;
