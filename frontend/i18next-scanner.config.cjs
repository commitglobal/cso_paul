const fs = require('fs');
const path = require('path');

// Function to load existing translations
function loadExistingTranslations(lng) {
  const filePath = path.join(__dirname, 'src/locales', `${lng}.json`);
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error(`Error loading existing translations for ${lng}:`, err);
  }
  return {};
}

// Load existing translations
const existingTranslations = {
  en: loadExistingTranslations('en'),
  ro: loadExistingTranslations('ro')
};

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
    debug: true, // Enable debug to see what's happening
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
      // Improve TypeScript parsing with updated acorn options
      acorn: {
        ecmaVersion: 2020,
        sourceType: 'module',
        // Add additional options for TypeScript
        allowHashBang: true,
        allowReserved: true,
        allowReturnOutsideFunction: true,
        allowImportExportEverywhere: true,
      }
    },
    lngs: ['en', 'ro'],
    ns: ['translation'],
    defaultLng: 'en',
    defaultNs: 'translation',
    // Use a function to preserve existing translations
    defaultValue: function(lng, ns, key) {
      // Check if there's an existing translation
      if (existingTranslations[lng] && existingTranslations[lng][key]) {
        return existingTranslations[lng][key];
      }
      // Return empty string for new keys
      return '';
    },
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
  // Custom transform function to handle TypeScript files better
  transform: function customTransform(file, enc, done) {
    const parser = this.parser;
    const content = fs.readFileSync(file.path, enc);

    // Parse translation function calls
    parser.parseFuncFromString(content, { list: ['t', 'i18next.t', 'i18n.t'] }, (key, options) => {
      parser.set(key, options);
    });

    // Skip Trans component parsing for TypeScript files to avoid errors
    if (!file.path.endsWith('.ts') && !file.path.endsWith('.tsx')) {
      try {
        parser.parseTransFromString(content);
      } catch (error) {
        console.log(`i18next-scanner: Skipping Trans parsing for ${file.path} due to error`);
      }
    }

    done();
  }
}
