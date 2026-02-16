import { Brain } from 'lucide-react';

export function PlanGeneratorHeader() {
  return (
    <div className="bg-transparent ">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        
        {/* Icon */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <Brain className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
        </div>
        
        {/* Text */}
        <div className="flex-1">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
            AI Study Plan Generator
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Tell us about your subjects and we'll create a personalized study schedule
          </p>
        </div>
      </div>
    </div>
  );
}