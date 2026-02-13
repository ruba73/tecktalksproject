import { Award } from "lucide-react";

export function WelcomeCard() {
  // Hardcoded data
  const userName = "Nour";
  const currentStreak = 7;
  const tasksRemaining = 3;
  
  // Get current date
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
      <div className="flex items-start justify-between">
        {/* Left side - Welcome text */}
        <div className="flex-1">
          <h1 className="text-xl font-bold mb-2">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-white/80 mb-2 text-sm">{formattedDate}</p>
          <p className="text-sm text-white/80">
            You have {tasksRemaining} tasks remaining for today
          </p>
        </div>
        
        {/* Right side - Streak badge */}
        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-3 ml-3">
          <div className="flex items-center gap-1 mb-1">
            <Award className="w-4 h-4 text-white" />
            <span className="text-xs">Current Streak</span>
          </div>
          <p className="text-3xl font-bold text-center">{currentStreak} days</p>
        </div>
      </div>
    </div>
  );
}