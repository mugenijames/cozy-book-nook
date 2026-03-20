// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type UserRole = "ADMIN" | null;

interface AuthContextType {
  isAdmin: boolean;
  token: string | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<UserRole>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token") || localStorage.getItem("admin_token");
    const storedRole = localStorage.getItem("user_role") as UserRole;
    
    console.log("🔐 Auth Init - Token exists:", !!storedToken);
    console.log("🔐 Auth Init - Role:", storedRole);
    
    if (storedToken && storedRole === "ADMIN") {
      setToken(storedToken);
      setRole("ADMIN");
      console.log("✅ Auth Init - User authenticated");
    } else {
      console.log("❌ Auth Init - No valid session found");
    }
    
    setIsLoading(false);
  }, []);

  const login = (newToken: string) => {
    console.log("🔐 Login - Storing token");
    
    // Store in multiple locations for compatibility
    localStorage.setItem("token", newToken);
    localStorage.setItem("admin_token", newToken);
    localStorage.setItem("auth_token", newToken);
    localStorage.setItem("user_role", "ADMIN");
    
    setToken(newToken);
    setRole("ADMIN");
  };

  const logout = () => {
    console.log("🔐 Logout - Clearing all auth data");
    
    // Clear all token locations
    localStorage.removeItem("token");
    localStorage.removeItem("admin_token");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user");
    
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ 
      isAdmin: role === "ADMIN", 
      token, 
      isLoading,
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};