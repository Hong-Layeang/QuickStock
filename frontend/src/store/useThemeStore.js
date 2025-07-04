import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useThemeStore = create(
  persist(
    (set, get) => ({
      // Theme state
      theme: 'light', // 'light' | 'dark' | 'system'
      
      // Theme actions
      setTheme: (theme) => {
        set({ theme })
        // Only toggle 'dark' class on <html>
        const root = document.documentElement;
        root.classList.remove('dark');
        if (theme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : '';
          if (systemTheme === 'dark') root.classList.add('dark');
        } else if (theme === 'dark') {
          root.classList.add('dark');
        }
      },
      
      toggleTheme: () => {
        const currentTheme = get().theme
        const newTheme = currentTheme === 'light' ? 'dark' : 'light'
        get().setTheme(newTheme)
      },
      
      // Initialize theme on app load
      initializeTheme: () => {
        const { theme } = get()
        get().setTheme(theme)
        
        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handleSystemThemeChange = (e) => {
          if (get().theme === 'system') {
            const root = document.documentElement;
            root.classList.remove('dark');
            if (e.matches) root.classList.add('dark');
          }
        }
        
        mediaQuery.addEventListener('change', handleSystemThemeChange)
        
        // Return cleanup function
        return () => mediaQuery.removeEventListener('change', handleSystemThemeChange)
      }
    }),
    {
      name: 'quickstock-theme', // localStorage key
      partialize: (state) => ({ theme: state.theme }), // Only persist theme
    }
  )
)

export default useThemeStore 