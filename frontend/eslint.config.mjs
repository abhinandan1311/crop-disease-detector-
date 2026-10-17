import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [".next/**", "node_modules/**", "out/**", "next-env.d.ts"],
  },
  {
    ...js.configs.recommended,
    languageOptions: {
      ...js.configs.recommended.languageOptions,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  ...tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
);
