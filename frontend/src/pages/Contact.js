import React, { useState } from "react";
import "../styles/StaticPages.css";
import API from "../utils/api";


const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ...

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setStatus("");

    try {
      await API.post("/contact", formData);

      setStatus("Thanks for reaching out! We'll get back to you soon.");

      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (err) {
      setStatus(
        err.response?.data?.message ||
        "Failed to send message."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1>Contact Us</h1>
      <p>If you have any questions or feedback, fill out the form below.</p>
      {status && <p className="message-info">{status}</p>}


      <form className="contact-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
};

export default Contact;
