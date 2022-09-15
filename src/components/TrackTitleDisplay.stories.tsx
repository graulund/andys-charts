import { ComponentStory, ComponentMeta } from "@storybook/react";

import TrackTitleDisplay from "./TrackTitleDisplay";

export default {
	title: "Chart/TrackTitleDisplay",
	component: TrackTitleDisplay,
	argTypes: {}
} as ComponentMeta<typeof TrackTitleDisplay>;

const Template: ComponentStory<typeof TrackTitleDisplay> = (args) => <TrackTitleDisplay {...args} />;

export const WithoutArtists = Template.bind({});

WithoutArtists.args = {
	title: "Test Track Title"
};

export const WithMainArtists = Template.bind({});

WithMainArtists.args = {
	title: "Test Track Title",
	artists: {
		main: [
			{ name: "Elton John", id: 1 },
			{ name: "Dua Lipa", id: 2 }
		]
	}
};

export const WithWithArtists = Template.bind({});

WithWithArtists.args = {
	title: "Test Track Title",
	artists: {
		with: [
			{ name: "Elton John", id: 1 },
			{ name: "Dua Lipa", id: 2 }
		]
	}
};

export const WithFeatArtists = Template.bind({});

WithFeatArtists.args = {
	title: "Test Track Title",
	artists: {
		feat: [
			{ name: "Elton John", id: 1 },
			{ name: "Dua Lipa", id: 2 }
		]
	}
};

export const WithAsArtistName = Template.bind({});

WithAsArtistName.args = {
	title: "Test Track Title",
	artists: {
		as: { name: "Puff Daddy", id: 1 }
	}
};
