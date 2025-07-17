/**
 * Script to check for missing translations between language files
 *
 * Usage: node scripts/i18n/check-missing.cjs
 */

const fs = require('fs');
const path = require('path');

// Configuration
const LOCALES_DIR = path.join(__dirname, '../../src/locales');
const LANGUAGES = ['en', 'ro'];
const PRIMARY_LANGUAGE = 'en';

// ANSI color codes for console output
const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

/**
 * Load translation file
 * @param {string} language - Language code
 * @returns {Object} - Translation object
 */
function loadTranslations(language) {
  const filePath = path.join(LOCALES_DIR, language, 'translation.json');
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error(`${COLORS.red}Error loading translations for ${language}:${COLORS.reset}`, err.message);
    process.exit(1);
  }
}

/**
 * Check for missing translations
 * @param {Object} primaryTranslations - Primary language translations
 * @param {Object} secondaryTranslations - Secondary language translations
 * @param {string} language - Secondary language code
 * @returns {Array} - Array of missing keys
 */
function checkMissingTranslations(primaryTranslations, secondaryTranslations, language) {
  const missingKeys = [];
  const emptyKeys = [];

  // Check for missing or empty translations
  Object.keys(primaryTranslations).forEach(key => {
    if (!(key in secondaryTranslations)) {
      missingKeys.push(key);
    } else if (secondaryTranslations[key] === '') {
      emptyKeys.push(key);
    }
  });

  // Print results
  if (missingKeys.length > 0) {
    console.log(`${COLORS.red}Missing translations in ${language}.json:${COLORS.reset}`);
    missingKeys.forEach(key => {
      console.log(`  - ${key}`);
    });
  }

  if (emptyKeys.length > 0) {
    console.log(`${COLORS.yellow}Empty translations in ${language}.json:${COLORS.reset}`);
    emptyKeys.forEach(key => {
      console.log(`  - ${key}`);
    });
  }

  // Check for extra keys in secondary language
  const extraKeys = [];
  Object.keys(secondaryTranslations).forEach(key => {
    if (!(key in primaryTranslations)) {
      extraKeys.push(key);
    }
  });

  if (extraKeys.length > 0) {
    console.log(`${COLORS.blue}Extra keys in ${language}.json (not in ${PRIMARY_LANGUAGE}.json):${COLORS.reset}`);
    extraKeys.forEach(key => {
      console.log(`  - ${key}`);
    });
  }

  return { missingKeys, emptyKeys, extraKeys };
}

// Main function
function main() {
  console.log(`${COLORS.cyan}Checking for missing translations...${COLORS.reset}`);

  // Load primary language translations
  const primaryTranslations = loadTranslations(PRIMARY_LANGUAGE);

  // Check each secondary language
  const secondaryLanguages = LANGUAGES.filter(lang => lang !== PRIMARY_LANGUAGE);
  let hasIssues = false;

  secondaryLanguages.forEach(language => {
    const secondaryTranslations = loadTranslations(language);
    const { missingKeys, emptyKeys, extraKeys } = checkMissingTranslations(
      primaryTranslations,
      secondaryTranslations,
      language
    );

    if (missingKeys.length > 0 || emptyKeys.length > 0) {
      hasIssues = true;
    }
  });

  if (!hasIssues) {
    console.log(`${COLORS.green}All translations are complete!${COLORS.reset}`);
  } else {
    console.log(`${COLORS.yellow}Please add the missing translations to complete the localization.${COLORS.reset}`);
  }
}

// Run the script
main();
