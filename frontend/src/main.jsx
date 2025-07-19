import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import ThemeProvider from './components/ThemeProvider.jsx';

// Initialize theme immediately to prevent flash
(function() {
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
  
  // Apply theme to DOM immediately
  if (isDark) {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
  
  // Re-enable transitions after theme is set
  requestAnimationFrame(() => {
    document.body.classList.add('theme-ready');
  });
})();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
