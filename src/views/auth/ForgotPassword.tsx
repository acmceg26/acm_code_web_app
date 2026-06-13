import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AuthLayout } from './AuthLayout';
import { resetPassword } from '../../services/authService';
import type { Theme } from '../../hooks/useTheme';

interface ForgotPasswordProps {
  theme: Theme;
  toggleTheme: () => void;
}

// Anna University student email: 10-digit roll number @student.annauniv.edu
const ANNA_EMAIL_RE = /^\d{10}@student\.annauniv\.edu$/;
const MIN_PASSWORD = 8;

interface ResetErrors {
  email?: string;
  password?: string;
  confirm?: string;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ theme, toggleTheme }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<ResetErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const normalizedEmail = email.trim().toLowerCase();

    const next: ResetErrors = {};
    if (!email.trim()) next.email = 'Email is required.';
    else if (!ANNA_EMAIL_RE.test(normalizedEmail))
      next.email = 'Use your Anna University student email (e.g. 2023115128@student.annauniv.edu).';

    if (!password) next.password = 'New password is required.';
    else if (password.length < MIN_PASSWORD) next.password = `Use at least ${MIN_PASSWORD} characters.`;
    if (confirm !== password) next.confirm = 'Passwords do not match.';

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    const res = await resetPassword(normalizedEmail, password);
    setSubmitting(false);

    if (!res.ok) {
      setServerError(res.message);
      return;
    }
    setDone(true);
  };

  if (done) {
    return (
      <AuthLayout
        theme={theme}
        toggleTheme={toggleTheme}
        title="Password updated"
        subtitle="You can sign in with your new password"
        footer={
          <>
            Back to{' '}
            <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
              Sign in
            </Link>
          </>
        }
      >
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          Your password for <span className="font-medium">{email.trim().toLowerCase()}</span> has been
          changed. Use it to sign in.
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      theme={theme}
      toggleTheme={toggleTheme}
      title="Reset your password"
      subtitle="Set a new password for your account"
      footer={
        <>
          Remembered it?{' '}
          <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
            Sign in
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
          label="Student email"
          type="email"
          icon={Mail}
          placeholder="1234567890@student.annauniv.edu"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />

        <Input
          label="New password"
          type="password"
          icon={Lock}
          placeholder="At least 8 characters"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        <Input
          label="Confirm new password"
          type="password"
          icon={Lock}
          placeholder="Re-enter your new password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={errors.confirm}
        />

        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={submitting}>
          {submitting ? 'Updating password…' : 'Update password'}
        </Button>
      </form>
    </AuthLayout>
  );
};
