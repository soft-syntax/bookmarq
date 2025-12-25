import React from "react";
import "../styles/BookmarkCard.css";

const BookmarkCard = ({ bookmark }) => {
  const { title, url, description, featuredImage, tags, category } = bookmark;

  return (
    <div className="bookmark-card">
      {featuredImage && (
        <img src={featuredImage} alt={title} className="bookmark-image" />
      )}

      <div className="bookmark-content">
        <h3>
          <a href={url} target="_blank" rel="noopener noreferrer">
            {title}
          </a>
        </h3>

        {description && <p>{description}</p>}

        {/* ✅ Category Tag */}
        {category && (
          <span
            className="bookmark-category"
            style={{
              backgroundColor: category.color || "#777",
              color: "#fff",
              padding: "4px 10px",
              borderRadius: "12px",
              fontSize: "0.8rem",
              marginRight: "8px",
              display: "inline-block",
            }}
          >
            {category.name}
          </span>
        )}

        {/* ✅ Tags */}
        {tags && tags.length > 0 && (
          <div className="bookmark-tags">
            {tags.map((tag, index) => (
              <span key={index} className="tag">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarkCard;
