export default function range(start, end) {
	const size = end - start;
	return [...Array(1 + size).keys()].map(i => i + start);
}
