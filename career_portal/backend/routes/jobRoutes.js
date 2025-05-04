import express from 'express';
import {
  createJob,
  getJobs,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  addApplicant,
  updateApplicantStatus,
  removeApplicant
} from '../controllers/jobController.js';

import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

// Public route for job listings
router.get('/', getAllJobs); // Everyone can access all jobs

// Recruiter-authenticated routes
router.post('/', authenticate, createJob); // Create job (Recruiter only)
router.get('/recruiter', authenticate, getJobs); // Get recruiter's jobs
router.get('/:jobId', getJobById); // View job details (public route for all users)
router.put('/:jobId', authenticate, updateJob); // Update job (Recruiter only)
router.delete('/:jobId', authenticate, deleteJob); // Delete job (Recruiter only)

// Application routes (Recruiter and student authentication)
router.post('/:jobId/apply', authenticate, addApplicant); // Student applies for a job
router.put('/:jobId/applicants/:studentId/status', authenticate, updateApplicantStatus); // Recruiter updates status
router.delete('/:jobId/applicants/:studentId', authenticate, removeApplicant); // Recruiter removes applicant

export default router;
