import { Navigate } from "react-router-dom";
import PrivateLayout from "./PrivateLayout";

function AuthNavigator() {
  const token = localStorage.getItem("accessToken");
  return token ? <PrivateLayout /> : <Navigate to="/login" replace />;
}

export default AuthNavigator;
