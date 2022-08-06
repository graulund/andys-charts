import React, { useContext } from "react";

import ChartContext from "./ChartContext";

const extraTopSpace = 2; // pixels: To allow for stroke edges to peek out over the top

function ChartDataMask() {
	const {
		config,
		mainAreaWidth,
		mainAreaHeight
	} = useContext(ChartContext);

	const {
		chartLeftWidth: offsetLeft,
		chartTopHeight: offsetTop,
		chartHeight,
		chartWidth,
		dataMaskId
	} = config;

	// First, mask off everything, then allow stuff (roughly) within the main data area

	return (
		<mask id={dataMaskId}>
			<rect
				x={0}
				y={0}
				width={chartWidth}
				height={chartHeight}
				fill="#000"
			/>
			<rect
				x={offsetLeft}
				y={offsetTop - extraTopSpace}
				width={mainAreaWidth}
				height={mainAreaHeight + extraTopSpace}
				fill="#fff"
			/>
		</mask>
	);
}

export default ChartDataMask;
