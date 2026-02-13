'use client';

import { Bell, Search } from "lucide-react";

export function Header() {
    return(
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10 px-9 py-4">
            <div className="flex items-center justify-between">
                {/* First section for text - Dashboard*/}
                <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
                {/* Second Section for search bar and user profile */}
                <div className="flex items-center gap-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input type="text" placeholder="Search courses, topics..." className="w-full text-sm pl-11 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        
                    </div>
                    {/* Notification Bell */}
                    <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Bell className="w-5 h-5 text-gray-600" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                    {/* Separetor */}
                    <div className="w-px h-6 bg-gray-200"></div>
                    {/* User Profile */}
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-semibold">
                            NR
                        </div>
                        <div className="flex flex-col text-left">
                            <p className="text-sm font-semibold text-gray-900">Nour Rifaieh</p>
                            <p className="text-xs text-gray-500">Free Plan</p>
                        </div>
                        {/* Dropdown Icon */}
                        <div className="w-4 h-4 text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>

                    </div>
                </div>
            </div>
        </header>
    );
}
