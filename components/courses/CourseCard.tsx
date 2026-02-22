import { BookOpen, Calendar, Clock, Edit, Trash2, Target } from 'lucide-react';
import { Course } from '@/app/(dashboard)/courses/page';

interface CourseCardProps {
  course: Course;
  onEdit: () => void;
  onDelete: () => void;
}

export function CourseCard({ course, onEdit, onDelete }: CourseCardProps) {
  const difficultyColors = {
    Easy: 'bg-green-100 text-green-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    Hard: 'bg-red-100 text-red-700',
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-200">
      {/* Colored Header */}
      <div className={`${course.color} p-6 text-white relative`}>
        <div className="flex items-start justify-between mb-4">
          <BookOpen className="w-8 h-8" />
          
          {/* Edit and Delete Icons */}
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-1.5 hover:bg-white/20 rounded transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1.5 hover:bg-white/20 rounded transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <h3 className="font-bold text-xl">{course.name}</h3>
      </div>

      {/* Card Body */}
      <div className="p-6">
        {/* Difficulty and Progress */}
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyColors[course.difficulty]}`}>
            {course.difficulty}
          </span>
          <div className="text-right">
            <p className="text-sm text-gray-500">Progress</p>
            <p className="text-lg font-bold text-gray-900">{course.progress}%</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className={`h-2 rounded-full ${course.color}`}
            style={{ width: `${course.progress}%` }}
          />
        </div>

        {/* Deadline */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <Calendar className="w-4 h-4" />
          <span>Due: {formatDate(course.deadline)}</span>
        </div>

        {/* Hours per Week */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <Clock className="w-4 h-4" />
          <span>{course.hoursPerWeek}h per week</span>
        </div>

        {/* Goals */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-semibold text-gray-900">Goals:</span>
          </div>
          <ul className="space-y-2">
            {course.goals.map((goal, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-gray-400 mt-0.5">•</span>
                <span>{goal}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}