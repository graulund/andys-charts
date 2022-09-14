import { useContext } from "react";

import ChartContext, { ChartContextContent } from "./ChartContext";
import { ChartDataPointValues } from "../lib/types";

import styles from "./ChartValueZones.module.css";

interface ChartValueZonesProps {
	values: ChartDataPointValues[];
}

/**
 * Renders "value zones" over the chart area: One zone for each point value
 * (a combination of time and play value) occurring in the chart. This allows
 * a user to see more information about the values as they move their pointer
 * over the various value zones.
 */
function ChartValueZones({ values }: ChartValueZonesProps) {
	const {
		config,
		getXPositionFromYmd,
		getYPosition,
		highlightedValueKey,
		setHighlightedValueKey,
		unitWidth,
		unitHeight
	} = useContext(ChartContext) as ChartContextContent;

	if (!values?.length) {
		return null;
	}

	const { chartWidth } = config;
	const valueZoneLeftMargin = -.5 * unitWidth;

	return (
		<div>
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

export default ChartValueZones;
