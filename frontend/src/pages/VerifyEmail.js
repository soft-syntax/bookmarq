import React, { useState } from "react";
import API from "../utils/api";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email || new URLSearchParams(location.search).get("email");

  const [email, setEmail] = useState(emailFromState || "");
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/verify-otp", { email, otp });
      setMsg("Verified — you can login now");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setMsg(err?.response?.data?.message || "Verify failed");
    }
  };

  const resend = async () => {
    try {
      await API.post("/auth/resend-otp", { email });
      setMsg("OTP resent. Check your email.");
    } catch (err) {
      setMsg("Resend failed");
    }
  };

  return (
    <div className="page-container">
      <h2>Verify your email</h2>
      <form onSubmit={submit}>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" required/>
        <input value={otp} onChange={(e)=>setOtp(e.target.value)} placeholder="Enter OTP" required/>
        <button type="submit">Verify</button>
      </form>
      <button onClick={resend}>Resend OTP</button>
      {msg && <p>{msg}</p>}
    </div>
  );
};

export default VerifyEmail;
