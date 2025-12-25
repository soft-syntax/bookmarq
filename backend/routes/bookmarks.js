import express from "express";
import Bookmark from "../models/Bookmark.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// --------------------
// Public: Get all bookmarks
// --------------------
router.get("/", async (req, res) => {
  try {
    const bookmarks = await Bookmark.find()
      .populate("user", "name")
      .populate("category", "name") // include category info
      .sort({ createdAt: -1 });

    res.json(bookmarks);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// --------------------
// Public: Get single bookmark by ID
// --------------------
router.get("/:id", async (req, res) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id)
      .populate("user", "name")
      .populate("category", "name");

    if (!bookmark)
      return res.status(404).json({ message: "Bookmark not found" });

    res.json(bookmark);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookmark", error: err.message });
  }
});

// --------------------
// Protected: Add new bookmark
// --------------------
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, url, description, featuredImage, tags, category } = req.body;
    const userId = req.user.id;

    const newBookmark = new Bookmark({
      title,
      url,
      description,
      featuredImage: featuredImage || "",
      tags: tags?.map((t) => t.trim()).filter(Boolean) || [],
      category: category || null, // new field for category
      user: userId,
    });

    await newBookmark.save();
    await newBookmark.populate("user", "name");
    await newBookmark.populate("category", "name");

    res.status(201).json(newBookmark);
  } catch (err) {
    res.status(500).json({ message: "Failed to add bookmark", error: err.message });
  }
});

// --------------------
// Protected: Update bookmark
// --------------------
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, url, description, featuredImage, tags, category } = req.body;

    const updatedBookmark = await Bookmark.findByIdAndUpdate(
      req.params.id,
      {
        title,
        url,
        description,
        featuredImage: featuredImage || "",
        tags: tags?.map((t) => t.trim()).filter(Boolean) || [],
        category: category || null,
      },
      { new: true }
    )
      .populate("user", "name")
      .populate("category", "name");

    res.json(updatedBookmark);
  } catch (err) {
    res.status(500).json({ message: "Failed to update bookmark", error: err.message });
  }
});

// --------------------
// Protected: Delete bookmark
// --------------------
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Bookmark.findByIdAndDelete(req.params.id);
    res.json({ message: "Bookmark deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete bookmark", error: err.message });
  }
});

// --------------------
// Public: Get bookmarks by category
// --------------------
router.get("/category/:categoryId", async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ category: req.params.categoryId })
      .populate("user", "name")
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.json(bookmarks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching category bookmarks", error: err.message });
  }
});

export default router;
