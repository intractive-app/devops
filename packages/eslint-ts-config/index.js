module.exports = {
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "ecmaVersion": 2018,
      "sourceType": "module",
      "jsx": true
    }
  },
  "plugins": ["@typescript-eslint"],
  "extends": [
      "plugin:react/recommended",
      "plugin:@typescript-eslint/recommended",
      "prettier",
      "prettier/@typescript-eslint",
      "plugin:prettier/recommended"
  ],
  "rules": {
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/no-empty-interface": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-non-null-assertion": 0,
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/explicit-member-accessibility": ["error", { "accessibility": "explicit", "overrides": { "constructors": "no-public" }}],
    "@typescript-eslint/no-namespace": ["error", { "allowDeclarations": true }],
    "@typescript-eslint/no-var-requires": "off",
    "react/display-name": "off",
    "react/no-find-dom-node": "off",
    "@typescript-eslint/no-triple-slash-reference": "off",
    "prettier/prettier": "warn",
    "react/prop-types": "off"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
