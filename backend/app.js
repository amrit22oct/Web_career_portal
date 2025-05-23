// import express from "express";
// import cors from "cors";
// import morgan from "morgan";
// import cookieParser from "cookie-parser";
// import path from "path";
// import { fileURLToPath } from "url";
// import dotenv from "dotenv";

// import authRoutes from "./routes/authRoutes.js";
// import profileRoutes from "./routes/profileRoutes.js";
// import studentRoutes from "./routes/studentRoutes.js";
// import recruiterRoutes from "./routes/recruiterRoutes.js";
// import jobRoutes from "./routes/jobRoutes.js";
// import adminRoutes from "./routes/adminRoutes.js";
// import { errorHandler } from "./middleware/errorHandler.js";

// dotenv.config();

// const app = express();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // This is the key: process.env.NODE_ENV must be 'production' in your deployment environment.
// const isProd = process.env.NODE_ENV === "production";

// // Determine frontend client URL (set on Render or fallback to localhost)
// // In production, if the backend serves the frontend, CLIENT_URL is primarily for CORS/CSP in development.
// // For production, 'self' will be sufficient for connect-src as they share the same origin.
// let CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
// if (isProd && !process.env.CLIENT_URL) {
//   console.warn(
//     "⚠️ Warning: CLIENT_URL is not explicitly set in production. Ensure your deployment environment handles this correctly."
//   );
// }

// // Define allowed origins for CORS. In production, when backend serves frontend,
// // requests from frontend to backend are same-origin, handled by !origin.
// const allowedOrigins = [CLIENT_URL, "http://localhost:5173"].filter(Boolean);

// // Dynamically build connect-src for CSP based on environment
// let connectSrc = `'self'`;
// // In development, the frontend runs on a different port, so we need to explicitly allow it.
// // In production, since the backend serves the frontend, they are on the same origin,
// // so 'self' is sufficient.
// if (!isProd) {
//   connectSrc += ` ${CLIENT_URL}`;
// }

// // === CSP Middleware (Optional, enhances security) ===
// app.use((req, res, next) => {
//   res.setHeader(
//     "Content-Security-Policy",
//     `
//       default-src 'self';
//       style-src 'self' https://fonts.googleapis.com;
//       style-src-elem 'self' https://fonts.googleapis.com;
//       font-src 'self' https://fonts.gstatic.com;
//       script-src 'self';
//       img-src 'self' data:;
//       connect-src ${connectSrc};
//       object-src 'none';
//       frame-src 'none';
//     `
//       .replace(/\s{2,}/g, " ")
//       .trim()
//   );
//   next();
// });

// // === CORS Setup ===
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       // Allow requests with no origin (like mobile apps or direct file access)
//       // or if the origin is in the allowed list.
//       if (!origin || allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       }
//       // Block requests from unallowed origins
//       return callback(new Error("CORS policy: Not allowed by server"), false);
//     },
//     credentials: true, // Allow sending cookies with cross-origin requests
//   })
// );

// // === Middleware ===
// app.use(express.json()); // Parse JSON request bodies
// app.use(cookieParser()); // Parse cookies from request headers
// app.use(morgan("dev")); // HTTP request logger middleware for development

// // === Serve uploaded files ===
// // This makes the 'uploads' directory accessible statically
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // === API Routes ===
// // Mount various API routes
// app.use("/api/auth", authRoutes);
// app.use("/api/auth", profileRoutes); // Assuming profile routes are also under /api/auth
// app.use("/api/student", studentRoutes);
// app.use("/api/recruiter", recruiterRoutes);
// app.use("/api/jobs", jobRoutes);
// app.use("/api/admin", adminRoutes);

// // === Serve frontend in production ===
// // This block will ONLY run if process.env.NODE_ENV is 'production'
// if (isProd) {
//   const frontendPath = path.join(__dirname, "../frontend/dist"); // Assuming Vite builds to 'dist'
//   app.use(express.static(frontendPath)); // Serve static files from the frontend build directory
//   // For any other GET request, serve the frontend's index.html
//   // This is crucial for client-side routing (e.g., React Router)
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(frontendPath, "index.html"));
//   });
// }

// // === Global error handler ===
// // Catches and processes errors that occur in the application
// app.use(errorHandler);

// export default app;
