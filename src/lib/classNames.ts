export type ClassName = string | false | null | undefined;

/** Joins truthy CSS class names without requiring a runtime dependency. */
export function classNames(...names: ClassName[]) {
	return names.filter(Boolean).join(" ");
}
