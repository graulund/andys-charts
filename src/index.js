import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import Chart from "./components/Chart";

import { unpackDataPointsInDataSets } from "./lib/chartData";

document.addEventListener("DOMContentLoaded", () => {
	const data = window.chartData;

	if (data) {
		const { config, dataSets } = data;
		const root = ReactDOM.createRoot(document.querySelector(".andy-chart-container"));
		root.render(
			<React.StrictMode>
				<Chart
					config={config}
					dataSets={unpackDataPointsInDataSets(dataSets)}
				/>
			</React.StrictMode>
		);
	}
});
