import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/api";
import "../styles/CategoryBookmarks.css";

const CategoryBookmarks = () => {
  const { id } = useParams();
  const [bookmarks, setBookmarks] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      const [categoryResult, bookmarksResult] = await Promise.allSettled([
        API.get(`/categories/${id}`),
        API.get(`/bookmarks/category/${id}`),
      ]);

      if (categoryResult.status === "fulfilled") {
        setCategoryName(categoryResult.value.data.name);
      } else {
        console.error("Failed to load category:", categoryResult.reason);
        setCategoryName("Category");
      }

      if (bookmarksResult.status === "fulfilled") {
        setBookmarks(bookmarksResult.value.data);
      } else {
        console.error("Failed to load bookmarks:", bookmarksResult.reason);
        setError("Could not load bookmarks for this category.");
      }

      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading) return <p>Loading bookmarks...</p>;

  return (
    <div className="category-bookmarks-container">
      <h2>{categoryName} Bookmarks</h2>
      {error && <p className="message-error">{error}</p>}
      <div className="bookmarks-grid">
        {bookmarks.length === 0 ? (
          <p>No bookmarks in this category yet.</p>
        ) : (
          bookmarks.map((bm) => (
            <div key={bm._id} className="bookmark-card">
              <h3>{bm.title}</h3>
              <a href={bm.url} target="_blank" rel="noreferrer">
                Visit
              </a>
              <p>{bm.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryBookmarks;