import { Navigate } from "react-router-dom";
import PrivateLayout from "./PrivateLayout";

function AuthNavigator() {
  // Check if user is authenticated (example: check for token in localStorage)
  const token = localStorage.getItem("auth-token"); // Adjust based on your auth storage

  return true ? <PrivateLayout /> : <Navigate to="/" replace />;
}

export default AuthNavigator;
