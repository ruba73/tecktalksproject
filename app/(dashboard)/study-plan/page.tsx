'use client';

import { useState } from 'react';
import { Sparkles, Calendar, RotateCcw, Target } from 'lucide-react';

export default function StudyPlanPage() {
  const [studyHoursPerDay, setStudyHoursPerDay] = useState('6');
  const [studyDaysPerWeek, setStudyDaysPerWeek] = useState('6');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('21:00');
  const [breakDuration, setBreakDuration] = useState('15');
  const [hasGeneratedPlan, setHasGeneratedPlan] = useState(false);

  const handleGeneratePlan = () => {
    // In real app, this would call AI to generate the plan
    alert('Generating your personalized study plan...\n\nThis will create a schedule based on your preferences and subjects!');
    setHasGeneratedPlan(true);
  };

  return (
    <div className="min-h-full bg-gray-50">
      {/* Responsive Container */}
      <div className="p-4 sm:p-4 lg:p-4">
        {/* AI Study Plan Generator Card */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                AI Study Plan Generator
              </h2>
              <p className="text-gray-600">
                Configure your preferences and let AI create your personalized study schedule
              </p>
            </div>
          </div>

          {/* Study Preferences Grid */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Study Hours per Day */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Study Hours per Day
              </label>
              <input
                type="number"
                value={studyHoursPerDay}
                onChange={(e) => setStudyHoursPerDay(e.target.value)}
                min="1"
                max="24"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Study Days per Week */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Study Days per Week
              </label>
              <input
                type="number"
                value={studyDaysPerWeek}
                onChange={(e) => setStudyDaysPerWeek(e.target.value)}
                min="1"
                max="7"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Preferred Start Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Start Time
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Preferred End Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred End Time
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Break Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Break Duration (minutes)
              </label>
              <input
                type="number"
                value={breakDuration}
                onChange={(e) => setBreakDuration(e.target.value)}
                min="5"
                max="60"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Feature Cards */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Deadline Priority */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">
                    Deadline Priority
                  </h3>
                  <p className="text-sm text-blue-700">
                    Courses with earlier deadlines get scheduled first
                  </p>
                </div>
              </div>
            </div>

            {/* Spaced Repetition */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <RotateCcw className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-purple-900 mb-1">
                    Spaced Repetition
                  </h3>
                  <p className="text-sm text-purple-700">
                    Reviews scheduled at 1, 3, 7, and 14-day intervals
                  </p>
                </div>
              </div>
            </div>

            {/* Difficulty Balance */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">
                    Difficulty Balance
                  </h3>
                  <p className="text-sm text-green-700">
                    Harder courses get longer study sessions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State or Generated Plan */}
        {!hasGeneratedPlan ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Study Plan Yet
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Configure your preferences above and click "Generate Plan" to create your personalized study schedule
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Study Plan Generated!
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              Your personalized study schedule has been created based on your preferences and subjects.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
              <p className="text-sm text-blue-800 mb-4">
                📅 Your study plan includes:
              </p>
              <ul className="text-left text-sm text-blue-700 space-y-2">
                <li>• {studyHoursPerDay} hours of study per day</li>
                <li>• {studyDaysPerWeek} study days per week</li>
                <li>• Sessions from {startTime} to {endTime}</li>
                <li>• {breakDuration} minute breaks between sessions</li>
                <li>• Prioritized by upcoming deadlines</li>
                <li>• Spaced repetition for better retention</li>
              </ul>
            </div>
          </div>
        )}

        {/* Generate Plan Button */}
        <div className="mt-8">
          <button
            onClick={handleGeneratePlan}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
          >
            <Sparkles className="w-5 h-5" />
            Generate Plan
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}