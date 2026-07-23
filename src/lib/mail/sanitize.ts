// Every value below eventually gets interpolated into an HTML email string,
// and short strings (name, email) get reused as mail headers (From/Subject/
// Reply-To). Both are injection surfaces if left raw: unescaped HTML lets a
// submitted "name" break out of its <td> and inject markup, and unstripped
// CR/LF in a header value enables classic SMTP header injection (extra
// Bcc:/Subject: lines smuggled in through a form field).

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function escapeAndBreak(value: string): string {
  return escapeHtml(value).replace(/\r\n|\r|\n/g, "<br />");
}

/** Strips newlines so a field can never smuggle extra headers into an SMTP message. */
export function sanitizeHeaderValue(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}
