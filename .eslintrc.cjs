/** @type {import("eslint").Linter.Config} */
const config = {
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": true
  },
  "plugins": [
    "@typescript-eslint"
  ],
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked"
  ],
  "rules": {
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    // "@typescript-eslint/consistent-type-imports": [
    //   "warn",
    //   {
    //     "prefer": "type-imports",
    //     "fixStyle": "inline-type-imports"
    //   }
    // ],
    // "@typescript-eslint/no-unused-vars": [
    //   "warn",
    //   {
    //     "argsIgnorePattern": "^_"
    //   }
    // ],
    "no-return-await": "off",
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/no-misused-promises": [
      "off"
      // "error",
      // {
      //   "checksVoidReturn": {
      //     "attributes": false
      //   }
      // }
    ],
    // "@typescript-eslint/no-unsafe-assignment": "error",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-explicit-any": ["off"],
    "@typescript-eslint/no-unused-types": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/await-thenable": ["off"],
    "@typescript-eslint/no-floating-promises": ["off"],
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/prefer-optional-chain": "off",
    "@typescript-eslint/return-await": ["off"],
    "@react-hooks/exhaustive-deps":"off"
  }
}
module.exports = config;