import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import type { AdminRole } from "@/services/adminAuth";
import { getCurrentAdmin } from "@/services/adminAuth";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
};

interface AuthContextType {
  isAdmin: boolean;
  isSuperAdmin: boolean;
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem("admin_user");
    if (!raw) return null;

    const parsed = JSON.parse(raw) as AuthUser;

    if (
      parsed?.id &&
      (parsed.role === "ADMIN" || parsed.role === "SUPER_ADMIN")
    ) {
      return parsed;
    }
  } catch {
    return null;
  }

  return null;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin_token");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("admin_user");
    localStorage.removeItem("user");
    localStorage.removeItem("token_expiry");

    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const storedToken =
      localStorage.getItem("token") ||
      localStorage.getItem("admin_token");
    const storedUser = readStoredUser();

    if (!storedToken || !storedUser) {
      setIsLoading(false);
      return;
    }

    setToken(storedToken);
    setUser(storedUser);

    getCurrentAdmin()
      .then((data) => {
        const nextUser = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
        };

        localStorage.setItem("admin_user", JSON.stringify(nextUser));
        localStorage.setItem("user_role", nextUser.role);
        setUser(nextUser);
      })
      .catch(() => {
        logout();
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = (newToken: string, nextUser: AuthUser) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("admin_token", newToken);
    localStorage.setItem("auth_token", newToken);
    localStorage.setItem("user_role", nextUser.role);
    localStorage.setItem("admin_user", JSON.stringify(nextUser));
    localStorage.setItem(
      "token_expiry",
      String(Date.now() + 8 * 60 * 60 * 1000)
    );

    setToken(newToken);
    setUser(nextUser);
  };

  const isAdmin =
    user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        isSuperAdmin: user?.role === "SUPER_ADMIN",
        user,
        token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
