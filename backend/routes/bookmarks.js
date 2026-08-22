import express from "express";
import Bookmark from "../models/Bookmark.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public: Get all bookmarks (Home page) with pagination
|--------------------------------------------------------------------------
*/
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const bookmarks = await Bookmark.find()
      .populate("user", "name")
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Bookmark.countDocuments();

    res.json({
      bookmarks,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Fetch bookmarks error:", err);
    res.status(500).json({
      message: "Could not load bookmarks. Please try again.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| Public: Get bookmarks by category
|--------------------------------------------------------------------------
| IMPORTANT: must be before "/:id"
*/
router.get("/category/:categoryId", async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({
      category: req.params.categoryId,
    })
      .populate("user", "name")
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.json(bookmarks);
  } catch (err) {
    console.error("Fetch category bookmarks error:", err);
    res.status(500).json({
      message: "Could not load category bookmarks.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| Protected: Get current user's bookmarks
|--------------------------------------------------------------------------
*/
router.get("/mine", authMiddleware, async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({
      user: req.user.id,
    })
      .populate("user", "name")
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.json(bookmarks);
  } catch (err) {
    console.error("Fetch user bookmarks error:", err);
    res.status(500).json({
      message: "Could not load your bookmarks.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| Public: Get single bookmark
|--------------------------------------------------------------------------
*/
router.get("/:id", async (req, res) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id)
      .populate("user", "name")
      .populate("category", "name");

    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    res.json(bookmark);
  } catch (err) {
    console.error("Fetch single bookmark error:", err);
    res.status(500).json({
      message: "Could not load bookmark.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| Protected: Add bookmark
|--------------------------------------------------------------------------
*/
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, url, description, featuredImage, tags, category } = req.body;

    const newBookmark = new Bookmark({
      title,
      url,
      description,
      featuredImage: featuredImage || "",
      tags: tags?.map(t => t.trim()).filter(Boolean) || [],
      category: category || null,
      user: req.user.id,
    });

    await newBookmark.save();

    await newBookmark.populate([
      { path: "user", select: "name" },
      { path: "category", select: "name" },
    ]);

    res.status(201).json(newBookmark);
  } catch (err) {
    console.error("Add bookmark error:", err);
    res.status(500).json({
      message: "Could not add bookmark. Please try again.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| Protected: Update bookmark (OWNER ONLY)
|--------------------------------------------------------------------------
*/
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);

    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    if (bookmark.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { title, url, description, featuredImage, tags, category } = req.body;

    bookmark.title = title;
    bookmark.url = url;
    bookmark.description = description;
    bookmark.featuredImage = featuredImage || "";
    bookmark.tags = tags?.map(t => t.trim()).filter(Boolean) || [];
    bookmark.category = category || null;

    await bookmark.save();

    await bookmark.populate([
      { path: "user", select: "name" },
      { path: "category", select: "name" },
    ]);

    res.json(bookmark);
  } catch (err) {
    console.error("Update bookmark error:", err);
    res.status(500).json({
      message: "Could not update bookmark. Please try again.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| Protected: Delete bookmark (OWNER ONLY)
|--------------------------------------------------------------------------
*/
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);

    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    if (bookmark.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await bookmark.deleteOne();

    res.json({ message: "Bookmark deleted" });
  } catch (err) {
    console.error("Delete bookmark error:", err);
    res.status(500).json({
      message: "Could not delete bookmark. Please try again.",
    });
  }
});

export default router;
