import './App.css';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from './store/useAuthStore';
import useThemeStore from './store/useThemeStore';
import { Toaster } from 'react-hot-toast';

import LoginPage from './pages/LoginPage.jsx';
import UnauthorizedPage from './pages/UnauthorizedPage.jsx';
import SessionExpiredPage from './pages/SessionExpiredPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';

import AdminDashBoardPage from './pages/admin/DashBoard.jsx';
import AdminProductsPage from './pages/admin/Products.jsx';
import AdminOrdersPage from './pages/admin/Orders.jsx';
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
  const initializeTheme = useThemeStore((state) => state.initializeTheme);
  const theme = useThemeStore((state) => state.theme);

  // Initialize theme system
  useEffect(() => {
    const cleanup = initializeTheme();
    return cleanup;
  }, [initializeTheme]);

  // Ensure body class matches theme
  useEffect(() => {
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);

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
            background: 'var(--toast-bg, #363636)',
            color: 'var(--toast-color, #fff)',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
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
          <Route path="orders" element={<AdminOrdersPage />} />
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
