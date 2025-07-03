import './App.css';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from './store/useAuthStore';

import LoginPage from './pages/LoginPage.jsx';
import UnauthorizedPage from './pages/UnauthorizedPage.jsx';
import SessionExpiredPage from './pages/SessionExpiredPage.jsx';

import AdminDashBoardPage from './pages/admin/DashBoard.jsx';

import SupplierDashBoardPage from './pages/supplier/Dashboard.jsx';

// Private route wrapper
const PrivateRoute = ({ children, role }) => {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const sessionExpired = useAuthStore((state) => state.sessionExpired);
  const loading = useAuthStore((state) => state.loading);

  if (loading) {
    // You can customize this loading UI however you want
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (sessionExpired) return <Navigate to="/session-expired" />;
  if (!token) return <Navigate to="/" />;
  if (role && user?.role !== role) return <Navigate to="/unauthorized" />;

  return children;
};


// Public route (only for unauthenticated users)
const PublicRoute = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  if (token && user?.role === "admin") return <Navigate to="/admin/dashboard" />;
  if (token && user?.role === "supplier") return <Navigate to="/supplier/dashboard" />;

  return children;
};

// Layouts for cleaner structure
const AdminLayout = () => (
  <PrivateRoute role="admin">
    <Outlet />
  </PrivateRoute>
);

const SupplierLayout = () => (
  <PrivateRoute role="supplier">
    <Outlet />
  </PrivateRoute>
);

const App = () => {
  const location = useLocation();
  const loadUserFromStorage = useAuthStore((state) => state.loadUserFromStorage);
  const resetSessionExpired = useAuthStore((state) => state.resetSessionExpired);
  const loading = useAuthStore((state) => state.loading);

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  // Reset sessionExpired after navigating to expired page
  useEffect(() => {
    if (location.pathname === '/session-expired') {
      resetSessionExpired();
    }
  }, [location.pathname, resetSessionExpired]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <div className="flex flex-col justify-center min-h-screen">
              <LoginPage />
            </div>
          </PublicRoute>
        }
      />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/session-expired" element={<SessionExpiredPage />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashBoardPage />} />
        {/* Add more admin pages here */}
      </Route>

      {/* Supplier Routes */}
      <Route path="/supplier" element={<SupplierLayout />}>
        <Route path="dashboard" element={<SupplierDashBoardPage />} />
        {/* Add more supplier pages here */}
      </Route>

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
