import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./models/Category.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const defaultCategories = [
  { name: "Technology", color: "#0d6efd" },
  { name: "Business", color: "#198754" },
  { name: "Education", color: "#ffc107" },
  { name: "Design", color: "#e83e8c" },
  { name: "Health", color: "#dc3545" },
  { name: "Finance", color: "#20c997" },
  { name: "Productivity", color: "#0dcaf0" },
  { name: "Lifestyle", color: "#6610f2" },
  { name: "Marketing", color: "#6f42c1" },
  { name: "Development", color: "#17a2b8" },
  { name: "Science", color: "#198754" },
  { name: "Sports", color: "#4caf50" },
  { name: "Travel", color: "#0d6efd" },
  { name: "Entertainment", color: "#e91e63" },
  { name: "Gaming", color: "#2196f3" },
  { name: "Food", color: "#ff7043" },
  { name: "News", color: "#009688" },
  { name: "Music", color: "#9c27b0" },
  { name: "Art", color: "#ff69b4" },
  { name: "Photography", color: "#f06292" },
  { name: "Other", color: "#999999" },
];

const seed = async () => {
  try {
    await Category.deleteMany();
    await Category.insertMany(defaultCategories);
    console.log("✅ Default categories with colors added!");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding categories:", err);
    process.exit(1);
  }
};

seed();
