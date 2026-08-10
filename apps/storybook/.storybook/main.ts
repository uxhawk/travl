import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';

const here = dirname(fileURLToPath(import.meta.url));
const uiSrc = resolve(here, '../../../packages/ui/src');

const config: StorybookConfig = {
  stories: [join(here, '../stories/**/*.mdx'), join(here, '../stories/**/*.stories.tsx')],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    // Props tables are generated from the real TS types, so the JSDoc
    // Figma contracts on each component surface in Docs.
    reactDocgen: 'react-docgen-typescript',
  },
  viteFinal: async (viteConfig) => {
    viteConfig.resolve ??= {};
    // Point at source, not dist: editing a component hot-reloads the story
    // instead of requiring a package rebuild.
    viteConfig.resolve.alias = {
      ...viteConfig.resolve.alias,
      '@travl/ui': resolve(uiSrc, 'index.ts'),
    };
    return viteConfig;
  },
};

export default config;