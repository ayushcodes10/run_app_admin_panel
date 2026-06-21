import { useState } from 'react';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { Check, X, AlertTriangle } from 'lucide-react';
import { approveRun, fetchRuns, rejectRun } from '@/lib/api';
import type { RunDetail, RunStatusFilter } from '@/types';
import {
  formatDistance,
  formatDuration,
  formatRelativeTime,
  formatSpeed,
} from '@/lib/format';
import { Card } from '@/components/ui/Card';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Column, Pagination, Table } from '@/components/ui/Table';

const LIMIT = 20;

const TABS: { key: RunStatusFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'validating', label: 'Validating' },
  { key: 'valid', label: 'Valid' },
  { key: 'flagged', label: 'Flagged' },
  { key: 'rejected', label: 'Rejected' },
];

export function RunsPage() {
  const [status, setStatus] = useState<RunStatusFilter>('flagged');
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-runs', status, page],
    queryFn: () => fetchRuns({ status, page, limit: LIMIT }),
    placeholderData: keepPreviousData,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-runs'] });
    queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
  };

  const approve = useMutation({
    mutationFn: (id: string) => approveRun(id),
    onSuccess: invalidate,
  });
  const reject = useMutation({
    mutationFn: (id: string) => rejectRun(id),
    onSuccess: invalidate,
  });

  const pendingId =
    (approve.isPending && approve.variables) ||
    (reject.isPending && reject.variables) ||
    null;

  const isReviewQueue = status === 'flagged';

  const columns: Column<RunDetail>[] = [
    {
      key: 'user',
      header: 'Runner',
      render: (r) => (
        <div>
          <p className="font-medium">{r.username}</p>
          <p className="text-xs text-text-muted">
            {formatRelativeTime(r.startedAt)}
          </p>
        </div>
      ),
    },
    {
      key: 'distance',
      header: 'Distance',
      render: (r) => formatDistance(r.distanceM),
    },
    {
      key: 'duration',
      header: 'Duration',
      render: (r) => formatDuration(r.durationS),
    },
    {
      key: 'speed',
      header: 'Avg speed',
      render: (r) => formatSpeed(r.avgSpeedMps),
    },
    {
      key: 'cells',
      header: 'Cells',
      render: (r) => r.cellsCaptured,
    },
    isReviewQueue
      ? {
          key: 'reasons',
          header: 'Anti-cheat flags',
          render: (r) => (
            <div className="flex max-w-xs flex-wrap gap-1.5">
              {r.reasons.length === 0 ? (
                <span className="text-text-muted">—</span>
              ) : (
                r.reasons.map((reason) => (
                  <Badge key={reason} tone="danger">
                    <AlertTriangle size={11} />
                    {reason}
                  </Badge>
                ))
              )}
            </div>
          ),
        }
      : {
          key: 'status',
          header: 'Status',
          render: (r) => <StatusBadge status={r.status} />,
        },
    {
      key: 'actions',
      header: isReviewQueue ? 'Review' : '',
      className: 'text-right',
      render: (r) =>
        isReviewQueue ? (
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="primary"
              loading={pendingId === r.id && approve.isPending}
              disabled={Boolean(pendingId)}
              onClick={() => approve.mutate(r.id)}
            >
              <Check size={14} /> Approve
            </Button>
            <Button
              size="sm"
              variant="danger"
              loading={pendingId === r.id && reject.isPending}
              disabled={Boolean(pendingId)}
              onClick={() => reject.mutate(r.id)}
            >
              <X size={14} /> Reject
            </Button>
          </div>
        ) : (
          <StatusBadge status={r.status} />
        ),
    },
  ];

  return (
    <div className="space-y-4">
      <Card>
        {/* Status tabs */}
        <div className="mb-4 flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setStatus(tab.key);
                setPage(1);
              }}
              className={
                'rounded-xl px-3.5 py-1.5 text-sm font-medium transition-colors ' +
                (status === tab.key
                  ? 'bg-accent/15 text-accent'
                  : 'text-text-muted hover:bg-white/5 hover:text-text')
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {isReviewQueue && (
          <p className="mb-4 flex items-center gap-2 rounded-xl border border-danger/20 bg-danger/5 px-3 py-2 text-sm text-text-muted">
            <AlertTriangle size={15} className="text-danger" />
            Anti-cheat review queue — approve to apply territory, reject to
            discard the run.
          </p>
        )}

        <Table
          columns={columns}
          rows={data?.items ?? []}
          rowKey={(r) => r.id}
          loading={isLoading}
          emptyMessage={
            isReviewQueue ? 'No flagged runs to review. ' : 'No runs found.'
          }
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
