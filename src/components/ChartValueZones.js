import React, { useContext } from "react";
import PropTypes from "prop-types";

import ChartContext from "./ChartContext";
import { dateFromYmd, daysBetweenDates } from "../lib/time";

import styles from "./ChartValueZones.module.css";

function ChartValueZones({ values }) {
	const {
		config,
		firstDate,
		highlightedValueKey,
		lastDate,
		mainAreaWidth,
		mainAreaHeight,
		maxValue,
		setHighlightedValueKey
	} = useContext(ChartContext);

	if (!values?.length) {
		return null;
	}

	const {
		chartLeftWidth: offsetLeft,
		chartTopHeight: offsetTop
	} = config;

	const start = dateFromYmd(firstDate);
	const end = dateFromYmd(lastDate);
	const totalDays = daysBetweenDates(start, end);

	return (
		<div className={styles.root}>
			{ values.map(({ date: ymd, plays }) => {
				// Calculating coords
				const date = dateFromYmd(ymd);
				const percY = (maxValue - plays) / maxValue;
				const y = offsetTop + percY * mainAreaHeight;
				const days = daysBetweenDates(start, date);
				const percX = days / totalDays;
				const x = offsetLeft + percX * mainAreaWidth;
				const unitWidth = 1 / totalDays * mainAreaWidth;
				const unitHeight = 1 / maxValue * mainAreaHeight;
				const key = `${ymd}:${plays}`;

				const mouseOut = () => {
					if (highlightedValueKey === key) {
						setHighlightedValueKey(null);
					}
				};

				return (
					<div
						className={styles.zone}
						onMouseOver={() => setHighlightedValueKey(key)}
						onMouseOut={mouseOut}
						style={{
							left: `${x}px`,
							top: `${y}px`,
							width: `${unitWidth}px`,
							height: `${unitHeight}px`,
							marginTop: `${-.5 * unitHeight}px`,
							marginLeft: `${-.5 * unitWidth}px`,
						}}
						key={key}
					/>
				);
			}) }
		</div>
	);
}

ChartValueZones.propTypes = {
	values: PropTypes.arrayOf(PropTypes.shape({
		date: PropTypes.string,
		plays: PropTypes.number,
		indexes: PropTypes.array
	})).isRequired
};

export default ChartValueZones;
