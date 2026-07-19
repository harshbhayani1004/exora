// Simple localStorage-based authentication (no backend)
// For production, integrate with a real authentication service like Firebase, Auth0, or NextAuth

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

// Mock Google OAuth Sign In
export async function signInWithGoogle(): Promise<AuthResponse> {
  // In production, integrate with actual OAuth provider
  return {
    success: false,
    error: "Google OAuth not configured. Please set up authentication service.",
  };
}

// Check if user is authenticated from localStorage
export async function checkSupabaseAuth(): Promise<User | null> {
  if (typeof window === "undefined") return null;

  const userJson = localStorage.getItem("user");
  if (!userJson) return null;

  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
}

// Simple hash function (for demo only - use proper server-side hashing in production)
async function simpleHash(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Register user (localStorage only)
export async function registerUser(
  email: string,
  password: string,
  name: string,
): Promise<AuthResponse> {
  if (typeof window === "undefined") {
    return { success: false, error: "Not in browser environment" };
  }

  try {
    // Check if user already exists
    const usersJson = localStorage.getItem("users");
    const users = usersJson ? JSON.parse(usersJson) : [];

    if (users.some((u: User) => u.email === email)) {
      return { success: false, error: "Email already registered" };
    }

    // Create new user
    const newUser: User = {
      id: Date.now(),
      email,
      name,
    };

    // Store hashed password separately (never store in user object)
    const passwordHash = await simpleHash(password);
    const passwords = JSON.parse(localStorage.getItem("passwords") || "{}");
    passwords[email] = passwordHash;
    localStorage.setItem("passwords", JSON.stringify(passwords));

    // Store user
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("user", JSON.stringify(newUser));

    return { success: true, user: newUser };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "Registration failed" };
  }
}

// Login user (localStorage only)
export async function loginUser(
  email: string,
  password: string,
): Promise<AuthResponse> {
  if (typeof window === "undefined") {
    return { success: false, error: "Not in browser environment" };
  }

  try {
    // Get users
    const usersJson = localStorage.getItem("users");
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];

    const user = users.find((u) => u.email === email);
    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }

    // Verify password
    const passwordHash = await simpleHash(password);
    const passwords = JSON.parse(localStorage.getItem("passwords") || "{}");

    if (passwords[email] !== passwordHash) {
      return { success: false, error: "Invalid email or password" };
    }

    // Set current user
    localStorage.setItem("user", JSON.stringify(user));

    return { success: true, user };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Login failed" };
  }
}

// Get current user
export async function getCurrentUser(): Promise<User | null> {
  if (typeof window === "undefined") return null;

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
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
  }
}

// Reset password (mock implementation)
export async function resetPassword(email: string): Promise<AuthResponse> {
  // In production, send a password reset email via your auth service
  return {
    success: false,
    error:
      "Password reset not configured. Please set up authentication service.",
  };
}

// Update password (mock implementation for reset flow)
export async function updatePassword(password: string): Promise<AuthResponse> {
    if (typeof window === "undefined") {
        return { success: false, error: "Not in browser environment" };
    }

    try {
        // In a real app, this would use the session established by the reset token
        // For this mock, we'll just update the current user if logged in, 
        // or return a success message if we're just simulating the flow.
        
        // Let's try to update the current user if one exists
        const userJson = localStorage.getItem("user");
        if (userJson) {
            const user = JSON.parse(userJson);
            const passwordHash = await simpleHash(password);
            const passwords = JSON.parse(localStorage.getItem("passwords") || "{}");
            passwords[user.email] = passwordHash;
            localStorage.setItem("passwords", JSON.stringify(passwords));
            return { success: true };
        }

        // If no user is logged in (which is effectively true for the reset flow until token exchange),
        // we can just return success to simulate the "flow" working for the UI demo.
        // However, since we can't actually identify WHICH user to update without a real backend token verification,
        // we'll just return a success mock.
        return { success: true }; 

    } catch (error) {
        console.error("Update password error:", error);
        return { success: false, error: "Failed to update password" };
    }
}

// Generate session token (for compatibility)
export function generateSessionToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
