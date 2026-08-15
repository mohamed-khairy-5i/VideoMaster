/*
 * package.json has had a "lint" script since the start, and eslint plus both
 * react plugins were in devDependencies, but no config file was ever committed.
 * So `npm run lint` failed with "couldn't find a configuration file" rather than
 * linting anything. Another promise the repo made and did not keep.
 *
 * Deliberately narrow: rules that catch real bugs, nothing that argues about
 * formatting. The two environments differ (browser for src, node for the
 * serverless functions), so they are separated with overrides.
 */
module.exports = {
  root: true,
  env: { browser: true, es2022: true },
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  settings: { react: { version: 'detect' } },
  rules: {
    // The codebase uses catch blocks with no binding and intentional throwaways.
    'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    // Vite handles JSX; prop-types are not used anywhere in this project.
    'react/prop-types': 'off',
    'no-console': 'off',
  },
  overrides: [
    {
      // Netlify functions and build scripts run in Node/Deno, not the browser.
      files: ['netlify/**/*.js', 'scripts/**/*.mjs'],
      env: { browser: false, node: true },
    },
    {
      // Service worker: self, caches, clients.
      files: ['public/sw.js'],
      env: { browser: true, serviceworker: true },
    },
  ],
  ignorePatterns: ['dist', 'node_modules', '.agent'],
};
