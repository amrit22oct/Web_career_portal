import express from "express";
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getRecruiterJobs,
} from "../controllers/jobController.js";

import { authenticate } from "../middleware/authenticate.js";
import { recruiterOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔓 Public Routes
router.get("/", getAllJobs); // Public
router.get("/recruiter/jobs", authenticate, recruiterOnly, getRecruiterJobs); // Must be above :jobId
router.get("/:jobId", getJobById); // Must come after fixed routes like /recruiter/jobs

// 🔐 Recruiter Routes
router.post("/", authenticate, recruiterOnly, createJob);
router.put("/:jobId", authenticate, recruiterOnly, updateJob);
router.delete("/:jobId", authenticate, recruiterOnly, deleteJob);

export default router;
