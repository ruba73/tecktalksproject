'use client';

import { Sparkles, ArrowRight } from 'lucide-react';

export function GenerateButton() {
  const handleGenerate = () => {
    alert('Generating study plan... (This is a demo)');
    // In real app, this would call an API or navigate to study plan page
  };

  return (
    <button
      onClick={handleGenerate}
      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 sm:py-4 px-6 rounded-xl font-semibold text-base sm:text-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
    >
      <Sparkles className="w-5 h-5" />
      <span>Generate My Study Plan</span>
      <ArrowRight className="w-5 h-5" />
    </button>
  );
}