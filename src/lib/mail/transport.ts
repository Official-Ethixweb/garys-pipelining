import nodemailer from "nodemailer";

// The only things a future project should ever need to change to reuse this
// module: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS (any standard SMTP relay,
// not just SMTP2Go), plus MAIL_FROM / MAIL_TO in send.ts and the brand values
// in brand.ts.
type SmtpConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
  secure: boolean;
};

function readSmtpConfig(): SmtpConfig | null {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !port || !user || !pass) return null;

  const portNumber = Number(port);
  if (!Number.isFinite(portNumber)) return null;

  return {
    host,
    port: portNumber,
    user,
    pass,
    // Port 465 is implicit TLS; everything else (587, 2525, 25, 8025 on
    // SMTP2Go) starts unencrypted and upgrades via STARTTLS.
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : portNumber === 465,
  };
}

export function isMailConfigured(): boolean {
  return readSmtpConfig() !== null;
}

let cachedTransporter: nodemailer.Transporter | null = null;
let cachedConfigKey = "";

/** Throws if SMTP isn't configured yet; callers should check isMailConfigured() first when they want to fail soft. */
export function getTransporter(): nodemailer.Transporter {
  const config = readSmtpConfig();
  if (!config) {
    throw new Error("SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS.");
  }

  const configKey = `${config.host}:${config.port}:${config.user}:${config.secure}`;
  if (cachedTransporter && cachedConfigKey === configKey) {
    return cachedTransporter;
  }

  cachedTransporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass: config.pass },
  });
  cachedConfigKey = configKey;
  return cachedTransporter;
}
