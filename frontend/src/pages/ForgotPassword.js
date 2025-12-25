import React, { useState } from "react";
import API from "../utils/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/forgot-password", { email });
      setMsg("If this email exists, you will receive reset instructions.");
    } catch (err) {
      setMsg("Error sending reset email");
    }
  };
  return (
    <div className="page-container">
      <h2>Forgot password</h2>
      <form onSubmit={submit}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Your email" required />
        <button type="submit">Send reset link</button>
      </form>
      <p>{msg}</p>
    </div>
  );
};
export default ForgotPassword;
