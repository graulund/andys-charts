import React, { useContext } from "react";
import PropTypes from "prop-types";

import ChartContext from "./ChartContext";
import { dateFromYmd, formatDate } from "../lib/time";

import styles from "./ChartHighlightInfo.module.css";

const infoHorizontalOffset = -16;
const infoVerticalOffset = 70; // 20;
const infoApproxWidth = 200;

function ChartHighlightInfo({ isSingle, value }) {
	const {
		config,
		getXPositionFromDate,
		getYBottomPosition,
		getYPosition,
		scrollLeft
	} = useContext(ChartContext);

	const { language } = config;

	// Return an element even if no value, for performance reasons

	let playInfoString = "";
	let x = 0;
	let y = 0;

	const titles = value?.titles || [];
	const indexes = value?.indexes || [];
	const infoClassName = value ? styles.info : [styles.info, styles.noInfo].join(" ");
	const maxX = window.innerWidth - infoApproxWidth;
	// TODO: Use actual width somehow(?)

	// Displaying a marker and info bubble

	if (value) {
		const { date: ymd, plays } = value;
		y = getYBottomPosition(plays) + infoVerticalOffset;

		const date = dateFromYmd(ymd);
		x = Math.min(maxX, getXPositionFromDate(date) + infoHorizontalOffset - scrollLeft);

		if (language === "da") {
			const playsName = plays === 1 ? "afspilning" : "afspilninger";
			playInfoString = `${plays} ${playsName} d. ${formatDate(date, language)}`;
		} else {
			const playsName = plays === 1 ? "play" : "plays";
			playInfoString = `${plays} ${playsName} on ${formatDate(date, language)}`;
		}
	}

	return (
		<div
			className={infoClassName}
			style={{ left: `${x}px`, bottom: `${y}px` }}
		>
			{ !isSingle ? (
				<ul className={styles.tracks}>
					{ titles.map((title, i) => (
						<li key={indexes[i]}>{ title }</li>
					)) }
				</ul>
			) : null }
			<p className={styles.playInfo}>
				{ playInfoString }
			</p>
		</div>
	);
}

ChartHighlightInfo.propTypes = {
	isSingle: PropTypes.bool.isRequired,
	value: PropTypes.shape({
		date: PropTypes.string,
		plays: PropTypes.number,
		titles: PropTypes.array
	})
};

ChartHighlightInfo.defaultProps = {
	isSingle: false,
	value: null
};

export default ChartHighlightInfo;
