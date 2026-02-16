'use client';

import { useState } from 'react';

export function AvailabilityForm() {
  // Form state
  const [studyHoursPerDay, setStudyHoursPerDay] = useState('4');
  const [studyDaysPerWeek, setStudyDaysPerWeek] = useState('6');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('21:00');

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
        Your Availability
      </h3>
      
      <div className="space-y-4 sm:space-y-6">
        
        {/* Row 1: Study Hours and Days */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
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
              className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
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
              className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Row 2: Start and End Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Preferred Start Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Start Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
          
          {/* Preferred End Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred End Time
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
        </div>
      </div>
    </div>
  );
}