// Production Authentication Client connected to /api/auth/* backend

export interface User {
  id: string | number;
  email: string;
  name: string;
  role?: string;
  phone?: string | null;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
  message?: string;
}

// Google OAuth Sign In (redirects to Google provider or displays notice)
export async function signInWithGoogle(): Promise<AuthResponse> {
  return {
    success: false,
    error: "Google OAuth requires GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to be configured.",
  };
}

// Check if user is authenticated from session endpoint or localStorage
export async function checkSupabaseAuth(): Promise<User | null> {
  return getCurrentUser();
}

// Register user via backend API
export async function registerUser(
  email: string,
  password: string,
  name: string,
): Promise<AuthResponse> {
  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || "Registration failed" };
    }

    if (typeof window !== "undefined" && data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
    }

    return { success: true, user: data.user };
  } catch (error: any) {
    console.error("Registration client error:", error);
    return { success: false, error: error.message || "Registration failed" };
  }
}

// Login user via backend API
export async function loginUser(
  email: string,
  password: string,
): Promise<AuthResponse> {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || "Invalid email or password" };
    }

    if (typeof window !== "undefined" && data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
    }

    return { success: true, user: data.user };
  } catch (error: any) {
    console.error("Login client error:", error);
    return { success: false, error: error.message || "Login failed" };
  }
}

// Get current user (verifies with backend session)
export async function getCurrentUser(): Promise<User | null> {
  if (typeof window === "undefined") return null;

  try {
    const res = await fetch("/api/auth/me");
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        return data.user;
      }
    }
  } catch {
    // Fall back to localStorage if offline/network error
  }

  const userJson = localStorage.getItem("user");
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
}

// Logout user
export async function logout(): Promise<void> {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } catch {
    // Ignore error
  }

  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }
}

// Request password reset email
export async function resetPassword(email: string): Promise<AuthResponse> {
  try {
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    return {
      success: res.ok && data.success,
      message: data.message || "Reset email instructions sent",
      error: !res.ok ? data.error : undefined,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to send password reset email",
    };
  }
}

// Update password using reset token
export async function updatePassword(password: string, token?: string): Promise<AuthResponse> {
  try {
    // If no token passed, try to extract from window.location.hash
    let recoveryToken = token;
    if (!recoveryToken && typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash) {
        const params = new URLSearchParams(hash.slice(1));
        recoveryToken = params.get("access_token") || undefined;
      }
    }

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, token: recoveryToken }),
    });

    const data = await res.json();
    return {
      success: res.ok && data.success,
      message: data.message,
      error: !res.ok ? data.error : undefined,
    };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update password" };
  }
}

// Generate session token (compatibility utility)
export function generateSessionToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
