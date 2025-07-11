import React, { useEffect } from 'react';
import useThemeStore from '../stores/useThemeStore.js';

const ThemeProvider = ({ children }) => {
  const { initializeTheme } = useThemeStore();
  
  useEffect(() => {
    // Initialize theme on mount
    initializeTheme();
  }, []);
  
  return <>{children}</>;
};

export default ThemeProvider; 