import React, { useContext } from "react";
import PropTypes from "prop-types";

import ChartContext from "./ChartContext";
import { dateFromYmd, formatDate } from "../lib/time";

import styles from "./ChartHighlightInfo.module.css";

const infoHorizontalOffset = -16;
const infoVerticalOffset = 20;

function ChartHighlightInfo({ isSingle, value }) {
	const {
		config,
		getXPositionFromDate,
		getYBottomPosition,
		getYPosition
	} = useContext(ChartContext);

	const { language } = config;

	// Return an element even if no value, for performance reasons

	let playInfoString = "";
	let infoX = 0;
	let infoY = 0;
	let markerX = 0;
	let markerY = 0;

	const titles = value?.titles || [];
	const indexes = value?.indexes || [];
	const infoClassName = value ? styles.info : [styles.info, styles.noInfo].join(" ");
	const markerClassName = value ? styles.marker : [styles.marker, styles.noMarker].join(" ");

	// Displaying a marker and info bubble

	if (value) {
		const { date: ymd, plays } = value;

		markerY = getYPosition(plays);
		infoY = getYBottomPosition(plays) + infoVerticalOffset;

		const date = dateFromYmd(ymd);
		markerX = getXPositionFromDate(date) + 0.5;
		infoX = markerX + infoHorizontalOffset;

		if (language === "da") {
			const playsName = plays === 1 ? "afspilning" : "afspilninger";
			playInfoString = `${plays} ${playsName} d. ${formatDate(date, language)}`;
		} else {
			const playsName = plays === 1 ? "play" : "plays";
			playInfoString = `${plays} ${playsName} on ${formatDate(date, language)}`;
		}
	}

	return (
		<>
			<div
				className={infoClassName}
				style={{ left: `${infoX}px`, bottom: `${infoY}px` }}
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
			<div
				className={markerClassName}
				style={{ left: `${markerX}px`, top: `${markerY}px` }}
			/>
		</>
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
