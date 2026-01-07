// src/pages/Home.js
import React, { useEffect, useState } from "react";
import API from "../utils/api";
import BookmarkCard from "../components/BookmarkCard";
import "../styles/Home.css";
import { Link } from "react-router-dom";
import { Plus, Bookmark } from "lucide-react";

const Home = () => {
  const [bookmarks, setBookmarks] = useState({ bookmarks: [], total: 0, page: 1, pages: 0 });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await API.get("/bookmarks");
        setBookmarks(res.data.bookmarks);
      } catch (err) {
        console.error("Failed to load bookmarks", err);
      }
    };
    fetchBookmarks();
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-shape">
        </div>

        <div className="hero-content">
          <Bookmark className="hero-icon" size={48} />
          <h1 className="hero-title">Discover & Share Bookmarks</h1>
          <p className="hero-subtitle">
            A place where everyone can save, explore, and get inspired by curated links.
          </p>

          <Link to={token ? "/add-link" : "/login"} className="hero-btn">
            <Plus size={18} />
            {token ? "Add Your Bookmark" : "Add Bookmark"}
          </Link>
        </div>
      </section>


      {/* Bookmark Section */}
      <section className="bookmarks-section">
        <h2 className="home-heading">Explore Recent Bookmarks</h2>
        <p className="home-subtext">
          Browse the latest shared links!...
        </p>

        <div className="bookmark-grid">
          {Array.isArray(bookmarks) &&
            bookmarks.map((bookmark) => (
              <BookmarkCard key={bookmark._id} bookmark={bookmark} />
            ))}
        </div>


      </section>
    </div>
  );
};

export default Home;
