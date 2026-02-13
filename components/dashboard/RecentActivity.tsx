
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function RecentActivity(){

    const activities = [
        {
            id: "1",
            status: "completed",
            title: "Linear Algebra Assignment",
            time: "2 hours ago",
        },
        {
            id: "2",
            status: "Started",
            title: "Started Data Structures ",
            time: "5 hours ago",
        },
        {
            id: "3",
            status: "Archived",
            title: "Study Streak",
            time: "1 day ago",
        }
    ];

    return(
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {activities.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3">
                            <div className="w-2 h-2 mt-1.5 bg-blue-600 rounded-full"></div>
                            <div className="space-x-1">
                                <span className="text-sm font-semibold text-gray-700">{activity.status}:</span>  
                                <span className="text-sm text-gray-500">{activity.title}</span>
                                <p className="text-xs text-gray-500">{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}