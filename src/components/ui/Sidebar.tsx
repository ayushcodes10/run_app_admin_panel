import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ShieldAlert,
  Map,
  Trophy,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/format';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

const NAV: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/users', label: 'Users', icon: Users },
  { to: '/runs', label: 'Runs & Anti-Cheat', icon: ShieldAlert },
  { to: '/territories', label: 'Territories', icon: Map },
  { to: '/leaderboards', label: 'Leaderboards', icon: Trophy },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r border-border bg-surface/60 backdrop-blur-glass transition-all',
        collapsed ? 'w-[72px]' : 'w-64',
      )}
    >
      <div className="flex h-16 items-center gap-2 px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-bg shadow-glow">
          <span className="font-display text-lg font-extrabold">R</span>
        </div>
        {!collapsed && (
          <div className="leading-tight">
            <p className="font-display text-base font-bold">RunRealm</p>
            <p className="text-xs text-text-muted">Admin</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent/15 text-accent'
                  : 'text-text-muted hover:bg-white/5 hover:text-text',
              )
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={20} className="shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={onToggle}
        className="m-3 flex items-center justify-center gap-2 rounded-xl border border-border py-2 text-sm text-text-muted hover:bg-white/5 hover:text-text"
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        {!collapsed && <span>Collapse</span>}
      </button>
    </aside>
  );
}
