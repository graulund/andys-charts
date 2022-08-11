import React from "react";
import PropTypes from "prop-types";

import styles from "./TrackTitleDisplay.module.css";

function asText(language) {
	if (language === "da") {
		return "som";
	}

	return "as";
}

function withText(language) {
	if (language === "da") {
		return "med";
	}

	return "with";
}

function renderList(items) {
	return items.reduce((out, item, index) => {
		if (index > 0) {
			if (index === items.length - 1) {
				out.push(" & ");
			} else {
				out.push(", ");
			}
		}

		out.push(item);
		return out;
	}, []);
}

function ArtistName({ name }) {
	return <span className={styles.artist}>{ name }</span>;
}

ArtistName.displayName = "TrackTitleDisplay.ArtistName";

ArtistName.propTypes = {
	name: PropTypes.string.isRequired
};

function ArtistList({ artists }) {
	return (
		<>
			{ renderList(artists.map(({ name }, i) => (
				<ArtistName name={name} key={i} />
			))) }
		</>
	);
}

ArtistList.displayName = "TrackTitleDisplay.ArtistList";

ArtistList.propTypes = {
	artists: PropTypes.arrayOf(PropTypes.shape({
		name: PropTypes.string
	})).isRequired
};

function TrackTitleDisplay({ artists, language, mainClassName, title }) {
	let prefix = null;

	if (artists?.main) {
		prefix = (
			<>
				<ArtistList artists={artists.main} />
				{ artists.feat ? (
					<>
						{ " featuring " }
						<ArtistList artists={artists.feat} />
					</>
				) : null }
				{" – "}
			</>
		);
	}

	let suffix = [];

	if (artists?.as) {
		suffix.push((
			<>
				{ `${asText(language)} ` }
				<ArtistName name={artists.as.name} />
			</>
		));
	}

	if (artists?.with) {
		suffix.push((
			<>
				{ `${withText(language)} ` }
				<ArtistList artists={artists.with} />
			</>
		));
	}

	if (artists?.feat && !artists.main) {
		suffix.push((
			<>
				{ "featuring " }
				<ArtistList artists={artists.feat} />
			</>
		));
	}

	const mainClassList = [styles.main];

	if (mainClassName) {
		mainClassList.push(mainClassName);
	}

	return (
		<>
			{ prefix }
			<span className={mainClassList.join(" ")}>
				{ title }
			</span>
			{ suffix.length > 0 ? (
				<>
					{" ("}
					{ suffix.map((el, i) => (
						<React.Fragment key={i}>
							{ i > 0 ? " " : null }
							{ el }
						</React.Fragment>
					)) }
					{")"}
				</>
			) : null }
		</>
	);
}

TrackTitleDisplay.propTypes = {
	artists: PropTypes.object,
	language: PropTypes.string,
	mainClassName: PropTypes.string,
	title: PropTypes.string.isRequired
};

TrackTitleDisplay.defaultProps = {
	artists: null,
	language: "en",
	mainClassName: undefined
};

export default TrackTitleDisplay;
