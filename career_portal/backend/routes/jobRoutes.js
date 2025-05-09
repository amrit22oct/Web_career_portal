import express from 'express';
import {
  createJob,
  getAllJobs, // Public
  getJobById,
  updateJob,
  deleteJob
} from '../controllers/jobController.js';

import { authenticate } from '../middleware/authenticate.js';
import { recruiterOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// 🔓 Public Routes
// Fetch all jobs visible to the public
router.get('/', getAllJobs); // All users can see available jobs

// View job details (accessible by anyone)
router.get('/:jobId', getJobById);

// 🔐 Recruiter Routes
// Create a new job posting (accessible only by recruiters)
router.post('/', authenticate, recruiterOnly, createJob); // Recruiter can create a job

// Get all jobs posted by the recruiter (accessible only by recruiters)


// Update a job (accessible only by recruiters)
router.put('/:jobId', authenticate, recruiterOnly, updateJob); // Recruiter can update a job

// Delete a job (accessible only by recruiters)
router.delete('/:jobId', authenticate, recruiterOnly, deleteJob); // Recruiter can delete a job

export default router;
