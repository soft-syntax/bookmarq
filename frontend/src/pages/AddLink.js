import React, { useContext, useEffect, useState } from "react";
import API, { getCategories } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/AddLink.css";

const AddLink = () => {
  const [bookmark, setBookmark] = useState({
    title: "",
    url: "",
    description: "",
    featuredImage: "",
    tags: "",
    category: "",
  });

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);

        const data = await getCategories();

        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading categories:", err);

        setError(
          err?.response?.data?.message ||
            "Failed to load categories."
        );
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setBookmark({
      ...bookmark,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!token) {
      setError("You must be logged in to submit a bookmark.");
      return;
    }

    const title = bookmark.title.trim();
    const url = bookmark.url.trim();
    const description = bookmark.description.trim();
    const featuredImage = bookmark.featuredImage.trim();

    if (!title || !url) {
      setError("Title and URL are required.");
      return;
    }

    if (title.length > 200) {
      setError("Title must be 200 characters or less.");
      return;
    }

    if (url.length > 2048) {
      setError("URL must be 2048 characters or less.");
      return;
    }

    if (description.length > 2000) {
      setError(
        "Description must be 2000 characters or less."
      );
      return;
    }

    if (featuredImage.length > 2048) {
      setError(
        "Featured image URL must be 2048 characters or less."
      );
      return;
    }

    const tags = bookmark.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (tags.length > 10) {
      setError("You can add a maximum of 10 tags.");
      return;
    }

    const invalidTag = tags.find(
      (tag) => tag.length > 50
    );

    if (invalidTag) {
      setError(
        "Each tag must be 50 characters or less."
      );
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title,
        url,
        description,
        featuredImage,
        tags,
        category: bookmark.category || null,
      };

      await API.post("/bookmarks", payload);

      setSuccess("Bookmark submitted successfully!");

      setBookmark({
        title: "",
        url: "",
        description: "",
        featuredImage: "",
        tags: "",
        category: "",
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    } catch (err) {
      console.error("Failed to submit bookmark:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to submit bookmark. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addlink-container">
      <h2>Submit a New Bookmark</h2>

      {error && (
        <p className="message-error">
          {error}
        </p>
      )}

      {success && (
        <p className="message-success">
          {success}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="bookmark-form"
      >
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={bookmark.title}
          onChange={handleChange}
          maxLength={200}
          required
          disabled={loading}
        />

        <input
          type="url"
          name="url"
          placeholder="URL"
          value={bookmark.url}
          onChange={handleChange}
          maxLength={2048}
          required
          disabled={loading}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={bookmark.description}
          onChange={handleChange}
          maxLength={2000}
          rows="4"
          disabled={loading}
        />

        <input
          type="url"
          name="featuredImage"
          placeholder="Featured Image URL"
          value={bookmark.featuredImage}
          onChange={handleChange}
          maxLength={2048}
          disabled={loading}
        />

        <input
          type="text"
          name="tags"
          placeholder="Tags (comma separated)"
          value={bookmark.tags}
          onChange={handleChange}
          disabled={loading}
        />

        <select
          id="category"
          name="category"
          value={bookmark.category}
          onChange={handleChange}
          required
          className="category-select"
          disabled={loading || categoriesLoading}
        >
          <option value="">
            {categoriesLoading
              ? "Loading categories..."
              : "Select a Category"}
          </option>

          {categories.map((category) => (
            <option
              key={category._id}
              value={category._id}
            >
              {category.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={
            loading ||
            categoriesLoading ||
            !token
          }
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddLink;