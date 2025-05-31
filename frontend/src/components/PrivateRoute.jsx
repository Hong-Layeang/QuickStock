import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore.js';

const PrivateRoute = () => {
  const token = useAuthStore((state) => state.token);
  return token ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;