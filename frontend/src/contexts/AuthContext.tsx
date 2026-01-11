import { createContext, useContext, useState, ReactNode } from "react";

type UserRole = "ADMIN" | "USER" | null;

interface AuthContextType {
  role: UserRole;
  isAdmin: boolean;
  signInAsAdmin: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<UserRole>(null);

  const signInAsAdmin = () => setRole("ADMIN");
  const signOut = () => setRole(null);

  return (
    <AuthContext.Provider
      value={{
        role,
        isAdmin: role === "ADMIN",
        signInAsAdmin,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* ✅ THIS IS WHAT YOU ARE MISSING */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
