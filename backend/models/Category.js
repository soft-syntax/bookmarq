import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 100,
  },

  color: {
    type: String,
    default: "#007bff",
    trim: true,
    match: [
      /^#[0-9A-Fa-f]{6}$/,
      "Color must be a valid hex color",
    ],
  },
});

export default mongoose.model("Category", categorySchema);