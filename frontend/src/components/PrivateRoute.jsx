import { Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore.js";

const PrivateRoute = ({ children }) => {
  const { token, loading } = useAuthStore();

  if (loading) return null; // or a spinner

  return token ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
