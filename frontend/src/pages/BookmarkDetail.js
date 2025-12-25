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
      try {
        const { data } = await API.get(`/bookmarks/${id}`);
        setBookmark(data);
      } catch (err) {
        setError("Failed to load bookmark details.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookmark();
  }, [id]);

  if (loading) return <div className="bookmark-detail-loading">Loading...</div>;
  if (error) return <div className="bookmark-detail-error">{error}</div>;
  if (!bookmark) return null;

  return (
    <div className="bookmark-detail-container">
      <div className="bookmark-detail-card">
        {bookmark.featuredImage && (
          <img
            src={bookmark.featuredImage}
            alt={bookmark.title}
            className="bookmark-detail-image"
          />
        )}

        <div className="bookmark-detail-content">
          <h2 className="bookmark-detail-title">{bookmark.title}</h2>
          <p className="bookmark-detail-description">{bookmark.description}</p>

          <div className="bookmark-detail-meta">
            <p>
              <strong>Category:</strong>{" "}
              {bookmark.category?.name || "Uncategorized"}
            </p>
            {bookmark.tags && bookmark.tags.length > 0 && (
              <p>
                <strong>Tags:</strong> {bookmark.tags.join(", ")}
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

          <Link to="/" className="bookmark-detail-back">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookmarkDetail;
