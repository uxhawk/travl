import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stepper, TextAreaField, TextField } from '@travl/ui';

const meta = {
  title: 'Primitives/Form controls',
  component: TextField,
  args: { label: 'Trip name' },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

const stack = {
  display: 'grid',
  gap: 'var(--space-5)',
  inlineSize: '24rem',
} as const;

export const TextFieldStates: Story = {
  render: () => (
    <div style={stack}>
      <TextField label="Trip name" placeholder="Barcelona with Sam" />
      <TextField
        label="Trip name"
        defaultValue="Barcelona"
        hint="Shown at the top of every day."
      />
      <TextField
        label="Trip name"
        defaultValue=""
        error="Give your trip a name so you can find it later."
      />
      <TextField label="Trip name" optional placeholder="Optional" />
      <TextField label="Trip name" disabled defaultValue="Locked" />
    </div>
  ),
};

/**
 * Governance case: when a field has both a hint and an error, only the error
 * is wired to aria-describedby. Inspect the input — after a failed submit a
 * screen reader user hears the error, not a stale hint.
 */
export const ErrorSupersedesHint: Story = {
  render: () => (
    <div style={stack}>
      <TextField
        label="Trip name"
        hint="This hint is hidden while the error is showing."
        error="Trip name is required."
      />
    </div>
  ),
};

export const TextArea: Story = {
  render: () => (
    <div style={stack}>
      <TextAreaField
        label="Note"
        optional
        placeholder="Address, booking reference, who's coming…"
        hint="Only you can see this."
      />
    </div>
  ),
};

export const StepperStates: Story = {
  render: () => {
    const [days, setDays] = useState(3);
    const [atMax, setAtMax] = useState(30);
    return (
      <div style={stack}>
        <Stepper
          label="Days"
          value={days}
          onValueChange={setDays}
          min={1}
          max={30}
          hint="How many days are you planning?"
          unitLabel="days"
        />
        <Stepper
          label="Days (at maximum)"
          value={atMax}
          onValueChange={setAtMax}
          min={1}
          max={30}
          unitLabel="days"
        />
        <Stepper
          label="Days (disabled)"
          value={5}
          onValueChange={() => {}}
          disabled
          unitLabel="days"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Clamping lives in the component. Type 999 into the first stepper and blur — it settles at 30, because the component will not hand its owner an out-of-range value.',
      },
    },
  },
};