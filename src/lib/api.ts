import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import type {
  AdminStats,
  AuthResponse,
  LeaderboardPeriod,
  LeaderboardResponse,
  Paginated,
  RefreshResponse,
  RunDetail,
  RunStatusFilter,
  TerritoryRow,
  UserDetail,
  UserRow,
} from '@/types';
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from '@/lib/auth';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach the bearer token on every request.
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

// ---- Refresh handling -------------------------------------------------------
// Single-flight refresh: if multiple requests 401 at once, they share one
// refresh call and replay afterwards.
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token');

  // Use a bare axios call so we don't recurse through interceptors.
  const { data } = await axios.post<RefreshResponse>(
    `${API_BASE_URL}/auth/refresh`,
    { refreshToken },
    { headers: { 'Content-Type': 'application/json' } },
  );
  setTokens(data.accessToken, data.refreshToken);
  return data.accessToken;
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as
      | (AxiosRequestConfig & { _retry?: boolean })
      | undefined;

    const isAuthCall = original?.url?.includes('/auth/');
    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !isAuthCall
    ) {
      original._retry = true;
      try {
        refreshPromise ??= refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
        const newToken = await refreshPromise;
        original.headers = original.headers ?? {};
        (original.headers as Record<string, string>).Authorization =
          `Bearer ${newToken}`;
        return api(original);
      } catch (refreshErr) {
        // Refresh failed → force logout.
        clearTokens();
        if (typeof window !== 'undefined') {
          window.location.assign('/login');
        }
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  },
);

// ---- Typed endpoint helpers -------------------------------------------------

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', {
    email,
    password,
  });
  return data;
}

export async function fetchStats(): Promise<AdminStats> {
  const { data } = await api.get<AdminStats>('/admin/stats');
  return data;
}

export async function fetchUsers(params: {
  search?: string;
  page: number;
  limit: number;
}): Promise<Paginated<UserRow>> {
  const { data } = await api.get<Paginated<UserRow>>('/admin/users', {
    params,
  });
  return data;
}

export async function fetchUser(id: string): Promise<UserDetail> {
  const { data } = await api.get<UserDetail>(`/admin/users/${id}`);
  return data;
}

export async function fetchRuns(params: {
  status: RunStatusFilter;
  page: number;
  limit: number;
}): Promise<Paginated<RunDetail>> {
  const { data } = await api.get<Paginated<RunDetail>>('/admin/runs', {
    params,
  });
  return data;
}

export async function approveRun(id: string): Promise<{ ok: boolean }> {
  const { data } = await api.post<{ ok: boolean }>(`/admin/runs/${id}/approve`);
  return data;
}

export async function rejectRun(id: string): Promise<{ ok: boolean }> {
  const { data } = await api.post<{ ok: boolean }>(`/admin/runs/${id}/reject`);
  return data;
}

export async function fetchTerritories(params: {
  cityId?: string;
  page: number;
  limit: number;
}): Promise<Paginated<TerritoryRow>> {
  const { data } = await api.get<Paginated<TerritoryRow>>(
    '/admin/territories',
    { params },
  );
  return data;
}

export async function fetchCityLeaderboard(
  cityId: string,
  period: LeaderboardPeriod,
): Promise<LeaderboardResponse> {
  const { data } = await api.get<LeaderboardResponse>(
    `/leaderboards/city/${cityId}`,
    { params: { period } },
  );
  return data;
}
