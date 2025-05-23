import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Routes & Middleware
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import recruiterRoutes from "./routes/recruiterRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { connectDB } from "./config/db.js";

// === Initial Setup ===
dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5001;
const isProd = process.env.NODE_ENV === "production";

let CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
if (isProd && !process.env.CLIENT_URL) {
  console.warn("⚠️ Warning: CLIENT_URL is not explicitly set in production. Ensure your deployment environment handles this correctly.");
}

const allowedOrigins = [CLIENT_URL, "http://localhost:5173"].filter(Boolean);
let connectSrc = `'self'`;
if (!isProd) {
  connectSrc += ` ${CLIENT_URL}`;
}

// === Middleware ===
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    `
      default-src 'self';
      style-src 'self' https://fonts.googleapis.com;
      style-src-elem 'self' https://fonts.googleapis.com;
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

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS policy: Not allowed by server"), false);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// === API Routes ===
app.use("/api/auth", authRoutes);
app.use("/api/auth", profileRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/admin", adminRoutes);

// === Serve Frontend in Production ===
if (isProd) {
  const frontendPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(frontendPath, "index.html"));
  });
}

// === Error Handler ===
app.use(errorHandler);

// === Connect to DB and Start Server ===
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
