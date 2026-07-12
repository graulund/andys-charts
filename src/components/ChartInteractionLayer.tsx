import { PointerEvent, useContext, useMemo } from "react";

import ChartContext, { ChartContextContent } from "./ChartContext";
import { ChartDataPointValues } from "../lib/types";
import { dateFromYmd, offsetDate, ymdFromDate } from "../lib/time";

import styles from "./ChartInteractionLayer.module.css";

interface ChartInteractionLayerProps {
	values: ChartDataPointValues[];
}

/** Resolves pointer coordinates to the nearest interactive chart value. */
function ChartInteractionLayer({ values }: ChartInteractionLayerProps) {
	const {
		config: { chartTopHeight },
		firstDate,
		getXPositionFromYmd,
		getYPosition,
		mainAreaHeight,
		mainAreaWidth,
		scrollContainerRef,
		setHighlightedX,
		setHighlightedValueKey,
		totalDays,
		unitHeight
	} = useContext(ChartContext) as ChartContextContent;

	const valuesByDate = useMemo(() => {
		return values.reduce<Map<string, ChartDataPointValues[]>>(
			(map, value) => {
				const dateValues = map.get(value.date) || [];
				dateValues.push(value);
				map.set(value.date, dateValues);
				return map;
			},
			new Map()
		);
	}, [values]);

	const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
		if (event.pointerType === "touch") {
			setHighlightedX(null);
			setHighlightedValueKey(null);
			return;
		}

		const bounds = event.currentTarget.getBoundingClientRect();
		const x = event.clientX - bounds.left;
		const y = event.clientY - bounds.top;
		const day = Math.max(
			0,
			Math.min(totalDays, Math.round((x / mainAreaWidth) * totalDays))
		);
		const date = ymdFromDate(offsetDate(dateFromYmd(firstDate), day));
		const nearest = (valuesByDate.get(date) || [])
			.map((value) => ({
				value,
				distance: Math.abs(getYPosition(value.plays) - y)
			}))
			.filter(({ distance }) => distance <= unitHeight / 2)
			.sort((a, b) => a.distance - b.distance)[0]?.value;

		setHighlightedValueKey(nearest?.valueKey || null);

		if (nearest && scrollContainerRef.current) {
			const viewport = scrollContainerRef.current;
			setHighlightedX(
				viewport.offsetLeft +
					getXPositionFromYmd(nearest.date) -
					viewport.scrollLeft
			);
		} else {
			setHighlightedX(null);
		}
	};

	const clearHighlight = () => {
		setHighlightedX(null);
		setHighlightedValueKey(null);
	};

	return (
		<div
			className={styles.layer}
			data-testid="chart-interaction-layer"
			style={{
				width: `${mainAreaWidth}px`,
				height: `${chartTopHeight + mainAreaHeight}px`
			}}
			onPointerMove={onPointerMove}
			onPointerLeave={clearHighlight}
		/>
	);
}

export default ChartInteractionLayer;
