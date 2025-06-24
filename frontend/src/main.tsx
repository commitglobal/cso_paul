import { createInertiaApp } from '@inertiajs/react'
import { ErrorBoundary } from 'react-error-boundary'
import { createRoot } from 'react-dom/client'
import { Fallback } from './components/paul/fallback.tsx'
import type { Page } from '@inertiajs/core'
import './index.css'

const pages = import.meta.glob('./pages/**/*.tsx')

document.addEventListener('DOMContentLoaded', () => {
  createInertiaApp({
    resolve: async (name) =>
      (await pages[`./pages/${name}.tsx`]() as { default: Page }).default,
    setup({ el, App, props }) {
      createRoot(el).render(
        <ErrorBoundary FallbackComponent={Fallback}>
          <App {...props} />
        </ErrorBoundary>
      )
    }
  })
})
