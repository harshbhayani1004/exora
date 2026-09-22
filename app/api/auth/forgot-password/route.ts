import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/backend/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      // Don't leak whether user exists
      return NextResponse.json({
        success: true,
        message: "If that email is registered, you will receive a reset link shortly.",
      });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.create({
      data: {
        email: normalizedEmail,
        token,
        expiresAt,
      },
    });

    // Construct reset link
    const host = request.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const resetUrl = `${protocol}://${host}/reset-password#access_token=${token}&type=recovery&token_type=bearer`;

    await sendPasswordResetEmail(normalizedEmail, resetUrl);

    return NextResponse.json({
      success: true,
      message: "If that email is registered, you will receive a reset link shortly.",
    });
  } catch (error: any) {
    console.error("Forgot password API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process password reset request" },
      { status: 500 }
    );
  }
}
