import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/api";
import "../styles/CategoryBookmarks.css";

const CategoryBookmarks = () => {
  const { id } = useParams();
  const [bookmarks, setBookmarks] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const catRes = await API.get(`/categories/${id}`);
        setCategoryName(catRes.data.name);

        const res = await API.get(`/bookmarks/category/${id}`);
        setBookmarks(res.data);
      } catch (err) {
        console.error("Failed to load bookmarks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, [id]);

  if (loading) return <p>Loading bookmarks...</p>;

  return (
    <div className="category-bookmarks-container">
      <h2>{categoryName} Bookmarks</h2>
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
