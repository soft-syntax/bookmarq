import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.js";
import bookmarkRoutes from "./routes/bookmarks.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import connectDB from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --------------------
// CORS
// --------------------
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // only allow your frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// --------------------
// Security headers
// --------------------
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'", process.env.FRONTEND_URL],
        imgSrc: ["'self'", "data:"],
      },
    },
  })
);

// --------------------
// JSON parser
// --------------------
app.use(express.json());

// --------------------
// Rate limiter
// --------------------
app.set("trust proxy", 1); // if behind proxy
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// --------------------
// Routes
// --------------------
app.use("/api/auth", authRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/categories", categoryRoutes);

// --------------------
// Test route
// --------------------
app.get("/", (req, res) => {
  res.send("BookmarQ backend is running...");
});

// --------------------
// Start server
// --------------------
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();
