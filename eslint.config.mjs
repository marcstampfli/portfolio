import next from "@next/eslint-plugin-next";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";

export default [
  {
    ignores: [".next/**"],
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@next/next": next,
      "@typescript-eslint": typescript,
      prettier,
    },
    languageOptions: {
      parser: typescriptParser,
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      ...next.configs.recommended.rules,
      ...next.configs["core-web-vitals"].rules,
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "prettier/prettier": "warn",
    },
    settings: {
      next: {
        rootDir: ".",
      },
    },
  },
];
