import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../Auth";

export default function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/" state={{ path: location.pathname }} />;
  }

  return children;
}
