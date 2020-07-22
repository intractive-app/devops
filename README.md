## Setting up development configs

#### First install project specific tooling

TypeScript projects (for plain ES projects `@intractive/eslint-config-es`):
```
yarn add --dev eslint prettier @intractive/eslint-config-ts
cat <<EOF > .eslintrc
{
  "extends": "@intractive/eslint-config-ts"
}
EOF
```

SCSS with stylelint
```
yarn add --dev stylelint @intractive/stylelint-config
cat <<EOF > .stylelintrc
{
  "extends": "@intractive/stylelint-config"
}
EOF
```

#### For TypeScript projects, ensure strict compiler settings:

```
// tsconfig.json
{
  "compilerOptions": {
    ...
    "strict": true,
    ...
  }
}

```

#### Configure husky and commitlint

Install dependencies:
```
yarn add --dev husky @commitlint/cli @commitlint/config-conventional lint-staged

```

Add the following to your package.json
```
  "husky": {
    "hooks": {
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "**/*.{ts,tsx}": [
      "eslint --max-warnings 0 --fix -c .eslintrc.js",
      "git add"
    ]
  },
  "commitlint": {
    "extends": [
      "@commitlint/config-conventional"
    ],
    "rules": {
      "header-max-length": [
        0,
        "always",
        85
      ]
    }
  }
```
*(Make sure to adjust accordingly)*

#### Configure changelog and version management (for CI systems)

*Coming soon*
