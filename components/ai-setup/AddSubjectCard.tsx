'use client';

import { Plus } from 'lucide-react';

interface AddSubjectCardProps {
  onClick: () => void;
}

export function AddSubjectCard({ onClick }: AddSubjectCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-3 hover:border-blue-500 hover:bg-blue-50 transition-all min-h-[180px] flex flex-col items-center justify-center gap-2 group"
    >
      <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
        <Plus className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
      </div>
      <div className="text-center">
        <p className="font-semibold text-gray-900 mb-1 text-sm">Add New Subject</p>
        <p className="text-xs text-gray-500">Click to add a subject to your plan</p>
      </div>
    </button>
  );
}
