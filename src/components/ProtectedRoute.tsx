import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { ReactElement } from "react";

export default function ProtectedRoute({ children }: { children: ReactElement }) {
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

  return children;
}
