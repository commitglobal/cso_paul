import { createInertiaApp } from '@inertiajs/react';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { createRoot } from 'react-dom/client';
import { Fallback } from './components/Fallback';
import LayoutDefault from './layouts/LayoutDefault';
import './index.css';

const pages = import.meta.glob('./pages/**/*.tsx');

document.addEventListener('DOMContentLoaded', () => {
  createInertiaApp({
    resolve: async (name) => {
      const page = (await pages[`./pages/${name}.tsx`]()).default;
      page.layout = page.layout || LayoutDefault;

      return page;
    },
    setup({ el, App, props }) {
      createRoot(el).render(
        <ErrorBoundary FallbackComponent={Fallback}>
          <App {...props} />
        </ErrorBoundary>,
      );
    },
  });
});
