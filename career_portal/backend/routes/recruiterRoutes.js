import express from 'express';
import { createJob } from '../controllers/recruiterController.js';
import { protect, recruiterOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/jobs', protect, recruiterOnly, createJob);

export default router;
