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

    try {
      await API.post("/auth/forgot-password", { email });

      setMsg("If this email exists, an OTP has been sent.");

      setTimeout(() => {
        navigate("/reset-password", {
          state: { email },
        });
      }, 800);
    } catch (err) {
      // Keep the message generic so we don't reveal
      // whether the email exists in the system.
      setMsg("If this email exists, an OTP has been sent.");

      setTimeout(() => {
        navigate("/reset-password", {
          state: { email },
        });
      }, 800);
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