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
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInitialBookmarks = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await API.get("/bookmarks", {
          params: {
            page: 1,
          },
        });

        const data = res.data;

        const initialBookmarks = Array.isArray(data?.bookmarks)
          ? data.bookmarks
          : [];

        setBookmarks(initialBookmarks);

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

    fetchInitialBookmarks();
  }, []);

  const loadMore = async () => {
    if (loadingMore || pagination.page >= pagination.pages) {
      return;
    }

    try {
      setLoadingMore(true);
      setError("");

      const nextPage = pagination.page + 1;

      const res = await API.get("/bookmarks", {
        params: {
          page: nextPage,
        },
      });

      const data = res.data;

      const newBookmarks = Array.isArray(data?.bookmarks)
        ? data.bookmarks
        : [];

      setBookmarks((currentBookmarks) => [
        ...currentBookmarks,
        ...newBookmarks,
      ]);

      setPagination({
        total: Number(data?.total) || pagination.total,
        page: Number(data?.page) || nextPage,
        pages: Number(data?.pages) || pagination.pages,
      });
    } catch (err) {
      console.error("Failed to load more bookmarks:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to load more bookmarks. Please try again."
      );
    } finally {
      setLoadingMore(false);
    }
  };

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

        {!loading && bookmarks.length > 0 && (
          <>
            <div className="bookmark-grid">
              {bookmarks.map((bookmark) => (
                <BookmarkCard
                  key={bookmark._id}
                  bookmark={bookmark}
                />
              ))}
            </div>

            <p className="home-subtext">
              Showing {bookmarks.length} of{" "}
              {pagination.total} bookmarks
            </p>

            {pagination.page < pagination.pages && (
              <div className="load-more-container">
                <button
                  type="button"
                  className="load-more-btn"
                  onClick={loadMore}
                  disabled={loadingMore}
                >
                  {loadingMore
                    ? "Loading..."
                    : "Load More"}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Home;