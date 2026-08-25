import express from "express";
import { sendEmail } from "../utils/mailer.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const message = req.body.message?.trim();

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (name.length > 100) {
      return res.status(400).json({
        message: "Name must be 100 characters or less",
      });
    }

    if (email.length > 254) {
      return res.status(400).json({
        message: "Invalid email address",
      });
    }

    if (message.length > 5000) {
      return res.status(400).json({
        message: "Message must be 5000 characters or less",
      });
    }

    await sendEmail({
      to: process.env.EMAIL_FROM,
      subject: `New contact form message from ${name}`,
      html: `
        <p><b>From:</b> ${name} (${email})</p>
        <p>${message}</p>
      `,
    });

    return res.json({
      message: "Message sent successfully",
    });
  } catch (err) {
    console.error("Contact form error:", err);

    return res.status(500).json({
      message:
        "Could not send message. Please try again later.",
    });
  }
});

export default router;