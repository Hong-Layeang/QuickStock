import { useState } from 'react'
import { Sun, Moon, Monitor, Check } from 'lucide-react'
import useThemeStore from '../store/useThemeStore'

const ThemeSettings = () => {
  const { theme, setTheme } = useThemeStore()
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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Theme Settings
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Choose your preferred theme for the application
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {themes.map((themeOption) => {
          const Icon = themeOption.icon
          const isActive = theme === themeOption.value
          
          return (
            <button
              key={themeOption.value}
              onClick={() => setTheme(themeOption.value)}
              className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left group ${
                isActive 
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600'
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
                <Icon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </div>

              {/* Content */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-gray-500" />
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {themeOption.label}
                  </h4>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {themeOption.description}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Additional settings */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              Auto-save theme preference
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
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