import type { ReactNode } from 'react';
import { cn } from '@/lib/format';

export interface Column<T> {
  key: string;
  header: ReactNode;
  // Render a cell for a row.
  render: (row: T) => ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyMessage?: string;
}

export function Table<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  loading = false,
  emptyMessage = 'No results.',
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="bg-white/[0.03] text-xs uppercase tracking-wide text-text-muted">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn('whitespace-nowrap px-4 py-3 font-medium', col.className)}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center text-text-muted"
              >
                Loading…
              </td>
            </tr>
          )}
          {!loading && rows.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center text-text-muted"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
          {!loading &&
            rows.map((row) => (
              <tr
                key={rowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(
                  'border-t border-border transition-colors',
                  onRowClick && 'cursor-pointer hover:bg-white/[0.04]',
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn('whitespace-nowrap px-4 py-3', col.className)}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

// Simple page-based pagination control used under tables.
export function Pagination({
  page,
  total,
  limit,
  onPage,
}: {
  page: number;
  total: number;
  limit: number;
  onPage: (page: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return (
    <div className="mt-4 flex items-center justify-between text-sm text-text-muted">
      <span>
        {total === 0
          ? '0 results'
          : `Page ${page} of ${totalPages} · ${total} total`}
      </span>
      <div className="flex gap-2">
        <button
          className="rounded-lg border border-border px-3 py-1.5 disabled:opacity-40 hover:bg-white/5"
          onClick={() => onPage(page - 1)}
          disabled={page <= 1}
        >
          Prev
        </button>
        <button
          className="rounded-lg border border-border px-3 py-1.5 disabled:opacity-40 hover:bg-white/5"
          onClick={() => onPage(page + 1)}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
