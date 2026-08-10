import type { HTMLAttributes, Ref } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';
import './card.css';

/**
 * Card
 *
 * @figma component Card
 * @figma prop variant     = raised | inset | outline
 * @figma prop size        = sm | md | lg
 * @figma prop interactive = true | false
 *
 * Governance: `interactive` only applies the affordance styling. Render an
 * actual <button> or <a> via `asChild` — a clickable <div> is not a control
 * and will fail keyboard review.
 */
const card = cva('tv-card', {
  variants: {
    variant: {
      raised: 'tv-card--raised',
      inset: 'tv-card--inset',
      outline: 'tv-card--outline',
    },
    size: {
      sm: 'tv-card--sm',
      md: 'tv-card--md',
      lg: 'tv-card--lg',
    },
    interactive: {
      true: 'tv-card--interactive',
      false: '',
    },
  },
  defaultVariants: { variant: 'raised', size: 'md', interactive: false },
});

export type CardProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof card> & {
    asChild?: boolean;
    ref?: Ref<HTMLDivElement>;
  };

export function Card({
  className,
  variant,
  size,
  interactive,
  asChild = false,
  ref,
  ...props
}: CardProps) {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      ref={ref}
      data-variant={variant ?? 'raised'}
      className={cn(card({ variant, size, interactive }), className)}
      {...props}
    />
  );
}
Card.displayName = 'Card';

export function CardHeader({
  className,
  ref,
  ...props
}: HTMLAttributes<HTMLDivElement> & { ref?: Ref<HTMLDivElement> }) {
  return <div ref={ref} className={cn('tv-card__header', className)} {...props} />;
}
CardHeader.displayName = 'CardHeader';

export function CardTitle({
  className,
  ref,
  ...props
}: HTMLAttributes<HTMLHeadingElement> & { ref?: Ref<HTMLHeadingElement> }) {
  return (
    <h3
      ref={ref}
      className={cn('tv-card__title tv-text-display-sm', className)}
      {...props}
    />
  );
}
CardTitle.displayName = 'CardTitle';

export function CardDescription({
  className,
  ref,
  ...props
}: HTMLAttributes<HTMLParagraphElement> & { ref?: Ref<HTMLParagraphElement> }) {
  return (
    <p
      ref={ref}
      className={cn('tv-card__description tv-text-body-sm', className)}
      {...props}
    />
  );
}
CardDescription.displayName = 'CardDescription';

export function CardFooter({
  className,
  ref,
  ...props
}: HTMLAttributes<HTMLDivElement> & { ref?: Ref<HTMLDivElement> }) {
  return <div ref={ref} className={cn('tv-card__footer', className)} {...props} />;
}
CardFooter.displayName = 'CardFooter';