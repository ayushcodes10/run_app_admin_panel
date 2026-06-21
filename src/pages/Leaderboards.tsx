import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Trophy } from 'lucide-react';
import { fetchCityLeaderboard } from '@/lib/api';
import type { LeaderboardEntry, LeaderboardPeriod } from '@/types';
import { formatNumber } from '@/lib/format';
import { Card } from '@/components/ui/Card';
import { RankBadge } from '@/components/ui/RankBadge';
import { Column, Table } from '@/components/ui/Table';

const PERIODS: LeaderboardPeriod[] = ['week', 'total'];

const columns: Column<LeaderboardEntry>[] = [
  {
    key: 'rank',
    header: '#',
    render: (e) => <RankBadge rank={e.rank} />,
  },
  {
    key: 'user',
    header: 'Runner',
    render: (e) => <span className="font-medium">{e.username}</span>,
  },
  {
    key: 'score',
    header: 'Score',
    className: 'text-right',
    render: (e) => (
      <span className="font-display font-semibold text-accent">
        {formatNumber(e.score)}
      </span>
    ),
  },
];

export function LeaderboardsPage() {
  const [cityId, setCityId] = useState('');
  const [appliedCity, setAppliedCity] = useState('');
  const [period, setPeriod] = useState<LeaderboardPeriod>('week');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['leaderboard', appliedCity, period],
    queryFn: () => fetchCityLeaderboard(appliedCity, period),
    enabled: Boolean(appliedCity),
  });

  return (
    <div className="space-y-4">
      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              setAppliedCity(cityId.trim());
            }}
          >
            <input
              value={cityId}
              onChange={(e) => setCityId(e.target.value)}
              placeholder="Enter city ID…"
              className="w-56 rounded-xl border border-border bg-white/[0.03] px-3 py-2 text-sm outline-none placeholder:text-text-muted focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
            />
            <button
              type="submit"
              className="rounded-xl border border-border px-3 py-2 text-sm hover:bg-white/5"
            >
              View
            </button>
          </form>

          <div className="flex gap-1 rounded-xl border border-border p-1">
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={
                  'rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors ' +
                  (period === p
                    ? 'bg-accent text-bg'
                    : 'text-text-muted hover:text-text')
                }
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {!appliedCity ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center text-text-muted">
            <Trophy size={36} className="text-accent/60" />
            <p>Enter a city ID to view its leaderboard.</p>
          </div>
        ) : isError ? (
          <p className="py-10 text-center text-danger">
            Failed to load leaderboard for “{appliedCity}”.
          </p>
        ) : (
          <>
            <Table
              columns={columns}
              rows={data?.entries ?? []}
              rowKey={(e) => e.userId}
              loading={isLoading}
              emptyMessage="No entries for this city/period."
            />
            {data?.me && (
              <div className="mt-4 flex items-center justify-between rounded-xl border border-accent/30 bg-accent/5 px-4 py-3">
                <div className="flex items-center gap-3">
                  <RankBadge rank={data.me.rank} />
                  <span className="font-medium">You · {data.me.username}</span>
                </div>
                <span className="font-display font-semibold text-accent">
                  {formatNumber(data.me.score)}
                </span>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
