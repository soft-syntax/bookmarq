import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API, { getCategories } from "../utils/api";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [categories, setCategories] = useState([]);

  const [newBookmark, setNewBookmark] = useState({
    title: "",
    url: "",
    description: "",
    featuredImage: "",
    category: "",
    tags: "",
  });

  const [editingBookmark, setEditingBookmark] = useState(null);
  const [editedBookmark, setEditedBookmark] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const { token } = useContext(AuthContext);
  const canEdit = !!token;

  useEffect(() => {
    if (token) {
      fetchBookmarks();
    }

    fetchCategories();
  }, [token]);

  const fetchBookmarks = async () => {
    try {
      const res = await API.get("/bookmarks/mine");
      setBookmarks(res.data);
    } catch (err) {
      setError("Failed to load bookmarks");
      setTimeout(() => setError(""), 3000);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  const handleChange = (e) => {
    setNewBookmark({
      ...newBookmark,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditChange = (e) => {
    setEditedBookmark({
      ...editedBookmark,
      [e.target.name]: e.target.value,
    });
  };

  const addBookmark = async (e) => {
    e.preventDefault();

    if (actionLoading) return;

    setActionLoading(true);
    setError("");

    try {
      const payload = {
        ...newBookmark,
        tags: newBookmark.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };

      await API.post("/bookmarks", payload);

      setNewBookmark({
        title: "",
        url: "",
        description: "",
        featuredImage: "",
        category: "",
        tags: "",
      });

      setSuccess("Bookmark added successfully!");

      await fetchBookmarks();

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to add bookmark"
      );

      setTimeout(() => setError(""), 3000);
    } finally {
      setActionLoading(false);
    }
  };

  const deleteBookmark = async (id) => {
    if (actionLoading) return;

    setActionLoading(true);
    setError("");

    try {
      await API.delete(`/bookmarks/${id}`);

      setBookmarks((currentBookmarks) =>
        currentBookmarks.filter((b) => b._id !== id)
      );

      setSuccess("Bookmark deleted!");

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Error deleting bookmark"
      );

      setTimeout(() => setError(""), 3000);
    } finally {
      setActionLoading(false);
    }
  };

  const startEditing = (bookmark) => {
    if (actionLoading) return;

    setEditingBookmark(bookmark._id);

    setEditedBookmark({
      ...bookmark,
      category: bookmark.category?._id || "",
      tags: bookmark.tags.join(", "),
    });
  };

  const saveEdit = async (id) => {
    if (actionLoading) return;

    if (
      !editedBookmark.title?.trim() ||
      !editedBookmark.url?.trim()
    ) {
      setError("Title and URL are required");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setActionLoading(true);
    setError("");

    try {
      const payload = {
        ...editedBookmark,
        tags: editedBookmark.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };

      await API.put(`/bookmarks/${id}`, payload);

      setEditingBookmark(null);
      setEditedBookmark({});

      setSuccess("Bookmark updated!");

      await fetchBookmarks();

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update bookmark"
      );

      setTimeout(() => setError(""), 3000);
    } finally {
      setActionLoading(false);
    }
  };

  const cancelEdit = () => {
    if (actionLoading) return;

    setEditingBookmark(null);
    setEditedBookmark({});
  };

  return (
    <div className="dashboard-container">
      <h2>Your Dashboard</h2>

      {canEdit && (
        <form onSubmit={addBookmark} className="bookmark-form">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newBookmark.title}
            onChange={handleChange}
            maxLength={200}
            required
            disabled={actionLoading}
          />

          <input
            type="url"
            name="url"
            placeholder="URL"
            value={newBookmark.url}
            onChange={handleChange}
            maxLength={2048}
            required
            disabled={actionLoading}
          />

          <input
            type="text"
            name="description"
            placeholder="Description"
            value={newBookmark.description}
            onChange={handleChange}
            maxLength={2000}
            disabled={actionLoading}
          />

          <select
            name="category"
            value={newBookmark.category}
            onChange={handleChange}
            disabled={actionLoading}
          >
            <option value="">Select Category</option>

            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>

          <input
            type="url"
            name="featuredImage"
            placeholder="Featured Image URL"
            value={newBookmark.featuredImage}
            onChange={handleChange}
            maxLength={2048}
            disabled={actionLoading}
          />

          <input
            type="text"
            name="tags"
            placeholder="Tags (comma separated)"
            value={newBookmark.tags}
            onChange={handleChange}
            disabled={actionLoading}
          />

          <button type="submit" disabled={actionLoading}>
            {actionLoading ? "Adding..." : "Add"}
          </button>
        </form>
      )}

      {error && <p className="message-error">{error}</p>}
      {success && <p className="message-success">{success}</p>}

      <div className="bookmark-grid">
        {bookmarks.map((b) => (
          <div key={b._id} className="bookmark-card">
            {editingBookmark === b._id ? (
              <>
                <input
                  type="text"
                  name="title"
                  value={editedBookmark.title}
                  onChange={handleEditChange}
                  placeholder="Title"
                  maxLength={200}
                  required
                  disabled={actionLoading}
                />

                <input
                  type="url"
                  name="url"
                  value={editedBookmark.url}
                  onChange={handleEditChange}
                  placeholder="URL"
                  maxLength={2048}
                  required
                  disabled={actionLoading}
                />

                <input
                  type="text"
                  name="description"
                  value={editedBookmark.description}
                  onChange={handleEditChange}
                  placeholder="Description"
                  maxLength={2000}
                  disabled={actionLoading}
                />

                <select
                  name="category"
                  value={editedBookmark.category || ""}
                  onChange={handleEditChange}
                  disabled={actionLoading}
                >
                  <option value="">Select Category</option>

                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                <input
                  type="url"
                  name="featuredImage"
                  value={editedBookmark.featuredImage}
                  onChange={handleEditChange}
                  placeholder="Featured Image URL"
                  maxLength={2048}
                  disabled={actionLoading}
                />

                <input
                  type="text"
                  name="tags"
                  value={editedBookmark.tags}
                  onChange={handleEditChange}
                  placeholder="Tags (comma separated)"
                  disabled={actionLoading}
                />

                <button
                  type="button"
                  className="save-btn"
                  onClick={() => saveEdit(b._id)}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Saving..." : "Save"}
                </button>

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={cancelEdit}
                  disabled={actionLoading}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                {b.featuredImage && (
                  <img
                    src={b.featuredImage}
                    alt={b.title}
                    className="bookmark-image"
                  />
                )}

                <h3>{b.title}</h3>

                <p>{b.description}</p>

                <p className="bookmark-meta">
                  <span>
                    By: {b.user?.name || "Anonymous"}
                  </span>{" "}
                  |{" "}
                  <span>
                    {new Date(b.createdAt).toLocaleString()}
                  </span>
                </p>

                <p className="bookmark-tags">
                  {b.tags.join(", ")}
                </p>

                <div className="bookmark-actions">
                  <a
                    href={b.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit
                  </a>

                  <button
                    className="edit-btn"
                    onClick={() => startEditing(b)}
                    disabled={actionLoading}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteBookmark(b._id)}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Processing..." : "Delete"}
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;