import { LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export function Topbar({ title }: { title: string }) {
  const { user, signOut } = useAuth();
  const initial = (user?.username ?? user?.email ?? '?').charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-bg/70 px-6 backdrop-blur-glass">
      <h1 className="font-display text-xl font-bold">{title}</h1>

      <div className="flex items-center gap-3">
        <div className="text-right leading-tight">
          <p className="text-sm font-medium">{user?.username ?? 'Admin'}</p>
          <p className="text-xs text-text-muted">{user?.email}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15 text-sm font-semibold text-accent">
          {initial}
        </div>
        <button
          onClick={signOut}
          title="Sign out"
          className="flex h-9 w-9 items-center justify-center rounded-xl text-text-muted hover:bg-white/5 hover:text-danger"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
