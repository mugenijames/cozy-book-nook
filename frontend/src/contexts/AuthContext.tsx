import { createContext, useContext, useState, ReactNode } from "react";

type UserRole = "ADMIN" | null;

interface AuthContextType {
  isAdmin: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Initialize from localStorage to persist login state
  const [role, setRole] = useState<UserRole>(() => 
    localStorage.getItem("user_role") as UserRole
  );

  const login = (token: string) => {
    // In a real app, save the actual JWT token here too
    localStorage.setItem("admin_token", token);
    localStorage.setItem("user_role", "ADMIN");
    setRole("ADMIN");
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("user_role");
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ isAdmin: role === "ADMIN", login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};