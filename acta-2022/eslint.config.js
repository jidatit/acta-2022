import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: { 
      globals: globals.browser 
    },
    plugins: {
      js: pluginJs.configs.recommended,
      react: pluginReact.configs.flat.recommended,
    },
  },
];