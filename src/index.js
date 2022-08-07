import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import App from "./components/App";

import { unpackDataPointsInDataSets } from "./lib/chartData";

document.addEventListener("DOMContentLoaded", () => {
	const data = window.chartData;

	if (data) {
		const { config, dataSets } = data;
		const root = ReactDOM.createRoot(document.getElementById("root"));
		root.render(
			<React.StrictMode>
				<App
					config={config}
					dataSets={unpackDataPointsInDataSets(dataSets)}
				/>
			</React.StrictMode>
		);
	}
});
