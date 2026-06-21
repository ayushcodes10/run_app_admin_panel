import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '@/lib/api';
import {
  formatDistance,
  formatNumber,
  formatRelativeTime,
} from '@/lib/format';
import { Drawer } from '@/components/ui/Drawer';
import { StatusBadge } from '@/components/ui/Badge';

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-white/[0.02] p-3">
      <p className="text-xs text-text-muted">{label}</p>
      <p className="mt-0.5 font-display text-lg font-semibold">{value}</p>
    </div>
  );
}

export function UserDetailDrawer({
  userId,
  onClose,
}: {
  userId: string | null;
  onClose: () => void;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-user', userId],
    queryFn: () => fetchUser(userId!),
    enabled: Boolean(userId),
  });

  return (
    <Drawer open={Boolean(userId)} title="User detail" onClose={onClose}>
      {isLoading && <p className="text-sm text-text-muted">Loading…</p>}
      {data && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 text-xl font-bold text-accent">
              {data.username.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate font-display text-lg font-bold">
                {data.username}
              </p>
              <p className="truncate text-sm text-text-muted">{data.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Stat label="Level" value={formatNumber(data.level)} />
            <Stat label="XP" value={formatNumber(data.xp)} />
            <Stat label="Runs" value={formatNumber(data.runsCount)} />
            <Stat
              label="Territory cells"
              value={formatNumber(data.territoryCells)}
            />
          </div>

          <p className="text-sm text-text-muted">
            Last active {formatRelativeTime(data.lastActiveAt)}
          </p>

          {data.recentRuns && data.recentRuns.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold">Recent runs</h3>
              <div className="space-y-2">
                {data.recentRuns.map((run) => (
                  <div
                    key={run.id}
                    className="flex items-center justify-between rounded-xl border border-border bg-white/[0.02] px-3 py-2.5 text-sm"
                  >
                    <div>
                      <p className="font-medium">
                        {formatDistance(run.distanceM)}
                      </p>
                      <p className="text-xs text-text-muted">
                        {formatRelativeTime(run.startedAt)}
                      </p>
                    </div>
                    <StatusBadge status={run.status} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Drawer>
  );
}
