'use client';

import { Bell, Search, Menu } from 'lucide-react';

export function Header({
  setIsOpen,
}: {
  setIsOpen: (v: boolean) => void;
}) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 px-4 sm:px-6 lg:px-8 py-4">

      <div className="flex items-center justify-between">

        {/* Left Section */}
        <div className="flex items-center gap-3">

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-6 h-6" />
          </button>

          <h2 className="hidden md:block text-lg md:text-xl font-bold text-gray-800">
            Dashboard
          </h2>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">

          {/* Search */}
          <div className="relative w-32 sm:w-48 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full text-sm pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Bell */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-semibold text-sm">
            NR
          </div>
        </div>
      </div>
    </header>
  );
}
