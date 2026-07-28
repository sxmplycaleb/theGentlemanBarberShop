const lintStagedConfig = {
  "*.{js,mjs,cjs,ts,tsx}": ["eslint --max-warnings=0", "prettier --write"],
  "*.{css,json,md,yml,yaml}": "prettier --write",
};

export default lintStagedConfig;
