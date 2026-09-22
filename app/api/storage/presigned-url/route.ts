import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/backend/auth";
import { createPresignedUploadUrl } from "@/lib/backend/r2";

export async function POST(request: Request) {
  try {
    await requireAdmin(request);

    const body = await request.json();
    const { filename, contentType } = body;

    if (!filename || !contentType) {
      return NextResponse.json(
        { success: false, error: "Filename and contentType are required" },
        { status: 400 }
      );
    }

    const cleanFilename = filename.replace(/[^a-zA-Z0-9_.-]/g, "_");
    const key = `exora-product-img/exora-file/${Date.now()}-${cleanFilename}`;

    const result = await createPresignedUploadUrl(key, contentType);

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          error: "Cloudflare R2 storage is not configured. Please add R2 credentials in environment.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("Presigned URL API error:", error);
    const status = error.message === "UNAUTHORIZED" ? 401 : error.message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate presigned upload URL" },
      { status }
    );
  }
}
