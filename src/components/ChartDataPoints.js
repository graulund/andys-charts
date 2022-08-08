import React from "react";
import PropTypes from "prop-types";

import ChartDataPointsSegment from "./ChartDataPointsSegment";
import { getPaddedDataPointSegments } from "../lib/chartData";

function ChartDataPoints({ color, dataPoints, index }) {
	if (!dataPoints?.length) {
		return null;
	}

	// Data is assumed to be padded here!
	// Split into area chart segments
	const segments = getPaddedDataPointSegments(dataPoints);

	return segments.map((segment, segmentIndex) => (
		<ChartDataPointsSegment
			color={color}
			dataPoints={segment}
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
	index: PropTypes.number.isRequired
};

export default ChartDataPoints;
