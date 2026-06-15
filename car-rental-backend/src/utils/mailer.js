// Dergues emaili me nodemailer. Konfigurohet me .env:
//   EMAIL_USER=email@gmail.com
//   EMAIL_PASS=app_password   (Gmail App Password, jo fjalekalimi normal)
//   EMAIL_HOST=smtp.gmail.com (opsional, default Gmail)
//   EMAIL_PORT=587            (opsional)
//   EMAIL_FROM="QENT <email@gmail.com>" (opsional)

let nodemailer;
try {
  nodemailer = require("nodemailer");
} catch (_) {
  nodemailer = null;
}

function getTransporter() {
  if (!nodemailer) return null;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!user || !pass) return null;
  const port = Number(process.env.EMAIL_PORT) || 587;
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port,
    secure: port === 465, // 465 = SSL, 587 = STARTTLS
    auth: { user, pass },
  });
}

/**
 * Dergon nje email. Kthen true nese u dergua, false nese mailer-i s'eshte konfiguruar.
 */
async function sendMail(to, subject, text) {
  const t = getTransporter();
  if (!t) {
    console.log(
      `[MAILER] Jo i konfiguruar. Email per ${to} | ${subject} | ${text}`,
    );
    return false;
  }
  await t.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
  return true;
}

module.exports = { sendMail };
