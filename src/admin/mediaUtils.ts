export type OptimisedImage = {
  blob: Blob;
  name: string;
  width: number;
  height: number;
  originalBytes: number;
  optimizedBytes: number;
};

/**
 * Resize and convert images in the browser before upload. This keeps R2 usage,
 * Worker memory and upload time inside the free tier, and the Worker only ever
 * receives the final compact file.
 */
export async function optimiseImage(file: File, maxEdge = 2000, quality = 0.82): Promise<OptimisedImage> {
  const fallback = { blob: file, name: file.name, width: 0, height: 0, originalBytes: file.size, optimizedBytes: file.size };
  if (!file.type.startsWith("image/") || file.type === "image/gif" || file.type === "image/svg+xml") return fallback;
  if (typeof createImageBitmap !== "function" || typeof OffscreenCanvas === "undefined") return fallback;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = new OffscreenCanvas(width, height);
    const context = canvas.getContext("2d");
    if (!context) return fallback;
    context.imageSmoothingQuality = "high";
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();
    const blob = await canvas.convertToBlob({ type: "image/webp", quality });
    if (blob.size >= file.size) return { ...fallback, width, height };
    return {
      blob,
      name: file.name.replace(/\.[^.]+$/, "") + ".webp",
      width,
      height,
      originalBytes: file.size,
      optimizedBytes: blob.size,
    };
  } catch {
    return fallback;
  }
}

export async function uploadOptimisedImage(file: File, upload: (form: FormData) => Promise<{ url: string; key: string }>, alt = "") {
  const optimised = await optimiseImage(file);
  const form = new FormData();
  form.append("file", optimised.blob, optimised.name);
  form.append("alt", alt);
  if (optimised.width) form.append("width", String(optimised.width));
  if (optimised.height) form.append("height", String(optimised.height));
  const result = await upload(form);
  return { ...result, optimised };
}

export const readAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
