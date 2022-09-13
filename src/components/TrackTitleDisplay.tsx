import React from "react";
import clsx from "clsx";

import { ChartConfig } from "../lib/config";
import { TrackArtist, TrackArtists } from "../lib/types";

import styles from "./TrackTitleDisplay.module.css";

type Language = ChartConfig['language'];

function asText(language: Language) {
	if (language === "da") {
		return "som";
	}

	return "as";
}

function withText(language: Language) {
	if (language === "da") {
		return "med";
	}

	return "with";
}

function renderList(items: React.ReactNode[]) {
	return items.reduce<React.ReactNode[]>((out, item, index) => {
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

interface ArtistNameProps {
	name: string;
}

function ArtistName({ name }: ArtistNameProps) {
	return <span className={styles.artist}>{ name }</span>;
}

ArtistName.displayName = "TrackTitleDisplay.ArtistName";

interface ArtistListProps {
	artists: TrackArtist[];
}

function ArtistList({ artists }: ArtistListProps) {
	return (
		<>
			{ renderList(artists.map(({ id, name }, i) => (
				<ArtistName name={name} key={id || i} />
			))) }
		</>
	);
}

ArtistList.displayName = "TrackTitleDisplay.ArtistList";

interface TrackTitleDisplayProps {
	artists?: TrackArtists;
	dark: boolean;
	language: Language;
	mainClassName?: string;
	title: string;
}

function TrackTitleDisplay({
	artists,
	dark,
	language,
	mainClassName,
	title
}: TrackTitleDisplayProps) {
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

	const suffix = [];

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

	const containerClassName = clsx({ [styles.darkContainer]: dark });

	const titleClassName = clsx(styles.main, mainClassName, {
		[styles.darkMain]: dark
	});

	return (
		<span className={containerClassName}>
			{ prefix }
			<span className={titleClassName}>
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
		</span>
	);
}

TrackTitleDisplay.defaultProps = {
	artists: null,
	dark: false,
	language: "en",
	mainClassName: undefined
};

export default TrackTitleDisplay;
