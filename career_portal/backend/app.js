import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import recruiterRoutes from './routes/recruiterRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Allowed origins for CORS (frontend URLs)
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',  // dev frontend URL
  'https://your-production-frontend-url.com'          // production frontend URL (replace this)
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like mobile apps, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS policy: This origin is not allowed'), false);
    }
  },
  credentials: true,  // allow cookies, credentials
}));

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', profileRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/recruiter', recruiterRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use(errorHandler);

export default app;
