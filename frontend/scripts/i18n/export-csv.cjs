/**
 * Script to export translations to CSV format
 *
 * Usage: node scripts/i18n/export-csv.cjs
 */

const fs = require('fs');
const path = require('path');

// Configuration
const LOCALES_DIR = path.join(__dirname, '../src/locales');
const EXPORTS_DIR = path.join(__dirname, '../exports');
const LANGUAGES = ['en', 'ro'];
const CSV_FILE = path.join(EXPORTS_DIR, 'translations.csv');

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
  const filePath = path.join(LOCALES_DIR, `${language}.json`);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error(`${COLORS.red}Error loading translations for ${language}:${COLORS.reset}`, err.message);
    process.exit(1);
  }
}

/**
 * Escape CSV field
 * @param {string} field - Field to escape
 * @returns {string} - Escaped field
 */
function escapeCSV(field) {
  if (field === null || field === undefined) {
    return '';
  }

  // Convert to string
  field = String(field);

  // If the field contains quotes, commas, or newlines, wrap it in quotes and escape internal quotes
  if (field.includes('"') || field.includes(',') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }

  return field;
}

/**
 * Export translations to CSV
 * @param {Object} allTranslations - Object with translations for all languages
 * @param {string} outputFile - Path to output CSV file
 */
function exportToCSV(allTranslations, outputFile) {
  try {
    // Create exports directory if it doesn't exist
    if (!fs.existsSync(EXPORTS_DIR)) {
      fs.mkdirSync(EXPORTS_DIR, { recursive: true });
    }

    // Get all unique keys from all languages
    const allKeys = new Set();
    Object.values(allTranslations).forEach(translations => {
      Object.keys(translations).forEach(key => allKeys.add(key));
    });

    // Sort keys alphabetically
    const sortedKeys = Array.from(allKeys).sort();

    // Create CSV header
    let csv = `key,${LANGUAGES.join(',')}\n`;

    // Add rows for each key
    sortedKeys.forEach(key => {
      const row = [key];

      // Add translation for each language
      LANGUAGES.forEach(lang => {
        const translation = allTranslations[lang][key] || '';
        row.push(translation);
      });

      // Add row to CSV
      csv += row.map(escapeCSV).join(',') + '\n';
    });

    // Write CSV to file
    fs.writeFileSync(outputFile, csv);

    console.log(`${COLORS.green}Translations exported to ${outputFile}${COLORS.reset}`);
  } catch (err) {
    console.error(`${COLORS.red}Error exporting translations to CSV:${COLORS.reset}`, err.message);
    process.exit(1);
  }
}

/**
 * Main function
 */
function main() {
  console.log(`${COLORS.cyan}Exporting translations to CSV...${COLORS.reset}`);

  // Load translations for all languages
  const allTranslations = {};
  LANGUAGES.forEach(language => {
    allTranslations[language] = loadTranslations(language);
  });

  // Export to CSV
  exportToCSV(allTranslations, CSV_FILE);
}

// Run the script
main();
