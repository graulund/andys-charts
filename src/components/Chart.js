import "./Chart.css";
import React from "react";
import PropTypes from "prop-types";

import ChartDataPoints from "./ChartDataPoints";
import ChartTimeAxis from "./ChartTimeAxis";
import ChartValueAxis from "./ChartValueAxis";
import { maxPlays, padChartDataPointLists } from "../lib/chartData";

const chartWidth = 1000;
const chartHeight = 145;
const minMaxPlays = 4;
const chartTopHeight = 4;
const chartBottomHeight = 14;
const chartLeftWidth = 18;
const mainAreaWidth = chartWidth - chartLeftWidth;
const mainAreaHeight = chartHeight - chartTopHeight - chartBottomHeight;

function Chart({ dataPointLists }) {
	if (!dataPointLists?.length) {
		return null;
	}

	const displayLists = padChartDataPointLists(dataPointLists);
	const maxValues = displayLists.map((list) => maxPlays(list));
	const maxValue = Math.max(minMaxPlays, ...maxValues);

	const firstDataset = displayLists[0];
	const firstDate = firstDataset[0]?.date;
	const lastDate = firstDataset[firstDataset.length - 1]?.date;

	if (!firstDate || !lastDate) {
		return null;
	}

	return (
		<div className="chart">
			<svg viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
				<ChartValueAxis
					maxValue={maxValue}
					offsetLeft={chartLeftWidth}
					offsetTop={chartTopHeight}
					areaHeight={mainAreaHeight}
				/>
				<ChartTimeAxis
					firstDate={firstDate}
					lastDate={lastDate}
					offsetLeft={chartLeftWidth}
					offsetTop={chartTopHeight}
					areaWidth={mainAreaWidth}
					areaHeight={mainAreaHeight}
				/>
				{ displayLists.map((dataPoints, i) => {
					return (
						<ChartDataPoints
							dataPoints={dataPoints}
							maxValue={maxValue}
							offsetLeft={chartLeftWidth}
							offsetTop={chartTopHeight}
							areaWidth={mainAreaWidth}
							areaHeight={mainAreaHeight}
							key={i}
						/>
					);
				}) }
			</svg>
		</div>
	);
}

Chart.propTypes = {
	dataPointLists: PropTypes.array.isRequired
};

export default Chart;
