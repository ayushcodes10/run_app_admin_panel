import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Activity } from 'lucide-react';
import { login } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/Button';

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const mutation = useMutation({
    mutationFn: () => login(email, password),
    onSuccess: (data) => {
      signIn(data.accessToken, data.refreshToken, data.user);
      navigate('/', { replace: true });
    },
  });

  // Already signed in → bounce to the dashboard.
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  const errorMessage =
    mutation.error instanceof AxiosError
      ? ((mutation.error.response?.data as { message?: string })?.message ??
        'Invalid email or password.')
      : mutation.error
        ? 'Something went wrong. Please try again.'
        : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg p-6">
      {/* Ambient lime glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-bg shadow-glow">
            <Activity size={28} />
          </div>
          <h1 className="font-display text-2xl font-bold">RunRealm Admin</h1>
          <p className="text-sm text-text-muted">
            Sign in to manage the realm.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-3xl glass p-7 shadow-card"
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-muted">
              Email
            </label>
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@runrealm.app"
              className="w-full rounded-xl border border-border bg-white/[0.03] px-4 py-2.5 text-sm outline-none placeholder:text-text-muted focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-muted">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-border bg-white/[0.03] px-4 py-2.5 text-sm outline-none placeholder:text-text-muted focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
            />
          </div>

          {errorMessage && (
            <p className="rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
              {errorMessage}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            loading={mutation.isPending}
            disabled={!email || !password}
          >
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}
