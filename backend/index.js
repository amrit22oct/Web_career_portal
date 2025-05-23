import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";

import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import recruiterRoutes from "./routes/recruiterRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5001;
const FRONTEND_URL = process.env.FRONTEND_URL;
const app = express();

// Allow these origins in development
const allowedOrigins = ["http://localhost:5173", process.env.FRONTEND_URL];

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// CORS only needed for development
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(
        new Error(`CORS policy: Not allowed by server - Origin: ${origin}`),
        false
      );
    },
    credentials: true,
  })
);

// Security headers
const connectSrc = allowedOrigins.join(" ");
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    `
      default-src 'self';
      style-src 'self' https://fonts.googleapis.com 'unsafe-inline';
      font-src 'self' https://fonts.gstatic.com;
      script-src 'self';
      img-src 'self' data:;
      connect-src 'self' ${connectSrc};
      object-src 'none';
      frame-src 'none';
    `
      .replace(/\s{2,}/g, " ")
      .trim()
  );
  next();
});

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/auth", profileRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/admin", adminRoutes);

// Error handler
app.use(errorHandler);

// Serve frontend in production


const startServer = async () => {
  try {
    await connectDB();

    // Start frontend automatically
    const frontendPath = path.resolve(__dirname, "../frontend");
    const frontendProcess = exec("npm run dev", { cwd: frontendPath });

    frontendProcess.stdout.on("data", (data) => {
      process.stdout.write(`[FRONTEND] ${data}`);
    });

    frontendProcess.stderr.on("data", (data) => {
      process.stderr.write(`[FRONTEND ERROR] ${data}`);
    });

    frontendProcess.on("close", (code) => {
      console.log(`Frontend process exited with code ${code}`);
    });

    app.listen(PORT, () => {
      console.log(`🚀 Backend running on http://localhost:${PORT}`);
      console.log(`🖥️ Frontend running on http:${FRONTEND_URL}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
