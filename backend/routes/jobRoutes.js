import express from "express";
import {
  createJob,
  getAllJobs,
  getJobById,
  getInternshipJobs,
  updateJob,
  deleteJob,
  getRecruiterJobs,
  addApplicant,

} from "../controllers/jobController.js";

import { authenticate } from "../middleware/authenticate.js";
import { recruiterOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔓 Public Routes
router.get("/", getAllJobs); // Public

// ✅ Specific fixed routes should come BEFORE dynamic ones
router.get("/internship", getInternshipJobs);
router.get("/recruiter/jobs", authenticate, recruiterOnly, getRecruiterJobs);

// Dynamic route (MUST come last)
router.get("/:jobId", getJobById);

// 🔐 Recruiter Routes
router.post("/", authenticate, recruiterOnly, createJob);
router.put("/:jobId", authenticate, recruiterOnly, updateJob);
router.delete("/:jobId", authenticate, recruiterOnly, deleteJob);
// applying the application
router.post('/:jobId/apply', authenticate, addApplicant);
// router.get('/applied', authenticate, getAppliedJobs);
// router.get('/application', authenticate, getApplicationsForRecruiter);

export default router;
