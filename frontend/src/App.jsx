import './App.css';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from './stores/useAuthStore.js';
import useThemeStore from './stores/useThemeStore.js';
import { Toaster } from 'react-hot-toast';

import LoginPage from './pages/shared/LoginPage.jsx';
import UnauthorizedPage from './pages/shared/UnauthorizedPage.jsx';
import SessionExpiredPage from './pages/shared/SessionExpiredPage.jsx';
import RegisterPage from './pages/shared/RegisterPage.jsx';

import AdminDashBoardPage from './pages/admin/DashBoard.jsx';
import AdminProductsPage from './pages/admin/Products.jsx';
import AdminReportsPage from './pages/admin/Reports.jsx';
import AdminSuppliersPage from './pages/admin/Suppliers.jsx';
import AdminUsersPage from './pages/admin/Users.jsx';
import AdminSettingsPage from './pages/admin/Settings.jsx';

import SupplierDashBoardPage from './pages/supplier/Dashboard.jsx';
import SupplierProductsPage from './pages/supplier/MyProducts.jsx';
import SupplierActivityLogPage from './pages/supplier/ActivityLog.jsx';
import SupplierSettingsPage from './pages/supplier/Settings.jsx';

// Private route wrapper
const PrivateRoute = ({ children, role }) => {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const sessionExpired = useAuthStore((state) => state.sessionExpired);
  const loading = useAuthStore((state) => state.loading);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-orange-700 dark:text-orange-300 font-medium">Loading...</p>
        </div>
      </div>
    );
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
  const isDark = useThemeStore((state) => state.isDark);

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
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-orange-700 dark:text-orange-300 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: isDark ? '#23272e' : '#fff',
            color: isDark ? '#fff' : '#23272e',
            boxShadow: isDark ? '0 2px 16px 0 #0004' : '0 2px 16px 0 #0002',
            border: isDark ? '1px solid #333' : '1px solid #eee',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: isDark ? '#23272e' : '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: isDark ? '#23272e' : '#fff',
            },
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/session-expired" element={<SessionExpiredPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashBoardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
          <Route path="suppliers" element={<AdminSuppliersPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        {/* Supplier Routes */}
        <Route path="/supplier" element={<SupplierLayout />}>
          <Route path="dashboard" element={<SupplierDashBoardPage />} />
          <Route path="my-products" element={<SupplierProductsPage />} />
          <Route path="activity-log" element={<SupplierActivityLogPage />} />
          <Route path="settings" element={<SupplierSettingsPage />} />
        </Route>

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;
