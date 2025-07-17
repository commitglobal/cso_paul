const fs = require('fs')
const path = require('path')

// Function to load existing translations
function loadExistingTranslations(lng) {
  const filePath = path.join(__dirname, 'src/locales', lng, 'translation.json')
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8')
      return JSON.parse(content)
    }
  } catch (err) {
    console.error(`Error loading existing translations for ${lng}:`, err)
  }
  return {}
}

// Load existing translations
const existingTranslations = {
  en: loadExistingTranslations('en'),
  ro: loadExistingTranslations('ro')
}
console.log('Loaded existing translations:', JSON.stringify(existingTranslations, null, 2))

// Utility to get nested value by dot-separated key
function getNested(obj, key) {
  return key.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj)
}

// Deep merge utility for nested objects
function deepMerge(target, source) {
  for (const key in source) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key])
    ) {
      if (!target[key] || typeof target[key] !== 'object') {
        target[key] = {}
      }
      deepMerge(target[key], source[key])
    } else {
      target[key] = source[key]
    }
  }
  return target
}

module.exports = {
  input: [
    'src/**/*.{js,jsx,ts,tsx}',
    // Exclude test files
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/*.spec.{js,jsx,ts,tsx}',
    '!**/node_modules/**'
  ],
  output: './',
  options: {
    defaultLng: 'en',
    defaultNs: 'translation',
    defaultValue: function(lng, ns, key) {
      // Use getNested to support nested keys
      const existing = existingTranslations[lng] && getNested(existingTranslations[lng], key)
      if (existing !== undefined) {
        return existing
      }
      return ''
    },
    func: {
      list: ['t', 'i18next.t', 'i18n.t'],
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    interpolation: {
      prefix: '{{',
      suffix: '}}'
    },
    keySeparator: '.',
    lngs: ['en', 'ro'],
    ns: ['translation'],
    // Use a function to preserve existing translations
    nsSeparator: false,
    removeUnusedKeys: false,
    // Custom resource handler to merge with existing translations
    resource: {
      loadPath: 'src/locales/{{lng}}/translation.json',
      savePath: 'src/locales/{{lng}}/translation.json',
      jsonIndent: 2,
      lineEnding: '\n',
      parse: function(data) {
        // Parse and return existing translations
        return JSON.parse(data)
      },
      stringify: function(resource) {
        // Deep merge with existing translations before saving
        const lng = this.options.lngs[0] // Only works for single language at a time
        const merged = deepMerge(
          {},
          existingTranslations[lng] || {}
        )
        deepMerge(merged, resource)
        return JSON.stringify(merged, null, 2)
      }
    }, // Set to false to disable namespace separator
    sort: true, // Key separator used in translation keys
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
        allowImportExportEverywhere: true
      }
    }
  },
  // Custom transform function to handle TypeScript files better
  transform: function customTransform(file, enc, done) {
    const parser = this.parser
    const content = fs.readFileSync(file.path, enc)

    // Parse translation function calls
    parser.parseFuncFromString(content, { list: ['t', 'i18next.t', 'i18n.t'] }, (key, options) => {
      parser.set(key, options)
    })

    // Skip Trans component parsing for TypeScript files to avoid errors
    if (!file.path.endsWith('.ts') && !file.path.endsWith('.tsx')) {
      try {
        parser.parseTransFromString(content)
      } catch (error) {
        console.log(`i18next-scanner: Skipping Trans parsing for ${file.path} due to error`)
      }
    }

    done()
  }
}
