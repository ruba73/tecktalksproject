'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function AddSubjectForm() {
  // Form state
  const [subjectName, setSubjectName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [hoursNeeded, setHoursNeeded] = useState('10');

  // Handle form submit
  const handleAddSubject = () => {
    if (!subjectName || !deadline) {
      alert('Please fill in subject name and deadline');
      return;
    }
    
    console.log({
      subjectName,
      deadline,
      priority,
      hoursNeeded,
    });
    
    // Clear form
    setSubjectName('');
    setDeadline('');
    setPriority('Medium');
    setHoursNeeded('10');
    
    alert('Subject added! (This is a demo)');
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
        Add New Subject
      </h3>
      
      <div className="space-y-4 sm:space-y-6">
        
        {/* Row 1: Subject Name and Deadline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Subject Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="e.g., Linear Algebra"
              className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
          
          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deadline <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Row 2: Priority and Hours Needed */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm sm:text-base"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          
          {/* Hours Needed */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hours Needed
            </label>
            <input
              type="number"
              value={hoursNeeded}
              onChange={(e) => setHoursNeeded(e.target.value)}
              min="1"
              max="100"
              className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Add Subject Button */}
        <div>
          <Button
            onClick={handleAddSubject}
            variant="primary"
            className="w-full sm:w-auto"
          >
            + Add Subject
          </Button>
        </div>
      </div>
    </div>
  );
}