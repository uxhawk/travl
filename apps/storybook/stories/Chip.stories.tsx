import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CATEGORIES, CategoryPicker, Chip, type Category } from '@travl/ui';

const meta = {
  title: 'Primitives/Chip',
  component: Chip,
  argTypes: {
    category: {
      control: 'select',
      options: CATEGORIES.map((c) => c.id),
    },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
  args: { category: 'coffee' },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/**
 * The full category set. Each row is one token family; adding a seventh
 * category means adding tokens and one CATEGORIES entry — no CSS logic
 * changes.
 */
export const AllCategories: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
      {CATEGORIES.map((c) => (
        <Chip key={c.id} category={c.id} />
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
      <Chip category="museums" size="sm" />
      <Chip category="museums" size="md" />
    </div>
  ),
};

export const WithoutCategory: Story = {
  args: { category: undefined, children: 'Draft' },
  parameters: {
    docs: {
      description: {
        story: 'A neutral chip for non-category metadata. No dot, no hue.',
      },
    },
  },
};

/**
 * UX review case: selection must survive grayscale. Screenshot this story
 * with a grayscale filter — the border and dot still distinguish the
 * selected chip once hue is gone.
 */
export const SelectionWithoutColor: Story = {
  render: () => {
    const [value, setValue] = useState<Category>('outdoors');
    return (
      <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
        <CategoryPicker label="Category" value={value} onValueChange={setValue} />
        <div style={{ filter: 'grayscale(1)' }}>
          <p
            className="tv-text-label-sm"
            style={{ color: 'var(--color-text-muted)', marginBlockEnd: 'var(--space-2)' }}
          >
            Same picker, grayscale
          </p>
          <CategoryPicker
            label="Category (grayscale)"
            hideLabel
            value={value}
            onValueChange={setValue}
          />
        </div>
      </div>
    );
  },
};