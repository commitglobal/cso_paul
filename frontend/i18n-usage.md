# i18n Translation Management

This document explains how to use the i18next-scanner to manage translations in the project.

## Running the Scanner

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

The scanner configuration is defined in `i18next-scanner.config.js`. If you need to modify the scanner behavior, such as adding more languages or changing file patterns, edit this file.

## Best Practices

1. Use descriptive, hierarchical keys (e.g., `common.buttons.submit` instead of just `submit`)
2. Run the scanner regularly to keep translation files up-to-date
3. Provide default text in your code to make development easier
4. Add comments for translators when the context might not be clear
