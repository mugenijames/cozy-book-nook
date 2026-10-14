// frontend/src/context/AuthContext.tsx

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import {
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Loader2 } from "lucide-react";
import type { AdminRole } from "@/services/adminAuth";
import { getCurrentAdmin } from "@/services/adminAuth";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
};

// ============================================================
// STUDENT TYPES (match what GET /students/me returns)
// ============================================================

export interface StudentProfile {
  id: string;
  studentNumber: string;
  fullName: string;
  email: string;
  phone: string | null;
  createdAt: string;
  courseEnrollments: {
    id: string;
    paymentStatus: string;
    enrollmentStatus: string;
    amountPaidCents: number;
    accessGranted: boolean;
    enrolledAt: string;
    completedAt: string | null;
    course: {
      id: string;
      title: string;
      slug: string;
      thumbnailUrl: string | null;
      priceCents: number | null;
      currency: string;
    };
  }[];
  programRegistrations: {
    id: string;
    status: string;
    createdAt: string;
    program: { id: string; title: string; slug: string };
  }[];
}

interface AuthContextType {
  // ---------- admin (unchanged) ----------
  isAdmin: boolean;
  isSuperAdmin: boolean;
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;

  // ---------- student (new) ----------
  student: StudentProfile | null;
  isStudentLoading: boolean;
  studentLogin: (email: string, password: string) => Promise<void>;
  studentSetPassword: (token: string, password: string) => Promise<void>;
  studentRequestAccess: (email: string) => Promise<void>;
  studentLogout: () => void;
  refreshStudent: () => Promise<void>;
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

// Students use a separate key so the two sessions never mix.
const STUDENT_TOKEN_KEY = "studentToken";

const API_URL = import.meta.env.VITE_API_URL || "/api";

async function studentRequest<T>(
  path: string,
  options: { method?: string; body?: unknown; token?: string | null } = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token
        ? { Authorization: `Bearer ${options.token}` }
        : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err: any = new Error(data.message || "Something went wrong");
    err.status = res.status;
    throw err;
  }

  return data as T;
}

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

  // ---------- student state ----------
  const [studentToken, setStudentToken] = useState<string | null>(() =>
    localStorage.getItem(STUDENT_TOKEN_KEY)
  );
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [isStudentLoading, setIsStudentLoading] = useState<boolean>(
    () => !!localStorage.getItem(STUDENT_TOKEN_KEY)
  );

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

  // ============================================================
  // STUDENT AUTH
  // ============================================================

  const saveStudentToken = (t: string | null) => {
    if (t) localStorage.setItem(STUDENT_TOKEN_KEY, t);
    else localStorage.removeItem(STUDENT_TOKEN_KEY);
    setStudentToken(t);
  };

  const studentLogout = useCallback(() => {
    localStorage.removeItem(STUDENT_TOKEN_KEY);
    setStudentToken(null);
    setStudent(null);
  }, []);

  // Load the profile for a token. Bad/expired token -> log out.
  const loadStudentProfile = useCallback(
    async (t: string) => {
      try {
        const profile = await studentRequest<StudentProfile>(
          "/students/me",
          { token: t }
        );
        setStudent(profile);
      } catch (err: any) {
        if (
          err.status === 401 ||
          err.status === 403 ||
          err.status === 404
        ) {
          studentLogout();
        }
      } finally {
        setIsStudentLoading(false);
      }
    },
    [studentLogout]
  );

  useEffect(() => {
    if (studentToken) loadStudentProfile(studentToken);
    else setIsStudentLoading(false);
  }, [studentToken, loadStudentProfile]);

  const studentLogin = useCallback(
    async (email: string, password: string) => {
      const data = await studentRequest<{ token: string }>(
        "/students/auth/login",
        { method: "POST", body: { email, password } }
      );
      setIsStudentLoading(true);
      saveStudentToken(data.token); // effect above then loads the profile
    },
    []
  );

  const studentSetPassword = useCallback(
    async (resetToken: string, password: string) => {
      const data = await studentRequest<{ token: string }>(
        "/students/auth/set-password",
        { method: "POST", body: { token: resetToken, password } }
      );
      setIsStudentLoading(true);
      saveStudentToken(data.token);
    },
    []
  );

  const studentRequestAccess = useCallback(async (email: string) => {
    await studentRequest("/students/auth/request-access", {
      method: "POST",
      body: { email },
    });
  }, []);

  const refreshStudent = useCallback(async () => {
    if (studentToken) await loadStudentProfile(studentToken);
  }, [studentToken, loadStudentProfile]);

  const isAdmin =
    user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  const value = useMemo<AuthContextType>(
    () => ({
      isAdmin,
      isSuperAdmin: user?.role === "SUPER_ADMIN",
      user,
      token,
      isLoading,
      login,
      logout,

      student,
      isStudentLoading,
      studentLogin,
      studentSetPassword,
      studentRequestAccess,
      studentLogout,
      refreshStudent,
    }),
    // `login` is recreated each render (as before); that's fine here
    // because the memo still avoids churn from unrelated state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      isAdmin,
      user,
      token,
      isLoading,
      logout,
      student,
      isStudentLoading,
      studentLogin,
      studentSetPassword,
      studentRequestAccess,
      studentLogout,
      refreshStudent,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
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

// ============================================================
// STUDENT ROUTE GUARD
//
//   <Route element={<StudentRoute />}>
//     <Route path="/profile" element={<StudentProfilePage />} />
//   </Route>
//
// Logged-out visitors go to /student/login and come back to the
// page they wanted afterwards.
// ============================================================

export function StudentRoute() {
  const { student, isStudentLoading } = useAuth();
  const location = useLocation();

  if (isStudentLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#C17B4F]" />
      </div>
    );
  }

  if (!student) {
    return (
      <Navigate
        to="/student/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return <Outlet />;
}