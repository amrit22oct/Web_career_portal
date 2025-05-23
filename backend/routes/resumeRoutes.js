import express from 'express';
import { uploadResume, parseResume } from '../controllers/resumeController.js';
import multer from 'multer';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure multer to handle file uploads
const upload = multer({ dest: './uploads/' });

// Upload resume
router.post('/upload', isAuthenticated, upload.single('resume'), uploadResume);

// Parse resume
router.post('/parse', isAuthenticated, parseResume);

export default router;
