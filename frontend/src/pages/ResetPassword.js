import React, { useState } from "react";
import API from "../utils/api";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const emailFromState = location.state?.email || "";

  const [email, setEmail] = useState(emailFromState);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMsg("");

    try {
      await API.post("/auth/reset-password", {
        email,
        otp,
        newPassword: password,
      });

      setMsg("Password reset. Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setMsg(
        err?.response?.data?.message || "Password reset failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h2>Reset password</h2>

      <form onSubmit={submit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter the OTP from your email"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
          minLength={8}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Resetting..." : "Reset password"}
        </button>
      </form>

      <p>{msg}</p>
    </div>
  );
};

export default ResetPassword;