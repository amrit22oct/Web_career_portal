import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import recruiterRoutes from "./routes/recruiterRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// === Environment Setup ===
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 5001;

// === Allowed Origins for CORS ===
const allowedOrigins = [
  "http://localhost:5173", // Vite frontend
  process.env.FRONTEND_URL // Production frontend (if set)
];

// === Middleware ===
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS policy: Not allowed by server"), false);
  },
  credentials: true
}));

// === Content Security Policy (CSP) Header ===
const connectSrc = allowedOrigins.join(" ");
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    `
      default-src 'self';
      style-src 'self' https://fonts.googleapis.com;
      font-src 'self' https://fonts.gstatic.com;
      script-src 'self';
      img-src 'self' data:;
      connect-src ${connectSrc};
      object-src 'none';
      frame-src 'none';
    `.replace(/\s{2,}/g, " ").trim()
  );
  next();
});

// === Static Files ===
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// === Routes ===
app.use("/api/auth", authRoutes);
app.use("/api/auth", profileRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/admin", adminRoutes);

// === Serve Frontend in Production ===
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

// === Global Error Handler ===
app.use(errorHandler);

// === Start Server ===
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
