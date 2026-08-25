import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Bookmark } from "lucide-react";

import API from "../utils/api";
import BookmarkCard from "../components/BookmarkCard";
import { AuthContext } from "../context/AuthContext";

import "../styles/Home.css";

const Home = () => {
  const { token } = useContext(AuthContext);

  const [bookmarks, setBookmarks] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await API.get("/bookmarks");

        const data = res.data;

        setBookmarks(
          Array.isArray(data?.bookmarks) ? data.bookmarks : []
        );

        setPagination({
          total: Number(data?.total) || 0,
          page: Number(data?.page) || 1,
          pages: Number(data?.pages) || 0,
        });
      } catch (err) {
        console.error("Failed to load bookmarks:", err);

        setBookmarks([]);
        setError(
          err?.response?.data?.message ||
            "Failed to load bookmarks. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-shape"></div>

        <div className="hero-content">
          <Bookmark className="hero-icon" size={48} />

          <h1 className="hero-title">
            Discover & Share Bookmarks
          </h1>

          <p className="hero-subtitle">
            A place where everyone can save, explore, and get
            inspired by curated links.
          </p>

          <Link
            to={token ? "/add-link" : "/login"}
            className="hero-btn"
          >
            <Plus size={18} />
            {token ? "Add Your Bookmark" : "Add Bookmark"}
          </Link>
        </div>
      </section>

      {/* Bookmark Section */}
      <section className="bookmarks-section">
        <h2 className="home-heading">
          Explore Recent Bookmarks
        </h2>

        <p className="home-subtext">
          Browse the latest shared links!
        </p>

        {loading && (
          <p className="home-status">
            Loading bookmarks...
          </p>
        )}

        {!loading && error && (
          <p className="message-error">
            {error}
          </p>
        )}

        {!loading && !error && bookmarks.length === 0 && (
          <p className="home-status">
            No bookmarks have been added yet.
          </p>
        )}

        {!loading && !error && bookmarks.length > 0 && (
          <>
            <div className="bookmark-grid">
              {bookmarks.map((bookmark) => (
                <BookmarkCard
                  key={bookmark._id}
                  bookmark={bookmark}
                />
              ))}
            </div>

            {pagination.total > 0 && (
              <p className="home-subtext">
                Showing {bookmarks.length} of{" "}
                {pagination.total} bookmarks
              </p>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Home;