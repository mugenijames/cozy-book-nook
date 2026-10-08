// frontend/src/services/admin.ts

import { getApiBase } from "@/services/api";

// ============================================================
// TYPES
// ============================================================

export type AdminRole = "ADMIN" | "SUPER_ADMIN";

export type AdminAccount = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt?: string;
};

// ============================================================
// TOKEN HELPERS
// ============================================================

function getToken(): string {
  return (
    localStorage.getItem("admin_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("auth_token") ||
    ""
  );
}

export function getAdminToken(): string {
  return getToken();
}

export function setAdminToken(token: string): void {
  localStorage.setItem("admin_token", token);
}

export function clearAdminToken(): void {
  localStorage.removeItem("admin_token");
  localStorage.removeItem("token");
  localStorage.removeItem("auth_token");
}

// ============================================================
// GENERIC REQUEST HELPER
// ============================================================

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${getApiBase()}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data?.error ||
        data?.message ||
        `Request failed (${response.status})`
    );
  }

  return data as T;
}

// ============================================================
// AUTH
// ============================================================

export async function adminLogin(email: string, password: string) {
  return request<{
    success: boolean;
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: AdminRole;
    };
    expiresIn: string;
  }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function adminDevLogin() {
  return request<{
    success: boolean;
    development: boolean;
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: AdminRole;
    };
    expiresIn: string;
  }>("/api/auth/dev-login", {
    method: "POST",
  });
}

export async function getCurrentAdmin() {
  return request<{
    success: boolean;
    user: AdminAccount;
  }>("/api/auth/me");
}

export function logoutAdmin() {
  clearAdminToken();
}

// ============================================================
// ADMIN USERS
// ============================================================

export async function listAdminUsers() {
  const data = await request<{
    success: boolean;
    users: AdminAccount[];
  }>("/api/admin/users");

  return data.users;
}

export async function createAdminUser(payload: {
  name: string;
  email: string;
  password: string;
  role: AdminRole;
}) {
  const data = await request<{
    success: boolean;
    user: AdminAccount;
  }>("/api/admin/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data.user;
}

export async function updateAdminUser(
  id: string,
  payload: {
    name?: string;
    role?: AdminRole;
    isActive?: boolean;
    password?: string;
  }
) {
  const data = await request<{
    success: boolean;
    user: AdminAccount;
  }>(`/api/admin/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  return data.user;
}

export async function deleteAdminUser(id: string) {
  return request<{ success: boolean }>(`/api/admin/users/${id}`, {
    method: "DELETE",
  });
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
  getAdminToken,
  setAdminToken,
  clearAdminToken,
  adminLogin,
  adminDevLogin,
  getCurrentAdmin,
  logoutAdmin,
  listAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
};