import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { path } from "d3-path";

import ChartContext, { ChartContextContent } from "./ChartContext";

import {
	dateFromYmd,
	formatYearMonth,
	getAllMonthsBetweenDates,
	YearMonthFormattingStyle
} from "../lib/time";

import styles from "./ChartAxes.module.css";

const tickTextOffsetTop = 12;
const tickTextMinRightPadding = 8;

/** Renders the time (x) axis of the chart; with a variable amount of labels */
function ChartTimeAxis() {
	const firstLabelEl = useRef<SVGTextElement>(null);
	const [hideFirstLabel, setHideFirstLabel] = useState(false);

	const {
		config,
		firstDate,
		getXPositionFromDate,
		lastDate,
		mainAreaWidth,
		mainAreaHeight
	} = useContext(ChartContext) as ChartContextContent;

	const {
		chartLeftWidth: offsetLeft,
		chartTopHeight: offsetTop,
		dark,
		language
	} = config;

	// Horizontal axis line
	const axisPath = path();
	axisPath.moveTo(offsetLeft, offsetTop + mainAreaHeight);
	axisPath.lineTo(offsetLeft + mainAreaWidth, offsetTop + mainAreaHeight);

	const start = dateFromYmd(firstDate);
	const months = getAllMonthsBetweenDates(firstDate, lastDate);
	const monthCount = months.length;
	let monthFormatStyle: YearMonthFormattingStyle = "normal";

	// TODO: This should depend on chart width
	// (on 700px chart width, 16-ish months (or maybe even less) should be tiny)

	if (monthCount >= 20) {
		monthFormatStyle = "tiny";
	} else if (monthCount >= 12) {
		monthFormatStyle = "small";
	}

	const calculateTickPos = useCallback(
		(ymd: string) => {
			const monthDate = new Date(Math.max(
				start.getTime(), dateFromYmd(ymd).getTime()
			));

			return getXPositionFromDate(monthDate);
		},
		[start, getXPositionFromDate]
	);

	// Detect if there's not enough space for the first time label
	// This will happen if the first month is a partial month
	// If we don't hide the first label, there will be a nasty looking double label overlap

	useEffect(() => {
		const el = firstLabelEl.current;
		const firstMonth = months[0];
		const nextMonth = months[1];

		if (!el || !firstMonth || !nextMonth) {
			setHideFirstLabel(false);
			return;
		}

		const { width: actualWidth } = el.getBBox();
		const firstTickPos = calculateTickPos(firstMonth.ymd);
		const nextTickPos = calculateTickPos(nextMonth.ymd);
		const spaceWidth = nextTickPos - firstTickPos;
		setHideFirstLabel(actualWidth >= spaceWidth + tickTextMinRightPadding);
	}, [calculateTickPos, firstLabelEl, months]);

	const lineClassName = clsx(styles.axisLine, {
		[styles.darkAxisLine]: dark
	});

	return (
		<>
			<path className={lineClassName} d={axisPath.toString()} />
			{ months.map(({ year, month, ymd }, index) => {
				// Render each tick, and tick value
				const tickPos = calculateTickPos(ymd);
				const tickPath = path();
				tickPath.moveTo(tickPos, offsetTop);
				tickPath.lineTo(tickPos, offsetTop + mainAreaHeight);

				const prevMonth = index > 1 || !hideFirstLabel ? months[index - 1] : undefined;

				const label = formatYearMonth(
					year, month, prevMonth?.year || 0, language, monthFormatStyle
				);

				const labelClassName = clsx(styles.axisLabel, {
					[styles.darkAxisLabel]: dark,
					[styles.hiddenLabel]: index === 0 && hideFirstLabel
				});

				return (
					<React.Fragment key={ymd}>
						<path className={lineClassName} d={tickPath.toString()} />
						<text
							className={labelClassName}
							x={tickPos}
							y={offsetTop + mainAreaHeight + tickTextOffsetTop}
							ref={index === 0 ? firstLabelEl : undefined}
						>
							{ label }
						</text>
					</React.Fragment>
				);
			}) }
		</>
	);
}

export default ChartTimeAxis;
