import React, { useState, useEffect } from "react";
import API from "../utils/api";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const email = params.get("email") || "";
  const token = params.get("token") || "";

  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/reset-password", { email, token, newPassword: password });
      setMsg("Password reset. Redirecting to login...");
      setTimeout(()=>navigate("/login"), 1500);
    } catch (err) {
      setMsg(err?.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="page-container">
      <h2>Reset password</h2>
      <form onSubmit={submit}>
        <input value={email} readOnly />
        <input value={token} readOnly />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="New password" required />
        <button type="submit">Reset</button>
      </form>
      <p>{msg}</p>
    </div>
  );
};

export default ResetPassword;
