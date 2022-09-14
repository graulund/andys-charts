import React, { useCallback, useMemo } from "react";

import ChartContext, { ChartContextContent, ChartContextData } from "./ChartContext";
import { dateFromYmd, daysBetweenDates } from "../lib/time";

interface ChartDataProps extends ChartContextData {
	children: React.ReactNode;
}

/**
 * This chart data wrapper component surrounds the entire chart and creates a React context,
 * calculates the context values, providing the data to the individual chart components.
 */
function ChartData({ children, ...data }: ChartDataProps) {
	const {
		config,
		firstDate,
		mainAreaHeight,
		mainAreaWidth,
		minValue,
		maxValue,
		totalDays
	} = data;

	const {
		chartBottomHeight: offsetBottom,
		chartLeftWidth: offsetLeft,
		chartTopHeight: offsetTop,
	} = config;

	const start = useMemo(() => dateFromYmd(firstDate), [firstDate]);

	// Calculating coords functions

	const unitWidth = 1 / totalDays * mainAreaWidth;
	const unitHeight = 1 / maxValue * mainAreaHeight;

	const getYPosition = useCallback(
		(val: number) => {
			// const percY = (maxValue - val) / maxValue;
			const perc = 1 - (val - minValue) / (maxValue - minValue);
			return offsetTop + perc * mainAreaHeight;
		},
		[mainAreaHeight, minValue, maxValue, offsetTop]
	);

	const getYBottomPosition = useCallback(
		(val: number) => {
			const perc = 1 - (val - minValue) / (maxValue - minValue);
			return offsetBottom + (1 - perc) * mainAreaHeight;
		},
		[mainAreaHeight, minValue, maxValue, offsetBottom]
	);

	const getXPositionFromDaysSinceStart = useCallback(
		(days: number) => {
			const perc = days / totalDays;
			return offsetLeft + perc * mainAreaWidth;
		},
		[mainAreaWidth, offsetLeft, totalDays]
	);

	const getXPositionFromDate = useCallback(
		(date: Date) => {
			const days = daysBetweenDates(start, date);
			return getXPositionFromDaysSinceStart(days);
		},
		[getXPositionFromDaysSinceStart, start]
	);

	const getXPositionFromYmd = useCallback(
		(ymd: string) => getXPositionFromDate(dateFromYmd(ymd)),
		[getXPositionFromDate]
	);

	// Add the functions to the context, along with the passed data

	const contextData: ChartContextContent = useMemo(() => ({
		...data,
		getXPositionFromDate,
		getXPositionFromDaysSinceStart,
		getXPositionFromYmd,
		getYBottomPosition,
		getYPosition,
		unitHeight,
		unitWidth
	}), [
		data,
		getXPositionFromDate,
		getXPositionFromDaysSinceStart,
		getXPositionFromYmd,
		getYBottomPosition,
		getYPosition,
		unitHeight,
		unitWidth
	]);

	return (
		<ChartContext.Provider value={contextData}>
			{ children }
		</ChartContext.Provider>
	);
}

export default ChartData;
