import { useContext } from "react";
import clsx from "clsx";

import ChartContext, { ChartContextContent } from "./ChartContext";
import TrackTitleDisplay from "./TrackTitleDisplay";
import { ChartLegendTrackItem } from "../lib/types";

import styles from "./ChartLegend.module.css";

interface ChartLegendProps {
	tracks: ChartLegendTrackItem[];
}

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
							setHighlightedIndex(undefined);
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

export default ChartLegend;
