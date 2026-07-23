import { mailBrand } from "./brand";
import { renderAdminLeadEmail, renderCustomerConfirmationEmail } from "./templates";
import { getTransporter, isMailConfigured } from "./transport";
import type { NormalizedLead } from "./types";

export class MailNotConfiguredError extends Error {
  constructor() {
    super("SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and MAIL_TO.");
    this.name = "MailNotConfiguredError";
  }
}

function resolveFromAddress(): string {
  const configured = process.env.MAIL_FROM;
  if (!configured) {
    const host = (() => {
      try {
        return new URL(mailBrand.siteUrl).hostname;
      } catch {
        return "example.com";
      }
    })();
    return `"${mailBrand.companyName}" <no-reply@${host}>`;
  }
  // Allow either a bare address ("leads@x.com") or a pre-formatted
  // "Name <leads@x.com>", only wrap it with the brand name if it's bare.
  return /<.+>/.test(configured) ? configured : `"${mailBrand.companyName}" <${configured}>`;
}

export type SendLeadEmailsResult = { admin: true; customer: boolean };

export async function sendLeadEmails(lead: NormalizedLead): Promise<SendLeadEmailsResult> {
  if (!isMailConfigured()) {
    throw new MailNotConfiguredError();
  }
  const mailTo = process.env.MAIL_TO;
  if (!mailTo) {
    throw new MailNotConfiguredError();
  }

  const transporter = getTransporter();
  const from = resolveFromAddress();

  const admin = renderAdminLeadEmail(lead);
  await transporter.sendMail({
    from,
    to: mailTo,
    replyTo: lead.email || undefined,
    subject: admin.subject,
    html: admin.html,
    text: admin.text,
    attachments: lead.attachment
      ? [{ filename: lead.attachment.filename, content: lead.attachment.content, contentType: lead.attachment.contentType }]
      : undefined,
  });

  let customerSent = false;
  if (lead.email) {
    try {
      const customer = renderCustomerConfirmationEmail(lead);
      await transporter.sendMail({
        from,
        to: lead.email,
        replyTo: mailBrand.email,
        subject: customer.subject,
        html: customer.html,
        text: customer.text,
      });
      customerSent = true;
    } catch (err) {
      // The admin already has the lead at this point; a failed courtesy
      // confirmation to the customer shouldn't make the whole request fail.
      console.error("[send-lead] Failed to send customer confirmation email", err);
    }
  }

  return { admin: true, customer: customerSent };
}
