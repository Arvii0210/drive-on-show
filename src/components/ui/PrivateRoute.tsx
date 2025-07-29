// src/components/ui/PrivateRoute.tsx
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
