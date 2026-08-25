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
      <h2>Authentication & Local Storage</h2>
      <p>
        We use browser local storage (not cookies) to keep you signed in. You can
        clear this anytime by logging out or clearing your browser's site data.
      </p>
      <h2>Contact Us</h2>
      <p>
        If you have privacy-related questions, contact us at{" "}
        <a href="mailto:support@bookmarq.xyz">support@bookmarq.xyz</a>.
      </p>
    </div>
  );
};

export default Privacy;
