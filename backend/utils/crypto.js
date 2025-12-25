import crypto from "crypto";

export const genNumericOTP = (length = 6) => {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) otp += digits[Math.floor(Math.random() * 10)];
  return otp;
};

export const hashString = (str) => {
  return crypto.createHash("sha256").update(str).digest("hex");
};

export const genRandomToken = (len = 40) => {
  return crypto.randomBytes(len).toString("hex");
};
