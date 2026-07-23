import { NextRequest, NextResponse } from "next/server";
import { validateAttachment } from "@/lib/mail/attachment";
import { leadPayloadSchema, SOURCE_LABELS } from "@/lib/mail/lead-schema";
import { sanitizeHeaderValue } from "@/lib/mail/sanitize";
import { MailNotConfiguredError, sendLeadEmails } from "@/lib/mail/send";
import { looksLikeSpam } from "@/lib/mail/spam";
import type { LeadAttachment, NormalizedLead } from "@/lib/mail/types";
import { checkRateLimit } from "@/lib/rate-limit";

// Every lead source on the site (Estimate, Contact, Contractor Partnership,
// Careers, and the chatbot) POSTs here. This is the only place that talks to
// SMTP, so validation, sanitization, spam filtering, and rate limiting only
// ever need to be written once.
export const runtime = "nodejs";

function jsonError(message: string, status: number, extraHeaders?: HeadersInit) {
  return NextResponse.json({ success: false, message }, { status, headers: extraHeaders });
}

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") || "";
  let rawBody: unknown;
  let attachment: LeadAttachment | undefined;

  try {
    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const payloadRaw = form.get("payload");
      if (typeof payloadRaw !== "string") {
        return jsonError("Missing form payload.", 400);
      }
      rawBody = JSON.parse(payloadRaw);

      const file = form.get("attachment");
      if (file instanceof File && file.size > 0) {
        const check = validateAttachment(file.name, file.size);
        if (!check.ok) return jsonError(check.message, 400);
        attachment = {
          filename: file.name,
          content: Buffer.from(await file.arrayBuffer()),
          contentType: file.type || "application/octet-stream",
        };
      }
    } else {
      rawBody = await request.json();
    }
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  const parsed = leadPayloadSchema.safeParse(rawBody);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "That submission didn't look right.";
    return jsonError(message, 400);
  }
  const data = parsed.data;

  const ip = getClientIp(request);
  const rate = checkRateLimit(`lead:${ip}`, { windowMs: 10 * 60_000, max: 6 });
  if (!rate.allowed) {
    return jsonError("Too many requests. Please try again in a few minutes.", 429, {
      "Retry-After": String(rate.retryAfterSeconds),
    });
  }

  // Honeypot: real visitors never see or fill this field. Report success
  // without sending anything so bots get no signal they were caught.
  if (data.botcheck) {
    return NextResponse.json({ success: true });
  }
  if (looksLikeSpam(data)) {
    console.warn(`[send-lead] Dropped a submission from ${ip} that matched spam heuristics.`);
    return NextResponse.json({ success: true });
  }

  const normalized: NormalizedLead = {
    source: data.source,
    sourceLabel: SOURCE_LABELS[data.source],
    name: sanitizeHeaderValue(data.name),
    email: data.email || undefined,
    phone: data.phone ? sanitizeHeaderValue(data.phone) : undefined,
    fields: data.fields
      .map((f) => ({ label: sanitizeHeaderValue(f.label), value: f.value.trim() }))
      .filter((f) => f.value.length > 0),
    transcript: data.transcript,
    urgent: data.urgent,
    pageUrl: data.pageUrl || undefined,
    submittedAt: new Date(),
    attachment,
  };

  try {
    const result = await sendLeadEmails(normalized);
    return NextResponse.json({ success: true, customerEmailSent: result.customer });
  } catch (err) {
    if (err instanceof MailNotConfiguredError) {
      console.error(`[send-lead] ${err.message}`);
      return jsonError("Email delivery isn't configured yet. Please call us instead.", 503);
    }
    console.error("[send-lead] Failed to send lead email", err);
    return jsonError("Something went wrong sending your request. Please call us instead.", 502);
  }
}
