'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';

export function TodaysTasks() {
  // Static tasks data
  const [tasks, setTasks] = useState([
    {
      id: '1',
      title: 'Complete Data Structures Assignment',
      description: 'Implement AVL tree relation methods',
      priority: 'high' as const,
      type: 'Assignment' as const,
      time: '11:59 PM',
      completed: false,
    },
    {
      id: '2',
      title: 'Study Calculus Chapter 5',
      description: 'Integration techniques and applications',
      priority: 'medium' as const,
      type: 'Study' as const,
      time: '6:00 PM',
      completed: true,
    },
    {
      id: '3',
      title: 'Review React Hooks',
      description: 'Go through useState, useEffect, and custom hooks',
      priority: 'low' as const,
      type: 'Review' as const,
      time: '3:00 PM',
      completed: false,
    },
    {
      id: '4',
      title: 'Database Systems Quiz Prep',
      description: 'Prepare for quiz on SQL joins and normalization',
      priority: 'high' as const,
      type: 'Exam' as const,
      time: '2:00 PM',
      completed: false,
    },
  ]);

  // Toggle task completion
  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // Priority badge colors
  const priorityColors = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-green-100 text-green-700',
  };
  
  // Type badge colors
  const typeColors = {
    Assignment: 'bg-blue-100 text-blue-700',
    Exam: 'bg-purple-100 text-purple-700',
    Study: 'bg-green-100 text-green-700',
    Review: 'bg-orange-100 text-orange-700',
    Project: 'bg-pink-100 text-pink-700',
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Today's Tasks</CardTitle>
          <button className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:text-blue-700">
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className={`font-medium text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {task.title}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">{task.description}</p>
                
                {/* Badges */}
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${priorityColors[task.priority]} capitalize`}>
                    {task.priority}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded ${typeColors[task.type]}`}>
                    {task.type}
                  </span>
                  <span className="text-xs text-gray-500">{task.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* View All Link */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="text-blue-600 text-sm font-medium hover:text-blue-700 w-full text-center">
            View All Tasks
          </button>
        </div>
      </CardContent>
    </Card>
  );
}