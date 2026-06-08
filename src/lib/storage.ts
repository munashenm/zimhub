import { createSupabaseAdmin, getStorageBucket } from "./supabase";

export interface UploadResult {
  url: string;
  path: string;
}

/**
 * Upload a product image to Supabase Storage.
 * Returns the public URL to store in the product `images` JSON field.
 */
export async function uploadProductImage(
  file: Buffer,
  filename: string,
  contentType: string
): Promise<UploadResult> {
  const supabase = createSupabaseAdmin();
  if (!supabase) {
    throw new Error(
      "Supabase storage is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  const bucket = getStorageBucket();
  const ext = filename.split(".").pop() || "jpg";
  const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType,
    upsert: false,
  });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);

  return { url: data.publicUrl, path };
}

/** Validate image file before upload. */
export function validateImageFile(
  size: number,
  contentType: string
): string | null {
  const maxSize = 5 * 1024 * 1024; // 5 MB
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];

  if (!allowed.includes(contentType)) {
    return "Only JPEG, PNG, WebP, and GIF images are allowed.";
  }
  if (size > maxSize) {
    return "Image must be smaller than 5 MB.";
  }
  return null;
}
