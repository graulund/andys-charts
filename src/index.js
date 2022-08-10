import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import Chart from "./components/Chart";

import { unpackDataPointsInDataSets } from "./lib/chartData";

let rendered = false;

window.createAndyCharts = function (chartData, rootQuerySelector) {
	if (rendered) {
		console.warn("Tried to create Andy charts, but they were already rendered");
		return;
	}

	const { config, dataSets } = chartData;

	const root = ReactDOM.createRoot(document.querySelector(
		rootQuerySelector || ".andy-chart-root"
	));

	root.render(
		<React.StrictMode>
			<Chart
				config={config}
				dataSets={unpackDataPointsInDataSets(dataSets)}
			/>
		</React.StrictMode>
	);

	rendered = true;
};
