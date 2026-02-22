'use client';

import { useMemo, useState } from 'react';
import { X, Clock, AlertCircle, Trophy, Sparkles } from 'lucide-react';

type NotificationType = 'reminder' | 'deadline' | 'achievement' | 'feature';

type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read?: boolean;
};

function notifIcon(type: NotificationType) {
  switch (type) {
    case 'reminder':
      return { Icon: Clock, bg: 'bg-blue-50', fg: 'text-blue-600' };
    case 'deadline':
      return { Icon: AlertCircle, bg: 'bg-red-50', fg: 'text-red-600' };
    case 'achievement':
      return { Icon: Trophy, bg: 'bg-green-50', fg: 'text-green-600' };
    case 'feature':
    default:
      return { Icon: Sparkles, bg: 'bg-purple-50', fg: 'text-purple-600' };
  }
}

export default function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>([
    {
      id: '1',
      type: 'reminder',
      title: 'Study Reminder',
      message: 'Time to study Data Structures - Binary Trees',
      time: '5 min ago',
      read: false,
    },
    {
      id: '2',
      type: 'deadline',
      title: 'Upcoming Deadline',
      message: 'Calculus II assignment due in 2 days',
      time: '1 hour ago',
      read: false,
    },
    {
      id: '3',
      type: 'achievement',
      title: 'Achievement Unlocked!',
      message: 'You completed 7 days study streak!',
      time: '3 hours ago',
      read: false,
    },
    {
      id: '4',
      type: 'feature',
      title: 'New Feature Available',
      message: 'Check out our new AI-powered study recommendations',
      time: '1 day ago',
      read: true,
    },
  ]);

  const unread = useMemo(() => items.filter((i) => !i.read).length, [items]);

  function markAllRead() {
    setItems((p) => p.map((n) => ({ ...n, read: true })));
  }

  function dismiss(id: string) {
    setItems((p) => p.filter((n) => n.id !== id));
  }

  return (
    // ✅ Match Settings wrapper + padding
    <div className="min-h-full bg-gray-50">
      <div className="p-4 sm:p-4 lg:p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Notifications
              </h1>
              <p className="text-gray-500">{unread} unread</p>
            </div>

            <button
              onClick={markAllRead}
              className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm font-medium text-gray-800"
            >
              Mark all read
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            {items.map((n) => {
              const { Icon, bg, fg } = notifIcon(n.type);
              return (
                <div
                  key={n.id}
                  className="px-5 py-4 border-b border-gray-100 hover:bg-gray-50 flex gap-4"
                >
                  <div
                    className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className={`w-5 h-5 ${fg}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold text-gray-900">
                          {n.title}
                        </div>
                        <div className="text-sm text-gray-600">{n.message}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {n.time}
                        </div>
                      </div>

                      <button
                        onClick={() => dismiss(n.id)}
                        className="p-2 rounded-lg hover:bg-gray-100"
                        aria-label="Dismiss"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {items.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                You’re all caught up 🧠✨
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}