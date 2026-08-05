// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import lenis from 'astro-lenis';
import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://dousec.org',
  i18n: {
    locales: ['es', 'en', 'pt'],
    defaultLocale: 'en',
    fallback: {
      pt: 'en',
    },
    routing: {
      fallbackType: 'rewrite',
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react(), lenis(), sitemap()],
});
