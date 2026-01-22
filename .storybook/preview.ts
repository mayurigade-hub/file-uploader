import type { Preview } from '@storybook/react-vite';
import '../src/index.css';

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      // Disable File controls to prevent "Objects are not valid as React child" error
      exclude: ['file', 'command']
    },

    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f9fafb' },
        { name: 'dark', value: '#000000' }
      ]
    },

    a11y: {
      test: 'todo'
    }
  },
};

export default preview;
