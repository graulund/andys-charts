import React, { useCallback, useMemo } from "react";
import PropTypes from "prop-types";

import ChartContext from "./ChartContext";
import { dateFromYmd, daysBetweenDates } from "../lib/time.ts";

function ChartData({ children, ...data }) {
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
		(val) => {
			// const percY = (maxValue - val) / maxValue;
			const perc = 1 - (val - minValue) / (maxValue - minValue);
			return offsetTop + perc * mainAreaHeight;
		},
		[mainAreaHeight, minValue, maxValue, offsetTop]
	);

	const getYBottomPosition = useCallback(
		(val) => {
			const perc = 1 - (val - minValue) / (maxValue - minValue);
			return offsetBottom + (1 - perc) * mainAreaHeight;
		},
		[mainAreaHeight, minValue, maxValue, offsetBottom]
	);

	const getXPositionFromDaysSinceStart = useCallback(
		(days) => {
			const perc = days / totalDays;
			return offsetLeft + perc * mainAreaWidth;
		},
		[mainAreaWidth, offsetLeft, totalDays]
	);

	const getXPositionFromDate = useCallback(
		(date) => {
			const days = daysBetweenDates(start, date);
			return getXPositionFromDaysSinceStart(days);
		},
		[getXPositionFromDaysSinceStart, start]
	);

	const getXPositionFromYmd = useCallback(
		(ymd) => getXPositionFromDate(dateFromYmd(ymd)),
		[getXPositionFromDate]
	);

	// Add the functions to the context, along with the passed data

	const contextData = useMemo(() => ({
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

ChartData.propTypes = {
	children: PropTypes.node.isRequired,
	firstDate: PropTypes.string.isRequired,
	config: PropTypes.shape({
		chartBottomHeight: PropTypes.number,
		chartLeftWidth: PropTypes.number,
		chartTopHeight: PropTypes.number
	}).isRequired,
	mainAreaHeight: PropTypes.number.isRequired,
	mainAreaWidth: PropTypes.number.isRequired,
	maxValue: PropTypes.number.isRequired,
	totalDays: PropTypes.number.isRequired
};

export default ChartData;
