# i18n Translation Management

This document explains how to use the i18n tools to manage translations in the project.

## Available Scripts

The project includes several scripts to help manage translations:

### Scanning for Translation Keys

To scan your codebase for translation keys and update the locale files, run:

```bash
npm run i18n:scan
# or if you're using yarn
yarn i18n:scan
```

This command will:
1. Scan all JS, JSX, TS, and TSX files in the `src` directory
2. Extract translation keys from t() function calls and Trans components
3. Update the locale files in `src/locales` (en.json and ro.json)

### Generating TypeScript Types

To generate TypeScript type definitions from your translation files, run:

```bash
npm run i18n:generate-types
# or if you're using yarn
yarn i18n:generate-types
```

This command will create a TypeScript interface definition file at `src/types/i18n.d.ts` that provides type safety when using translations in your code.

### Checking for Missing Translations

To check for missing or empty translations between language files, run:

```bash
npm run i18n:check-missing
# or if you're using yarn
yarn i18n:check-missing
```

This command will compare all language files and report:
- Missing keys (keys in primary language but not in secondary)
- Empty translations (keys with empty values)
- Extra keys (keys in secondary language but not in primary)

### Validating Translation Files

To validate translation files for syntax errors and other issues, run:

```bash
npm run i18n:validate
# or if you're using yarn
yarn i18n:validate
```

This command will check each translation file for:
- JSON syntax errors
- Empty keys
- Interpolation syntax errors (unbalanced braces)

### Exporting Translations to CSV

To export translations to CSV format for easier collaboration with translators, run:

```bash
npm run i18n:export-csv
# or if you're using yarn
yarn i18n:export-csv
```

This command will create a CSV file at `exports/translations.csv` with columns for the key and each language.

### Importing Translations from CSV

To import translations from CSV back into the JSON files, run:

```bash
npm run i18n:import-csv [path/to/csv]
# or if you're using yarn
yarn i18n:import-csv [path/to/csv]
```

If no CSV file is specified, it will use the default path (`exports/translations.csv`).

## How to Use Translations in Your Code

### Using the t() function

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('pageTitle')}</h1>
      <p>{t('welcomeMessage')}</p>
    </div>
  );
}
```

### Using the Trans component

```tsx
import { Trans } from 'react-i18next';

function MyComponent() {
  return (
    <div>
      <Trans i18nKey="richTextExample">
        This is <strong>rich text</strong> with <a href="/link">a link</a>
      </Trans>
    </div>
  );
}
```

## Configuration

The scanner configuration is defined in `i18next-scanner.config.cjs`. If you need to modify the scanner behavior, such as adding more languages or changing file patterns, edit this file.

### Preserving Existing Translations

The scanner is configured to preserve existing translations when scanning your codebase. This means that if you've already translated a key, the scanner will not overwrite it with an empty string. Only new keys will be added with empty values.

### TypeScript Parsing Errors

When running the scanner, you may see TypeScript parsing errors in the console output. These errors are related to parsing the Trans component in TypeScript files and don't affect the functionality of the scanner. The scanner will still extract translation keys from function calls and preserve existing translations.

### Configuration Options

Some important configuration options in the scanner:

- `debug`: Set to `true` to see detailed output during scanning
- `removeUnusedKeys`: Set to `false` to prevent removing keys that are no longer used in the code
- `defaultValue`: A function that preserves existing translations
- `trans.acorn`: Configuration for the parser that handles TypeScript files

## Best Practices

1. Use descriptive, hierarchical keys (e.g., `common.buttons.submit` instead of just `submit`)
2. Run the scanner regularly to keep translation files up-to-date
3. Provide default text in your code to make development easier
4. Add comments for translators when the context might not be clear
5. When adding new translations, edit the locale files directly rather than relying on the scanner to extract default values
6. If you see TypeScript parsing errors, you can safely ignore them as long as your translation keys are being extracted correctly
