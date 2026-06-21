import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/format';
import { Card } from './Card';

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  // Highlight (e.g. flagged pending) draws attention with the danger tone.
  highlight?: boolean;
  hint?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  highlight = false,
  hint,
}: StatCardProps) {
  return (
    <Card className="flex items-center gap-4">
      <div
        className={cn(
          'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl',
          highlight
            ? 'bg-danger/15 text-danger'
            : 'bg-accent/15 text-accent',
        )}
      >
        <Icon size={22} />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm text-text-muted">{label}</p>
        <p className="text-2xl font-bold font-display leading-tight">{value}</p>
        {hint && <p className="text-xs text-text-muted">{hint}</p>}
      </div>
    </Card>
  );
}
