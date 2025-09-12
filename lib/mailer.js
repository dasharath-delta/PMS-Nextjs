import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,       // e.g. smtp.gmail.com
  port: process.env.SMTP_PORT,       // 465 (SSL) or 587 (TLS)
  secure: process.env.SMTP_PORT == 465, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,     // your email
    pass: process.env.SMTP_PASS,     // app password (not your real password)
  },
});

export async function sendMail({ to, subject, html }) {
  try {
    const info = await transporter.sendMail({
      from: `"Support" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("❌ Error sending mail:", err);
    throw err;
  }
}
