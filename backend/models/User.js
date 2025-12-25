import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    // new fields for OTP verification
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String, // will store hashed OTP
    },
    otpExpiresAt: {
      type: Date,
    },

    // for forgot password functionality
    resetToken: {
      type: String,
    },
    resetTokenExpiresAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
