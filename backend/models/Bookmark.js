import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    url: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2048,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (tags) {
          return (
            Array.isArray(tags) &&
            tags.length <= 10 &&
            tags.every(
              (tag) =>
                typeof tag === "string" &&
                tag.trim().length > 0 &&
                tag.trim().length <= 50
            )
          );
        },
        message: "Tags must contain a maximum of 10 items, each up to 50 characters.",
      },
    },

    featuredImage: {
      type: String,
      default: "",
      trim: true,
      maxlength: 2048,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

export default Bookmark;