'use client';

import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { TaskCard } from '@/components/tasks/TaskCard';
import { TaskModal } from '@/components/tasks/TaskModal';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  type: 'Assignment' | 'Study' | 'Review' | 'Exam' | 'Project';
  date: string;
  time: string;
  completed: boolean;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Complete Data Structures Assignment',
      description: 'Implement AVL tree relation methods',
      priority: 'High',
      type: 'Assignment',
      date: '2026-02-03',
      time: '23:59',
      completed: false,
    },
    {
      id: '2',
      title: 'Study Calculus Chapter 5',
      description: 'Integration techniques and applications',
      priority: 'Medium',
      type: 'Study',
      date: '2026-02-03',
      time: '18:00',
      completed: true,
    },
    {
      id: '3',
      title: 'Review React Hooks',
      description: 'Go through useState, useEffect, and custom hooks',
      priority: 'Low',
      type: 'Review',
      date: '2026-02-04',
      time: '10:00',
      completed: false,
    },
    {
      id: '4',
      title: 'Database Systems Quiz',
      description: 'Prepare for quiz on SQL joins and normalization',
      priority: 'High',
      type: 'Exam',
      date: '2026-02-05',
      time: '14:00',
      completed: false,
    },
    {
      id: '5',
      title: 'Linear Algebra Problem Set',
      description: 'Solve problems 1-15 from textbook',
      priority: 'Medium',
      type: 'Assignment',
      date: '2026-02-06',
      time: '23:59',
      completed: false,
    },
    {
      id: '6',
      title: 'Prepare Presentation Slides',
      description: 'Operating Systems group project presentation',
      priority: 'High',
      type: 'Project',
      date: '2026-02-07',
      time: '16:00',
      completed: false,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'today' | 'upcoming' | 'completed'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Toggle task completion
  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // Delete task
  const handleDelete = (id: string) => {
    if (window.confirm('Delete this task?')) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  // Save task (add or edit)
  const handleSave = (taskData: Omit<Task, 'id'> | Task) => {
    if ('id' in taskData) {
      setTasks(tasks.map(t => t.id === taskData.id ? taskData : t));
    } else {
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
      };
      setTasks([...tasks, newTask]);
    }
    setIsModalOpen(false);
    setEditingTask(null);
  };

  // Filter tasks - FIXED VERSION
  const getFilteredTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    
    let filtered = [...tasks];

    // Apply tab filter
    switch (activeFilter) {
      case 'today':
        filtered = filtered.filter(t => t.date === today && !t.completed);
        break;
      case 'upcoming':
        filtered = filtered.filter(t => t.date > today && !t.completed);
        break;
      case 'completed':
        filtered = filtered.filter(t => t.completed);
        break;
      case 'all':
      default:
        // Show all tasks
        break;
    }

    // Apply search - IMPROVED
    const query = searchQuery.toLowerCase().trim();
    if (query) {
      filtered = filtered.filter(task => {
        const titleMatch = task.title.toLowerCase().includes(query);
        const descMatch = task.description.toLowerCase().includes(query);
        const typeMatch = task.type.toLowerCase().includes(query);
        const priorityMatch = task.priority.toLowerCase().includes(query);
        
        return titleMatch || descMatch || typeMatch || priorityMatch;
      });
    }

    return filtered;
  };

  const filteredTasks = getFilteredTasks();
  
  // Count for each filter
  const today = new Date().toISOString().split('T')[0];
  const counts = {
    all: tasks.length,
    today: tasks.filter(t => t.date === today && !t.completed).length,
    upcoming: tasks.filter(t => t.date > today && !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
  };

return (
  <div className="min-h-full bg-gray-50">
    <div className="p-4 sm:p-4 lg:p-4">
      <div className="space-y-6 sm:space-y-6">
        {/* HEADER SECTION */}
        <div >
          <div className="flex flex-row sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 b"
            />
          </div>
            <button
              onClick={() => {
                setEditingTask(null);
                setIsModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg text-xs font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Task
            </button>
          </div>

          {/* Search */}

        </div>

        {/* FILTER TABS */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {(['all', 'today', 'upcoming', 'completed'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                activeFilter === filter
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {filter === 'all' && `All Tasks (${counts.all})`}
              {filter === 'today' && `Today (${counts.today})`}
              {filter === 'upcoming' && `Upcoming (${counts.upcoming})`}
              {filter === 'completed' && `Completed (${counts.completed})`}
            </button>
          ))}
        </div>

        {/* TASKS GRID (Like Dashboard Sections) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

          {filteredTasks.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl p-12 text-center border border-gray-200">
              <p className="text-gray-500">
                {searchQuery
                  ? `No tasks found matching "${searchQuery}"`
                  : 'No tasks found'}
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={() => toggleTask(task.id)}
                onEdit={() => {
                  setEditingTask(task);
                  setIsModalOpen(true);
                }}
                onDelete={() => handleDelete(task.id)}
              />
            ))
          )}

        </div>

      </div>
    </div>

    <TaskModal
      isOpen={isModalOpen}
      onClose={() => {
        setIsModalOpen(false);
        setEditingTask(null);
      }}
      onSave={handleSave}
      task={editingTask}
    />
  </div>
);
}