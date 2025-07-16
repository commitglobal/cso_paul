/**
 * Script to import translations from CSV format
 *
 * Usage: node scripts/i18n/import-csv.cjs [path/to/csv]
 *
 * If no CSV file is specified, it will use the default path (exports/translations.csv)
 */

const fs = require('fs');
const path = require('path');

// Configuration
const LOCALES_DIR = path.join(__dirname, '../src/locales');
const EXPORTS_DIR = path.join(__dirname, '../exports');
const LANGUAGES = ['en', 'ro'];
const DEFAULT_CSV_FILE = path.join(EXPORTS_DIR, 'translations.csv');

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
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    }
    return {};
  } catch (err) {
    console.error(`${COLORS.red}Error loading translations for ${language}:${COLORS.reset}`, err.message);
    return {};
  }
}

/**
 * Save translations to file
 * @param {string} language - Language code
 * @param {Object} translations - Translation object
 */
function saveTranslations(language, translations) {
  const filePath = path.join(LOCALES_DIR, `${language}.json`);
  try {
    const content = JSON.stringify(translations, null, 2);
    fs.writeFileSync(filePath, content);
    console.log(`${COLORS.green}Translations for ${language} saved to ${filePath}${COLORS.reset}`);
  } catch (err) {
    console.error(`${COLORS.red}Error saving translations for ${language}:${COLORS.reset}`, err.message);
  }
}

/**
 * Parse CSV line, handling quoted fields
 * @param {string} line - CSV line
 * @returns {Array} - Array of fields
 */
function parseCSVLine(line) {
  const fields = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      // Check if this is an escaped quote (double quote)
      if (i + 1 < line.length && line[i + 1] === '"') {
        field += '"';
        i++; // Skip the next quote
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      fields.push(field);
      field = '';
    } else {
      field += char;
    }
  }

  // Add the last field
  fields.push(field);

  return fields;
}

/**
 * Import translations from CSV
 * @param {string} csvFile - Path to CSV file
 */
function importFromCSV(csvFile) {
  try {
    // Check if CSV file exists
    if (!fs.existsSync(csvFile)) {
      console.error(`${COLORS.red}CSV file not found: ${csvFile}${COLORS.reset}`);
      process.exit(1);
    }

    // Read CSV file
    const csvContent = fs.readFileSync(csvFile, 'utf8');
    const lines = csvContent.split('\n').filter(line => line.trim());

    // Parse header to get language indices
    const header = parseCSVLine(lines[0]);
    const keyIndex = header.findIndex(col => col.toLowerCase() === 'key');

    if (keyIndex === -1) {
      console.error(`${COLORS.red}CSV file does not have a 'key' column${COLORS.reset}`);
      process.exit(1);
    }

    const langIndices = {};
    LANGUAGES.forEach(lang => {
      const index = header.findIndex(col => col.toLowerCase() === lang.toLowerCase());
      if (index !== -1) {
        langIndices[lang] = index;
      }
    });

    // Load existing translations
    const translations = {};
    LANGUAGES.forEach(lang => {
      translations[lang] = loadTranslations(lang);
    });

    // Parse CSV data
    let updatedCount = 0;
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;

      const fields = parseCSVLine(line);
      const key = fields[keyIndex];

      if (!key) {
        console.warn(`${COLORS.yellow}Skipping line ${i + 1}: No key found${COLORS.reset}`);
        continue;
      }

      // Update translations for each language
      Object.entries(langIndices).forEach(([lang, index]) => {
        if (index < fields.length) {
          const value = fields[index];

          // Only update if the value is different
          if (translations[lang][key] !== value) {
            translations[lang][key] = value;
            updatedCount++;
          }
        }
      });
    }

    // Save updated translations
    LANGUAGES.forEach(lang => {
      if (langIndices[lang]) {
        saveTranslations(lang, translations[lang]);
      }
    });

    console.log(`${COLORS.green}Import completed. Updated ${updatedCount} translations.${COLORS.reset}`);
  } catch (err) {
    console.error(`${COLORS.red}Error importing translations from CSV:${COLORS.reset}`, err.message);
    process.exit(1);
  }
}

/**
 * Main function
 */
function main() {
  // Get CSV file path from command line arguments or use default
  const csvFile = process.argv[2] || DEFAULT_CSV_FILE;

  console.log(`${COLORS.cyan}Importing translations from ${csvFile}...${COLORS.reset}`);

  // Import from CSV
  importFromCSV(csvFile);
}

// Run the script
main();
