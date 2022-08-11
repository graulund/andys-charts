import React, { useContext } from "react";
import PropTypes from "prop-types";

import ChartContext from "./ChartContext";
import TrackTitleDisplay from "./TrackTitleDisplay";

import styles from "./ChartLegend.module.css";

function ChartLegend({ tracks }) {
	const {
		config,
		highlightedIndex,
		setHighlightedIndex // set highlighted dataset
	} = useContext(ChartContext);

	if (tracks.length <= 1) {
		return null;
	}

	const { language, linkMainClassName } = config;

	const mainClassList = [styles.itemMain];

	if (linkMainClassName) {
		mainClassList.push(linkMainClassName);
	}

	const mainClassName = mainClassList.join(" ");

	return (
		<div className={styles.legend} aria-label="Legend">
			<ul className={styles.list}>
				{ tracks.map(({ artists, color, index, title, url }) => {
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
								<TrackTitleDisplay
									artists={artists}
									language={language}
									mainClassName={mainClassName}
									title={title}
								/>
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
		artists: PropTypes.object,
		color: PropTypes.string,
		index: PropTypes.number,
		title: PropTypes.string,
		url: PropTypes.string
	})).isRequired
};

export default ChartLegend;
