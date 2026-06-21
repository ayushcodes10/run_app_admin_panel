// Shared API types for the RunRealm Admin Panel.

export type RunStatus = 'validating' | 'valid' | 'flagged' | 'rejected';
export type RunStatusFilter = 'all' | RunStatus;

export interface AdminUser {
  id: string;
  email: string;
  username: string;
  role?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AdminUser;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface StatsSeriesPoint {
  date: string;
  count: number;
}

export interface CityCount {
  city: string;
  count: number;
}

export interface AdminStats {
  totalUsers: number;
  runsToday: number;
  flaggedPending: number;
  totalCells: number;
  runsSeries: StatsSeriesPoint[];
  topCities: CityCount[];
}

export interface UserRow {
  id: string;
  username: string;
  email: string;
  level: number;
  xp: number;
  runsCount: number;
  territoryCells: number;
  lastActiveAt: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
}

export interface RunDetail {
  id: string;
  userId: string;
  username: string;
  status: RunStatus;
  distanceM: number;
  durationS: number;
  avgSpeedMps: number;
  reasons: string[];
  startedAt: string;
  cellsCaptured: number;
  // Optional route summary for the mini-map / detail view.
  route?: Array<{ lat: number; lng: number }>;
}

export interface UserDetail extends UserRow {
  recentRuns?: RunDetail[];
}

export interface TerritoryRow {
  userId: string;
  username: string;
  cells: number;
  areaM2: number;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatarId?: string | number;
  score: number;
  rank: number;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  me?: LeaderboardEntry;
}

export type LeaderboardPeriod = 'week' | 'total';
