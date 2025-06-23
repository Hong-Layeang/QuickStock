"use client"

import { BarChart3, Package, ClipboardList, Users, Menu, X } from "lucide-react"
import { useState } from "react"
import Logo from "../components/Logo"

const AdminSideBar = () => {
  const [active, setActive] = useState("dashboard")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: <BarChart3 className="w-5 h-5" /> },
    { key: "products", label: "Products", icon: <Package className="w-5 h-5" /> },
    { key: "orders", label: "Orders", icon: <ClipboardList className="w-5 h-5" /> },
    { key: "suppliers", label: "Suppliers", icon: <Users className="w-5 h-5" /> },
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo Section */}
      <div className="p-10 border-b border-orange-400">
        <Logo />
      </div>

      {/* Menu Items Section */}
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
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
      >
        <Menu className="h-4 w-4" />
      </button>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative flex flex-col w-64">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 border-r border-orange-400">
        <SidebarContent />
      </div>
    </>
  )
}

export default AdminSideBar
