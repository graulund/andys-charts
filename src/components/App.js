import PropTypes from "prop-types";

import Chart from "./Chart";
import dataSoldier from "../data/Soldier.json";
import dataTiger from "../data/Tiger.json";
import dataWeirdo from "../data/Weirdo.json";

import "./App.css";

function App({ config, dataSets }) {
	return (
		<div className="App">
			<Chart config={config} dataSets={dataSets} />
		</div>
	);
}

Chart.propTypes = {
	config: PropTypes.object,
	dataSets: PropTypes.array.isRequired
};

Chart.defaultProps = {
	config: null
};

export default App;
