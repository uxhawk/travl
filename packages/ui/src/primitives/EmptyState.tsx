import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import './empty-state.css';

/**
 * EmptyState
 *
 * @figma component EmptyState
 * @figma prop size = compact | default
 *
 * Governance: `action` is REQUIRED. An empty state that only reports
 * emptiness is a dead end — every one in this system has to offer the next
 * step. If a surface genuinely has no action to offer, it should not be
 * using EmptyState.
 */
export type EmptyStateProps = {
  title: string;
  description?: ReactNode;
  /** The invitation. Required by design — see the governance note above. */
  action: ReactNode;
  icon?: ReactNode;
  size?: 'compact' | 'default';
  className?: string;
};

export function EmptyState({
  title,
  description,
  action,
  icon,
  size = 'default',
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'tv-empty-state',
        size === 'compact' && 'tv-empty-state--compact',
        className,
      )}
    >
      {icon ? (
        <span className="tv-empty-state__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <p
        className={cn(
          'tv-empty-state__title',
          size === 'compact' ? 'tv-text-label-lg' : 'tv-text-display-sm',
        )}
      >
        {title}
      </p>
      {description ? (
        <p className="tv-empty-state__description tv-text-body-sm">{description}</p>
      ) : null}
      {action}
    </div>
  );
}
EmptyState.displayName = 'EmptyState';