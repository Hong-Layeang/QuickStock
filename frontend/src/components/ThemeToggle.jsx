import { useState, useEffect } from 'react'
import { Sun, Moon, Monitor, ChevronDown } from 'lucide-react'
import useThemeStore from '../stores/useThemeStore'

const ThemeToggle = ({ variant = 'button' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { isDark, toggleTheme, setTheme } = useThemeStore()

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor }
  ]

  const currentTheme = themes.find(t => t.value === (isDark ? 'dark' : 'light')) || themes[0]
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
        className={`p-2 rounded-lg transition-colors ${
          isDark 
            ? 'bg-gray-700 hover:bg-gray-600' 
            : 'bg-gray-200 hover:bg-gray-300'
        }`}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </button>
    )
  }

  if (variant === 'dropdown') {
    return (
      <div className="relative theme-dropdown">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 p-2 rounded-xl transition-colors group hover:cursor-pointer ${
            isDark 
              ? 'hover:bg-gray-800' 
              : 'hover:bg-gray-100'
          }`}
          title="Theme settings"
        >
          <CurrentIcon className={`h-5 w-5 group-hover:scale-110 transition-transform ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`} />
          <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className={`absolute right-0 top-full mt-2 w-48 rounded-xl shadow-lg border py-2 z-50 animate-fade-in ${
            isDark 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            {themes.map((themeOption) => {
              const Icon = themeOption.icon
              const isActive = (isDark && themeOption.value === 'dark') || (!isDark && themeOption.value === 'light')
              
              return (
                <button
                  key={themeOption.value}
                  onClick={() => {
                    if (themeOption.value === 'system') {
                      // For system theme, we'll use the system preference
                      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
                      setTheme(prefersDark)
                    } else {
                      setTheme(themeOption.value === 'dark')
                    }
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:cursor-pointer ${
                    isActive 
                      ? isDark
                        ? 'text-orange-400 bg-orange-900/20'
                        : 'text-orange-600 bg-orange-50'
                      : isDark
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-50'
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