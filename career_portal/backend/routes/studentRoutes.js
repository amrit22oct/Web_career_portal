// routes/studentRoutes.js

import express from 'express';
import { getMyApplications } from '../controllers/studentController.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/applications', isAuthenticated, getMyApplications);

export default router;
