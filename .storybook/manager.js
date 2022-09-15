import { addons } from "@storybook/addons";
import { create } from "@storybook/theming/create";

addons.setConfig({
	theme: create({
		base: "light",
		brandTitle: "Andy's Charts",
		brandUrl: "https://github.com/graulund/andys-charts"
	})
});
