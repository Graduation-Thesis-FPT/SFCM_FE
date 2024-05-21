import { getRefreshToken } from "@/lib/auth";
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export function PrivateRoute() {
  const location = useLocation();
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
