import { create } from 'zustand';

const useThemeStore = create((set, get) => ({
  isDark: false,
  
  // Initialize theme from current state
  initializeTheme: () => {
    const isDark = document.body.classList.contains('dark');
    set({ isDark });
  },
  
  // Toggle theme
  toggleTheme: () => {
    const { isDark } = get();
    const newIsDark = !isDark;
    
    if (newIsDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    
    set({ isDark: newIsDark });
  },
  
  // Set specific theme
  setTheme: (isDark) => {
    const currentIsDark = get().isDark;
    
    // Only update if the theme is actually changing
    if (currentIsDark !== isDark) {
      if (isDark) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
      
      set({ isDark });
    }
  },
}));

export default useThemeStore;
