import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CategoryPicker, type Category } from '@travl/ui';

const meta = {
  title: 'Primitives/CategoryPicker',
  component: CategoryPicker,
  // Every story below drives its own state through `Controlled`; these args
  // exist so the Docs props table has something to describe.
  args: {
    label: 'Category',
    value: undefined,
    onValueChange: () => {},
  },
  parameters: {
    docs: {
      description: {
        component:
          'A radiogroup, not a row of toggles. Arrow keys move between categories and only the selected chip is a tab stop — try tabbing in and pressing →.',
      },
    },
  },
} satisfies Meta<typeof CategoryPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

function Controlled(props: { size?: 'sm' | 'md'; disabled?: boolean; initial?: Category }) {
  const [value, setValue] = useState<Category | undefined>(props.initial);
  return (
    <div style={{ display: 'grid', gap: 'var(--space-3)', inlineSize: '28rem' }}>
      <CategoryPicker
        label="Category"
        value={value}
        onValueChange={setValue}
        size={props.size}
        disabled={props.disabled}
      />
      <p className="tv-text-body-sm" style={{ color: 'var(--color-text-muted)' }}>
        Selected: <code className="tv-text-data-sm">{value ?? 'none'}</code>
      </p>
    </div>
  );
}

export const Default: Story = {
  render: () => <Controlled initial="dining" />,
};

export const NothingSelected: Story = {
  render: () => <Controlled />,
  parameters: {
    docs: {
      description: {
        story:
          'The initial state of the add-activity form. No category is preselected, because guessing one produces silently mis-categorised activities.',
      },
    },
  },
};

export const Small: Story = {
  render: () => <Controlled size="sm" initial="concerts" />,
};

export const Disabled: Story = {
  render: () => <Controlled disabled initial="coffee" />,
};