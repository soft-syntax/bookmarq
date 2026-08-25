import fetch from "node-fetch";

const RESEND_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.EMAIL_FROM;

export const sendEmail = async ({ to, subject, html }) => {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to,
      subject,
      html
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error("Email failed: " + err);
  }
  return res.json();
};
