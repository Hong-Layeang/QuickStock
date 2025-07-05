import React, { useEffect } from 'react';
import useThemeStore from '../store/useThemeStore';

const ThemeProvider = ({ children }) => {
  const { initializeTheme } = useThemeStore();
  
  useEffect(() => {
    // Initialize theme on mount
    initializeTheme();
  }, []);
  
  return <>{children}</>;
};

export default ThemeProvider; 