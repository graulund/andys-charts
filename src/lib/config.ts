interface ChartConfig {
	readonly backgroundColor: string,
	readonly chartBottomHeight: number,
	readonly chartHeight: number,
	readonly chartLeftWidth: number,
	readonly chartTopHeight: number,
	readonly chartWidth: number,
	readonly dark: boolean,
	readonly dataMaskId: string,
	readonly fillOpacity: number,
	readonly isSingle: boolean,
	readonly language: string,
	readonly linkMainClassName: string,
	readonly maxDays: number,
	readonly maxEndPaddingDays: number,
	readonly minDays: number,
	readonly minMaxPlays: number,
	readonly minValues: number,
	readonly overrideEndYmd: string,
	readonly overrideStartYmd: string,
	readonly showEndFirst: boolean,
	readonly singleColor: string,
	readonly singleFillOpacity: number,
	readonly todayYmd: string,
	readonly colors: string[]
}

export const defaultConfig: ChartConfig = {
	backgroundColor: "#fff",
	chartBottomHeight: 14,
	chartHeight: 145,
	chartLeftWidth: 18,
	chartTopHeight: 4,
	chartWidth: 1000,
	dark: false,
	dataMaskId: "andy-chart-data-mask",
	fillOpacity: .4,
	isSingle: false,
	language: "da",
	linkMainClassName: "",
	maxDays: 183,
	maxEndPaddingDays: 5,
	minDays: 10,
	minMaxPlays: 4,
	minValues: 2,
	overrideEndYmd: "",
	overrideStartYmd: "",
	showEndFirst: true,
	singleColor: "#3faa9e",
	singleFillOpacity: .4,
	todayYmd: "",
	colors: [
		"#3faa9e", // Seafoam
		"#b7000c", // Red
		"#009107", // Green
		"#2d61c1", // Blue
		"#adb100", // Yellow
		"#b70097", // Purple
		"#666" // Grey
	]
};