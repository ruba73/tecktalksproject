'use client';

import { useState } from 'react';
import { Calendar, Clock, X } from 'lucide-react';

interface Subject {
  id: string;
  name: string;
  deadline: string;
  hoursNeeded: string;
  priority: 'High' | 'Medium' | 'Low';
}

export function SubjectsList() {
  // Static subjects data
  const [subjects, setSubjects] = useState<Subject[]>([
    {
      id: '1',
      name: 'Data Structures',
      deadline: '3/15/2026',
      hoursNeeded: '24h needed',
      priority: 'High',
    },
    {
      id: '2',
      name: 'Calculus II',
      deadline: '3/20/2026',
      hoursNeeded: '16h needed',
      priority: 'Medium',
    },
  ]);

  // Remove subject
  const removeSubject = (id: string) => {
    setSubjects(subjects.filter(subject => subject.id !== id));
  };

  // Priority colors
  const priorityColors = {
    High: 'bg-red-100 text-red-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    Low: 'bg-green-100 text-green-700',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Your Subjects</h3>
        <span className="text-sm text-gray-500">{subjects.length} subjects added</span>
      </div>

      {/* Subjects List */}
      <div className="space-y-3 sm:space-y-4">
        {subjects.map((subject) => (
          <div 
            key={subject.id}
            className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {/* Subject Name */}
                <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 truncate">
                  {subject.name}
                </h4>
                
                {/* Details - Stack on mobile, row on tablet */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>{subject.deadline}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span>{subject.hoursNeeded}</span>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[subject.priority]} w-fit`}>
                    {subject.priority}
                  </span>
                </div>
              </div>
              
              {/* Delete Button */}
              <button
                onClick={() => removeSubject(subject.id)}
                className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                aria-label="Remove subject"
              >
                <X className="w-5 h-5 text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}