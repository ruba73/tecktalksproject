import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { TodaysTasks } from "@/components/dashboard/TodaysTasks";
import { ProgressTracker } from "@/components/dashboard/ProgressTracker";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
export default function DashboardPage() {
  return (
    <div className="p-8 space-y-8">
      <WelcomeCard/>
      <StatsGrid/>
      {/* <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1> */}
      {/* <p className="text-gray-600 mt-2">Welcome to your dashboard!</p> */}
      
      <div className="text-gray-600 mt-4">
        <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TodaysTasks/> 
        <ProgressTracker/>
        <RecentActivity/>
        </div>
        <p>here are the widgets</p>
      </div>
    </div>
  );
}