import tseslint from 'typescript-eslint'
import astro from 'eslint-plugin-astro'
import { defineConfig } from 'eslint/config'
export default defineConfig({ignores:['dist/**','.astro/**','.vite/**','node_modules/**','playwright-report/**','test-results/**']}, ...tseslint.configs.recommended, ...astro.configs['flat/recommended'])
