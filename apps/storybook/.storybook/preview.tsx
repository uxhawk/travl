import { useEffect } from 'react';
import type { Decorator, Preview } from '@storybook/react-vite';
import './preview.css';

/**
 * Theme switching here uses the exact mechanism a real consumer uses:
 * `data-theme` on <html>. No Storybook-only theming shim — if the toolbar
 * works, the token pipeline works.
 */
const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme as 'light' | 'dark';

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
    // Also color the canvas chrome so screenshots aren't half-themed.
    document.body.style.backgroundColor = 'var(--color-bg-base)';
    document.body.style.color = 'var(--color-text-primary)';
  }, [theme]);

  return <Story />;
};

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Token theme, applied as data-theme on <html>',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  decorators: [withTheme],
  parameters: {
    layout: 'centered',
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    a11y: {
      // Surface violations in the panel rather than failing the story, so
      // reviewers see the finding in context. CI runs the contrast gate
      // separately as the hard block.
      test: 'todo',
    },
    docs: {
      toc: true,
    },
  },
};

export default preview;