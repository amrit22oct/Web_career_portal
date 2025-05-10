import express from "express";
import {
  createJob,
  getAllJobs, // Public
  getJobById,
  updateJob,
  deleteJob,
  getRecruiterJobs, // Fetch jobs posted by the recruiter
} from "../controllers/jobController.js";

import { authenticate } from "../middleware/authenticate.js";
import { recruiterOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔓 Public Routes
router.get("/", getAllJobs); // Fetch all jobs visible to the public
router.get("/:jobId", getJobById); // View job details (accessible by anyone)

// 🔐 Recruiter Routes
router.post("/", authenticate, recruiterOnly, createJob); // Create a new job posting (only by recruiters)
router.get("/recruiter/jobs", authenticate, recruiterOnly, getRecruiterJobs); // Fetch recruiter's jobs
router.put("/:jobId", authenticate, recruiterOnly, updateJob); // Update a job (only by recruiters)
router.delete("/:jobId", authenticate, recruiterOnly, deleteJob); // Delete a job (only by recruiters)

export default router;
