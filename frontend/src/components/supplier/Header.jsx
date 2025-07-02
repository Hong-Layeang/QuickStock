"use client"

import { Sun, Moon, Bell, User } from "lucide-react"
import { useEffect, useState } from "react"

const Header = () => {
  const [darkMode, setDarkMode] = useState(false)

  const handleDarkmode = () => {
    setDarkMode((prev) => !prev)
  }

  useEffect(() => {
    const body = document.body
    if (darkMode) {
      body.classList.add("dark")
    } else {
      body.classList.remove("dark")
    }
  }, [darkMode])

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-4 lg:pl-0">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-orange-900">Inventory Supplier</h1>
      <div className="flex items-center gap-2 sm:gap-3">
        <button onClick={handleDarkmode} className="p-2 hover:bg-gray-400 cursor-pointer rounded-xl transition-colors">
          {darkMode ? (
            <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
          ) : (
            <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
          )}
        </button>
        <button className="p-2 hover:bg-gray-400 cursor-pointer rounded-xl transition-colors">
          <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
        </button>
        <button className="p-2 hover:bg-gray-400 cursor-pointer rounded-xl transition-colors">
          <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
        </button>
      </div>
    </div>
  )
}

export default Header