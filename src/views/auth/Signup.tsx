import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User as UserIcon, Mail, Lock, Hash, BookOpen, MapPin, GraduationCap, Users } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { AuthLayout } from './AuthLayout';
import { signUp } from '../../services/authService';
import type { Theme } from '../../hooks/useTheme';

interface SignupProps {
  theme: Theme;
  toggleTheme: () => void;
}

// Anna University student email: 10-digit roll number @student.annauniv.edu
// e.g. 2023115128@student.annauniv.edu
const ANNA_EMAIL_RE = /^\d{10}@student\.annauniv\.edu$/;
const ROLL_RE = /^\d{10}$/;
const MIN_PASSWORD = 8;

const YEAR_OPTIONS = [
  { value: '1', label: '1st year' },
  { value: '2', label: '2nd year' },
  { value: '3', label: '3rd year' },
  { value: '4', label: '4th year' },
];

interface SignupErrors {
  name?: string;
  email?: string;
  rollNumber?: string;
  department?: string;
  campus?: string;
  year?: string;
  batch?: string;
  password?: string;
  confirm?: string;
}

export const Signup: React.FC<SignupProps> = ({ theme, toggleTheme }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [department, setDepartment] = useState('');
  const [campus, setCampus] = useState('');
  const [year, setYear] = useState('');
  const [batch, setBatch] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<SignupErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmSent, setConfirmSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const normalizedEmail = email.trim().toLowerCase();
    const yearNum = Number(year);

    const next: SignupErrors = {};
    if (!name.trim()) next.name = 'Name is required.';

    if (!email.trim()) next.email = 'Email is required.';
    else if (!ANNA_EMAIL_RE.test(normalizedEmail))
      next.email = 'Use your Anna University student email (e.g. 20231112222@student.annauniv.edu).';

    if (!ROLL_RE.test(rollNumber.trim())) next.rollNumber = 'Roll number must be exactly 10 digits.';

    if (!department.trim()) next.department = 'Department is required.';
    if (!campus.trim()) next.campus = 'Campus is required.';

    if (!year) next.year = 'Select your year.';
    else if (!Number.isInteger(yearNum) || yearNum < 1 || yearNum > 4)
      next.year = 'Year must be between 1 and 4.';

    if (!batch.trim()) next.batch = 'Batch is required.';

    if (!password) next.password = 'Password is required.';
    else if (password.length < MIN_PASSWORD) next.password = `Use at least ${MIN_PASSWORD} characters.`;
    if (confirm !== password) next.confirm = 'Passwords do not match.';

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    const result = await signUp({
      name: name.trim(),
      email: normalizedEmail,
      password,
      year: yearNum,
      rollNumber: rollNumber.trim(),
      department: department.trim() || undefined,
      campus: campus.trim() || undefined,
      batch: batch.trim() || undefined,
    });

    if (!result.ok) {
      setSubmitting(false);
      if (result.reason === 'exists') {
        setErrors({ email: result.message });
      } else {
        setServerError(result.message);
      }
      return;
    }

    // Account created. If a session came back, the auth-state listener flips the
    // app into the authed routes automatically (this component unmounts).
    // Otherwise, email confirmation is required before the user can sign in.
    if (result.needsEmailConfirmation) {
      setSubmitting(false);
      setConfirmSent(true);
    }
  };

  if (confirmSent) {
    return (
      <AuthLayout
        theme={theme}
        toggleTheme={toggleTheme}
        title="Check your email"
        subtitle="Confirm your address to finish signing up"
        footer={
          <>
            Already confirmed?{' '}
            <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
              Sign in
            </Link>
          </>
        }
      >
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          We sent a confirmation link to{' '}
          <span className="font-medium">{email.trim().toLowerCase()}</span>. Open it to activate your
          account, then sign in.
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      theme={theme}
      toggleTheme={toggleTheme}
      title="Create your account"
      subtitle="Start tracking your placement prep"
      footer={
        <>
          Already have an account?{' '}
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
          label="Full name"
          icon={UserIcon}
          placeholder="Your name"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />

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
          label="Roll number"
          icon={Hash}
          placeholder="20231112222"
          inputMode="numeric"
          maxLength={10}
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value.replace(/\D/g, ''))}
          error={errors.rollNumber}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Department"
            icon={BookOpen}
            placeholder="e.g. Computer Science"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            error={errors.department}
          />
          <Input
            label="Campus"
            icon={MapPin}
            placeholder="e.g. CEG"
            value={campus}
            onChange={(e) => setCampus(e.target.value)}
            error={errors.campus}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Year"
            icon={GraduationCap}
            placeholder="Select"
            options={YEAR_OPTIONS}
            value={year}
            onChange={(e) => setYear(e.target.value)}
            error={errors.year}
          />
          <Input
            label="Batch"
            icon={Users}
            placeholder="e.g. 1"
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
            error={errors.batch}
          />
        </div>

        <Input
          label="Password"
          type="password"
          icon={Lock}
          placeholder="At least 8 characters"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        <Input
          label="Confirm password"
          type="password"
          icon={Lock}
          placeholder="Re-enter your password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={errors.confirm}
        />

        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
    </AuthLayout>
  );
};
