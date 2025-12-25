import React from "react";
import "../styles/StaticPages.css";

const Privacy = () => {
  return (
    <div className="page-container">
      <h1>Privacy Policy</h1>
      <p>
        Your privacy is important to us. This website collects minimal personal data,
        only what’s necessary to provide our bookmarking service.
      </p>
      <h2>Information We Collect</h2>
      <p>
        We may collect your email and username during signup or login. No other
        personal data is stored or shared.
      </p>
      <h2>Cookies</h2>
      <p>
        We use cookies for authentication and improving your experience. You can
        clear them anytime from your browser settings.
      </p>
      <h2>Contact Us</h2>
      <p>
        If you have privacy-related questions, contact us at{" "}
        <a href="mailto:support@bookmarq.xyz">support@yourdomain.com</a>.
      </p>
    </div>
  );
};

export default Privacy;
