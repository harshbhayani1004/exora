import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    try {
      await prisma.contactInquiry.create({
        data: {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          subject: subject?.trim() || "General Inquiry",
          message: message.trim(),
        },
      });
    } catch (dbError) {
      console.warn("DB contact save failed (fallback logging):", dbError);
    }

    console.log(`📩 [NEW CONTACT INQUIRY] From: ${name} (${email}) | Subject: ${subject || "None"}`);

    return NextResponse.json({
      success: true,
      message: "Thank you for reaching out! Our studio team will reply within one business day.",
    });
  } catch (error: any) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit contact message" },
      { status: 500 }
    );
  }
}
