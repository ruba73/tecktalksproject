'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Course } from '@/app/(dashboard)/courses/page';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: Omit<Course, 'id'> | Course) => void;
  course: Course | null;
}

const colorOptions = [
  { name: 'Blue', value: 'bg-blue-500' },
  { name: 'Green', value: 'bg-green-600' },
  { name: 'Purple', value: 'bg-purple-600' },
  { name: 'Orange', value: 'bg-orange-500' },
  { name: 'Red', value: 'bg-red-600' },
  { name: 'Indigo', value: 'bg-indigo-600' },
  { name: 'Pink', value: 'bg-pink-600' },
  { name: 'Teal', value: 'bg-teal-600' },
];

export function CourseModal({ isOpen, onClose, onSave, course }: CourseModalProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('bg-blue-500');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [progress, setProgress] = useState('0');
  const [deadline, setDeadline] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState('4');
  const [goals, setGoals] = useState<string[]>(['']);

  useEffect(() => {
    if (course) {
      setName(course.name);
      setColor(course.color);
      setDifficulty(course.difficulty);
      setProgress(course.progress.toString());
      setDeadline(course.deadline);
      setHoursPerWeek(course.hoursPerWeek.toString());
      setGoals(course.goals.length > 0 ? course.goals : ['']);
    } else {
      setName('');
      setColor('bg-blue-500');
      setDifficulty('Medium');
      setProgress('0');
      setDeadline('');
      setHoursPerWeek('4');
      setGoals(['']);
    }
  }, [course, isOpen]);

  const addGoal = () => {
    setGoals([...goals, '']);
  };

  const updateGoal = (index: number, value: string) => {
    const newGoals = [...goals];
    newGoals[index] = value;
    setGoals(newGoals);
  };

  const removeGoal = (index: number) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('Please enter a course name');
      return;
    }
    if (!deadline) {
      alert('Please select a deadline');
      return;
    }

    const courseData = {
      name: name.trim(),
      color,
      difficulty,
      progress: parseInt(progress) || 0,
      deadline,
      hoursPerWeek: parseInt(hoursPerWeek) || 4,
      goals: goals.filter(g => g.trim() !== ''),
    };

    if (course) {
      onSave({ ...courseData, id: course.id });
    } else {
      onSave(courseData);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={course ? 'Edit Course' : 'Add New Course'}>
      <div className="space-y-5">
        {/* Course Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Data Structures & Algorithms"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Color Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Color
          </label>
          <div className="grid grid-cols-4 gap-2">
            {colorOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setColor(option.value)}
                className={`h-12 rounded-lg ${option.value} ${
                  color === option.value ? 'ring-4 ring-gray-400' : ''
                }`}
              />
            ))}
          </div>
        </div>

        {/* Difficulty, Progress, Hours */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Progress (%)
            </label>
            <input
              type="number"
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              min="0"
              max="100"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hours/Week
            </label>
            <input
              type="number"
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(e.target.value)}
              min="1"
              max="40"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
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
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Goals */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Learning Goals
          </label>
          <div className="space-y-2">
            {goals.map((goal, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => updateGoal(index, e.target.value)}
                  placeholder={`Goal ${index + 1}`}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {goals.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeGoal(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addGoal}
            className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            + Add Goal
          </button>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button onClick={onClose} variant="secondary" className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="primary" className="flex-1">
            {course ? 'Save Changes' : 'Add Course'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}