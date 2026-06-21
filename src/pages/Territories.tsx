import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Map as MapIcon } from 'lucide-react';
import { fetchTerritories } from '@/lib/api';
import type { TerritoryRow } from '@/types';
import { formatArea, formatNumber } from '@/lib/format';
import { Card } from '@/components/ui/Card';
import { RankBadge } from '@/components/ui/RankBadge';
import { Column, Pagination, Table } from '@/components/ui/Table';

const LIMIT = 20;

export function TerritoriesPage() {
  const [cityId, setCityId] = useState('');
  const [appliedCity, setAppliedCity] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-territories', appliedCity, page],
    queryFn: () =>
      fetchTerritories({
        cityId: appliedCity || undefined,
        page,
        limit: LIMIT,
      }),
    placeholderData: keepPreviousData,
  });

  // Rank is derived from position on the current page (offset by page).
  const offset = (page - 1) * LIMIT;
  const rows = data?.items ?? [];

  // Stable rank lookup so render stays O(1) per cell.
  const rankByUser = new Map(rows.map((t, i) => [t.userId, offset + i + 1]));

  const columns: Column<TerritoryRow>[] = [
    {
      key: 'rank',
      header: '#',
      render: (t) => <RankBadge rank={rankByUser.get(t.userId) ?? 0} />,
    },
    {
      key: 'user',
      header: 'Owner',
      render: (t) => <span className="font-medium">{t.username}</span>,
    },
    {
      key: 'cells',
      header: 'Cells owned',
      render: (t) => (
        <span className="font-display font-semibold text-accent">
          {formatNumber(t.cells)}
        </span>
      ),
    },
    {
      key: 'area',
      header: 'Area',
      render: (t) => formatArea(t.areaM2),
    },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <MapIcon size={18} />
          </div>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              setAppliedCity(cityId.trim());
              setPage(1);
            }}
          >
            <input
              value={cityId}
              onChange={(e) => setCityId(e.target.value)}
              placeholder="Filter by city ID…"
              className="w-56 rounded-xl border border-border bg-white/[0.03] px-3 py-2 text-sm outline-none placeholder:text-text-muted focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
            />
            <button
              type="submit"
              className="rounded-xl border border-border px-3 py-2 text-sm hover:bg-white/5"
            >
              Apply
            </button>
          </form>
        </div>

        <Table
          columns={columns}
          rows={rows}
          rowKey={(t) => t.userId}
          loading={isLoading}
          emptyMessage="No territory owners found."
        />
        <Pagination
          page={page}
          total={data?.total ?? 0}
          limit={LIMIT}
          onPage={setPage}
        />
      </Card>
    </div>
  );
}
