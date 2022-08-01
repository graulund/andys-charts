import "./Chart.css";
import React from "react";
import PropTypes from "prop-types";
import { path } from "d3-path";

import { maxPlays, padChartData } from "../lib/chartData";
import { ymFromDate } from "../lib/time";

const chartWidth = 1000;
const chartHeight = 145;
const minMaxPlays = 4;

function Chart({ data }) {
	if (!data?.length) {
		return null;
	}

	const displayData = padChartData(data);
	const numDays = displayData.length;
	const max = Math.max(minMaxPlays, maxPlays(displayData));
	const months = new Set();

	const p = path();
	p.moveTo(0, chartHeight);

	displayData.forEach(({ date, plays }, index) => {
		// Months
		months.add(ymFromDate(date));

		// Path
		const percY = (max - plays) / max;
		const y = percY * chartHeight;
		const percX = index / numDays;
		const x = percX * chartWidth;

		p.lineTo(x, y);
	});

	console.log("months", months);

	const linePath = p.toString();
	p.closePath();
	const areaPath = p.toString();

	return (
		<div className="chart">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
				<path d={areaPath} fill="#84e4d9" />
				<path d={linePath} strokeWidth="2" stroke="#3faa9e" fill="transparent" />
			</svg>
		</div>
	);
}

Chart.propTypes = {
	data: PropTypes.arrayOf(PropTypes.shape({
		date: PropTypes.string,
		plays: PropTypes.number
	})).isRequired
};

export default Chart;
