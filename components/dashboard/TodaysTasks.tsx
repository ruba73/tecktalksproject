"use client";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export function TodaysTasks(){

    const [tasks, setTasks] = useState([
        {
            id: "1",
            title: "Complete Data Structures Assignment",
            priority: "high" as const,
            time: "11:59 PM",
            completed: false,
        },
        {
            id: "2",
            title: "Study Calculus Chapter 5",
            priority: "medium" as const,
            time: "6:00 PM",
            completed: true,
        },
        {
            id: "3",
            title: "review React Hooks",
            priority: "low" as const,
            time: "3:00 PM",
            completed: false,
        },
    ])

    const toggleTask = (id: string) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };

    const priorityColors = {
        high: "bg-red-100 text-red-700",
        medium: "bg-yellow-100 text-yellow-700",
        low: "bg-green-100 text-green-700",
    };

    return(
    <Card>
        <CardHeader>
            <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Today's Tasks</CardTitle>
                <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700">
                    <Plus className="w-4 h-4" />
                </button>
            </div>          
        </CardHeader>
        <CardContent>
            <div className="space-y-1">
                {tasks.map((task) => (
                    <div key={task.id} className="flex items-start gap-3 p-3 border bg-gray-50 rounded-lg hover:bg-gray-100 border-gray-100">
                        <input type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTask(task.id)}
                            className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 "
                        />                    
                        <div className="flex-1 min-w-0 ">
                            <h4 className={`font-medium text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {task.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-2">
                            <span className={`text-xs px-2 py-0.5 rounded ${priorityColors[task.priority]} capitalize`}>
                                {task.priority}
                            </span>
                            <span className="text-xs text-gray-500">{task.time}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
            <button className="w-full text-center  text-sm text-blue-600 font-medium hover:text-blue-700 py-2">View All Tasks</button>
    </Card>
    );
}