import express from 'express';
import { createJob, getApplicationsForRecruiter,updateApplicationStatus } from '../controllers/recruiterController.js';
import { isAuthenticated, recruiterOnly } from '../middleware/authMiddleware.js';
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

// Route to create a job
router.post('/jobs', isAuthenticated, recruiterOnly, createJob);

// Route to get jobs by the recruiter
// router.get('/my-jobs', isAuthenticated, recruiterOnly, getJobs);

router.get('/application', authenticate, getApplicationsForRecruiter);
router.patch("/application/:id/status", authenticate, updateApplicationStatus);
export default router;
