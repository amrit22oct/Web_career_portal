import express from 'express';
import {
  createJob,
  getJobs,
  deleteJob,
  getJobById,
  updateJob,
} from '../controllers/jobController.js';
import { validateJobId } from '../middleware/validateJobId.js'; // Custom middleware to validate jobId format
import { authenticate } from '../middleware/authenticate.js'; // Assuming a middleware for authentication


const router = express.Router();

// Middleware to authenticate the user
router.use(authenticate);

// POST: Create a new job post
router.post('/', createJob);

// GET: Fetch all jobs posted by the recruiter
router.get('/', getJobs);

// DELETE: Delete a job post by job ID
router.delete('/:jobId', validateJobId,  deleteJob);

// GET: Get a job by ID (for viewing applicants or job details)
router.get('/:jobId', validateJobId, getJobById);

// PUT: Update a job post by job ID
router.put('/:jobId', validateJobId,  updateJob);

export default router;
