// Studio Admin API Client for EXORA Backend

export interface AdminUser {
  id: string | number;
  email: string;
  name: string;
  role: string;
  phone?: string | null;
}
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
/**
 * Universal authenticated fetch helper for admin panel.
 * Uses native relative /api routes on the backend.
 */
export async function adminFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers = new Headers(options.headers || {});

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  try {
    const res = await fetch(endpoint, {
      ...options,
      headers,
      credentials: "include",
    });
    return res;
  } catch (error: any) {
    console.warn("adminFetch network notice:", endpoint, error?.message);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Network communication notice. Please retry in a moment.",
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

/**
 * Retrieve active authenticated admin user session
 */
export async function getCurrentAdmin(): Promise<AdminUser | null> {
  if (typeof window === "undefined") return null;

  try {
    const res = await adminFetch("/api/auth/me");
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.user && data.user.role === "ADMIN") {
        localStorage.setItem("user", JSON.stringify(data.user));
        return data.user;
      }
    }
  } catch {
    // Ignore error
  }

  const stored = localStorage.getItem("user");
  if (stored) {
    try {
      const user = JSON.parse(stored);
      if (user && user.role === "ADMIN") {
        return user;
      }
    } catch {
      localStorage.removeItem("user");
    }
  }

  return null;
}

/**
 * Admin authentication login
 */
export async function adminLogin(email: string, password: string) {
  const res = await adminFetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (data.success && data.user) {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
    }
  }
  return data;
}

/**
 * Admin sign out
 */
export async function adminLogout() {
  try {
    await adminFetch("/api/auth/logout", { method: "POST" });
  } catch {
    // Ignore error
  }
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }
}
