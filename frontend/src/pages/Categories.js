import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../utils/api";
import "../styles/Categories.css";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <p>Loading categories...</p>;

  return (
    <div className="categories-container">
      <h2>Browse Categories</h2>
      <div className="categories-grid">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="category-card"
            style={{ backgroundColor: cat.color || "#eee" }}
            onClick={() => navigate(`/category/${cat._id}`)}
          >
            <h3>{cat.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
