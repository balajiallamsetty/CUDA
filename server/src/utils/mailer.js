import { env } from '../config/env.js';

export function isSmtpConfigured() {
  return Boolean(env.smtp.host);
}

export async function sendMail({ to, subject, text }) {
  if (!isSmtpConfigured()) {
    if (env.isProd) {
      throw new Error('SMTP is not configured');
    }
    console.info(`[mailer:dev] To: ${to}\nSubject: ${subject}\n${text}`);
    return { queued: false, logged: true };
  }

  const nodemailer = await import('nodemailer');
  const transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: env.smtp.user
      ? { user: env.smtp.user, pass: env.smtp.pass }
      : undefined,
  });

  await transporter.sendMail({
    from: env.smtp.from,
    to,
    subject,
    text,
  });
  return { queued: true };
}
