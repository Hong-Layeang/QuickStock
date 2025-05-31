import './App.css';
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import useAuthStore from './store/useAuthStore.js';
import LoginPage from './pages/LoginPage.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import DashBoardPage from './pages/DashBoardPage.jsx';

const App = () => {
  const loadUserFromStorage = useAuthStore((state) => state.loadUserFromStorage);

  useEffect(() => {
    loadUserFromStorage(); // load token + user from localStorage
  }, [loadUserFromStorage]);

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={
        <PrivateRoute>
          <DashBoardPage />
        </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default App
