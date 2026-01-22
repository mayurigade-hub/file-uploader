import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';

const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  // 🔥 REQUIRED for GitHub Pages
  base: "/file-uploader/",

  plugins: [
    react(),
    tailwindcss()
  ],

  test: {
    projects: [
      {
        extends: true,

        plugins: [
          storybookTest({
            configDir: path.join(dirname, '.storybook')
          })
        ],

        test: {
          name: 'storybook',

          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              { browser: 'chromium' }
            ]
          },

          setupFiles: ['.storybook/vitest.setup.ts']
        }
      }
    ]
  }
});
