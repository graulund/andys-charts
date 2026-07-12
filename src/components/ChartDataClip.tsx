import { useContext } from "react";

import ChartContext, { ChartContextContent } from "./ChartContext";

const extraTopSpace = 2;

/** Clips data strokes and fills to the plot area. */
function ChartDataClip() {
	const {
		clipPathId,
		config: { chartTopHeight: offsetTop },
		mainAreaHeight,
		mainAreaWidth
	} = useContext(ChartContext) as ChartContextContent;

	return (
		<clipPath id={clipPathId}>
			<rect
				x={0}
				y={offsetTop - extraTopSpace}
				width={mainAreaWidth}
				height={mainAreaHeight + extraTopSpace}
			/>
		</clipPath>
	);
}

export default ChartDataClip;
