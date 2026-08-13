// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://dncold.github.io',
  base: process.env.NODE_ENV === 'production' ? '/website' : '/',
  trailingSlash: 'always',
  integrations: [mdx(), sitemap()],
  build: {
    assets: 'assets',
  },
});
