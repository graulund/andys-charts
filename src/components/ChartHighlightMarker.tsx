import { useContext } from "react";
import clsx from "clsx";

import ChartContext, { ChartContextContent } from "./ChartContext";

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

	const className = clsx(styles.marker, {
		[styles.darkMarker]: dark,
		[styles.noMarker]: !value
	});

	return (
		<div
			className={className}
			style={{ left: `${x}px`, top: `${y}px` }}
		/>
	);
}

ChartHighlightMarker.defaultProps = {
	isSingle: false,
	value: null
};

export default ChartHighlightMarker;
