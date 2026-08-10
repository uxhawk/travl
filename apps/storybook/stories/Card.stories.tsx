import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Button,
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Chip,
  EmptyState,
} from '@travl/ui';

const meta = {
  title: 'Primitives/Card',
  component: Card,
  argTypes: {
    variant: { control: 'inline-radio', options: ['raised', 'inset', 'outline'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { variant: 'raised', size: 'md' },
  render: (args) => (
    <Card {...args} style={{ inlineSize: '22rem' }}>
      <CardHeader>
        <CardTitle>Barcelona</CardTitle>
        <Chip category="outdoors" size="sm" />
      </CardHeader>
      <CardDescription>5 days · 12 activities</CardDescription>
      <CardFooter>
        <Button size="sm" variant="secondary">
          Open
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
      {(['raised', 'inset', 'outline'] as const).map((variant) => (
        <Card key={variant} variant={variant} style={{ inlineSize: '14rem' }}>
          <CardTitle>{variant}</CardTitle>
          <CardDescription>Surface variant</CardDescription>
        </Card>
      ))}
    </div>
  ),
};

/**
 * `interactive` only styles the affordance. The card must still BE a control —
 * rendered here through `asChild` as a real button, so it is focusable and
 * responds to Enter and Space for free.
 */
export const Interactive: Story = {
  render: () => (
    <Card interactive asChild style={{ inlineSize: '22rem' }}>
      <button type="button" onClick={() => {}}>
        <CardHeader>
          <CardTitle>Lisbon</CardTitle>
          <Chip category="dining" size="sm" />
        </CardHeader>
        <CardDescription>3 days · 7 activities</CardDescription>
      </button>
    </Card>
  ),
};

export const WithEmptyState: Story = {
  render: () => (
    <Card variant="outline" style={{ inlineSize: '26rem' }}>
      <EmptyState
        title="No trips yet"
        description="Plan your first trip and it'll show up here."
        action={<Button size="sm">Create a trip</Button>}
      />
    </Card>
  ),
};