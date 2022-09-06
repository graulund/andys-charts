import React, { useContext } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

import ChartContext from "./ChartContext";
import TrackTitleDisplay from "./TrackTitleDisplay";

import styles from "./ChartLegend.module.css";

function ChartLegend({ tracks }) {
	const {
		config,
		highlightedIndex,
		setHighlightedIndex // set highlighted dataset
	} = useContext(ChartContext);

	const { dark, isSingle, language, linkMainClassName } = config;

	if (isSingle) {
		return null;
	}

	const itemClassName = clsx(styles.item, {
		[styles.darkItem]: dark
	});

	const mainClassName = clsx(styles.itemMain, linkMainClassName);

	return (
		<div className={styles.legend} aria-label="Legend">
			<ul className={styles.list}>
				{ tracks.map(({ artists, color, index, title, url }) => {
					const mouseOut = () => {
						if (highlightedIndex === index) {
							setHighlightedIndex(null);
						}
					};

					const ItemComponent = url ? "a" : "span";
					const itemProps = url ? { href: url } : {};

					return (
						<li className={styles.listItem} key={index}>
							<ItemComponent
								className={itemClassName}
								{...itemProps}
								style={{ borderColor: color }}
								onMouseOver={() => setHighlightedIndex(index)}
								onMouseOut={mouseOut}
							>
								<TrackTitleDisplay
									artists={artists}
									dark={dark}
									language={language}
									mainClassName={mainClassName}
									title={title}
								/>
							</ItemComponent>
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
