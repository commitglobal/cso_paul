/**
 * Script to validate translation files for syntax errors and other issues
 *
 * Usage: node scripts/i18n/validate.cjs
 */

const fs = require('fs');
const path = require('path');

// Configuration
const LOCALES_DIR = path.join(__dirname, '../../src/locales');
const LANGUAGES = ['en', 'ro'];

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
 * Validate a translation file
 * @param {string} language - Language code
 * @returns {Object} - Validation results
 */
function validateTranslationFile(language) {
  const filePath = path.join(LOCALES_DIR, language, 'translation.json');
  const issues = [];

  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      issues.push(`Translation file ${filePath} for ${language} does not exist`);
      return { valid: false, issues };
    }

    // Read file content
    const content = fs.readFileSync(filePath, 'utf8');

    // Check if file is empty
    if (!content.trim()) {
      issues.push(`Translation file ${filePath} for ${language} is empty`);
      return { valid: false, issues };
    }

    // Try to parse JSON
    let translations;
    try {
      translations = JSON.parse(content);
    } catch (err) {
      issues.push(`Invalid JSON in ${filePath}: ${err.message}`);
      return { valid: false, issues };
    }

    // Check if translations is an object
    if (typeof translations !== 'object' || translations === null || Array.isArray(translations)) {
      issues.push(`Translations for ${language} should be an object`);
      return { valid: false, issues };
    }

    // Check for empty keys
    Object.keys(translations).forEach(key => {
      if (!key.trim()) {
        issues.push(`Empty key found in ${filePath}`);
      }
    });

    // Check for interpolation syntax errors
    Object.entries(translations).forEach(([key, value]) => {
      if (typeof value === 'string') {
        // Check for unbalanced interpolation braces
        const openBraces = (value.match(/{{/g) || []).length;
        const closeBraces = (value.match(/}}/g) || []).length;

        if (openBraces !== closeBraces) {
          issues.push(`Unbalanced interpolation braces in key "${key}" in ${filePath}`);
        }
      }
    });

    return {
      valid: issues.length === 0,
      issues,
    };
  } catch (err) {
    issues.push(`Error validating ${filePath}: ${err.message}`);
    return { valid: false, issues };
  }
}

/**
 * Main function
 */
function main() {
  console.log(`${COLORS.cyan}Validating translation files...${COLORS.reset}`);

  let allValid = true;

  // Validate each language file
  LANGUAGES.forEach(language => {
    const { valid, issues } = validateTranslationFile(language);

    if (!valid) {
      allValid = false;
      console.log(`${COLORS.red}Issues found for ${language}:${COLORS.reset}`);
      issues.forEach(issue => {
        console.log(`  - ${issue}`);
      });
    } else {
      console.log(`${COLORS.green}${language} is valid${COLORS.reset}`);
    }
  });

  if (allValid) {
    console.log(`${COLORS.green}All translation files are valid!${COLORS.reset}`);
    process.exit(0);
  } else {
    console.log(`${COLORS.yellow}Please fix the issues in the translation files.${COLORS.reset}`);
    process.exit(1);
  }
}

// Run the script
main();
