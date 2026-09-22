import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/backend/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json(
        { success: false, error: "Token and new password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetRecord || resetRecord.used || resetRecord.expiresAt < new Date()) {
      return NextResponse.json(
        { success: false, error: "This reset link is invalid or has expired." },
        { status: 400 }
      );
    }

    const newPasswordHash = await hashPassword(password);

    // Update password
    await prisma.user.update({
      where: { email: resetRecord.email },
      data: { passwordHash: newPasswordHash },
    });

    // Mark token as used
    await prisma.passwordResetToken.update({
      where: { id: resetRecord.id },
      data: { used: true },
    });

    return NextResponse.json({
      success: true,
      message: "Your password has been reset successfully. You can now log in.",
    });
  } catch (error: any) {
    console.error("Reset password API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
