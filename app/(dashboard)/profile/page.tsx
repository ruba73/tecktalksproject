'use client';

import { useMemo, useRef, useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Clock,
  Flame,
  Award,
  Shield,
  Camera,
  CalendarDays,
} from 'lucide-react';

export default function ProfilePage() {
  const [bio, setBio] = useState(
    'Passionate computer science student focusing on algorithms and data structures.'
  );

  const [form, setForm] = useState({
    fullName: 'Nour Rifaieh',
    email: 'nourrifaieh60@gmail.com',
    educationLevel: 'University',
    major: 'Computer Science',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  // ✅ Avatar upload state
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ Initials fallback (JD)
  const initials = useMemo(() => {
    const parts = form.fullName.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'U';
    const first = parts[0]?.[0] ?? 'U';
    const last = (parts.length > 1 ? parts[parts.length - 1]?.[0] : '') ?? '';
    return (first + last).toUpperCase();
  }, [form.fullName]);

  function setField<K extends keyof typeof form>(key: K, value: string) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function saveProfile() {
    // Connect to your API / server action here
    console.log('Save profile', { bio, form, avatarUrl });
    alert('Profile saved successfully!');
  }

  // ✅ Better password validation without changing UI
  function changePassword() {
    const current = form.currentPassword.trim();
    const next = form.newPassword.trim();
    const confirm = form.confirmNewPassword.trim();

    if (!current || !next || !confirm) {
      alert('Please fill all password fields.');
      return;
    }

    if (next.length < 8) {
      alert('New password must be at least 8 characters.');
      return;
    }

    if (next !== confirm) {
      alert('New password and confirmation do not match.');
      return;
    }

    if (next === current) {
      alert('New password must be different from current password.');
      return;
    }

    // Connect to your API / server action here
    console.log('Change password');
    alert('Password changed successfully!');

    // ✅ Clear password fields after success
    setForm((p) => ({
      ...p,
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    }));
  }

  // ✅ Avatar upload handler + preview
  function onPickAvatar() {
    fileInputRef.current?.click();
  }

  function onAvatarSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic file validation
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    const maxMB = 4;
    if (file.size > maxMB * 1024 * 1024) {
      alert(`Image size must be less than ${maxMB}MB.`);
      return;
    }

    const url = URL.createObjectURL(file);
    setAvatarUrl((prev) => {
      // clean old preview URL to avoid memory leaks
      if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);
      return url;
    });
  }

  return (
    // ✅ Match Settings page wrapper + padding EXACTLY
    <div className="min-h-full bg-gray-50">
      <div className="p-4 sm:p-4 lg:p-4">
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <div className="flex items-start gap-3 mb-6 hidden md:flex">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold">👤</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                My Profile
              </h2>
              <p className="text-gray-600">
                Manage your personal information and view your progress
              </p>
            </div>
          </div>

<div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
  <div className="relative h-28 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500">
    {/* ✅ Responsive name/email positioning */}
    <div
      className="
        absolute bottom-8
        left-4 sm:left-6 md:left-16 lg:left-[12%]
        text-left
        w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] md:w-[60%] lg:w-[30%]
      "
    >
      <div className="text-xl sm:text-2xl font-bold text-white leading-tight drop-shadow truncate">
        {form.fullName}
      </div>
      <div className="text-xs sm:text-sm text-white/90 drop-shadow truncate">
        {form.email}
      </div>
    </div>
  </div>

            <div className="px-6 -mt-10">
              <div className="flex items-end gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full ring-4 ring-white overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-2xl font-bold">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={onPickAvatar}
                    className="absolute -right-1 -bottom-1 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50"
                    aria-label="Change avatar"
                  >
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onAvatarSelected}
                  />
                </div>

                <div className="pb-1/2 ">
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-100">
                      <GraduationCap className="w-4 h-4" />
                      {form.educationLevel}
                    </span>
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-purple-50 text-purple-700 border border-purple-100">
                      <BookOpen className="w-4 h-4" />
                      {form.major}
                    </span>
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-green-50 text-green-700 border border-green-100">
                      <CalendarDays className="w-4 h-4" />
                      Joined Sep 2025
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <StatCard
                  icon={<BookOpen className="w-5 h-5 text-blue-600" />}
                  title="Courses Completed"
                  value="12"
                />
                <StatCard
                  icon={<Clock className="w-5 h-5 text-purple-600" />}
                  title="Study Hours"
                  value="156h"
                />
                <StatCard
                  icon={<Flame className="w-5 h-5 text-green-600" />}
                  title="Current Streak"
                  value="7 days"
                />
                <StatCard
                  icon={<Award className="w-5 h-5 text-orange-600" />}
                  title="Achievements"
                  value="8"
                />
              </div>

              {/* Bio */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full min-h-[90px] resize-none border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Profile Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <Field label="Full Name">
                  <input
                    value={form.fullName}
                    onChange={(e) => setField('fullName', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </Field>

                <Field label="Email Address">
                  <input
                    value={form.email}
                    onChange={(e) => setField('email', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </Field>

                <Field label="Education Level">
                  <select
                    value={form.educationLevel}
                    onChange={(e) => setField('educationLevel', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>High School</option>
                    <option>University</option>
                    <option>Graduate</option>
                    <option>Self-taught</option>
                  </select>
                </Field>

                <Field label="Major / Field of Study">
                  <input
                    value={form.major}
                    onChange={(e) => setField('major', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </Field>
              </div>

              {/* Security */}
              <div className="mt-8 border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-gray-900 font-semibold">
                  <Shield className="w-5 h-5 text-red-500" />
                  Security
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                  <Field label="Current Password">
                    <input
                      type="password"
                      placeholder="Enter current password"
                      value={form.currentPassword}
                      onChange={(e) =>
                        setField('currentPassword', e.target.value)
                      }
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </Field>

                  <div className="hidden md:block" />

                  <Field label="New Password">
                    <input
                      type="password"
                      placeholder="Enter new password"
                      value={form.newPassword}
                      onChange={(e) => setField('newPassword', e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </Field>

                  <Field label="Confirm New Password">
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={form.confirmNewPassword}
                      onChange={(e) =>
                        setField('confirmNewPassword', e.target.value)
                      }
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </Field>

                  <div className="md:col-span-2">
                    <button
                      type="button"
                      onClick={changePassword}
                      className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </div>

              {/* Save */}
              <div className="mt-8 pb-6">
                <button
                  type="button"
                  onClick={saveProfile}
                  className="w-full py-4 rounded-2xl text-white font-semibold bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 hover:opacity-95 active:opacity-90"
                >
                  Save Profile Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="text-sm font-medium text-gray-700 mb-2">{label}</div>
      {children}
    </label>
  );
}

function StatCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="border border-gray-200 rounded-2xl p-4 bg-white">
      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
        {icon}
      </div>
      <div className="mt-3 text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500">{title}</div>
    </div>
  );
}