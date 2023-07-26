
import { render, screen } from "@testing-library/react";
import Chart from "./Chart";

test("renders learn react link", () => {
	render(
		<Chart
			config={{ "todayYmd": "2022-07-06", "maxDays": 183, "language": "da", "singleColor": "#3faa9e", "colors": ["#3faa9e", "#b7000c", "#009107", "#2d61c1", "#adb100", "#b70097", "#666666"] }}
			dataSets={[{
				"title": "Test", "dataPoints": [
					{ date: "2022-05-06", plays: 5 },
					{ date: "2022-05-07", plays: 5 },
					{ date: "2022-05-08", plays: 5 },
					{ date: "2022-05-09", plays: 5 },
					{ date: "2022-05-10", plays: 5 },
					{ date: "2022-05-11", plays: 5 }
				]
			}]}
		/>
	);
	const linkElement = screen.getByText(/chart/i);
	expect(linkElement).toBeInTheDocument();
});
