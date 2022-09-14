import React from "react";

import { ChartConfig } from "../lib/config";

/**
 * Data supplied to the context from the main chart component
 */
export interface ChartContextData {
	config: ChartConfig;
	firstDate: string;
	lastDate: string;
	mainAreaHeight: number;
	mainAreaWidth: number;
	minValue: number;
	maxValue: number;
	highlightedIndex: number | undefined;
	highlightedValueKey: string | null;
	scrollLeft: number;
	setHighlightedIndex: (value: number | undefined) => void;
	setHighlightedValueKey: (value: string | null) => void;
	setScrollLeft: (value: number) => void;
	totalDays: number;
}

/**
 * All of the content in the context, including helper methods
 */
export interface ChartContextContent extends ChartContextData {
	getXPositionFromDate: (date: Date) => number;
	getXPositionFromDaysSinceStart: (days: number) => number;
	getXPositionFromYmd: (ymd: string) => number;
	getYBottomPosition: (val: number) => number;
	getYPosition: (val: number) => number;
	unitHeight: number;
	unitWidth: number;
}

/**
 * Chart context: Provides the config, along with calculated values, to the components
 */
const ChartContext = React.createContext<ChartContextContent | null>(null);
ChartContext.displayName = "ChartContext";

export default ChartContext;
