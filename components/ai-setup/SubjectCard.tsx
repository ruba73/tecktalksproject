'use client';

import { Calendar, Clock, Edit, Trash2, FileText } from 'lucide-react';
import { Subject } from '@/app/types/types';

interface SubjectCardProps {
  subject: Subject;
  onEdit: () => void;
  onDelete: () => void;
}

export function SubjectCard({ subject, onEdit, onDelete }: SubjectCardProps) {
  const priorityColors = {
    High: 'bg-red-100 text-red-700 border-red-200',
    Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Low: 'bg-green-100 text-green-700 border-green-200',
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div 
      className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group"
      onClick={onEdit}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-bold text-gray-900 text-lg flex-1 pr-2 line-clamp-1">
          {subject.name}
        </h3>
        
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="p-1.5 hover:bg-blue-50 text-blue-600 rounded transition-colors"
            aria-label="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1.5 hover:bg-red-50 text-red-600 rounded transition-colors"
            aria-label="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[40px]">
        {subject.description}
      </p>

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Due: {formatDate(subject.deadline)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{subject.hoursNeeded}h needed</span>
        </div>
        {subject.files && subject.files.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FileText className="w-4 h-4" />
            <span>{subject.files.length} file{subject.files.length > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${priorityColors[subject.priority]}`}>
          {subject.priority} Priority
        </span>
      </div>
    </div>
  );
}
