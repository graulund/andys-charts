/** Represents a chart configuration, as supplied by the user */
export interface ChartConfig {
	/**
	 * The background color of the chart, supplied in a CSS-compatible format.
	 * This is required because the horizontal scrolling nature of the chart in
	 * narrow viewports employs a "sliding door" technique: The left value axis
	 * is laid on top of the main chart area, and thus needs to be opaque.
	 * Thus, it needs to have an explicit background color specified. 
	 */
	readonly backgroundColor: string,

	/**
	 * Height (in pixels) allocated for the horizontal time (x) axis
	 */
	readonly chartBottomHeight: number,

	/**
	 * Total height of the chart (in pixels), including the horizontal (x) axis
	 */
	readonly chartHeight: number,

	/**
	 * Width (in pixels) allocated for the vertical value (y) axis
	 */
	readonly chartLeftWidth: number,

	/**
	 * Vertical distance (in pixels) between the top of the main chart area and
	 * the top of the total chart area. This is usually very tiny, and only to
	 * account for the fact that the top label of the value axis peeks out over
	 * the main chart area
	 */
	readonly chartTopHeight: number,

	/**
	 * Width (in pixels) of the total chart area, including the vertical (y) axis
	 */
	readonly chartWidth: number,

	/**
	 * List of colors, in a CSS-compatible format, of the data sets, in order
	 */
	readonly colors: string[],

	/**
	 * Whether the chart has a dark background (this will enable brighter
	 * foreground colors)
	 */
	readonly dark: boolean,

	/**
	 * ID of the inner SVG chart mask element
	 */
	readonly dataMaskId: string,

	/**
	 * How opaque the fill of the areas in the chart is. A value of 0 will turn
	 * the chart into a pure line chart; no fills
	 */
	readonly fillOpacity: number,

	/**
	 * Whether or not this is intended to be a chart with only one data set:
	 * This disable the chart legend
	 */
	readonly isSingle: boolean,

	/**
	 * The language of the chart. Right now, Danish (`da`) and English (`en`)
	 * are supported values
	 */
	readonly language: "da" | "en",

	/**
	 * If you want the link elements for any track URLs supplied with the data
	 * sets to have a specific class name, you can supply this class name here
	 */
	readonly linkMainClassName: string,

	/**
	 * Maximum amount of days displayed in the chart, even if the data sets go
	 * back further (default value is 183 which is... kinda... half a year)
	 */
	readonly maxDays: number,

	/**
	 * If the data sets all end before the present day (specified by `todayYmd`
	 * in the config, and defaulting to now), display no more than this amount
	 * of empty days at the end of the chart, in order to visually communicate
	 * to the user that some time passed since the last data point
	 */
	readonly maxEndPaddingDays: number,

	/**
	 * Display no less than this amount of days even for very tiny data sets.
	 * This extra padding prevents very stretched small charts
	 */
	readonly minDays: number,

	/**
	 * The maximum value of the chart (top y axis value) will be no less than
	 * this. Setting an appropriate value prevents data sets with very low
	 * values from looking like they actually have high values
	 */
	readonly minMaxPlays: number,

	/**
	 * Filter out data sets that don't have at least this amount of data points
	 */
	readonly minValues: number,

	/**
	 * Enable a specific end date (specified in `YYYY-MM-DD` format) for the
	 * chart. This crops the data set and overrides other padding/min-max-day-
	 * related settings 
	 */
	readonly overrideEndYmd: string,

	/**
	 * Enable a specific start date (specified in `YYYY-MM-DD` format) for the
	 * chart. This crops the data set and overrides other padding/min-max-day-
	 * related settings 
	 */
	readonly overrideStartYmd: string,

	/**
	 * If true, the end of the chart is more important than the start: This
	 * makes the chart load scrolled horizontally to the end in narrow
	 * viewports
	 */
	readonly showEndFirst: boolean,

	/**
	 * Use this data color, supplied in a CSS-compatible format, when there's
	 * only a single data set in the chart
	 */
	readonly singleColor: string,

	/**
	 * Use this fill opacity when there's only a single data set in the chart.
	 * Overrides the `fillOpacity` setting when there's only one data set
	 */
	readonly singleFillOpacity: number,

	/**
	 * Today's date, specified in `YYYY-MM-DD` string format. Defaults to now
	 */
	readonly todayYmd: string
}

/**
 * Default values
 */
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
	language: "en",
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
