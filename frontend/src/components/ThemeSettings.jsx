import { useState } from 'react'
import { Sun, Moon, Monitor, Check } from 'lucide-react'
import useThemeStore from '../store/useThemeStore'

const ThemeSettings = () => {
  const { isDark, setTheme } = useThemeStore()
  const [isOpen, setIsOpen] = useState(false)

  const themes = [
    { 
      value: 'light', 
      label: 'Light', 
      description: 'Clean and bright interface',
      icon: Sun,
      preview: 'bg-white border-gray-200'
    },
    { 
      value: 'dark', 
      label: 'Dark', 
      description: 'Easy on the eyes in low light',
      icon: Moon,
      preview: 'bg-gray-900 border-gray-700'
    },
    { 
      value: 'system', 
      label: 'System', 
      description: 'Follows your device settings',
      icon: Monitor,
      preview: 'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-semibold mb-2 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          Theme Settings
        </h3>
        <p className={`text-sm ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Choose your preferred theme for the application
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {themes.map((themeOption) => {
          const Icon = themeOption.icon
          const isActive = (isDark && themeOption.value === 'dark') || (!isDark && themeOption.value === 'light')
          
          return (
            <button
              key={themeOption.value}
              onClick={() => {
                if (themeOption.value === 'system') {
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
                  setTheme(prefersDark)
                } else {
                  setTheme(themeOption.value === 'dark')
                }
              }}
              className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left group ${
                isActive 
                  ? isDark
                    ? 'border-orange-500 bg-orange-900/20'
                    : 'border-orange-500 bg-orange-50'
                  : isDark
                    ? 'border-gray-700 hover:border-orange-600'
                    : 'border-gray-200 hover:border-orange-300'
              }`}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute top-3 right-3">
                  <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}

              {/* Preview */}
              <div className={`w-full h-16 rounded-lg border ${themeOption.preview} mb-3 flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`} />
              </div>

              {/* Content */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-gray-500" />
                  <h4 className={`font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {themeOption.label}
                  </h4>
                </div>
                <p className={`text-xs ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {themeOption.description}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Additional settings */}
      <div className={`pt-4 border-t ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h4 className={`text-sm font-medium ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Auto-save theme preference
            </h4>
            <p className={`text-xs ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Your theme choice will be remembered across sessions
            </p>
          </div>
          <div className="w-10 h-6 bg-orange-500 rounded-full flex items-center justify-start px-1">
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThemeSettings 