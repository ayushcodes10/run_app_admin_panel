import type { ReactNode } from 'react';
import { cn } from '@/lib/format';
import type { RunStatus } from '@/types';

type Tone = 'neutral' | 'accent' | 'danger' | 'friend' | 'warn';

const TONES: Record<Tone, string> = {
  neutral: 'bg-white/5 text-text-muted border-border',
  accent: 'bg-accent/15 text-accent border-accent/30',
  danger: 'bg-danger/15 text-danger border-danger/30',
  friend: 'bg-friend/15 text-friend border-friend/30',
  warn: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
};

export function Badge({
  tone = 'neutral',
  children,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

const STATUS_TONE: Record<RunStatus, Tone> = {
  validating: 'warn',
  valid: 'accent',
  flagged: 'danger',
  rejected: 'neutral',
};

export function StatusBadge({ status }: { status: RunStatus }) {
  return (
    <Badge tone={STATUS_TONE[status]} className="capitalize">
      {status}
    </Badge>
  );
}
