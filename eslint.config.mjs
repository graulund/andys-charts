import js from "@eslint/js";
import hooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
	{
		ignores: ["build/**", "coverage/**", "dist/**"]
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	hooks.configs.flat.recommended,
	{
		files: ["**/*.{ts,tsx}"],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		},
		rules: {
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": "error",
			eqeqeq: ["error", "smart"],
			"prefer-const": "error",
			semi: ["error", "always"]
		}
	}
);
