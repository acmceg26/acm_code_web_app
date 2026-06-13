import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AuthLayout } from './AuthLayout';
import { signIn } from '../../services/authService';
import type { Theme } from '../../hooks/useTheme';

interface LoginProps {
  theme: Theme;
  toggleTheme: () => void;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const Login: React.FC<LoginProps> = ({ theme, toggleTheme }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const normalizedEmail = email.trim().toLowerCase();

    const next: typeof errors = {};
    if (!email.trim()) next.email = 'Email is required.';
    else if (!EMAIL_RE.test(normalizedEmail)) next.email = 'Enter a valid email address.';
    if (!password) next.password = 'Password is required.';

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    const result = await signIn(normalizedEmail, password, remember);

    if (!result.ok) {
      setSubmitting(false);
      setServerError(result.message);
      return;
    }
    // Success: the auth-state listener flips the app into the authed routes,
    // which redirects this page to "/". Nothing else to do here.
  };

  return (
    <AuthLayout
      theme={theme}
      toggleTheme={toggleTheme}
      title="Welcome back"
      subtitle="Sign in to continue to C.O.D.E"
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {serverError && (
          <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-300">
            {serverError}
          </div>
        )}

        <Input
          label="Email"
          type="email"
          icon={Mail}
          placeholder="1234567890@student.annauniv.edu"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />

        <Input
          label="Password"
          type="password"
          icon={Lock}
          placeholder="••••••••"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 accent-blue-600 cursor-pointer"
            />
            <span className="text-xs text-zinc-400">Remember me</span>
          </label>

          <Link
            to="/forgot-password"
            className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </AuthLayout>
  );
};
