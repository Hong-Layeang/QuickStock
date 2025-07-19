import { create } from 'zustand';

const useThemeStore = create((set, get) => ({
  isDark: false,
  
  // Initialize theme from localStorage or system preference
  initializeTheme: () => {
    // Check if theme is already initialized by checking the DOM
    const isDarkInDOM = document.body.classList.contains('dark');
    
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    let isDark = false;
    
    if (savedTheme) {
      if (savedTheme === 'system') {
        // Use system preference
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      } else {
        // Use saved preference
        isDark = savedTheme === 'dark';
      }
    } else {
      // Fall back to system preference
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    // Only apply theme to DOM if it's not already set correctly
    if (isDark !== isDarkInDOM) {
      if (isDark) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    }
    
    set({ isDark });
    
    // Listen for system theme changes if theme is set to 'system'
    if (savedTheme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        const newIsDark = e.matches;
        if (newIsDark) {
          document.body.classList.add('dark');
        } else {
          document.body.classList.remove('dark');
        }
        set({ isDark: newIsDark });
      };
      
      mediaQuery.addEventListener('change', handleChange);
      
      // Return cleanup function
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  },
  
  // Toggle theme
  toggleTheme: () => {
    const { isDark } = get();
    const newIsDark = !isDark;
    
    // Update DOM
    if (newIsDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    
    // Save to localStorage
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
    
    set({ isDark: newIsDark });
  },
  
  // Set specific theme
  setTheme: (isDark) => {
    const currentIsDark = get().isDark;
    
    // Only update if the theme is actually changing
    if (currentIsDark !== isDark) {
      // Update DOM
      if (isDark) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
      
      // Save to localStorage
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      
      set({ isDark });
    }
  },
}));

export default useThemeStore;
