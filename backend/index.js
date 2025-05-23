import express from "express";
import dotenv from "dotenv";
dotenv.config();

import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import recruiterRoutes from "./routes/recruiterRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const PORT = process.env.PORT || 5001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet());

// Allow CORS only in development
if (process.env.NODE_ENV !== "production") {
  app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }));
}

// Custom CSP (same-origin only)
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", `
    default-src 'self';
    style-src 'self' https://fonts.googleapis.com 'unsafe-inline';
    font-src 'self' https://fonts.gstatic.com;
    script-src 'self';
    img-src 'self' data:;
    connect-src 'self';
    object-src 'none';
    frame-src 'none';
  `.replace(/\s{2,}/g, " ").trim());
  next();
});

// Static file serving for uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/auth", profileRoutes); // Assuming profile routes are also under /api/auth
app.use("/api/student", studentRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/admin", adminRoutes);

// Error handler
app.use(errorHandler);


// ✅ NEW:
if (process.env.NODE_ENV === "production") {
  const clientPath = path.join(__dirname, "./client");
  console.log("Serving static files from:", clientPath);

  app.use(express.static(clientPath));

  app.get("*", (req, res) => {
    const indexFile = path.join(clientPath, "index.html");
    console.log("Serving index.html from:", indexFile);
    res.sendFile(indexFile, err => {
      if (err) {
        console.error("Error sending index.html:", err);
        res.status(500).send("Something went wrong");
      }
    });
  });
}




// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
