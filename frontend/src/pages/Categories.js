import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../utils/api";
import "../styles/Categories.css";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getCategories();

        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load categories:", err);

        setCategories([]);
        setError(
          err?.response?.data?.message ||
            "Failed to load categories. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="categories-container">
        <p>Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="categories-container">
      <h2>Browse Categories</h2>

      {error && (
        <p className="message-error">
          {error}
        </p>
      )}

      {!error && categories.length === 0 && (
        <p>No categories available yet.</p>
      )}

      {!error && categories.length > 0 && (
        <div className="categories-grid">
          {categories.map((category) => (
            <button
              key={category._id}
              type="button"
              className="category-card"
              style={{
                backgroundColor:
                  typeof category.color === "string" &&
                  category.color
                    ? category.color
                    : "#eee",
              }}
              onClick={() =>
                navigate(`/category/${category._id}`)
              }
            >
              <h3>{category.name}</h3>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;