import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
export default defineConfig({site:'https://matheusode.me',output:'static',trailingSlash:'always',integrations:[mdx(),sitemap()]});
