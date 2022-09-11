import React, { useMemo } from "react";
import PropTypes from "prop-types";

import ChartDataPointsSegment from "./ChartDataPointsSegment";
import { getPaddedDataPointSegments } from "../lib/chartData";

function ChartDataPoints({ color, dataPoints, fillOpacity, index }) {
	// Data is assumed to be padded here!
	// Split into area chart segments

	const segments = useMemo(
		() => getPaddedDataPointSegments(dataPoints),
		[dataPoints]
	);

	return segments.map((segment, segmentIndex) => (
		<ChartDataPointsSegment
			color={color}
			dataPoints={segment}
			fillOpacity={fillOpacity}
			index={index}
			key={`${index}-${segmentIndex}`}
		/>
	));
}

ChartDataPoints.propTypes = {
	color: PropTypes.string.isRequired,
	dataPoints: PropTypes.arrayOf(PropTypes.shape({
		date: PropTypes.string,
		plays: PropTypes.number
	})).isRequired,
	fillOpacity: PropTypes.number.isRequired,
	index: PropTypes.number.isRequired
};

export default ChartDataPoints;
