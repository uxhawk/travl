import { useState } from 'react';
import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, ConfirmDialog } from '@travl/ui';

const meta = {
  title: 'Primitives/Button',
  component: Button,
  args: { children: 'Add activity' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'accent', 'destructive'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const row: CSSProperties = {
  display: 'flex',
  gap: 'var(--space-3)',
  alignItems: 'center',
  flexWrap: 'wrap',
};

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={row}>
      <Button {...args} variant="primary">
        Primary
      </Button>
      <Button {...args} variant="secondary">
        Secondary
      </Button>
      <Button {...args} variant="ghost">
        Ghost
      </Button>
      <Button {...args} variant="accent">
        Accent
      </Button>
      <Button {...args} variant="destructive">
        Destructive
      </Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={row}>
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Disabled buttons are deliberately exempt from the WCAG AA floor. Meeting contrast on an inert control makes it read as available — the low contrast IS the signal.',
      },
    },
  },
  render: (args) => (
    <div style={row}>
      <Button {...args} disabled variant="primary">
        Primary
      </Button>
      <Button {...args} disabled variant="secondary">
        Secondary
      </Button>
      <Button {...args} disabled variant="destructive">
        Destructive
      </Button>
    </div>
  ),
};

export const IconOnly: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`iconOnly` requires `aria-label` at the type level — omitting it is a TypeScript error, not a review finding.',
      },
    },
  },
  render: (args) => (
    <div style={row}>
      <Button {...args} iconOnly aria-label="Remove activity" variant="ghost" size="sm">
        <TrashIcon />
      </Button>
      <Button {...args} iconOnly aria-label="Remove activity" variant="secondary">
        <TrashIcon />
      </Button>
      <Button {...args} iconOnly aria-label="Remove activity" variant="destructive" size="lg">
        <TrashIcon />
      </Button>
    </div>
  ),
};

export const FullWidth: Story = {
  render: (args) => (
    <div style={{ inlineSize: '20rem' }}>
      <Button {...args} fullWidth>
        Create trip
      </Button>
    </div>
  ),
};

/**
 * The governance story: Button styles a destructive action but never confirms
 * it. This is what "confirmation is the caller's job" looks like in practice.
 */
export const DestructiveWithConfirmation: Story = {
  parameters: { docs: { description: { story: 'Destructive + ConfirmDialog, the sanctioned pairing.' } } },
  render: () => {
    const [open, setOpen] = useState(false);
    const [deleted, setDeleted] = useState(false);
    return (
      <div style={{ display: 'grid', gap: 'var(--space-3)', justifyItems: 'start' }}>
        <Button variant="destructive" onClick={() => setOpen(true)} disabled={deleted}>
          Delete trip
        </Button>
        {deleted ? (
          <p className="tv-text-body-sm" style={{ color: 'var(--color-text-muted)' }}>
            Trip deleted.
          </p>
        ) : null}
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="Delete this trip?"
          description="Barcelona, 5 days and 12 activities. This cannot be undone."
          confirmLabel="Delete trip"
          onConfirm={() => setDeleted(true)}
        />
      </div>
    );
  },
};

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 4.5h10M6.5 4.5V3.2c0-.4.3-.7.7-.7h1.6c.4 0 .7.3.7.7v1.3M4.5 4.5l.6 8c0 .5.4.9.9.9h4c.5 0 .9-.4.9-.9l.6-8"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}