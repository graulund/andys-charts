import { useContext } from "react";
import clsx from "clsx";

import ChartContext, { ChartContextContent } from "./ChartContext";
import { dateFromYmd, formatDate } from "../lib/time";
import { ChartDataPointTitles } from "../lib/types";

import styles from "./ChartHighlightInfo.module.css";

const infoHorizontalOffset = -16;
const infoVerticalOffset = 20;
const windowWidthBuffer = 250;

interface ChartHighlightInfoProps {
	value?: ChartDataPointTitles
}

/** Renders an info bubble, displaying additional info about a specific data point */
function ChartHighlightInfo({ value }: ChartHighlightInfoProps) {
	const {
		config,
		getXPositionFromDate,
		getYBottomPosition,
		scrollLeft
	} = useContext(ChartContext) as ChartContextContent;

	const { isSingle, language } = config;

	// Return an element even if no value, for performance reasons

	let playInfoString = "";
	let x = 0;
	let y = 0;

	const titles = value?.titles || [];
	const indexes = value?.indexes || [];
	const maxX = window.innerWidth - windowWidthBuffer;

	const infoClassName = clsx(styles.info, {
		[styles.noInfo]: !value
	});

	// Rendering an info bubble

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

ChartHighlightInfo.defaultProps = {
	value: null
};

export default ChartHighlightInfo;
