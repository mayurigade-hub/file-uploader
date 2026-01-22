import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],

  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs"
  ],

  framework: {
    name: "@storybook/react-vite",
    options: {}
  },

  viteFinal: async (config) => {
    // Add Tailwind CSS v4 plugin
    config.plugins = config.plugins || [];
    config.plugins.push(tailwindcss());

    // Fix dynamic import issues
    if (config.optimizeDeps) {
      config.optimizeDeps.include = [
        ...(config.optimizeDeps.include || []),
        '@storybook/blocks'
      ];
    }
    return config;
  }
};

export default config;
