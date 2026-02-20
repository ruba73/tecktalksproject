'use client';

import { useState } from 'react';
import { Settings as SettingsIcon, Target, Bell, Palette, Globe, Volume2, Save, LogOut, Sun, Moon } from 'lucide-react';

export default function SettingsPage() {
  // Study Preferences State
  const [dailyGoal, setDailyGoal] = useState(4);
  const [breakDuration, setBreakDuration] = useState('15 minutes');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('21:00');

  // Notification Settings State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [studyReminders, setStudyReminders] = useState(true);
  const [deadlineAlerts, setDeadlineAlerts] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);

  // Appearance Settings State
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState('English');
  const [soundEffects, setSoundEffects] = useState(true);

  // Calculate available study window
  const calculateStudyWindow = () => {
    const start = parseInt(startTime.split(':')[0]);
    const end = parseInt(endTime.split(':')[0]);
    const hours = end - start;
    return `${startTime} - ${endTime} (${hours} hours)`;
  };

  const handleSaveSettings = () => {
    alert('Settings saved successfully!');
    console.log('Saving settings:', {
      dailyGoal,
      breakDuration,
      startTime,
      endTime,
      emailNotifications,
      pushNotifications,
      studyReminders,
      deadlineAlerts,
      weeklyReports,
      theme,
      language,
      soundEffects,
    });
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      alert('Logging out...');
      // In real app: clear session, redirect to login
    }
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="p-4 sm:p-4 lg:p-4">
        <div className="mb-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <SettingsIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Settings</h2>
              <p className="text-gray-600">Manage your preferences and application settings</p>
            </div>
          </div>
        </div>

        {/* Study Preferences Section */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Study Preferences</h3>
          </div>

          <div className="space-y-6">
            {/* Daily Study Goal */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700">Daily Study Goal (hours)</label>
                <span className="text-sm text-gray-500">{dailyGoal} hours per day</span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                value={dailyGoal}
                onChange={(e) => setDailyGoal(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                style={{
                  background: `linear-gradient(to right, #9333ea 0%, #9333ea ${(dailyGoal / 12) * 100}%, #e5e7eb ${(dailyGoal / 12) * 100}%, #e5e7eb 100%)`
                }}
              />
            </div>

            {/* Break Duration and Times Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Break Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Break Duration (minutes)
                </label>
                <select
                  value={breakDuration}
                  onChange={(e) => setBreakDuration(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="5 minutes">5 minutes</option>
                  <option value="10 minutes">10 minutes</option>
                  <option value="15 minutes">15 minutes</option>
                  <option value="20 minutes">20 minutes</option>
                  <option value="30 minutes">30 minutes</option>
                </select>
              </div>

              {/* Preferred Start Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Study Start Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Preferred End Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Study End Time
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Available Study Window */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900">
                Available Study Window: <span className="text-blue-600">{calculateStudyWindow()}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Notification Settings Section */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Bell className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
          </div>

          <div className="space-y-4">
            {/* Email Notifications */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive updates via email</p>
              </div>
              <button
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  emailNotifications ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Push Notifications */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">Push Notifications</p>
                <p className="text-sm text-gray-600">Receive browser notifications</p>
              </div>
              <button
                onClick={() => setPushNotifications(!pushNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  pushNotifications ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    pushNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Study Reminders */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">Study Reminders</p>
                <p className="text-sm text-gray-600">Get reminded about study sessions</p>
              </div>
              <button
                onClick={() => setStudyReminders(!studyReminders)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  studyReminders ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    studyReminders ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Deadline Alerts */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">Deadline Alerts</p>
                <p className="text-sm text-gray-600">Alerts for upcoming deadlines</p>
              </div>
              <button
                onClick={() => setDeadlineAlerts(!deadlineAlerts)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  deadlineAlerts ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    deadlineAlerts ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Weekly Reports */}
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">Weekly Reports</p>
                <p className="text-sm text-gray-600">Receive weekly progress summaries</p>
              </div>
              <button
                onClick={() => setWeeklyReports(!weeklyReports)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  weeklyReports ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    weeklyReports ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>


        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleSaveSettings}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Save className="w-5 h-5" />
            Save Settings
          </button>
          <button
            onClick={handleLogout}
            className="sm:w-auto px-6 py-3 border-2 border-red-600 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}