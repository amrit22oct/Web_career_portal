import express from 'express';
import { createJob, getJobs, updateJob, deleteJob } from '../controllers/jobController.js';
import { protect, recruiterOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect routes and allow only recruiters to create and manage jobs
router.post('/', protect, recruiterOnly, createJob);  // Recruiter can create a job
router.get('/', protect, recruiterOnly, getJobs);     // Recruiter can view their jobs
router.put('/:jobId', protect, recruiterOnly, updateJob);  // Recruiter can update a job
router.delete('/:jobId', protect, recruiterOnly, deleteJob);  // Recruiter can delete a job

export default router;
