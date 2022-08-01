import "./App.css";

import Chart from "./Chart";
import dataSoldier from "../data/Soldier.json";
import dataTiger from "../data/Tiger.json";
import dataWeirdo from "../data/Weirdo.json";

function App() {
	// eslint-disable-next-line no-restricted-globals
	const params = location.search ? new URLSearchParams(location.search.substr(1)) : null;
	const trackTitle = params?.get("track") || "";
	let data = dataWeirdo;

	if (trackTitle === "Soldier") {
		data = dataSoldier;
	} else if (trackTitle === "Tiger") {
		data = dataTiger;
	}

	return (
		<div className="App">
			<Chart data={data} />
		</div>
	);
}

export default App;
