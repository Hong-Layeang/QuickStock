import './App.css';
import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';

import useAuthStore from './store/useAuthStore.js';
import LoginPage from './pages/LoginPage.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import AdminDashBoardPage from './pages/AdminDashBoardPage.jsx';
import UnauthorizedPage from './pages/UnauthorizedPage.jsx';
import SessionExpiredPage from './pages/SessionExpiredPage.jsx';

const App = () => {
  const loadUserFromStorage = useAuthStore((state) => state.loadUserFromStorage);
  const sessionExpired = useAuthStore((state) => state.sessionExpired);
  const resetSessionExpired = useAuthStore((state) => state.resetSessionExpired);

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  useEffect(() => {
    if (sessionExpired) {
      window.location.href = "/session-expired";
      resetSessionExpired(); // clean up flag
    }
  }, [sessionExpired, resetSessionExpired]);

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/session-expired" element={<SessionExpiredPage />} />
      <Route path="/adminDashboard" element={
        <PrivateRoute>
          <AdminDashBoardPage />
        </PrivateRoute>
      } />
    </Routes>
  );
};

export default App;
