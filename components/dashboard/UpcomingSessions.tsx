import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Plus } from "lucide-react";

export function UpcomingSessions(){

    const sessions = [
        {
           id: '1',
            subject: 'Data Structures',
            topic: 'Binary Trees',
            time: 'Today, 2:00 PM',
            duration: '2h',
            difficulty: 'hard' as const,
        },
        {
            id: '2',
            subject: 'Calculus',
            topic: 'Integration by Parts',
            time: 'Tomorrow, 4:00 PM',
            duration: '1.5h',
            difficulty: 'medium' as const,
        },
        {
            id: '3',
            subject: 'Web Development',
            topic: 'React Hooks',   
            time: 'Friday, 6:00 PM',
            duration: '2h',
            difficulty: 'easy' as const,
        },
        {
            id: '4',
            subject: 'Physics',
            topic: 'Quantum Mechanics',
            time: 'Saturday, 3:00 PM',
            duration: '2.5h',
            difficulty: 'hard' as const,
        },
    ];

    return(
        <Card>
            <CardHeader className="flex itmes-center justify-between">
                <CardTitle>Upcoming Study Sessions</CardTitle>
                    <button
                    className="flex items-center gap-2 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg px-3 py-1.5 text-sm hover:opacity-90">
                        <Plus className="w-4 h-4" />
                        <span >Add Session</span>
                    </button>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sessions.map(session => (
                        <div key={session.id} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                            <Calendar className="w-5 h-5 text-white" />
                        </div>

                        <div className="flex-1 mx-4">
                            <h3 className="font-semibold">{session.subject}</h3>
                            <p className="text-xs text-gray-600">{session.topic}</p>
                            <p className="text-xs text-gray-500 mt-1">{session.time}</p>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                            <div className="text-xs px-2 py-1">{session.duration}</div>
                            <div className={`text-xs px-2 py-1 rounded-lg ${
                            session.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                            session.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                            }`}>
                            {session.difficulty}
                            </div>
                        </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}