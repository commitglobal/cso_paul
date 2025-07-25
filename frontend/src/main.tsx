import { createInertiaApp } from '@inertiajs/react'
import { ErrorBoundary } from 'react-error-boundary'
import { createRoot } from 'react-dom/client'
import { Fallback } from './components/paul/fallback.tsx'
import type { Page } from '@inertiajs/core'
import BaseLayout from './layouts/base-layout';
import { I18nextProvider } from 'react-i18next';
import { NuqsAdapter } from "nuqs/adapters/react";
import i18n from './i18n';
import './index.css'

const pages = import.meta.glob('./pages/**/*.tsx')

document.addEventListener('DOMContentLoaded', () => {
  createInertiaApp({
    resolve: async (name) => {
      const page = (await pages[`./pages/${name}.tsx`]() as { default: Page }).default;

      // @ts-expect-error: TypeScript does not recognize the layout property on Page, although it is used by Inertia.js
      page.layout = page.layout || BaseLayout;

      return page
    },
    setup({el, App, props}) {
      const language = typeof props.initialPage.props.language === 'string' ? props.initialPage.props.language : 'en';
      if (language && i18n.language !== language) {
        i18n.changeLanguage(language);
      }

      createRoot(el).render(
        <ErrorBoundary FallbackComponent={Fallback}>
          <I18nextProvider i18n={i18n}>
            <NuqsAdapter>
              <App {...props} />
            </NuqsAdapter>
          </I18nextProvider>
        </ErrorBoundary>
      )
    }
  })
})
