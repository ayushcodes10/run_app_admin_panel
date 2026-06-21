import { LogOut, Server, Tag } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const APP_VERSION = '0.1.0';

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Server;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border py-3 last:border-0">
      <div className="flex items-center gap-3 text-sm text-text-muted">
        <Icon size={16} />
        {label}
      </div>
      <span className="font-mono text-sm">{value}</span>
    </div>
  );
}

export function SettingsPage() {
  const { user, signOut } = useAuth();

  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <CardHeader title="About" subtitle="RunRealm Admin Panel" />
        <Row icon={Tag} label="App version" value={APP_VERSION} />
        <Row icon={Server} label="API base URL" value={API_BASE_URL} />
      </Card>

      <Card>
        <CardHeader title="Account" subtitle="Signed-in administrator" />
        <Row
          icon={Tag}
          label="Username"
          value={user?.username ?? '—'}
        />
        <Row icon={Server} label="Email" value={user?.email ?? '—'} />
        <div className="pt-4">
          <Button variant="danger" onClick={signOut}>
            <LogOut size={16} /> Sign out
          </Button>
        </div>
      </Card>
    </div>
  );
}
