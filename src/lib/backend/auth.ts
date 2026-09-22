import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma";

const JWT_SECRET = process.env.JWT_SECRET || "exora-fallback-jwt-secret-2026";
const TOKEN_COOKIE_NAME = "exora_auth_token";

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string | null;
}

/**
 * Hash plain password with bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Compare plain password against bcrypt hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate signed JWT
 */
export function generateToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): AuthTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
  } catch {
    return null;
  }
}

/**
 * Extract auth user from Request cookies or Authorization header
 */
export async function getAuthUserFromRequest(request: Request): Promise<AuthUser | null> {
  let token: string | undefined;

  // 1. Check Authorization header
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  }

  // 2. Check Cookie if header not present
  if (!token) {
    const cookieHeader = request.headers.get("cookie");
    if (cookieHeader) {
      const match = cookieHeader.match(new RegExp(`(^|;\\s*)${TOKEN_COOKIE_NAME}=([^;]+)`));
      if (match) {
        token = match[2];
      }
    }
  }

  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload || !payload.userId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
      },
    });
    return user;
  } catch (error) {
    console.error("Error retrieving user by token:", error);
    return null;
  }
}

/**
 * Guard: Require authenticated user or throw error
 */
export async function requireAuth(request: Request): Promise<AuthUser> {
  const user = await getAuthUserFromRequest(request);
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

/**
 * Guard: Require admin role or throw error
 */
export async function requireAdmin(request: Request): Promise<AuthUser> {
  const user = await requireAuth(request);
  if (user.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }
  return user;
}

/**
 * Cookie options helper
 */
export const AUTH_COOKIE_CONFIG = {
  name: TOKEN_COOKIE_NAME,
  options: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
};
