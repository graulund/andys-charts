import "./Chart.css";
import React from "react";
import PropTypes from "prop-types";

import ChartItem from "./ChartItem";
import ChartTimeAxis from "./ChartTimeAxis";
import ChartValueAxis from "./ChartValueAxis";
import { maxPlays, padChartData } from "../lib/chartData";

const chartWidth = 1000;
const chartHeight = 145;
const minMaxPlays = 4;
const chartTopHeight = 4;
const chartBottomHeight = 14;
const chartLeftWidth = 18;
const mainAreaWidth = chartWidth - chartLeftWidth;
const mainAreaHeight = chartHeight - chartTopHeight - chartBottomHeight;

function Chart({ dataItems }) {
	if (!dataItems?.length) {
		return null;
	}

	const displayItems = dataItems.map((data) => padChartData(data));
	const maxValues = displayItems.map((list) => maxPlays(list));
	const maxValue = Math.max(minMaxPlays, ...maxValues);

	const firstDataset = displayItems[0];
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
				{ displayItems.map((data, i) => {
					return (
						<ChartItem
							data={data}
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
	dataItems: PropTypes.array.isRequired
};

export default Chart;
