import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../utils/api";
import "../styles/Auth.css";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const emailFromState =
    location.state?.email ||
    new URLSearchParams(location.search).get("email") ||
    "";

  const [email, setEmail] = useState(emailFromState);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!otp) return;

    try {
      setLoading(true);
      setMessage("");

      await API.post("/auth/verify-otp", { email, otp });

      setMessage("Email verified successfully. You can login now.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setMessage(err?.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    try {
      setLoading(true);
      setMessage("");

      await API.post("/auth/resend-otp", { email });

      setMessage("OTP resent. Please check your email.");
      setOtp(""); // clear OTP field
    } catch (err) {
      setMessage(err?.response?.data?.message || "Resend failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Verify your email</h2>

      {message && <p className="message-info">{message}</p>}

      <form onSubmit={submit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          disabled={loading}
        />

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          required
          disabled={loading}
        />

        <button type="submit" disabled={loading || !otp}>
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>

      <button
        type="button"
        onClick={resend}
        disabled={loading || !email}
        className="secondary-btn"
      >
        {loading ? "Sending..." : "Resend OTP"}
      </button>
    </div>
  );
};

export default VerifyEmail;
