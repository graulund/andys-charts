import React, { useContext } from "react";
import PropTypes from "prop-types";

import ChartContext from "./ChartContext";

import styles from "./ChartLegend.module.css";

function ChartLegend({ tracks }) {
	const {
		highlightedIndex,
		setHighlightedIndex // set highlighted dataset
	} = useContext(ChartContext);

	if (tracks.length <= 1) {
		return null;
	}

	return (
		<div className={styles.legend} aria-label="Legend">
			<ul className={styles.list}>
				{ tracks.map(({ color, index, title, url }) => {
					const mouseOut = () => {
						if (highlightedIndex === index) {
							setHighlightedIndex(null);
						}
					};

					return (
						<li className={styles.listItem} key={index}>
							<a
								className={styles.item}
								href={url}
								style={{ borderColor: color }}
								onMouseOver={() => setHighlightedIndex(index)}
								onMouseOut={mouseOut}
							>
								{ title }
							</a>
						</li>
					);
				}) }
			</ul>
		</div>
	);
}

ChartLegend.propTypes = {
	tracks: PropTypes.arrayOf(PropTypes.shape({
		color: PropTypes.string,
		index: PropTypes.number,
		title: PropTypes.string,
		url: PropTypes.string
	})).isRequired
};

export default ChartLegend;
