import React, { useState, useEffect } from "react";
import API, { getCategories } from "../utils/api";
import { useNavigate } from "react-router-dom";
import "../styles/AddLink.css";

const AddLink = () => {
  const [bookmark, setBookmark] = useState({
    title: "",
    url: "",
    description: "",
    featuredImage: "",
    tags: "",
    category: "", // new field for category
  });
  const [categories, setCategories] = useState([]); // store fetched categories
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setBookmark({ ...bookmark, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError("You must be logged in to submit a bookmark");
      return;
    }

    try {
      const payload = {
        ...bookmark,
        tags: bookmark.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };

      await API.post("/bookmarks", payload);

      setSuccess("Bookmark submitted successfully!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError("Failed to submit bookmark");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="addlink-container">
      <h2>Submit a New Bookmark</h2>

      {error && <p className="message-error">{error}</p>}
      {success && <p className="message-success">{success}</p>}

      <form onSubmit={handleSubmit} className="bookmark-form">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={bookmark.title}
          onChange={handleChange}
          required
        />

        <input
          type="url"
          name="url"
          placeholder="URL"
          value={bookmark.url}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={bookmark.description}
          onChange={handleChange}
          rows="4"
        />

        <input
          type="url"
          name="featuredImage"
          placeholder="Featured Image URL"
          value={bookmark.featuredImage}
          onChange={handleChange}
        />

        <input
          type="text"
          name="tags"
          placeholder="Tags (comma separated)"
          value={bookmark.tags}
          onChange={handleChange}
        />

        {/* New Category Dropdown */}
        <label htmlFor="category" className="category-label">
          
        </label>
        <select
          id="category"
          name="category"
          value={bookmark.category}
          onChange={handleChange}
          required
          className="category-select"
        >
          <option value="">Select a Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddLink;
