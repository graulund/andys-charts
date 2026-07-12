function niceStep(roughStep: number) {
	const power = 10 ** Math.floor(Math.log10(roughStep));
	const normalized = roughStep / power;

	if (normalized <= 1) {
		return power;
	}

	if (normalized <= 2) {
		return 2 * power;
	}

	if (normalized <= 5) {
		return 5 * power;
	}

	return 10 * power;
}

/** Returns a compact set of readable ticks that always includes both endpoints. */
export function getValueTicks(
	minValue: number,
	maxValue: number,
	targetCount = 5
) {
	if (maxValue <= minValue) {
		return [minValue];
	}

	const step = niceStep((maxValue - minValue) / Math.max(1, targetCount));
	const ticks = [minValue];
	let value = Math.ceil((minValue + Number.EPSILON) / step) * step;

	while (value < maxValue) {
		if (value > minValue) {
			ticks.push(value);
		}
		value += step;
	}

	if (ticks.at(-1) !== maxValue) {
		ticks.push(maxValue);
	}

	return ticks;
}
