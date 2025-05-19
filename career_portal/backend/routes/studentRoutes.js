// routes/studentRoutes.js

import express from 'express';
import { getAppliedJobs} from '../controllers/studentController.js';
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

// router.get('/applications', isAuthenticated, getMyApplications);
router.get('/applied', authenticate, getAppliedJobs);

export default router;
