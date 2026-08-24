import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children, allowedRoles }) {

    const { isAuthenticated, isLoading, user } = useAuth();

    if (isLoading) {
        return null;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />
    }

    return children;
}