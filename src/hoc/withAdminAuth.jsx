import { useAuth } from "@/context/AuthContext";
import React from "react";
import { Navigate } from "react-router-dom";

export function withAdminAuth(Component) {
  function WrappedWithAdminAuth(props) {
    const { user, loading } = useAuth();

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Checking admin session...</p>
        </div>
      );
    }

    if (!user) {
      return <Navigate to="/adminlogin" replace />;
    }

    return <Component {...props} />;
  }

  WrappedWithAdminAuth.displayName = `withAdminAuth(${Component.displayName || Component.name || "Component"})`;
  return WrappedWithAdminAuth;
}
