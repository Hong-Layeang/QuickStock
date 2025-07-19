import React, { useEffect } from 'react';
import useThemeStore from '../stores/useThemeStore.js';

const ThemeProvider = ({ children }) => {
  const { initializeTheme } = useThemeStore();
  
  useEffect(() => {
    // Initialize theme store state (DOM is already set in main.jsx)
    initializeTheme();
  }, []);
  
  return <>{children}</>;
};

export default ThemeProvider; 