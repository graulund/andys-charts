/** Minimal straight-line SVG path builder used by the chart and axes. */
export function createSvgPath() {
	const commands: string[] = [];

	return {
		moveTo(x: number, y: number) {
			commands.push(`M${x},${y}`);
		},
		lineTo(x: number, y: number) {
			commands.push(`L${x},${y}`);
		},
		closePath() {
			commands.push("Z");
		},
		toString() {
			return commands.join("");
		}
	};
}
