'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Subject } from '@/app/types/types';
import { SubjectCard } from '@/components/ai-setup/SubjectCard';
import { AddSubjectCard } from '@/components/ai-setup/AddSubjectCard';
import { AvailabilitySection } from '@/components/ai-setup/AvailabilitySection';
import { SubjectModal } from '@/components/ai-setup/SubjectModal';

export default function AISetupPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const handleSave = (subjectData: Omit<Subject, 'id'> | Subject) => {
    if ('id' in subjectData) {
      setSubjects(subjects.map(s => s.id === subjectData.id ? subjectData : s));
    } else {
      const newSubject: Subject = { ...subjectData, id: Date.now().toString() };
      setSubjects([...subjects, newSubject]);
    }
    setIsModalOpen(false);
    setEditingSubject(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this subject?')) {
      setSubjects(subjects.filter(s => s.id !== id));
    }
  };

  const openEditModal = (subject: Subject) => {
    setEditingSubject(subject);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingSubject(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">AI Study Plan Generator</h2>
              <p className="text-gray-600">
                Manage your subjects and generate a personalized study schedule
              </p>
            </div>
          </div>
        </div>

        {/* Subjects */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Your Subjects</h3>
            <span className="text-sm text-gray-500">{subjects.length} subjects added</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map(subject => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                onEdit={() => openEditModal(subject)}
                onDelete={() => handleDelete(subject.id)}
              />
            ))}
            <AddSubjectCard onClick={openAddModal} />
          </div>
        </div>

        <AvailabilitySection />

        <button
          onClick={() => alert('Generating study plan...')}
          disabled={subjects.length === 0}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles className="w-5 h-5" />
          Generate My Study Plan
          <span>→</span>
        </button>
      </div>

      <SubjectModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingSubject(null); }}
        onSave={handleSave}
        subject={editingSubject}
      />
    </div>
  );
}
