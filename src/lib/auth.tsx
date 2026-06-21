import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { AdminUser } from '@/types';

// ---- Token storage ----------------------------------------------------------
const ACCESS_KEY = 'rr_admin_access';
const REFRESH_KEY = 'rr_admin_refresh';
const USER_KEY = 'rr_admin_user';

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(ACCESS_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}

function getStoredUser(): AdminUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
}

// ---- Auth context -----------------------------------------------------------
interface AuthContextValue {
  user: AdminUser | null;
  isAuthenticated: boolean;
  signIn: (
    accessToken: string,
    refreshToken: string,
    user: AdminUser,
  ) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(() => getStoredUser());
  const [token, setToken] = useState<string | null>(() => getAccessToken());

  const signIn = useCallback(
    (accessToken: string, refreshToken: string, nextUser: AdminUser) => {
      setTokens(accessToken, refreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
      setToken(accessToken);
      setUser(nextUser);
    },
    [],
  );

  const signOut = useCallback(() => {
    clearTokens();
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(token),
      signIn,
      signOut,
    }),
    [user, token, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
