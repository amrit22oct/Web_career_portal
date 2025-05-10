import express from 'express';
import { createJob, getJobs } from '../controllers/recruiterController.js';
import { isAuthenticated, recruiterOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to create a job
router.post('/jobs', isAuthenticated, recruiterOnly, createJob);

// Route to get jobs by the recruiter
// router.get('/my-jobs', isAuthenticated, recruiterOnly, getJobs);

export default router;
