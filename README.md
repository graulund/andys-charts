# Andy’s Charts

A simple charting library made out of React, TypeScript and SVG for a very
specific use case: Showing plays per day for musical tracks.

<img width="1007" alt="Screen Shot 2022-09-14 at 23 14 43" src="https://user-images.githubusercontent.com/80858/190263861-fb20ebf4-986f-4255-8e75-cafdbbc855a8.png">

This is the charting library used on my sites
[Playte](https://playte.co/andy/music/Harry_Styles) and
[P3 Trends](https://andyg.dk/p3trends/music/Harry_Styles). It is used to display
the amount of time one or more tracks have been played per day, over time, via a
minimalistic, stylish, interactive, to-the-point area chart.

This area chart has time as the x-axis dimension, with an important feature:
There's a tick/label for each month — regardless of how many months have passed
in the timespan of the chart. This means that the amount of ticks and labels in
the x-axis is variable and automatic.

There are two ways to use the library:

1. **As an npm package** (`npm install andys-charts`) in a React app
2. **As a self-contained script bundle** that renders a chart into a DOM element
   via `window.createAndyCharts`, for server-rendered pages with no client-side
   React infrastructure

## Usage as an npm package

```
npm install andys-charts
```

React 18 or newer is required (`react` and `react-dom` are peer dependencies).
The package ships as an ES module with TypeScript declarations. The component's
styles are compiled into the module and injected into the document automatically
— no separate stylesheet import is needed.

```tsx
import { Chart, unpackDataPointsInDataSets } from "andys-charts";
import type { ChartConfig, CompressedChartDataSet } from "andys-charts";

function TrackChart({
	config,
	dataSets
}: {
	config: Partial<ChartConfig>;
	dataSets: CompressedChartDataSet[];
}) {
	return (
		<Chart
			config={config}
			dataSets={unpackDataPointsInDataSets(dataSets)}
		/>
	);
}
```

The `Chart` component takes a (partial) config object (see
[Configuration](#configuration) below) and a list of data sets. If your data
sets are in the "compressed" form described below (lists of `[date, plays]`
tuples), run them through `unpackDataPointsInDataSets` first.

The package continues to inject its small stylesheet automatically for backwards
compatibility. A standalone `andys-charts/style.css` export is also available
for SSR and CSP-oriented integrations; automatic injection will remain until a
future major release makes the explicit stylesheet the default.

Exports:

- `Chart` — the chart React component. It accepts an optional `ariaLabel` prop
  and can be server-rendered; import `andys-charts/style.css` when
  server-rendered styles must be present before hydration.
- `unpackDataPointsInDataSets`, `unpackCompressedDataPoints` — data helpers
- `defaultConfig` — the default chart configuration
- Types: `ChartProps`, `ChartConfig`, `ChartDataSet`, `ChartDataPoint`,
  `CompressedChartData`, `CompressedChartDataSet`, `CompressedChartDataPoint`,
  `TrackArtist`, `TrackArtists`

## Usage as a script bundle (`window.createAndyCharts`)

This mode exists for server-rendered pages that have no client-side React setup:
The bundle includes React and exposes a single global function.

Build the project with `npm run build:legacy`, and copy everything in the
`build` folder to the appropriate directory in your project — probably an
`assets` directory. Then, use the `entrypoints` section of the
`asset-manifest.json` file to find the list of files to include as `link` and
`script` elements.

The script will expose the following function:

```typescript
window.createAndyCharts = function (
	chartData: CompressedChartData,
	rootQuerySelector: string
) {
	/* ... */
};
```

The second argument, `rootQuerySelector`, is the query selector of the DOM
element you'd like to use as root element for the chart (defaults to
`.andy-chart-root`).

The first argument, `chartData`, is an object containing the data sets
themselves, along with a configuration object.

## Chart data

Chart data (the `chartData` argument in the script bundle mode, or the `config`
and `dataSets` props in npm package mode) has the following structure, expressed
in TypeScript pseudocode:

```typescript
interface CompressedChartData {
	config: Partial<ChartConfig>; // Object with config options: See next section
	dataSets: [
		{
			title: string; // Track title
			artists?: {
				// Optional lists of artist relationship for track
				main?: [{ name: string } /* , ... */]; // Main artist(s) for track
				with?: [{ name: string } /* , ... */]; // With-level artist(s) for track (if one main artist is implied)
				feat?: [{ name: string } /* , ... */]; // Featuring-level artist(s) for track
				as?: { name: string }; // Any alt name for implied main artist for track
			};
			url?: string; // Optional track URL: This link will appear in the chart legend
			dataPoints: [
				// List of two-value arrays with data points for the chart:
				// First value is the date expressed as a YYYY-MM-DD string
				// Second value is the value for that day (usually number of plays per day)
				[date, plays],
				[date, plays],
				[date, plays]
				// Example: ["2022-01-01", 5],
				/* ... */
			];
		}
		// , { further objects in data set }, ...
	];
}
```

Once the chart is rendered with the proper arguments, it will hopefully contain
a beautiful area chart!

## Configuration

Even though this is a relatively simple project, there are still a bunch of
configuration options that can be included in the `config` prop of the chart
data object:

| Option              | Default value          | Explanation                                                                                                                                                                                                                                                                          |
| ------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `backgroundColor`   | `#fff`                 | Deprecated compatibility option. The value axis no longer overlays the plot, so its background is transparent and this value is ignored.                                                                                                                                             |
| `chartBottomHeight` | 14                     | Height (in pixels) allocated for the horizontal time (x) axis                                                                                                                                                                                                                        |
| `chartHeight`       | 145                    | Total height of the chart (in pixels), including the horizontal (x) axis                                                                                                                                                                                                             |
| `chartLeftWidth`    | 18                     | Width (in pixels) allocated for the vertical value (y) axis                                                                                                                                                                                                                          |
| `chartTopHeight`    | 4                      | Vertical distance (in pixels) between the top of the main chart area and the top of the total chart area. This is usually very tiny, and only to account for the fact that the top label of the value axis peeks out over the main chart area                                        |
| `chartWidth`        | 1000                   | Width (in pixels) of the total chart area, including the vertical (y) axis                                                                                                                                                                                                           |
| `colors`            | `["#3faa9e", ...]`     | List of colors, in a CSS-compatible format, of the data sets, in order                                                                                                                                                                                                               |
| `dark`              | `false`                | Whether the chart has a dark background (this will enable brighter foreground colors)                                                                                                                                                                                                |
| `dataMaskId`        | `andy-chart-data-mask` | Deprecated compatibility option. Clip-path IDs are now generated internally.                                                                                                                                                                                                         |
| `fillOpacity`       | 0.4                    | How opaque the fill of the areas in the chart is. A value of 0 will turn the chart into a pure line chart; no fills                                                                                                                                                                  |
| `isSingle`          | `false`                | Whether or not this is intended to be a chart with only one data set: This disable the chart legend                                                                                                                                                                                  |
| `language`          | `en`                   | The language of the chart. Right now, Danish (`da`) and English (`en`) are supported values                                                                                                                                                                                          |
| `linkMainClassName` | None                   | If you want the link elements for any track URLs supplied with the data sets to have a specific class name, you can supply this class name here                                                                                                                                      |
| `maxDays`           | 183                    | Maximum amount of days displayed in the chart, even if the data sets go back further (default value is 183 which is... kinda... half a year)                                                                                                                                         |
| `maxEndPaddingDays` | 5                      | If the data sets all end before the present day (specified by `todayYmd` in the config, and defaulting to now), display no more than this amount of empty days at the end of the chart, in order to visually communicate to the user that some time passed since the last data point |
| `minDays`           | 10                     | Display no less than this amount of days even for very tiny data sets. This extra padding prevents very stretched small charts                                                                                                                                                       |
| `minMaxPlays`       | 4                      | The maximum value of the chart (top y axis value) will be no less than this. Setting an appropriate value prevents data sets with very low values from looking like they actually have high values                                                                                   |
| `minValues`         | 2                      | Filter out data sets that don't have at least this amount of data points                                                                                                                                                                                                             |
| `overrideEndYmd`    | None                   | Enable a specific end date (specified in `YYYY-MM-DD` format) for the chart. This crops the data set and overrides other padding/min-max-day-related settings                                                                                                                        |
| `overrideStartYmd`  | None                   | Enable a specific start date (specified in `YYYY-MM-DD` format) for the chart. This crops the data set and overrides other padding/min-max-day-related settings                                                                                                                      |
| `showEndFirst`      | `true`                 | If true, the end of the chart is more important than the start: This makes the chart load scrolled horizontally to the end in narrow viewports                                                                                                                                       |
| `singleColor`       | `#3faa9e`              | Use this data color, supplied in a CSS-compatible format, when there's only a single data set in the chart                                                                                                                                                                           |
| `singleFillOpacity` | 0.4                    | Use this fill opacity when there's only a single data set in the chart. Overrides the `fillOpacity` setting when there's only one data set                                                                                                                                           |
| `todayYmd`          | Now                    | Today's date, specified in `YYYY-MM-DD` string format. Defaults to now                                                                                                                                                                                                               |

### Theming

Foreground colors can be customized with inherited CSS properties such as
`--andys-charts-axis-line`, `--andys-charts-axis-label`,
`--andys-charts-tooltip-background`, `--andys-charts-tooltip-title`,
`--andys-charts-tooltip-text`, `--andys-charts-marker`, `--andys-charts-title`,
and `--andys-charts-artist`. Dark-mode variants use the same names with a
`-dark` suffix where applicable.

## Development

- `npm start` — dev server with a demo page ([index.html](index.html))
- `npm run typecheck` — TypeScript check
- `npm run format` — format source and documentation with Prettier
- `npm run format:check` — verify formatting without changing files
- `npm test` — unit and real-browser component tests
- `npm run coverage` — core-logic coverage report
- `npm run test:package` — install the packed module into React 18 and React 19
  fixtures
- `npm run build:lib` — build the npm package (ESM + type declarations) into
  `dist`
- `npm run build:legacy` — build the `window.createAndyCharts` script bundle
  into `build`
- `npm run build` — both of the above

Run `npx playwright install chromium` once before running the browser tests
locally.

## Caveats

This library very much shows signs of being made for a very specific use case.
This means that there are some things about it that are not perfect, but may be
fixed in the near future:

- **The X axis is definitely hardcoded to be a time axis.** That's part of the
  simplicity of the project.

But hey, this project may not apply to everyone — even still, I wanted to share
the code in the hopes somebody can use it for something! Yay! 🎉

## License

MIT
