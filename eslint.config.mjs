import reactRefresh from "eslint-plugin-react-refresh";
import _import from "eslint-plugin-import";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import { fixupConfigRules } from "@eslint/compat";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: [
        "**/dist",
        "**/*.mjs",
        "src/generated",
        "src/components/Map/TileLayers/TileLayer/WMTS.tsx",
        "src/components/Map/TileLayers/TileLayer/WMTSOffline.tsx",
    ],
}, ...fixupConfigRules(compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/stylistic",
    "plugin:react-hooks/recommended",
)), {
    plugins: {
        "react-refresh": reactRefresh,
        import: _import,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
        },

        parser: tsParser,
    },

    rules: {
        strict: 0,
        "react/prop-types": 0,
        "react/display-name": "off",
        "no-console": "off",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "@typescript-eslint/no-unused-vars": ["error"],
        "@typescript-eslint/consistent-type-definitions": "off",

        "no-empty": ["error", {
            allowEmptyCatch: true,
        }],

        "react/react-in-jsx-scope": "off",

        "react-refresh/only-export-components": ["warn", {
            allowConstantExport: true,
        }],

        "import/extensions": ["warn", "ignorePackages", {
            js: "never",
            jsx: "never",
            tsx: "never",
        }],
    },
}];
