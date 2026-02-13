import { BookOpen, Clock, Target, TrendingUp } from "lucide-react";
import { StatCard } from "./StatCard";
export function StatsGrid(){
    const stats ={
        activeCourses: 6,
        studyHours: 24,
        completionRate: 87,
        goalsAchieved: 12,

    };

    return(
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Active Courses*/}
            <StatCard 
                title="Active Courses"
                value={stats.activeCourses}
                icon={BookOpen}
                iconColor="text-blue-600" iconBgColor={"bg-blue-50"}>
            </StatCard>
            {/* Study Hours */}
            <StatCard
                title="Study Hours (Week)"
                value={stats.studyHours}
                icon={Clock}
                iconColor="text-green-600" iconBgColor={"bg-green-50"}>
            </StatCard>
            {/* Completion Rate */}
            <StatCard
                title="Completion Rate"
                value={`${stats.completionRate}%`}
                icon={TrendingUp}
                iconColor="text-purple-600" iconBgColor={"bg-purple-50"}>
            </StatCard>
            {/* Goals Achieved */}
            <StatCard
                title="Goals Achieved"
                value={stats.goalsAchieved}
                icon={Target}
                iconColor="text-orange-600" iconBgColor={"bg-orange-50"}>
            </StatCard>
        </div>
    );
}