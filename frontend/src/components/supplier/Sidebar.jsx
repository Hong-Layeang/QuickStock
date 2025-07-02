"use client"

import { ChartNoAxesCombined, Package, ClipboardList, Users, X } from "lucide-react"
import { useEffect, useState } from "react"
import Logo from "../Logo"
import MobileMenuToggle from "../MobileMenuToggle"

const SideBar = () => {
  const [active, setActive] = useState("dashboard")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isDarkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDarkMode(document.body.classList.contains("dark"))
    })

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [])

  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: <ChartNoAxesCombined className="w-5 h-5" /> },
    { key: "products", label: "Products", icon: <Package className="w-5 h-5" /> },
    { key: "orders", label: "Orders", icon: <ClipboardList className="w-5 h-5" /> },
    { key: "suppliers", label: "Suppliers", icon: <Users className="w-5 h-5" /> },
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-10 border-b border-orange-500">
        <Logo />
      </div>
      <div className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setActive(item.key)
                setMobileMenuOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors
                ${
                  active === item.key
                    ? "bg-orange-500 text-white hover:cursor-pointer"
                    : "text-gray-600 hover:bg-orange-100 cursor-pointer hover:text-orange-700"
                }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Menu Toggle Button (externalized) */}
      <MobileMenuToggle onClick={() => setMobileMenuOpen(true)} />

      {/* Mobile Sidebar Overlay */}
      <div className={`lg:hidden fixed inset-0 z-50 flex transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
        <div
          className={`relative flex flex-col w-64 ${isDarkMode ? "bg-gray-900" : "bg-white"} shadow-xl transform transition-transform duration-300 ease-in-out
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-4 right-4 p-1 hover:bg-gray-100 cursor-pointer rounded"
          >
            <X className="h-4 w-4" />
          </button>
          <SidebarContent />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 border-r border-orange-500">
        <SidebarContent />
      </div>
    </>
  )
}

export default SideBar
