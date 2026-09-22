import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "A valid email address is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    try {
      await prisma.newsletterSubscriber.upsert({
        where: { email: normalizedEmail },
        update: {},
        create: { email: normalizedEmail },
      });
    } catch (dbError) {
      console.warn("DB newsletter subscribe failed (fallback logging):", dbError);
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for subscribing! Keep an eye on your inbox for studio notes and new blooms.",
    });
  } catch (error: any) {
    console.error("Newsletter API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to subscribe to newsletter" },
      { status: 500 }
    );
  }
}
