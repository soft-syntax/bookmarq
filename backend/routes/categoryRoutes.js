import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

// List all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// NEW: Get a single category by ID
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (err) {
    // Malformed ObjectId also lands here — treat as "not found" rather than 500
    res.status(404).json({ message: "Category not found" });
  }
});

export default router;