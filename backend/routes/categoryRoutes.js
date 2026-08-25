import express from "express";
import mongoose from "mongoose";
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

// Get a single category by ID

router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid category ID",
      });
    }

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.json(category);
  } catch (err) {
    console.error("Fetch category error:", err);

    res.status(500).json({
      message: "Could not load category.",
    });
  }
});

export default router;