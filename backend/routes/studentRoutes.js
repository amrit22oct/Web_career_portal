// routes/studentRoutes.js

import express from 'express';
import { getAppliedJobs,withdrawApplication} from '../controllers/studentController.js';
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

// router.get('/applications', isAuthenticated, getMyApplications);
router.get('/applied', authenticate, getAppliedJobs);
router.delete("/application/:applicationId", authenticate,withdrawApplication);
export default router;
