import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/api";
import BookmarkCard from "../components/BookmarkCard";
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
      setCategoryName("");
      setBookmarks([]);

      try {
        const [categoryResult, bookmarksResult] =
          await Promise.allSettled([
            API.get(`/categories/${id}`),
            API.get(`/bookmarks/category/${id}`),
          ]);

        // -----------------------------
        // Category
        // -----------------------------
        if (categoryResult.status === "fulfilled") {
          const category = categoryResult.value.data;

          setCategoryName(
            typeof category?.name === "string"
              ? category.name
              : "Category"
          );
        } else {
          console.error(
            "Failed to load category:",
            categoryResult.reason
          );

          setError("Could not load this category.");
          return;
        }

        // -----------------------------
        // Bookmarks
        // -----------------------------
        if (bookmarksResult.status === "fulfilled") {
          const data = bookmarksResult.value.data;

          setBookmarks(Array.isArray(data) ? data : []);
        } else {
          console.error(
            "Failed to load bookmarks:",
            bookmarksResult.reason
          );

          setError(
            "Could not load bookmarks for this category."
          );
        }
      } catch (err) {
        console.error(
          "Category bookmarks error:",
          err
        );

        setError(
          "Something went wrong while loading this category."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    } else {
      setError("Invalid category.");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="category-bookmarks-container">
        <p>Loading bookmarks...</p>
      </div>
    );
  }

  if (error && !categoryName) {
    return (
      <div className="category-bookmarks-container">
        <p className="message-error">{error}</p>
      </div>
    );
  }

  return (
    <div className="category-bookmarks-container">
      <h2>{categoryName} Bookmarks</h2>

      {error && (
        <p className="message-error">
          {error}
        </p>
      )}

      {!error && bookmarks.length === 0 && (
        <p>No bookmarks in this category yet.</p>
      )}

      {!error && bookmarks.length > 0 && (
        <div className="bookmarks-grid">
          {bookmarks.map((bookmark) => (
            <BookmarkCard
              key={bookmark._id}
              bookmark={bookmark}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryBookmarks;