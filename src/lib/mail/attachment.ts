// Shared between the client (instant feedback before upload) and the API
// route (the check that actually matters, never trust the client-side one).
export const ALLOWED_ATTACHMENT_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png", ".dwg"];
export const MAX_ATTACHMENT_SIZE_BYTES = 10 * 1024 * 1024;

export function validateAttachment(filename: string, size: number): { ok: true } | { ok: false; message: string } {
  const dot = filename.lastIndexOf(".");
  const extension = dot >= 0 ? filename.slice(dot).toLowerCase() : "";
  if (!ALLOWED_ATTACHMENT_EXTENSIONS.includes(extension)) {
    return {
      ok: false,
      message: `That file type isn't supported. Please upload one of: ${ALLOWED_ATTACHMENT_EXTENSIONS.join(", ")}.`,
    };
  }
  if (size > MAX_ATTACHMENT_SIZE_BYTES) {
    return { ok: false, message: "That file is too large. Please upload something under 10 MB." };
  }
  return { ok: true };
}
