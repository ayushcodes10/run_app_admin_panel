import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { fetchUsers } from '@/lib/api';
import type { UserRow } from '@/types';
import { formatNumber, formatRelativeTime } from '@/lib/format';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Column, Pagination, Table } from '@/components/ui/Table';
import { UserDetailDrawer } from './UserDetailDrawer';

const LIMIT = 20;

const columns: Column<UserRow>[] = [
  {
    key: 'username',
    header: 'User',
    render: (u) => (
      <div>
        <p className="font-medium">{u.username}</p>
        <p className="text-xs text-text-muted">{u.email}</p>
      </div>
    ),
  },
  {
    key: 'level',
    header: 'Level',
    render: (u) => <Badge tone="accent">Lvl {u.level}</Badge>,
  },
  { key: 'xp', header: 'XP', render: (u) => formatNumber(u.xp) },
  { key: 'runs', header: 'Runs', render: (u) => formatNumber(u.runsCount) },
  {
    key: 'cells',
    header: 'Cells',
    render: (u) => formatNumber(u.territoryCells),
  },
  {
    key: 'lastActive',
    header: 'Last active',
    className: 'text-text-muted',
    render: (u) => formatRelativeTime(u.lastActiveAt),
  },
];

export function UsersPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', search, page],
    queryFn: () => fetchUsers({ search, page, limit: LIMIT }),
    placeholderData: keepPreviousData,
  });

  return (
    <div className="space-y-4">
      <Card>
        <div className="mb-4 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search username or email…"
              className="w-full rounded-xl border border-border bg-white/[0.03] py-2.5 pl-9 pr-4 text-sm outline-none placeholder:text-text-muted focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
            />
          </div>
        </div>

        <Table
          columns={columns}
          rows={data?.items ?? []}
          rowKey={(u) => u.id}
          onRowClick={(u) => setSelectedId(u.id)}
          loading={isLoading}
          emptyMessage="No users match your search."
        />
        <Pagination
          page={page}
          total={data?.total ?? 0}
          limit={LIMIT}
          onPage={setPage}
        />
      </Card>

      <UserDetailDrawer userId={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  );
}
