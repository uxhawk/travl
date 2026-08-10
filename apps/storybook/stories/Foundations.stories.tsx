import type { CSSProperties, ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Foundations render the published token artifacts directly. Nothing here is
 * hand-authored: every swatch and every line of type reads a CSS variable
 * that shipped from Figma. Flip the theme toolbar to check both modes.
 */
const meta: Meta = {
  title: 'Foundations/Tokens',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

const GROUPS: { name: string; tokens: string[] }[] = [
  {
    name: 'Background',
    tokens: ['bg-base', 'bg-surface', 'bg-surface-raised', 'bg-inset'],
  },
  {
    name: 'Text',
    tokens: [
      'text-primary',
      'text-secondary',
      'text-muted',
      'text-link',
      'text-on-primary',
      'text-on-accent',
      'text-on-destructive',
    ],
  },
  {
    name: 'Border',
    tokens: ['border-subtle', 'border-default', 'border-strong', 'border-focus'],
  },
  {
    name: 'Action',
    tokens: [
      'action-primary',
      'action-primary-hover',
      'action-primary-active',
      'action-accent',
      'action-destructive',
      'action-destructive-hover',
      'action-disabled-bg',
      'action-disabled-fg',
    ],
  },
  {
    name: 'Status',
    tokens: [
      'status-success-soft',
      'status-success-fg',
      'status-success-solid',
      'status-warning-soft',
      'status-warning-fg',
      'status-warning-solid',
      'status-danger-soft',
      'status-danger-fg',
      'status-danger-solid',
    ],
  },
];

const CATEGORY_TOKENS = [
  'dining',
  'coffee',
  'outdoors',
  'shopping',
  'museums',
  'concerts',
];

function Swatch({ token }: { token: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
      <div
        style={{
          inlineSize: 'var(--space-10)',
          blockSize: 'var(--space-10)',
          borderRadius: 'var(--radius-md)',
          backgroundColor: `var(--color-${token})`,
          border: '1px solid var(--color-border-subtle)',
          flexShrink: 0,
        }}
      />
      <code
        className="tv-text-data-sm"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        --color-{token}
      </code>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ display: 'grid', gap: 'var(--space-4)' }}>
      <h3 className="tv-text-display-sm" style={{ color: 'var(--color-text-primary)' }}>
        {title}
      </h3>
      {children}
    </section>
  );
}

const page: CSSProperties = {
  padding: 'var(--space-8)',
  display: 'grid',
  gap: 'var(--space-10)',
  backgroundColor: 'var(--color-bg-base)',
  minBlockSize: '100vh',
};

export const Color: Story = {
  render: () => (
    <div style={page}>
      {GROUPS.map((group) => (
        <Section key={group.name} title={group.name}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(18rem, 1fr))',
              gap: 'var(--space-3)',
            }}
          >
            {group.tokens.map((t) => (
              <Swatch key={t} token={t} />
            ))}
          </div>
        </Section>
      ))}

      <Section title="Category">
        <p className="tv-text-body-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Six categories, three tokens each. <code>on-soft</code> is
          contrast-checked against <code>soft</code> in both themes by the CI
          gate — that pairing is what Chip and ActivityCard render.
        </p>
        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
          {CATEGORY_TOKENS.map((c) => (
            <div
              key={c}
              style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}
            >
              <Swatch token={`category-${c}-soft`} />
              <Swatch token={`category-${c}-on-soft`} />
              <Swatch token={`category-${c}-solid`} />
            </div>
          ))}
        </div>
      </Section>
    </div>
  ),
};

const TYPE_ROLES = [
  'display-lg',
  'display-md',
  'display-sm',
  'body-lg',
  'body-md',
  'body-sm',
  'label-lg',
  'label-md',
  'label-sm',
  'data-md',
  'data-sm',
];

export const Typography: Story = {
  render: () => (
    <div style={page}>
      <Section title="Type roles">
        <p className="tv-text-body-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Each role bundles family, size, leading, weight and tracking. Callers
          pick a role, never a size — that is what stops a 15px semibold from
          appearing in the wild.
        </p>
        <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
          {TYPE_ROLES.map((role) => (
            <div key={role} style={{ display: 'grid', gap: 'var(--space-1)' }}>
              <code
                className="tv-text-data-sm"
                style={{ color: 'var(--color-text-muted)' }}
              >
                .tv-text-{role}
              </code>
              <p
                className={`tv-text-${role}`}
                style={{ color: 'var(--color-text-primary)' }}
              >
                Watch the sunset from Bernal Heights
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Spacing & radius">
        <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          {['1', '2', '3', '4', '6', '8', '12', '16'].map((s) => (
            <div key={s} style={{ display: 'grid', gap: 'var(--space-1)' }}>
              <div
                style={{
                  inlineSize: `var(--space-${s})`,
                  blockSize: 'var(--space-8)',
                  backgroundColor: 'var(--color-action-primary)',
                  borderRadius: 'var(--radius-sm)',
                }}
              />
              <code
                className="tv-text-data-sm"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {s}
              </code>
            </div>
          ))}
        </div>
      </Section>
    </div>
  ),
};