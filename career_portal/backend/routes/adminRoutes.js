// routes/recruiterRoutes.js

import express from 'express';
import { createJob } from '../controllers/recruiterController.js';
import {
  isAuthenticated,
  recruiterOnly,
} from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/jobs', isAuthenticated, recruiterOnly, createJob);

export default router;
