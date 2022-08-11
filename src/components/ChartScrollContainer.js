import React, { useContext, useEffect, useRef } from "react";
import PropTypes from "prop-types";

import ChartContext from "./ChartContext";

import styles from "./ChartScrollContainer.module.css";

function ChartScrollContainer({ children }) {
	const containerEl = useRef(null);

	const { config, setScrollLeft } = useContext(ChartContext);
	const { chartWidth, showEndFirst } = config;

	const onScroll = () => {
		const el = containerEl.current;

		if (!el) {
			return;
		}

		setScrollLeft(el.scrollLeft);
	};

	useEffect(() => {
		const el = containerEl.current;

		if (!el) {
			return;
		}

		// On mount, scroll all the way to the right, if you prefer it

		if (showEndFirst) {
			const { width } = el.getBoundingClientRect();
			const endPos = chartWidth - width;

			if (endPos > 0) {
				el.scrollTo(endPos, 0);
			}
		}

		el.addEventListener("scroll", onScroll);

		return () => el.removeEventListener("scroll", onScroll);

		// (Should only run on mount)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className={styles.scrollContainer} ref={containerEl}>
			{ children }
		</div>
	);
}

ChartScrollContainer.propTypes = {
	children: PropTypes.node.isRequired
};

export default ChartScrollContainer;
