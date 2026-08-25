import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.js";
import bookmarkRoutes from "./routes/bookmarks.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import contactRoutes from "./routes/contact.js";
import connectDB from "./db.js";

dotenv.config();

const requiredEnvVars = [
  "MONGO_URI",
  "JWT_SECRET",
  "FRONTEND_URL",
  "RESEND_API_KEY",
  "EMAIL_FROM",
];

for (const variable of requiredEnvVars) {
  if (!process.env[variable]) {
    throw new Error(`Missing required environment variable: ${variable}`);
  }
}

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
app.use(express.json({ limit: "1mb" }));
// --------------------
// Rate limiter
// --------------------
app.set("trust proxy", 1); // if behind proxy
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later.",
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many authentication attempts. Please try again later.",
});

app.use(limiter);

// --------------------
// Routes
// --------------------
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/contact", contactRoutes);
// --------------------
// Test route
// --------------------
app.get("/", (req, res) => {
  res.send("BookmarQ backend is running...");
});
// --------------------
// Global error handler
// --------------------
app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);

  res.status(500).json({
    message: "Internal server error. Please try again later.",
  });
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
