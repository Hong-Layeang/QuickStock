"use client"

import { ChartNoAxesCombined, Package, ClipboardList, Users, X, Menu, Settings } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import Logo from "../Logo"
import useAuthStore from "../../stores/useAuthStore"
import useThemeStore from "../../stores/useThemeStore"
import { Link, useLocation } from "react-router-dom"

const SideBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showMenuButton, setShowMenuButton] = useState(true)
  const lastScrollY = useRef(0)
  const ticking = useRef(false)
  const logout = useAuthStore((state) => state.logout)
  const location = useLocation()
  const { isDark } = useThemeStore()

  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: <ChartNoAxesCombined className="w-5 h-5" />, path: "/admin/dashboard" },
    { key: "products", label: "Products", icon: <Package className="w-5 h-5" />, path: "/admin/products" },
    { key: "reports", label: "Reports", icon: <ClipboardList className="w-5 h-5" />, path: "/admin/reports" },
    { key: "suppliers", label: "Suppliers", icon: <Users className="w-5 h-5" />, path: "/admin/suppliers" },
    { key: "users", label: "Users", icon: <Users className="w-5 h-5" />, path: "/admin/users" },
    { key: "settings", label: "Settings", icon: <Settings className="w-5 h-5" />, path: "/admin/settings" },
  ]

  // Scroll logic for menu button
  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY
          if (currentScrollY < 10) {
            setShowMenuButton(true)
          } else if (currentScrollY > lastScrollY.current) {
            // Scrolling down
            setShowMenuButton(false)
          } else {
            // Scrolling up
            setShowMenuButton(true)
          }
          lastScrollY.current = currentScrollY
          ticking.current = false
        })
        ticking.current = true
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo Section */}
      <div className={`p-6 border-b ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center justify-center">
          <Logo />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6">
        <nav className="space-y-2 px-4">
          {menuItems.map((item) => (
            <Link
              key={item.key}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
                              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
                ${location.pathname.startsWith(item.path)
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25"
                  : isDark
                    ? "text-gray-300 hover:bg-gray-800 hover:text-orange-400"
                    : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                }`}
            >
              <div className={`transition-transform duration-200 group-hover:scale-110 ${
                location.pathname.startsWith(item.path) ? 'text-white' : 'text-gray-500 group-hover:text-orange-600'
              }`}>
                {item.icon}
              </div>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Logout Section */}
      <div className={`p-4 border-t ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 hover:cursor-pointer ${
            isDark
              ? 'text-gray-300 hover:bg-red-900/20 hover:text-red-400'
              : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className={`lg:hidden fixed top-4 left-4 z-40 p-2 rounded-xl shadow-lg border transition-all duration-500 hover:cursor-pointer
          ${showMenuButton ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
          ${isDark 
            ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' 
            : 'bg-white border-gray-200 hover:bg-gray-50'
          }
        `}
        style={{transition: 'opacity 0.3s, transform 0.3s'}}
        aria-label="Open sidebar menu"
      >
        <Menu className={`h-6 w-6 ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`} />
      </button>

      {/* Mobile Sidebar Overlay */}
      <div className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
        mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
        <div
          className={`absolute left-0 top-0 h-full w-80 max-w-[85vw] shadow-2xl transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } ${isDark ? 'bg-gray-900' : 'bg-white'}`}
        >
          <div className="relative h-full">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className={`absolute top-4 right-4 p-2 rounded-lg transition-colors hover:cursor-pointer ${
                isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              <X className={`h-5 w-5 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`} />
            </button>
            <SidebarContent />
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-30 border-r shadow-lg ${
        isDark 
          ? 'bg-gray-900 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <SidebarContent />
      </div>
    </>
  )
}

export default SideBar
