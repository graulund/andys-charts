export default function range(start, end) {
	// Both values inclusive
	const size = end - start;
	return [...Array(1 + size).keys()].map(i => i + start);
}
