import React from 'react'
import  { 
    BookOpen, 
    Brain,
    Calendar,
    ChartColumn,
    SquareCheckBig,
    LayoutDashboard,
    Sparkles,  
} from 'lucide-react'
import { usePathname } from 'next/dist/client/components/navigation';
import { Button } from '@/components/ui/button';

const navItems = [
    {name: 'Dashboard', href:'/dashboard', icon: LayoutDashboard},
    {name: 'AI Setup' , href:'/ai-setup', icon: Sparkles},
    {name: 'My Courses', href: '/courses' , icon: BookOpen},
    {name: 'Tasks / To-Do' , href:'/tasks', icon: BookOpen},
    {name: 'Study Plan' , href:'/study-plan', icon: SquareCheckBig},
    {name: 'Calendar' , href: '/calendar', icon: Calendar},
    {name: 'Analytics' , href:'/analytics', icon: ChartColumn}
];

export function Sidebar() {
    const pathname = usePathname();
  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-black">StudyFlow</h1>
            <p className="text-sm text-gray-500"> Smart Study Planner</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname ===item.href;
                return (
                    <a key={item.name} href={item.href} 
                    className={'flex items-center gap-3 px-4 py-3 rounded-lg transition-all'
                        + (isActive ? ' bg-blue-50 text-blue-600 font-medium' : ' text-gray-700 hover:bg-gray-50')
                    }
                >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                </a>
            );
            })}
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar