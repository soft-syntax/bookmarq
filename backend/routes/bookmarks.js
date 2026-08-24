import express from "express";
import mongoose from "mongoose";
import Bookmark from "../models/Bookmark.js";
import Category from "../models/Category.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Bookmark validation helper
|--------------------------------------------------------------------------
*/
const validateBookmarkInput = async ({
  title,
  url,
  description,
  featuredImage,
  tags,
  category,
}) => {
  const errors = {};

  // Title
  if (typeof title !== "string" || !title.trim()) {
    errors.title = "Title is required.";
  } else if (title.trim().length > 200) {
    errors.title = "Title must be 200 characters or less.";
  }

  // URL
  if (typeof url !== "string" || !url.trim()) {
    errors.url = "URL is required.";
  } else if (url.trim().length > 2048) {
    errors.url = "URL must be 2048 characters or less.";
  } else {
    try {
      const parsedUrl = new URL(url.trim());

      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        errors.url = "URL must use http or https.";
      }
    } catch {
      errors.url = "Please provide a valid URL.";
    }
  }

  // Description
  if (
    description !== undefined &&
    description !== null &&
    typeof description !== "string"
  ) {
    errors.description = "Description must be text.";
  } else if (
    typeof description === "string" &&
    description.trim().length > 2000
  ) {
    errors.description = "Description must be 2000 characters or less.";
  }

  // Featured image
  if (
    featuredImage !== undefined &&
    featuredImage !== null &&
    typeof featuredImage !== "string"
  ) {
    errors.featuredImage = "Featured image must be a URL.";
  } else if (
    typeof featuredImage === "string" &&
    featuredImage.trim()
  ) {
    if (featuredImage.trim().length > 2048) {
      errors.featuredImage =
        "Featured image URL must be 2048 characters or less.";
    } else {
      try {
        const parsedImageUrl = new URL(featuredImage.trim());

        if (!["http:", "https:"].includes(parsedImageUrl.protocol)) {
          errors.featuredImage =
            "Featured image must use http or https.";
        }
      } catch {
        errors.featuredImage = "Featured image must be a valid URL.";
      }
    }
  }

  // Tags
  if (tags !== undefined && tags !== null) {
    if (!Array.isArray(tags)) {
      errors.tags = "Tags must be an array.";
    } else if (tags.length > 10) {
      errors.tags = "You can add a maximum of 10 tags.";
    } else {
      const invalidTag = tags.find(
        (tag) =>
          typeof tag !== "string" ||
          !tag.trim() ||
          tag.trim().length > 50
      );

      if (invalidTag !== undefined) {
        errors.tags =
          "Each tag must be text between 1 and 50 characters.";
      }
    }
  }

  // Category
  if (category !== undefined && category !== null && category !== "") {
    if (!mongoose.Types.ObjectId.isValid(category)) {
      errors.category = "Invalid category.";
    } else {
      const categoryExists = await Category.exists({ _id: category });

      if (!categoryExists) {
        errors.category = "Category not found.";
      }
    }
  }

  return errors;
};

/*
|--------------------------------------------------------------------------
| Public: Get all bookmarks (Home page) with pagination
|--------------------------------------------------------------------------
*/
router.get("/", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);

    const requestedLimit = parseInt(req.query.limit, 10) || 10;

    const limit = Math.min(Math.max(requestedLimit, 1), 100);

    const skip = (page - 1) * limit;

    const bookmarks = await Bookmark.find()
      .populate("user", "name")
      .populate("category", "name color")
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
    if (!mongoose.Types.ObjectId.isValid(req.params.categoryId)) {
      return res.status(400).json({
        message: "Invalid category ID.",
      });
    }

    const bookmarks = await Bookmark.find({
      category: req.params.categoryId,
    })
      .populate("user", "name")
      .populate("category", "name color")
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
      .populate("category", "name color")
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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid bookmark ID.",
      });
    }

    const bookmark = await Bookmark.findById(req.params.id)
      .populate("user", "name")
      .populate("category", "name color");

    if (!bookmark) {
      return res.status(404).json({
        message: "Bookmark not found",
      });
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
    const {
      title,
      url,
      description,
      featuredImage,
      tags,
      category,
    } = req.body;

    const errors = await validateBookmarkInput({
      title,
      url,
      description,
      featuredImage,
      tags,
      category,
    });

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        message: "Please correct the highlighted fields.",
        errors,
      });
    }

    const newBookmark = new Bookmark({
      title: title.trim(),
      url: url.trim(),
      description:
        typeof description === "string"
          ? description.trim()
          : "",
      featuredImage:
        typeof featuredImage === "string"
          ? featuredImage.trim()
          : "",
      tags: Array.isArray(tags)
        ? tags.map((tag) => tag.trim()).filter(Boolean)
        : [],
      category: category || null,
      user: req.user.id,
    });

    await newBookmark.save();

    await newBookmark.populate([
      { path: "user", select: "name" },
      { path: "category", select: "name color" },
    ]);

    res.status(201).json(newBookmark);
  } catch (err) {
    console.error("Add bookmark error:", err);

    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid bookmark data.",
      });
    }

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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid bookmark ID.",
      });
    }

    const bookmark = await Bookmark.findById(req.params.id);

    if (!bookmark) {
      return res.status(404).json({
        message: "Bookmark not found",
      });
    }

    if (bookmark.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const {
      title,
      url,
      description,
      featuredImage,
      tags,
      category,
    } = req.body;

    const errors = await validateBookmarkInput({
      title,
      url,
      description,
      featuredImage,
      tags,
      category,
    });

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        message: "Please correct the highlighted fields.",
        errors,
      });
    }

    bookmark.title = title.trim();
    bookmark.url = url.trim();
    bookmark.description =
      typeof description === "string"
        ? description.trim()
        : "";
    bookmark.featuredImage =
      typeof featuredImage === "string"
        ? featuredImage.trim()
        : "";
    bookmark.tags = Array.isArray(tags)
      ? tags.map((tag) => tag.trim()).filter(Boolean)
      : [];
    bookmark.category = category || null;

    await bookmark.save();

    await bookmark.populate([
      { path: "user", select: "name" },
      { path: "category", select: "name color" },
    ]);

    res.json(bookmark);
  } catch (err) {
    console.error("Update bookmark error:", err);

    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid bookmark data.",
      });
    }

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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid bookmark ID.",
      });
    }

    const bookmark = await Bookmark.findById(req.params.id);

    if (!bookmark) {
      return res.status(404).json({
        message: "Bookmark not found",
      });
    }

    if (bookmark.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await bookmark.deleteOne();

    res.json({
      message: "Bookmark deleted",
    });
  } catch (err) {
    console.error("Delete bookmark error:", err);

    res.status(500).json({
      message: "Could not delete bookmark. Please try again.",
    });
  }
});

export default router;