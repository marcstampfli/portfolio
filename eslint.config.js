import js from "@eslint/js";
import next from "eslint-config-next";
import prettier from "eslint-config-prettier";

const config = [
  js.configs.recommended,
  ...next,
  prettier,
  {
    ignores: ["node_modules/", ".next/", "out/", "public/"],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "no-undef": "off",
    },
  },
  {
    rules: {
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-unused-vars": "off",
    },
  },
];

export default config;
