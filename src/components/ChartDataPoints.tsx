import { useMemo } from "react";

import ChartDataPointsSegment from "./ChartDataPointsSegment";
import { getPaddedDataPointSegments } from "../lib/chartData";
import { ChartDataPoint } from "../lib/types";

interface ChartDataPointsProps {
	color: string;
	dataPoints: ChartDataPoint[];
	fillOpacity: number;
	index: number;
}

/** Renders a single set of data points */
function ChartDataPoints({
	color,
	dataPoints,
	fillOpacity,
	index
}: ChartDataPointsProps) {
	// Data is assumed to be padded here!
	// Split into area chart segments

	const segments = useMemo(
		() => getPaddedDataPointSegments(dataPoints),
		[dataPoints]
	);

	return (
		<>
			{ segments.map((segment, segmentIndex) => (
				<ChartDataPointsSegment
					color={color}
					dataPoints={segment}
					fillOpacity={fillOpacity}
					index={index}
					key={`${index}-${segmentIndex}`}
				/>
			)) }
		</>
	);
}

export default ChartDataPoints;
