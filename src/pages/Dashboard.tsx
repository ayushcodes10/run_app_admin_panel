import { useQuery } from '@tanstack/react-query';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Users, Activity, ShieldAlert, Grid3x3 } from 'lucide-react';
import { fetchStats } from '@/lib/api';
import { formatNumber } from '@/lib/format';
import { Card, CardHeader } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';

const ACCENT = '#C5F94B';

const tooltipStyle = {
  background: '#15171A',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 12,
  color: '#fff',
  fontSize: 12,
} as const;

export function DashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: fetchStats,
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total users"
          value={formatNumber(data?.totalUsers)}
          icon={Users}
        />
        <StatCard
          label="Runs today"
          value={formatNumber(data?.runsToday)}
          icon={Activity}
        />
        <StatCard
          label="Flagged pending"
          value={formatNumber(data?.flaggedPending)}
          icon={ShieldAlert}
          highlight={Boolean(data?.flaggedPending)}
          hint="Awaiting review"
        />
        <StatCard
          label="Total cells owned"
          value={formatNumber(data?.totalCells)}
          icon={Grid3x3}
        />
      </div>

      {isError && (
        <Card className="text-danger">
          Failed to load dashboard stats. Check the API connection.
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Runs over time" subtitle="Daily completed runs" />
          <div className="h-72">
            {isLoading ? (
              <ChartSkeleton />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.runsSeries ?? []}>
                  <defs>
                    <linearGradient id="runsFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={ACCENT} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.06)"
                  />
                  <XAxis
                    dataKey="date"
                    stroke="#8A8F98"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#8A8F98"
                    fontSize={12}
                    tickLine={false}
                    width={32}
                  />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: ACCENT }} />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke={ACCENT}
                    strokeWidth={2}
                    fill="url(#runsFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title="Top cities" subtitle="By active runners" />
          <div className="h-72">
            {isLoading ? (
              <ChartSkeleton />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.topCities ?? []}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.06)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="city"
                    stroke="#8A8F98"
                    fontSize={11}
                    tickLine={false}
                    interval={0}
                  />
                  <YAxis
                    stroke="#8A8F98"
                    fontSize={12}
                    tickLine={false}
                    width={32}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                  />
                  <Bar dataKey="count" fill={ACCENT} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="flex h-full items-center justify-center text-sm text-text-muted">
      Loading chart…
    </div>
  );
}
