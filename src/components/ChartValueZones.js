import React, { useContext } from "react";
import PropTypes from "prop-types";

import ChartContext from "./ChartContext";

import styles from "./ChartValueZones.module.css";

function ChartValueZones({ values }) {
	const {
		config,
		getXPositionFromYmd,
		getYPosition,
		highlightedValueKey,
		setHighlightedValueKey,
		unitWidth,
		unitHeight
	} = useContext(ChartContext);

	if (!values?.length) {
		return null;
	}

	const { chartWidth } = config;
	const valueZoneLeftMargin = -.5 * unitWidth;

	return (
		<div className={styles.root}>
			{ values.map(({ date: ymd, plays }) => {
				const y = getYPosition(plays);
				const x = getXPositionFromYmd(ymd);
				const key = `${ymd}:${plays}`;

				const mouseOut = () => {
					if (highlightedValueKey === key) {
						setHighlightedValueKey(null);
					}
				};

				// Prevent width overflow
				const overflow = Math.max(0, x + unitWidth + valueZoneLeftMargin - chartWidth);

				return (
					<div
						className={styles.zone}
						onMouseOver={() => setHighlightedValueKey(key)}
						onMouseOut={mouseOut}
						style={{
							left: `${x}px`,
							top: `${y}px`,
							width: `${unitWidth - overflow}px`,
							height: `${unitHeight}px`,
							marginTop: `${-.5 * unitHeight}px`,
							marginLeft: `${valueZoneLeftMargin}px`,
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
