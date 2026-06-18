import React, { useEffect, useMemo, useState } from 'react';
import {
  User as UserIcon,
  Mail,
  Hash,
  BookOpen,
  MapPin,
  GraduationCap,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { updateProfile } from '../services/profileService';
import type { User } from '../hooks/useAuth';

const ROLL_RE = /^\d{10}$/;

const YEAR_OPTIONS = [
  { value: '1', label: '1st year' },
  { value: '2', label: '2nd year' },
  { value: '3', label: '3rd year' },
  { value: '4', label: '4th year' },
];

interface ProfileProps {
  user: User | null;
}

interface ProfileErrors {
  name?: string;
  rollNumber?: string;
  department?: string;
  campus?: string;
  year?: string;
  batch?: string;
}

function getInitials(name?: string, email?: string): string {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
  }
  return (email?.[0] ?? '?').toUpperCase();
}

export const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [department, setDepartment] = useState('');
  const [campus, setCampus] = useState('');
  const [year, setYear] = useState('');
  const [batch, setBatch] = useState('');
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // (Re)hydrate the form from the user record whenever it changes (initial
  // load, session restore, or after a successful save refreshes the session).
  useEffect(() => {
    setName(user?.name ?? '');
    setRollNumber(user?.rollNumber ?? '');
    setDepartment(user?.department ?? '');
    setCampus(user?.campus ?? '');
    setYear(user?.year ? String(user.year) : '');
    setBatch(user?.batch ?? '');
  }, [user]);

  // Has the user changed anything? Gates the Save button.
  const dirty = useMemo(
    () =>
      name !== (user?.name ?? '') ||
      rollNumber !== (user?.rollNumber ?? '') ||
      department !== (user?.department ?? '') ||
      campus !== (user?.campus ?? '') ||
      year !== (user?.year ? String(user.year) : '') ||
      batch !== (user?.batch ?? ''),
    [name, rollNumber, department, campus, year, batch, user],
  );

  // Drop the "saved" banner as soon as the user starts editing again.
  useEffect(() => {
    if (dirty) setSaved(false);
  }, [dirty]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const yearNum = Number(year);
    const next: ProfileErrors = {};
    if (!name.trim()) next.name = 'Name is required.';
    if (!ROLL_RE.test(rollNumber.trim())) next.rollNumber = 'Roll number must be exactly 10 digits.';
    if (!department.trim()) next.department = 'Department is required.';
    if (!campus.trim()) next.campus = 'Campus is required.';
    if (!year) next.year = 'Select your year.';
    else if (!Number.isInteger(yearNum) || yearNum < 1 || yearNum > 4)
      next.year = 'Year must be between 1 and 4.';
    if (!batch.trim()) next.batch = 'Batch is required.';

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSaving(true);
    const result = await updateProfile({
      name: name.trim(),
      rollNumber: rollNumber.trim(),
      year: yearNum,
      department: department.trim() || undefined,
      campus: campus.trim() || undefined,
      batch: batch.trim() || undefined,
    });
    setSaving(false);

    if (!result.ok) {
      setServerError(result.message);
      return;
    }
    setSaved(true);
  };

  return (
    <div className="space-y-6 animate-fade-in-up max-w-3xl">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-semibold text-zinc-100">My Profile</h2>
        <p className="text-sm text-zinc-500 mt-1">View and update your account details.</p>
      </div>

      {/* Identity card */}
      <div className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-600/20 border border-blue-500/30 text-xl font-bold text-blue-300">
          {getInitials(user?.name, user?.email)}
        </div>
        <div className="min-w-0">
          <p className="text-lg font-semibold text-zinc-100 truncate">{user?.name || 'Your name'}</p>
          <div className="mt-0.5 flex items-center gap-1.5 text-sm text-zinc-400">
            <Mail className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{user?.email}</span>
          </div>
        </div>
      </div>

      {/* Editable details */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6"
        noValidate
      >
        {serverError && (
          <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-300">
            {serverError}
          </div>
        )}

        {saved && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2.5 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            Your profile has been updated.
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

        {/* Email is read-only — tied to the account and the roll number. */}
        <Input
          label="Student email (cannot be changed)"
          icon={Mail}
          value={user?.email ?? ''}
          readOnly
          disabled
          className="opacity-70"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            placeholder="e.g. N, P, Q"
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
            error={errors.batch}
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary" size="lg" disabled={saving || !dirty}>
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};
