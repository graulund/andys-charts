import React, { useContext, useEffect } from "react";

import ChartContext, { ChartContextContent } from "./ChartContext";

import styles from "./ChartScrollContainer.module.css";

interface ChartScrollContainerProps {
	children: React.ReactNode;
}

/**
 * Renders a container that allows the chart to be scrolled horizontally in narrow viewports
 */
function ChartScrollContainer({ children }: ChartScrollContainerProps) {
	const {
		config,
		mainAreaWidth,
		scrollContainerRef,
		setHighlightedX,
		setHighlightedValueKey
	} = useContext(ChartContext) as ChartContextContent;
	const { showEndFirst } = config;

	useEffect(() => {
		const el = scrollContainerRef.current;

		if (!el) {
			return;
		}

		// On mount, scroll all the way to the right, if you prefer it

		if (showEndFirst) {
			const { width } = el.getBoundingClientRect();
			const endPos = mainAreaWidth - width;

			if (endPos > 0) {
				el.scrollTo(endPos, 0);
			}
		}
	}, [mainAreaWidth, scrollContainerRef, showEndFirst]);

	return (
		<div
			className={styles.scrollContainer}
			data-testid="chart-scroll-container"
			ref={scrollContainerRef}
			onScroll={() => {
				setHighlightedX(null);
				setHighlightedValueKey(null);
			}}
		>
			{children}
		</div>
	);
}

export default ChartScrollContainer;
