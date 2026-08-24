import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { setUnauthorizedHandler } from "../api/apiClient";
import { notify } from "../lib/toast";

const AuthContext = createContext(null);

function readStoredAuth() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");
  const fullName = localStorage.getItem("fullName");

  if (!token || !role || !userId) {
    return { token: null, user: null };
  }
  return { token, user: { userId, role, fullName } };
}

export function AuthProvider({ children }) {
  const [{ token, user }, setAuth] = useState(readStoredAuth);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("fullName");
    setAuth({ token: null, user: null });
  }, []);

  const handleSessionExpired = useCallback(() => {
    logout();
    notify.error("Session expired. Please log in again.");
  }, [logout]);

  useEffect(() => {
    setUnauthorizedHandler(handleSessionExpired);
    setIsLoading(false);
  }, [handleSessionExpired]);

  const login = useCallback((data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("userId", data.userId);
    localStorage.setItem("fullName", data.fullName);
    setAuth({
      token: data.token,
      user: { userId: data.userId, role: data.role, fullName: data.fullName },
    });
  }, []);


  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
