module.exports = {
  input: [
    'src/**/*.{js,jsx,ts,tsx}',
    // Exclude test files
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/*.spec.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
  ],
  output: './src/locales',
  options: {
    debug: false,
    removeUnusedKeys: false,
    sort: true,
    func: {
      list: ['t', 'i18next.t', 'i18n.t'],
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    trans: {
      component: 'Trans',
      i18nKey: 'i18nKey',
      defaultsKey: 'defaults',
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    lngs: ['en', 'ro'],
    ns: ['translation'],
    defaultLng: 'en',
    defaultNs: 'translation',
    defaultValue: '',
    resource: {
      loadPath: '{{lng}}.json',
      savePath: '{{lng}}.json',
      jsonIndent: 2,
      lineEnding: '\n',
    },
    nsSeparator: false, // Set to false to disable namespace separator
    keySeparator: '.', // Key separator used in translation keys
    interpolation: {
      prefix: '{{',
      suffix: '}}',
    },
  },
}
