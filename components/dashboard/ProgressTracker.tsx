"use client";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
export function ProgressTracker(){
    const dailyProgress = {
        percentage: 75,
        completed: 3,
        total: 4,
    };

    const weeklyProgress = {
        percentage: 60,
        completed: 10,
        total:18,
    };
    const upcomingDeadlines = [
        {
            title: "Data Structures Exam",
            daysLeft: 2,
            color: "text-red-600",
        },
          {
            title: "Web Dev Project",
            daysLeft: 7,
            color: "text-green-600",
        },
        {
            title: "Science Project",
            daysLeft: 5,
            color: "text-yellow-600",
        }, 
    ];

    return (
    <Card>
        <CardHeader>
            <CardTitle className="text-lg font-bold">Progress Tracker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
            {/* Daily Progress */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Daily Progress</span>
                    <span className="text-sm font-semibold text-blue-600">{dailyProgress.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${dailyProgress.percentage}%` }}
                    />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    {dailyProgress.completed} of {dailyProgress.total} tasks completed
                </p>
            </div>
            {/*Weekly Progress*/}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Weekly Progress</span>
                    <span className="text-sm font-semibold text-green-600">{weeklyProgress.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div    
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${weeklyProgress.percentage}%` }}/>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    {weeklyProgress.completed} of {weeklyProgress.total} Study Hours completed    
                </p>
            </div>

            <div className="w-full border-t border-gray-200"></div>
            {/* Upcoming Deadlines */}
            <div className="space-y-2">
                <h2 className="text-sm font-bold text-gray-700">Upcoming Deadlines</h2>
                {upcomingDeadlines.map((deadline, index) => (
                    <div key={index} className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">{deadline.title}</span>
                        <span className={`text-sm font-medium ${deadline.color}`}>
                        {deadline.daysLeft} days
                        </span>
                    </div>
                    ))}
            </div>
        </CardContent>
    </Card>
    );
}