// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://yli769227-jpg.github.io',
	base: '/ai-thoughts',
	integrations: [mdx(), sitemap()],
});
