# Andy’s Charts

A simple charting library made out of React, TypeScript and SVG for a very specific use case: Showing plays per day for musical tracks. 

This is the charting library used on my sites [Playte](https://playte.co/andy/music/Harry_Styles) and [P3 Trends](https://andyg.dk/p3trends/music/Harry_Styles). It is used to display the amount of time a track has been played per day, over time, via a simple, stylish, minimalistic, interactive, to-the-point area chart. 

Because of the fact that both sites that I intended to use this on are server-rendered with minimal client-side code, this module attaches itself directly to the `window` object as of now, because there's no advanced client-side infrastructure to integrate with on these pages. In the future, this project can hopefully be a proper NPM package, so others can more easily use it.

## Usage
(Sorry: This is non-standard and weird — for now — because of the above reason. 👆🏼)

Build the project, and copy everything in the `build` folder to the appropriate directory in your project — probably an `assets` directory. Use the `entryPoints` section of the `asset-manifest.json` file to find the list of files to include as `link` and `script` elements.

The script will expose the following function: 
```typescript
window.createAndyCharts = function (chartData: CompressedChartData, rootQuerySelector: string) {
	/* ... */
}
```

The second argument, `rootQuerySelector`, is the query selector of the DOM element you'd like to use as root element for the chart. 

The first argument, `chartData`, is an object containing the data sets themselves, along with a configuration object (see more about that below). It has the following structure, expressed in TypeScript pseudocode:

```typescript
interface CompressedChartData {
	config: Partial<ChartConfig>; // Object with config options: See next section
	dataSets: [
		{
			title: string; // Track title
			artists?: { // Optional lists of artist relationship for track
				main?: [{ name: string } /* , ... */ ]; // Main artist(s) for track
				with?: [{ name: string } /* , ... */ ]; // With-level artist(s) for track (if one main artist is implied)
				feat?: [{ name: string } /* , ... */ ]; // Featuring-level artist(s) for track
				as?: { name: string }; // Any alt name for implied main artist for track
			};
			url?: string; // Track URL
			dataPoints: [
				// List of two-value arrays with data points for the chart:
				// First value is the date expressed as a YYYY-MM-DD string
				// Second value is the value for that day (usually number of plays per day)
				[date, plays],
				[date, plays],
				[date, plays],
				/* ... */
			];
		}
		// , { further objects in data set }, ...
	];
}
```

Once the function is called with the proper arguments, a React instance will be added to the root element, and it will hopefully contain a beautiful area chart!

## Configuration

Even though this is a relatively simple project, there are still a bunch of configuration options that can be included in the `config` prop of the chart data object!

| Option | Default value | Explanation |
|--------|---------------|-------------|
| `backgroundColor` | `#fff` | The background color of the chart, supplied in a CSS-compatible format. This is required because the horizontal scrolling nature of the chart in narrow viewports employs a "sliding door" technique: The left value axis is laid on top of the main chart area, and thus needs to be opaque. Thus, it needs to have an explicit background color specified. |
| `chartBottomHeight` | 14 | Height (in pixels) allocated for the horizontal time (x) axis |
| `chartHeight` | 145 | Total height of the chart (in pixels), including the horizontal (x) axis |
| `chartLeftWidth` | 18 | Width (in pixels) allocated for the vertical value (y) axis |
| `chartTopHeight` | 4 | Vertical distance (in pixels) between the top of the main chart area and the top of the total chart area. This is usually very tiny, and only to account for the fact that the top label of the value axis peeks out over the main chart area |
| `chartWidth` | 1000 | Width (in pixels) of the total chart area, including the vertical (y) axis |
| `colors` | `["#3faa9e", ...]` | List of colors, in a CSS-compatible format, of the data sets, in order |
| `dark` | `false` | Whether the chart has a dark background (this will enable brighter foreground colors) |
| `dataMaskId` | `andy-chart-data-mask` | ID of the inner SVG chart mask element |
| `fillOpacity` | 0.4 | How opaque the fill of the areas in the chart is. A value of 0 will turn the chart into a pure line chart; no fills |
| `isSingle` | `false` | Whether or not this is intended to be a chart with only one data set: This disable the chart legend |
| `language` | `en` | The language of the chart. Right now, Danish (`da`) and English (`en`) are supported values |
| `linkMainClassName` | None | If you want the link elements for any track URLs supplied with the data sets to have a specific class name, you can supply this class name here |
| `maxDays` | 183 | Maximum amount of days displayed in the chart, even if the data sets go back further (default value is 183 which is... kinda... half a year) |
| `maxEndPaddingDays` | 5 | If the data sets all end before the present day (specified by `todayYmd` in the config, and defaulting to now), display no more than this amount of empty days at the end of the chart, in order to visually communicate to the user that some time passed since the last data point |
| `minDays` | 10 | Display no less than this amount of days even for very tiny data sets. This extra padding prevents very stretched small charts |
| `minMaxPlays` | 4 | The maximum value of the chart (top y axis value) will be no less than this. Setting an appropriate value prevents data sets with very low values from looking like they actually have high values |
| `minValues` | 2 | Filter out data sets that don't have at least this amount of data points |
| `overrideEndYmd` | None | Enable a specific end date (specified in `YYYY-MM-DD` format) for the chart. This crops the data set and overrides other padding/min-max-day-related settings  |
| `overrideStartYmd` | None | Enable a specific start date (specified in `YYYY-MM-DD` format) for the chart. This crops the data set and overrides other padding/min-max-day-related settings  |
| `showEndFirst` | `true` | If true, the end of the chart is more important than the start: This makes the chart load scrolled horizontally to the end in narrow viewports |
| `singleColor` | `#3faa9e` | Use this data color, supplied in a CSS-compatible format, when there's only a single data set in the chart |
| `singleFillOpacity` | 0.4 | Use this fill opacity when there's only a single data set in the chart. Overrides the `fillOpacity` setting when there's only one data set |
| `todayYmd` | Now | Today's date, specified in `YYYY-MM-DD` string format. Defaults to now |

## Caveats

This library is still very young, and still shows signs of made for a very specific use case. This means that there are some things about it that are not perfect, but may be fixed in the near future:

* There's no proper NPM package for this. As explained in the intro, this was mainly made to be an addition to certain pages that are largely static when it comes to the client-side. So, as it is right now, it's not made to fit into a larger front end web infrastructure with a package manager. This should not be a big deal to change. 
* It's mainly made to show track plays per day, only ever encountering relatively small values, meaning this charting library does not support any values higher than 15 (at least in theory, I haven't tested it)
* The X axis is definitely hardcoded to be a time axis. That's part of the simplicity of the project.

But hey, this project may not apply to everyone — even still, I wanted to share the code in the hopes somebody can use it for something! Yay! 🎉
