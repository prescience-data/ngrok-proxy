import { FlatCompat } from "@eslint/eslintrc"
import tsPlugin from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import prettier from "eslint-plugin-prettier"
import simpleImportSort from "eslint-plugin-simple-import-sort"
import unicorn from "eslint-plugin-unicorn"

const compat = new FlatCompat({
  baseDirectory: import.meta.url,
  recommendedConfig: prettier.configs.recommended
})

export default [
  {
    files: ["**/*.ts", "**/*.json"],
    ignores: ["node_modules/", "**/vendor/*.js"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      parser: tsParser
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "simple-import-sort": simpleImportSort,
      unicorn
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "prettier/prettier": "error",
      "unicorn/better-regex": "error",
      semi: ["error", "never"],
      quotes: ["error", "double"],
      "no-trailing-spaces": ["error"],
      "simple-import-sort/imports": "error", // Automatically sort imports
      "simple-import-sort/exports": "error", // Automatically sort exports
      "array-bracket-spacing": ["error", "always"], // Enforce spaces inside array brackets
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          disallowTypeAnnotations: true
        }
      ],
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "*", next: "function" }, // Before functions
        { blankLine: "always", prev: "function", next: "*" }, // After functions
        { blankLine: "always", prev: "*", next: "export" }, // Before exports
        { blankLine: "always", prev: "export", next: "*" } // After exports
      ],
      "no-multiple-empty-lines": [
        "error",
        {
          max: 1, // Maximum 1 empty line allowed
          maxEOF: 1, // Maximum 1 empty line at end of file
          maxBOF: 0 // No empty lines at the beginning of file
        }
      ]
    }
  },
  {
    files: ["index.ts", "**/index.ts"], // Override for index.ts files
    rules: {
      "padding-line-between-statements": "off"
    }
  },
  ...compat.extends("plugin:@typescript-eslint/recommended"),
  ...compat.extends("plugin:prettier/recommended"),
  {
    files: ["**/*.ts"],
    rules: {
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" }
      ]
    }
  },
  {
    files: ["dist/**/*.js"],
    rules: {
      "prefer-const": [
        "error",
        {
          destructuring: "any",
          ignoreReadBeforeAssign: false
        }
      ],
      semi: ["error", "never"],
      quotes: ["error", "double"],
      "array-bracket-spacing": ["error", "always"], // Enforce spaces inside array brackets
      "@typescript-eslint/no-unused-vars": "off",
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "*", next: "function" }, // Before functions
        { blankLine: "always", prev: "function", next: "*" }, // After functions
        { blankLine: "always", prev: "*", next: "export" }, // Before exports
        { blankLine: "always", prev: "export", next: "*" } // After exports
      ]
    }
  },
  {
    files: ["clients/**/*.ts"], // Override for client files
    rules: {
      "@typescript-eslint/no-unused-vars": "off"
    }
  }
]
