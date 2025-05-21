import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import recruiterRoutes from './routes/recruiterRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// === CSP Middleware ===
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    `
    default-src 'self';
    style-src 'self' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    script-src 'self';
    img-src 'self' data:;
    connect-src 'self' ${process.env.CLIENT_URL};
    object-src 'none';
    frame-src 'none';
  `.replace(/\s{2,}/g, ' ').trim()
  );
  next();
});

// === CORS Setup ===
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173', // for development
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS policy: This origin is not allowed'), false);
    }
  },
  credentials: true,
}));

// === Middleware ===
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// === Static Files (e.g., uploads) ===
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// === Routes ===
app.use('/api/auth', authRoutes);
app.use('/api/auth', profileRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/recruiter', recruiterRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/admin', adminRoutes);

// === Error Handling ===
app.use(errorHandler);

export default app;
