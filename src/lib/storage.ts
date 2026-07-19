// Cloudflare R2 Configuration
const R2_PUBLIC_URL =
  process.env.NEXT_PUBLIC_R2_PUBLIC_URL ||
  "https://pub-2a5d8e5eaff3498da143b1150b20a7c1.r2.dev";

// Folder path in R2 bucket where images are stored
const R2_IMAGE_PATH = "exora-product-img/exora-file";

/**
 * Get public URL for an image in Cloudflare R2 storage
 */
export function getImageUrl(path: string): string {
  if (!path) return "";

  // If path is already a full URL, return it
  if (path.startsWith("http")) return path;

  // Remove leading slash if present
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  // Return Cloudflare R2 public URL with folder path
  return `${R2_PUBLIC_URL}/${R2_IMAGE_PATH}/${cleanPath}`;
}

/**
 * Upload an image to Cloudflare R2 storage
 * Note: For client-side uploads, you'll need to set up a presigned URL endpoint
 * This is a placeholder that should be implemented via an API route
 */
export async function uploadImage(
  file: File,
  path?: string,
): Promise<{ url: string; path: string } | null> {
  try {
    const fileName = path || `${Date.now()}-${file.name}`;

    // TODO: Implement R2 upload via API route with presigned URL
    // For now, you'll need to upload images manually to R2
    console.warn("R2 upload not implemented. Upload images manually to R2.");

    return {
      path: fileName,
      url: getImageUrl(fileName),
    };
  } catch (err) {
    console.error("Unexpected error uploading image:", err);
    return null;
  }
}

/**
 * Delete an image from Cloudflare R2 storage
 * Note: This should be implemented via an API route with R2 credentials
 */
export async function deleteImage(path: string): Promise<boolean> {
  try {
    // TODO: Implement R2 delete via API route
    console.warn("R2 delete not implemented. Delete images manually from R2.");
    return false;
  } catch (err) {
    console.error("Unexpected error deleting image:", err);
    return false;
  }
}

/**
 * List all images in Cloudflare R2 storage
 * Note: This should be implemented via an API route with R2 credentials
 */
export async function listImages(folder = ""): Promise<string[]> {
  try {
    // TODO: Implement R2 list via API route
    console.warn("R2 list not implemented.");
    return [];
  } catch (err) {
    console.error("Unexpected error listing images:", err);
    return [];
  }
}
