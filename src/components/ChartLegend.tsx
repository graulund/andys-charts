import { useContext } from "react";

import ChartContext, { ChartContextContent } from "./ChartContext";
import TrackTitleDisplay from "./TrackTitleDisplay";
import { classNames } from "../lib/classNames";
import { ChartLegendTrackItem } from "../lib/types";

import styles from "./ChartLegend.module.css";

interface ChartLegendProps {
	tracks: ChartLegendTrackItem[];
}

/**
 * Renders the legend under the chart, with the user allowed to highlight
 * a single set of data points
 */
function ChartLegend({ tracks }: ChartLegendProps) {
	const {
		config,
		highlightedIndex,
		setHighlightedIndex // set highlighted dataset
	} = useContext(ChartContext) as ChartContextContent;

	const { dark, isSingle, language, linkMainClassName } = config;

	if (isSingle) {
		return null;
	}

	const itemClassName = classNames(styles.item, dark && styles.darkItem);

	const mainClassName = classNames(styles.itemMain, linkMainClassName);

	return (
		<div className={styles.legend} role="group" aria-label="Chart legend">
			<ul className={styles.list}>
				{tracks.map(({ artists, color, index, title, url }) => {
					const leave = () => {
						if (highlightedIndex === index) {
							setHighlightedIndex(undefined);
						}
					};

					const ItemComponent = url ? "a" : "button";
					const itemProps = url
						? { href: url }
						: { type: "button" as const };

					return (
						<li className={styles.listItem} key={index}>
							<ItemComponent
								className={itemClassName}
								{...itemProps}
								style={{ borderColor: color }}
								onPointerEnter={() =>
									setHighlightedIndex(index)
								}
								onPointerLeave={leave}
								onFocus={() => setHighlightedIndex(index)}
								onBlur={leave}
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
				})}
			</ul>
		</div>
	);
}

export default ChartLegend;
