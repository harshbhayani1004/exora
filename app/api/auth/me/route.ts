import { NextResponse } from "next/server";
import { getAuthUserFromRequest } from "@/lib/backend/auth";

export async function GET(request: Request) {
  try {
    const user = await getAuthUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { success: false, user: null },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error: any) {
    console.error("Auth me API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user session" },
      { status: 500 }
    );
  }
}
