import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { workSchema, writingSchema } from './lib/content';

export const collections = {
  work: defineCollection({ loader: glob({ pattern: '**/*.mdx', base: './src/content/work' }), schema: workSchema }),
  writing: defineCollection({ loader: glob({ pattern: '**/*.mdx', base: './src/content/writing' }), schema: writingSchema }),
};
