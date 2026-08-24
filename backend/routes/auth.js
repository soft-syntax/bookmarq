import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendEmail } from "../utils/mailer.js";
import { genNumericOTP } from "../utils/crypto.js";

const router = express.Router();

// =============================
// Helper: Validate register input
// =============================
const validateRegister = (name, email, password) => {
  if (!name || !email || !password) return "All fields are required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Invalid email format";
  if (password.length < 6) return "Password must be at least 6 characters";
  return null;
};

// =============================
// REGISTER (Send OTP)
// =============================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const errorMsg = validateRegister(name, email, password);
    if (errorMsg) return res.status(400).json({ message: errorMsg });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = genNumericOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      otp: hashedOtp,
      otpExpiresAt: Date.now() + 10 * 60 * 1000,
      isVerified: false,
    });

    await newUser.save();

    // Try sending email, but do NOT fail registration if email fails
    try {
      await sendEmail({
        to: email,
        subject: "Verify your email",
        html: `<p>Your OTP code is <b>${otp}</b></p>`,
      });
    } catch (err) {
      console.error(`OTP email failed for ${email}:`, err);
    }

    res.status(201).json({
      message: "Account created. Please verify your email.",
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      message: "Registration failed. Please try again later.",
    });
  }
});

// =============================
// VERIFY OTP
// =============================
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ message: "Email and OTP are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.isVerified)
      return res.status(400).json({ message: "User already verified" });

    if (!user.otp || !user.otpExpiresAt || Date.now() > user.otpExpiresAt)
      return res.status(400).json({ message: "OTP expired" });

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) return res.status(400).json({ message: "Invalid OTP" });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({
      message: "Verification failed. Please try again.",
    });
  }
});

// =============================
// RESEND OTP
// =============================
router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.isVerified)
      return res.status(400).json({ message: "User already verified" });

    const otp = genNumericOTP();
    user.otp = await bcrypt.hash(otp, 10);
    user.otpExpiresAt = Date.now() + 10 * 60 * 1000;
    await user.save();

    try {
      await sendEmail({
        to: email,
        subject: "Verify your email",
        html: `<p>Your OTP code is <b>${otp}</b></p>`,
      });
    } catch (err) {
      console.error(`Resend OTP failed for ${email}:`, err);
    }

    res.json({ message: "OTP resent. Check your email." });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({
      message: "Failed to resend OTP. Please try again.",
    });
  }
});

// =============================
// LOGIN
// =============================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    if (!user.isVerified)
      return res.status(400).json({ message: "Please verify your email first" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Login failed. Please try again.",
    });
  }
});

// =============================
// FORGOT PASSWORD
// =============================
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const otp = genNumericOTP();
    user.otp = await bcrypt.hash(otp, 10);
    user.otpExpiresAt = Date.now() + 10 * 60 * 1000;
    await user.save();

    try {
      await sendEmail({
        to: email,
        subject: "Password Reset OTP",
        html: `<p>Your password reset OTP is <b>${otp}</b></p>`,
      });
    } catch (err) {
      console.error(`Password reset OTP failed for ${email}:`, err);
    }

    res.json({ message: "OTP sent to email for password reset" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      message: "Could not process request. Please try again.",
    });
  }
});

// =============================
// RESET PASSWORD
// =============================
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword)
      return res.status(400).json({ message: "All fields are required" });

    if (newPassword.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (!user.otp || !user.otpExpiresAt || Date.now() > user.otpExpiresAt)
      return res.status(400).json({ message: "OTP expired" });

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) return res.status(400).json({ message: "Invalid OTP" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      message: "Password reset failed. Please try again.",
    });
  }
});

export default router;
