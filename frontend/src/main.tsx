import { createInertiaApp } from '@inertiajs/react'
import { ErrorBoundary } from 'react-error-boundary'
import { createRoot } from 'react-dom/client'
import { Fallback } from './components/paul/Fallback.tsx'
import './index.css'
import * as React from 'react'

const pages = import.meta.glob('./pages/**/*.tsx')

document.addEventListener('DOMContentLoaded', () => {
  createInertiaApp({
    resolve: async (name) => {
      return (await (await pages[`./pages/${name}.tsx`]() as Promise<{ default: React.ComponentType<any> }>)).default
    },
    setup({ el, App, props }) {
      createRoot(el).render(
        <ErrorBoundary FallbackComponent={Fallback}>
          <App {...props} />
        </ErrorBoundary>
      )
    }
  })
})
