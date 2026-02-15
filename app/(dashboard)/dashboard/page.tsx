import { WelcomeCard } from '@/components/dashboard/WelcomeCard';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { TodaysTasks } from '@/components/dashboard/TodaysTasks';
import { ProgressTracker } from '@/components/dashboard/ProgressTracker';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { UpcomingSessions } from '@/components/dashboard/UpcomingSessions';

export default function DashboardPage() {
  return (
    <div className="min-h-full bg-gray-50">
      {/* Responsive Container */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="space-y-6 sm:space-y-8">
          
          {/* Welcome Card */}
          <WelcomeCard />
          
          {/* Stats Grid */}
          <StatsGrid />
          
          {/* 3-Column Grid - Responsive */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <TodaysTasks />
            <ProgressTracker />
            <RecentActivity />
          </div>
          
          {/* Upcoming Sessions */}
          <UpcomingSessions />
        </div>
      </div>
    </div>
  );
}