import { useContext } from "react";

import ChartContext, { ChartContextContent } from "./ChartContext";
import { classNames } from "../lib/classNames";
import { dateFromYmd, formatDate } from "../lib/time";
import { ChartDataPointTitles } from "../lib/types";

import styles from "./ChartHighlightInfo.module.css";

const infoHorizontalOffset = -16;
const infoVerticalOffset = 20;
const windowWidthBuffer = 250;

interface ChartHighlightInfoProps {
	value?: ChartDataPointTitles;
}

/** Renders an info bubble, displaying additional info about a specific data point */
function ChartHighlightInfo({ value }: ChartHighlightInfoProps) {
	const { config, getYBottomPosition, highlightedX } = useContext(
		ChartContext
	) as ChartContextContent;

	const { isSingle, language } = config;

	// Return an element even if no value, for performance reasons

	let playInfoString = "";
	let x = 0;
	let y = 0;

	const titles = value?.titles || [];
	const indexes = value?.indexes || [];
	const infoClassName = classNames(styles.info, !value && styles.noInfo);

	// Rendering an info bubble

	if (value) {
		const { date: ymd, plays } = value;
		y = getYBottomPosition(plays) + infoVerticalOffset;

		const date = dateFromYmd(ymd);
		x = (highlightedX || 0) + infoHorizontalOffset;

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
			aria-live="polite"
			aria-atomic="true"
			className={infoClassName}
			data-testid="chart-highlight-info"
			style={{
				left: `clamp(0px, ${x}px, calc(100% - ${windowWidthBuffer}px))`,
				bottom: `${y}px`
			}}
		>
			{!isSingle ? (
				<ul className={styles.tracks}>
					{titles.map((title, i) => (
						<li key={indexes[i]}>{title}</li>
					))}
				</ul>
			) : null}
			<p className={styles.playInfo}>{playInfoString}</p>
		</div>
	);
}

export default ChartHighlightInfo;
