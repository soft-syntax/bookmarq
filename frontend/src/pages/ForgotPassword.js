import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMsg("");

    const normalizedEmail = email.trim().toLowerCase();

    try {
      await API.post("/auth/forgot-password", {
        email: normalizedEmail,
      });

      setMsg("If this email exists, an OTP has been sent.");

      setTimeout(() => {
        navigate("/reset-password", {
          state: { email: normalizedEmail },
        });
      }, 800);
    } catch (err) {
      setMsg(
        err?.response?.data?.message ||
          "Could not process your request. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h2>Forgot password</h2>

      <form onSubmit={submit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          required
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send reset code"}
        </button>
      </form>

      <p>{msg}</p>
    </div>
  );
};

export default ForgotPassword;