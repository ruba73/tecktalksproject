'use client';

import { useState } from 'react';
import { CourseCard } from '@/components/courses/CourseCard';
import { CourseModal } from '@/components/courses/CourseModal';

export interface Course {
  id: string;
  name: string;
  color: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  progress: number;
  deadline: string;
  hoursPerWeek: number;
  goals: string[];
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      name: 'Data Structures & Algorithms',
      color: 'bg-blue-500',
      difficulty: 'Hard',
      progress: 45,
      deadline: '2026-03-15',
      hoursPerWeek: 6,
      goals: [
        'Master binary trees',
        'Complete all LeetCode problems',
        '+1 more',
      ],
    },
    {
      id: '2',
      name: 'Calculus II',
      color: 'bg-green-600',
      difficulty: 'Medium',
      progress: 62,
      deadline: '2026-03-20',
      hoursPerWeek: 4,
      goals: [
        'Understand integration techniques',
        'Score 85+ on midterm',
      ],
    },
    {
      id: '3',
      name: 'Web Development',
      color: 'bg-purple-600',
      difficulty: 'Easy',
      progress: 78,
      deadline: '2026-04-01',
      hoursPerWeek: 5,
      goals: [
        'Build portfolio website',
        'Learn React advanced patterns',
      ],
    },
    {
      id: '4',
      name: 'Database Systems',
      color: 'bg-orange-500',
      difficulty: 'Medium',
      progress: 38,
      deadline: '2026-03-25',
      hoursPerWeek: 4,
      goals: [
        'Master SQL queries',
        'Design normalized databases',
      ],
    },
    {
      id: '5',
      name: 'Linear Algebra',
      color: 'bg-red-600',
      difficulty: 'Hard',
      progress: 55,
      deadline: '2026-03-18',
      hoursPerWeek: 5,
      goals: [
        'Understand eigenvalues',
        'Complete all assignments',
      ],
    },
    {
      id: '6',
      name: 'Operating Systems',
      color: 'bg-indigo-600',
      difficulty: 'Hard',
      progress: 30,
      deadline: '2026-04-10',
      hoursPerWeek: 6,
      goals: [
        'Implement thread scheduling',
        'Understand memory management',
      ],
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const handleSave = (courseData: Omit<Course, 'id'> | Course) => {
    if ('id' in courseData) {
      setCourses(courses.map(c => c.id === courseData.id ? courseData : c));
    } else {
      const newCourse: Course = {
        ...courseData,
        id: Date.now().toString(),
      };
      setCourses([...courses, newCourse]);
    }
    setIsModalOpen(false);
    setEditingCourse(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this course?')) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="p-4 sm:p-4 lg:p-4">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Manage your courses and learning goals</p>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg text-sm font-medium"
            >
              <span className="text-lg">+</span>
              Add Course
            </button>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEdit={() => openEditModal(course)}
              onDelete={() => handleDelete(course.id)}
            />
          ))}
        </div>
      </div>

      <CourseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCourse(null);
        }}
        onSave={handleSave}
        course={editingCourse}
      />
    </div>
  );
}