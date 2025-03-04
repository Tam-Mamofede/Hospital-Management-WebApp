/* eslint-disable react/prop-types */

import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const navigate = useNavigate();
  const { isAuthenticated, userRole } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !userRole) {
      navigate("/login");
    } else if (!allowedRoles.includes(userRole)) {
      navigate("/");
    }
  }, [isAuthenticated, userRole, allowedRoles, navigate]);

  if (!isAuthenticated || !userRole || !allowedRoles.includes(userRole)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
