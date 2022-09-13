import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import Chart from "./components/Chart";

import { unpackDataPointsInDataSets } from "./lib/compression";
import { CompressedChartData } from "./lib/types";

let rendered = false;

declare global {
	interface Window { createAndyCharts: any; }
}

window.createAndyCharts = function (chartData: CompressedChartData, rootQuerySelector: string) {
	if (rendered) {
		console.warn("Tried to create Andy charts, but they were already rendered");
		return;
	}

	const { config, dataSets } = chartData;

	const rootEl = document.querySelector(
		rootQuerySelector || ".andy-chart-root"
	);

	if (!rootEl) {
		console.warn("Could not initialize Andy charts because the root element did not exist");
		return;
	}

	const root = ReactDOM.createRoot(rootEl);

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
