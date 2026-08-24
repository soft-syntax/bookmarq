import crypto from "crypto";

export const genNumericOTP = (length = 6) => {
  if (!Number.isInteger(length) || length < 1) {
    throw new Error("OTP length must be a positive integer");
  }

  const min = 10 ** (length - 1);
  const max = 10 ** length;

  return crypto.randomInt(min, max).toString();
};

export const hashString = (str) => {
  return crypto.createHash("sha256").update(str).digest("hex");
};

export const genRandomToken = (len = 40) => {
  return crypto.randomBytes(len).toString("hex");
};