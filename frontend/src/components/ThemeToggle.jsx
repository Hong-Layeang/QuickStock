import { useState, useEffect } from 'react'
import { Sun, Moon, Monitor, ChevronDown } from 'lucide-react'
import useThemeStore from '../store/useThemeStore'

const ThemeToggle = ({ variant = 'button' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme, toggleTheme } = useThemeStore()

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor }
  ]

  const currentTheme = themes.find(t => t.value === theme) || themes[0]
  const CurrentIcon = currentTheme.icon

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.theme-dropdown')) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  if (variant === 'button') {
    return (
      <button
        onClick={toggleTheme}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors relative group"
        title={`Current theme: ${currentTheme.label}`}
      >
        {theme === 'dark' ? (
          <Sun className="h-5 w-5 text-yellow-500 group-hover:scale-110 transition-transform" />
        ) : (
          <Moon className="h-5 w-5 text-gray-600 group-hover:scale-110 transition-transform" />
        )}
      </button>
    )
  }

  if (variant === 'dropdown') {
    return (
      <div className="relative theme-dropdown">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors group"
          title="Theme settings"
        >
          <CurrentIcon className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:scale-110 transition-transform" />
          <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 animate-fade-in">
            {themes.map((themeOption) => {
              const Icon = themeOption.icon
              const isActive = theme === themeOption.value
              
              return (
                <button
                  key={themeOption.value}
                  onClick={() => {
                    setTheme(themeOption.value)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    isActive 
                      ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{themeOption.label}</span>
                  {isActive && (
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return null
}

export default ThemeToggle 