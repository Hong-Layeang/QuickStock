import './App.css';
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import useAuthStore from './store/useAuthStore.js';
import LoginPage from './pages/LoginPage.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import AdminDashBoardPage from './pages/adminDashBoardPage.jsx';
import UnauthorizedPage from './pages/UnauthorizedPage.jsx';

const App = () => {
  const loadUserFromStorage = useAuthStore((state) => state.loadUserFromStorage);

  useEffect(() => {
    loadUserFromStorage(); // load token + user from localStorage
  }, [loadUserFromStorage]);

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path='/unauthorized' element={<UnauthorizedPage />} />
      <Route path="/adminDashboard" element={
        <PrivateRoute>
          <AdminDashBoardPage />
        </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default App
