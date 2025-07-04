"use client"

import { Bell, User, Search, Settings } from "lucide-react"
import { useEffect, useState } from "react"
import useAuthStore from "../../store/useAuthStore"
import ThemeToggle from "../ThemeToggle"

const Header = () => {
  const [notifications, setNotifications] = useState(3)
  const user = useAuthStore((state) => state.user)

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Left Section - Title and Search */}
          <div className="flex items-center space-x-4 flex-1">
            <div className="hidden sm:block">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
                Inventory Admin
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hidden lg:block">
                Manage your inventory efficiently
              </p>
            </div>
            
            {/* Mobile Title */}
            <div className="sm:hidden">
              <h1 className="text-lg font-bold text-orange-600">
                QuickStock
              </h1>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex items-center flex-1 max-w-md ml-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products, orders..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search Button (Mobile) */}
            <button className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
              <Search className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>

            {/* Theme Toggle */}
            <ThemeToggle variant="dropdown" />

            {/* Notifications */}
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors relative group">
              <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:scale-110 transition-transform" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {notifications > 9 ? '9+' : notifications}
                </span>
              )}
            </button>

            {/* Settings */}
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors group">
              <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:scale-110 transition-transform" />
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-3 pl-2 border-l border-gray-200 dark:border-gray-700">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.name || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.email || 'admin@quickstock.com'}
                </p>
              </div>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors group">
                <div className="h-8 w-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-medium text-sm group-hover:scale-110 transition-transform">
                  {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
