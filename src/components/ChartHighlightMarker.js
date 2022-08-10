import React, { useContext } from "react";
import PropTypes from "prop-types";

import ChartContext from "./ChartContext";

import styles from "./ChartHighlightMarker.module.css";

function ChartHighlightMarker({ value }) {
	const { getXPositionFromYmd, getYPosition } = useContext(ChartContext);

	// Return an element even if no value, for performance reasons

	let x = 0;
	let y = 0;

	// Displaying a marker and info bubble

	if (value) {
		const { date: ymd, plays } = value;
		y = getYPosition(plays);
		x = getXPositionFromYmd(ymd) + 0.5;
	}

	const className = value ? styles.marker : [styles.marker, styles.noMarker].join(" ");

	return (
		<div
			className={className}
			style={{ left: `${x}px`, top: `${y}px` }}
		/>
	);
}

ChartHighlightMarker.propTypes = {
	value: PropTypes.shape({
		date: PropTypes.string,
		plays: PropTypes.number
	})
};

ChartHighlightMarker.defaultProps = {
	isSingle: false,
	value: null
};

export default ChartHighlightMarker;
