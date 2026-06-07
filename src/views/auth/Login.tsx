import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AuthLayout } from './AuthLayout';
import type { Theme } from '../../hooks/useTheme';
import type { User } from '../../hooks/useAuth';

interface LoginProps {
  theme: Theme;
  toggleTheme: () => void;
  onAuth: (user: User, remember: boolean) => void;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const Login: React.FC<LoginProps> = ({ theme, toggleTheme, onAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const next: typeof errors = {};
    if (!email.trim()) next.email = 'Email is required.';
    else if (!EMAIL_RE.test(email.trim())) next.email = 'Enter a valid email address.';
    if (!password) next.password = 'Password is required.';

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    // Frontend-only: simulate a request, then start the session.
    setTimeout(() => onAuth({ email: email.trim() }, remember), 600);
  };

  return (
    <AuthLayout
      theme={theme}
      toggleTheme={toggleTheme}
      title="Welcome back"
      subtitle="Sign in to continue to PrepVault"
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
        <Input
          label="Email"
          type="email"
          icon={Mail}
          placeholder="you@example.com"
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

          <button
            type="button"
            className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
          >
            Forgot password?
          </button>
        </div>

        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </AuthLayout>
  );
};
