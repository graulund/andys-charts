import { useContext } from "react";

import ChartContext, { ChartContextContent } from "./ChartContext";
import { classNames } from "../lib/classNames";

import styles from "./ChartHighlightMarker.module.css";
import { ChartDataPointTitles } from "../lib/types";

interface ChartHighlightMarkerProps {
	value?: ChartDataPointTitles;
}

/** Renders a point shape highlighting the data point the user is currently inspecting */
function ChartHighlightMarker({ value }: ChartHighlightMarkerProps) {
	const {
		config: { dark },
		getXPositionFromYmd,
		getYPosition
	} = useContext(ChartContext) as ChartContextContent;

	// Return an element even if no value, for performance reasons

	let x = 0;
	let y = 0;

	if (value) {
		const { date: ymd, plays } = value;
		y = getYPosition(plays);
		x = getXPositionFromYmd(ymd) + 0.5;
	}

	const className = classNames(
		styles.marker,
		dark && styles.darkMarker,
		!value && styles.noMarker
	);

	return (
		<div className={className} style={{ left: `${x}px`, top: `${y}px` }} />
	);
}

export default ChartHighlightMarker;
