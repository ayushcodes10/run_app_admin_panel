import { cn } from '@/lib/format';

// Lime/gradient styling for the top 3, muted chip otherwise.
export function RankBadge({ rank }: { rank: number }) {
  const isTop3 = rank <= 3;
  return (
    <span
      className={cn(
        'inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold tabular-nums',
        isTop3
          ? 'bg-accent text-bg shadow-glow'
          : 'bg-white/5 text-text-muted border border-border',
      )}
    >
      {rank}
    </span>
  );
}
