// frontend/src/context/AuthContext.tsx

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
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

// Automatically log out after 5 minutes without activity.
const INACTIVITY_TIMEOUT = 5 * 60 * 1000;

const AUTH_STORAGE_KEYS = [
  "token",
  "admin_token",
  "auth_token",
  "access_token",
  "user_role",
  "admin_user",
  "user",
  "token_expiry",
];

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

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const navigate = useNavigate();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Keep track of the inactivity timer.
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  // Prevent repeated timeout logouts.
  const sessionEnded = useRef(false);

  const clearInactivityTimer = useCallback(() => {
    if (inactivityTimer.current !== null) {
      clearTimeout(inactivityTimer.current);
      inactivityTimer.current = null;
    }
  }, []);

  const logout = useCallback(() => {
    clearInactivityTimer();

    AUTH_STORAGE_KEYS.forEach((key) => {
      localStorage.removeItem(key);
    });

    setToken(null);
    setUser(null);

    sessionEnded.current = true;

    // Send the administrator to the login page.
    navigate("/admin/login", { replace: true });
  }, [clearInactivityTimer, navigate]);

  useEffect(() => {
    const storedToken =
      localStorage.getItem("admin_token") ||
      localStorage.getItem("token") ||
      localStorage.getItem("auth_token");

    const storedUser = readStoredUser();
    const tokenExpiry = localStorage.getItem("token_expiry");

    // Reject an expired locally stored session.
    if (
      tokenExpiry &&
      (!Number.isFinite(Number(tokenExpiry)) ||
        Date.now() >= Number(tokenExpiry))
    ) {
      logout();
      setIsLoading(false);
      return;
    }

    if (!storedToken || !storedUser) {
      setIsLoading(false);
      return;
    }

    setToken(storedToken);
    setUser(storedUser);

    getCurrentAdmin()
      .then((data) => {
        if (!data?.user) {
          logout();
          return;
        }

        const nextUser: AuthUser = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
        };

        if (
          nextUser.role !== "ADMIN" &&
          nextUser.role !== "SUPER_ADMIN"
        ) {
          logout();
          return;
        }

        localStorage.setItem(
          "admin_user",
          JSON.stringify(nextUser)
        );
        localStorage.setItem("user_role", nextUser.role);

        setUser(nextUser);
      })
      .catch(() => {
        logout();
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      clearInactivityTimer();
    };
  }, [logout, clearInactivityTimer]);

  // Reset the inactivity timer whenever an authenticated
  // administrator interacts with the application.
  useEffect(() => {
    if (!user || !token || isLoading) {
      clearInactivityTimer();
      return;
    }

    sessionEnded.current = false;

    const resetInactivityTimer = () => {
      if (sessionEnded.current) return;

      clearInactivityTimer();

      inactivityTimer.current = setTimeout(() => {
        logout();
      }, INACTIVITY_TIMEOUT);
    };

    const activityEvents: (keyof WindowEventMap)[] = [
      "pointerdown",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];

    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, resetInactivityTimer, {
        passive: true,
      });
    });

    // Start the timer when the authenticated session becomes active.
    resetInactivityTimer();

    return () => {
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, resetInactivityTimer);
      });

      clearInactivityTimer();
    };
  }, [
    user,
    token,
    isLoading,
    logout,
    clearInactivityTimer,
  ]);

  const login = (newToken: string, nextUser: AuthUser) => {
    clearInactivityTimer();
    sessionEnded.current = false;

    localStorage.setItem("token", newToken);
    localStorage.setItem("admin_token", newToken);
    localStorage.setItem("auth_token", newToken);
    localStorage.setItem("user_role", nextUser.role);
    localStorage.setItem("admin_user", JSON.stringify(nextUser));

    // Keep the existing 8-hour maximum session expiry.
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
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
};