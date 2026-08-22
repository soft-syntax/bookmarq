import React, { useEffect, useState } from "react";
import API from "../utils/api";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [newBookmark, setNewBookmark] = useState({
    title: "",
    url: "",
    description: "",
    featuredImage: "",
    tags: "",
  });
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [editedBookmark, setEditedBookmark] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");
  const canEdit = !!token;

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const res = await API.get("/bookmarks");
      setBookmarks(res.data.bookmarks);
    } catch (err) {
      setError("Failed to load bookmarks");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleChange = (e) => {
    setNewBookmark({ ...newBookmark, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditedBookmark({ ...editedBookmark, [e.target.name]: e.target.value });
  };

  const addBookmark = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newBookmark,
        tags: newBookmark.tags.split(",").map((t) => t.trim()).filter(Boolean),
      };
      await API.post("/bookmarks", payload);
      setNewBookmark({ title: "", url: "", description: "", featuredImage: "", tags: "" });
      setSuccess("Bookmark added successfully!");
      fetchBookmarks();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to add bookmark");
      setTimeout(() => setError(""), 3000);
    }
  };

  const deleteBookmark = async (id) => {
    try {
      await API.delete(`/bookmarks/${id}`);
      setBookmarks(bookmarks.filter((b) => b._id !== id));
      setSuccess("Bookmark deleted!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Error deleting bookmark");
      setTimeout(() => setError(""), 3000);
    }
  };

  const startEditing = (bookmark) => {
    setEditingBookmark(bookmark._id);
    setEditedBookmark({ ...bookmark, tags: bookmark.tags.join(", ") });
  };

  const saveEdit = async (id) => {
    try {
      const payload = {
        ...editedBookmark,
        tags: editedBookmark.tags.split(",").map((t) => t.trim()).filter(Boolean),
      };
      await API.put(`/bookmarks/${id}`, payload);
      setEditingBookmark(null);
      setEditedBookmark({});
      setSuccess("Bookmark updated!");
      fetchBookmarks();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to update bookmark");
      setTimeout(() => setError(""), 3000);
    }
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
            required
          />
          <input
            type="url"
            name="url"
            placeholder="URL"
            value={newBookmark.url}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={newBookmark.description}
            onChange={handleChange}
          />
          <input
            type="url"
            name="featuredImage"
            placeholder="Featured Image URL"
            value={newBookmark.featuredImage}
            onChange={handleChange}
          />
          <input
            type="text"
            name="tags"
            placeholder="Tags (comma separated)"
            value={newBookmark.tags}
            onChange={handleChange}
          />
          <button type="submit">Add</button>
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
                />
                <input
                  type="url"
                  name="url"
                  value={editedBookmark.url}
                  onChange={handleEditChange}
                  placeholder="URL"
                />
                <input
                  type="text"
                  name="description"
                  value={editedBookmark.description}
                  onChange={handleEditChange}
                  placeholder="Description"
                />
                <input
                  type="url"
                  name="featuredImage"
                  value={editedBookmark.featuredImage}
                  onChange={handleEditChange}
                  placeholder="Featured Image URL"
                />
                <input
                  type="text"
                  name="tags"
                  value={editedBookmark.tags}
                  onChange={handleEditChange}
                  placeholder="Tags (comma separated)"
                />
                <button className="save-btn" onClick={() => saveEdit(b._id)}>Save</button>
                <button className="cancel-btn" onClick={() => setEditingBookmark(null)}>Cancel</button>
              </>
            ) : (
              <>
                {b.featuredImage && <img src={b.featuredImage} alt={b.title} className="bookmark-image" />}
                <h3>{b.title}</h3>
                <p>{b.description}</p>
                <p className="bookmark-meta">
                  <span>By: {b.user?.name || "Anonymous"}</span> |{" "}
                  <span>{new Date(b.createdAt).toLocaleString()}</span>
                </p>
                <p className="bookmark-tags">{b.tags.join(", ")}</p>
                <div className="bookmark-actions">
                  <a href={b.url} target="_blank" rel="noopener noreferrer">Visit</a>
                  <button className="edit-btn" onClick={() => startEditing(b)}>Edit</button>
                  <button className="delete-btn" onClick={() => deleteBookmark(b._id)}>Delete</button>
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
