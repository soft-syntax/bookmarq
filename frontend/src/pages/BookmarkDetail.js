import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../utils/api";
import "../styles/BookmarkDetail.css";

const BookmarkDetail = () => {
  const { id } = useParams();

  const [bookmark, setBookmark] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookmark = async () => {
      setLoading(true);
      setError("");
      setBookmark(null);

      if (!id) {
        setError("Invalid bookmark.");
        setLoading(false);
        return;
      }

      try {
        const { data } = await API.get(`/bookmarks/${id}`);

        if (!data || typeof data !== "object") {
          setError("Bookmark not found.");
          return;
        }

        setBookmark(data);
      } catch (err) {
        console.error("Failed to load bookmark:", err);

        setError(
          err?.response?.data?.message ||
            "Failed to load bookmark details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookmark();
  }, [id]);

  if (loading) {
    return (
      <div className="bookmark-detail-loading">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bookmark-detail-error">
        <p>{error}</p>

        <Link to="/" className="bookmark-detail-back">
          ← Back to Home
        </Link>
      </div>
    );
  }

  if (!bookmark) {
    return (
      <div className="bookmark-detail-error">
        <p>Bookmark not found.</p>

        <Link to="/" className="bookmark-detail-back">
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bookmark-detail-container">
      <div className="bookmark-detail-card">
        {bookmark.featuredImage && (
          <img
            src={bookmark.featuredImage}
            alt={bookmark.title || "Bookmark"}
            className="bookmark-detail-image"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        )}

        <div className="bookmark-detail-content">
          <h2 className="bookmark-detail-title">
            {bookmark.title}
          </h2>

          {bookmark.description && (
            <p className="bookmark-detail-description">
              {bookmark.description}
            </p>
          )}

          <div className="bookmark-detail-meta">
            <p>
              <strong>Category:</strong>{" "}
              {bookmark.category?.name || "Uncategorized"}
            </p>

            {Array.isArray(bookmark.tags) &&
              bookmark.tags.length > 0 && (
                <p>
                  <strong>Tags:</strong>{" "}
                  {bookmark.tags.join(", ")}
                </p>
              )}
          </div>

          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bookmark-detail-button"
          >
            Visit Website
          </a>

          <Link
            to="/"
            className="bookmark-detail-back"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookmarkDetail;