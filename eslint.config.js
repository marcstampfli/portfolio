import js from "@eslint/js";
import next from "eslint-config-next";
import prettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  ...next,
  prettier,
  {
    ignores: ["node_modules/", ".next/", "out/", "public/"],
  },
  {
    rules: {
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
      ]
    }
  }
];
