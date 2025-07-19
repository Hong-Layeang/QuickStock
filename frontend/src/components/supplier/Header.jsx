"use client"

import { User, Search, Settings } from "lucide-react"
import useAuthStore from "../../stores/useAuthStore"
import useThemeStore from "../../stores/useThemeStore"
import ThemeToggle from "../ThemeToggle"
import NotificationDropdown from "../NotificationDropdown"

const Header = () => {
  const user = useAuthStore((state) => state.user)
  const { isDark } = useThemeStore()

  return (
    <header className={`border-b shadow-sm ${
      isDark 
        ? 'bg-gray-900 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Left Section - Title and Search */}
          <div className="flex items-center space-x-4 flex-1">
            <div className="hidden sm:block">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
                Inventory Supplier
              </h1>
              <p className={`text-xs sm:text-sm hidden lg:block ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Manage your supplier operations
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
                  className={`w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                    isDark 
                      ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400' 
                      : 'border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search Button (Mobile) */}
            <button className={`md:hidden p-2 rounded-xl transition-colors ${
              isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}>
              <Search className={`h-5 w-5 ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`} />
            </button>

            {/* Theme Toggle */}
            <ThemeToggle variant="dropdown" />

            {/* Notifications */}
            <NotificationDropdown userType="supplier" />

            {/* Settings */}
            <button className={`p-2 rounded-xl transition-colors group ${
              isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}>
              <Settings className={`h-5 w-5 group-hover:scale-110 transition-transform ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`} />
            </button>

            {/* User Profile */}
            <div className={`flex items-center space-x-3 pl-2 border-l ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="hidden sm:block text-right">
                <p className={`text-sm font-medium ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {user?.name || 'Supplier User'}
                </p>
                <p className={`text-xs ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {user?.email || 'supplier@quickstock.com'}
                </p>
              </div>
              <button className={`p-2 rounded-xl transition-colors group ${
                isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}>
                <div className="h-8 w-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-medium text-sm group-hover:scale-110 transition-transform">
                  {user?.name?.charAt(0)?.toUpperCase() || 'S'}
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