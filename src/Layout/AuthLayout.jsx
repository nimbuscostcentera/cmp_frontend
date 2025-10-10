// Layout/AuthLayout.jsx
import { Outlet, Navigate } from "react-router-dom";

function AuthLayout() {
  const token = localStorage.getItem("accessToken");
  return token ? <Navigate to="/auth/home" replace /> : <Outlet />;
}

export default AuthLayout;
